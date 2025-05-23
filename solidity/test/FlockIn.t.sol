// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../src/FlockIn.sol";

contract MockToken is ERC20 {
    constructor() ERC20("Mock Token", "MTK") {
        _mint(msg.sender, 1000000 * 10**18);
    }
}

contract FlockInTest is Test {
    FlockIn public flockIn;
    MockToken public token;
    
    address public alice = address(0x1);
    address public bob = address(0x2);
    address public charlie = address(0x3);
    
    uint256 public constant TEST_AMOUNT = 10 * 10**18;

    function setUp() public {
        // Deploy mock token
        token = new MockToken();
        
        // Deploy FlockIn contract
        flockIn = new FlockIn();
        
        // Mint tokens to test accounts
        token.transfer(alice, 10000 * 10**18);
        token.transfer(bob, 10000 * 10**18);
        token.transfer(charlie, 10000 * 10**18);
    }

    function test_RequestFlockIn() public {
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        
        string memory message = "Hey Bob, can you help me with this?";
        flockIn.requestFlockIn(bob, address(token), TEST_AMOUNT, message);
        
        // Check request was created correctly
        FlockIn.Request memory request = flockIn.getRequest(0);
        
        assertEq(request.id, 0);
        assertEq(request.requester, alice);
        assertEq(request.completer, bob);
        assertEq(request.token, address(token));
        assertEq(request.amount, TEST_AMOUNT);
        assertEq(request.isCompleted, false);
        assertEq(request.isCancelled, false);
        assertEq(request.message, message);
        assertEq(request.completionProof, "");
        
        // Check token transfer
        assertEq(token.balanceOf(address(flockIn)), TEST_AMOUNT);
        assertEq(token.balanceOf(alice), 10000 * 10**18 - TEST_AMOUNT);
        vm.stopPrank();
    }

    function test_CompleteRequest() public {
        // Create request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(bob, address(token), TEST_AMOUNT, "Test message");
        vm.stopPrank();
        
        // Complete request as Bob
        vm.startPrank(bob);
        uint256 bobBalanceBefore = token.balanceOf(bob);
        flockIn.completeRequest(0, "");
        uint256 bobBalanceAfter = token.balanceOf(bob);
        
        // Check Bob received the tokens
        assertEq(bobBalanceAfter - bobBalanceBefore, TEST_AMOUNT);
        assertEq(token.balanceOf(address(flockIn)), 0);
        vm.stopPrank();
    }

    function test_CancelRequest() public {
        // Create request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(bob, address(token), TEST_AMOUNT, "Test message");
        
        // Cancel request
        uint256 aliceBalanceBefore = token.balanceOf(alice);
        flockIn.cancelRequest(0);
        uint256 aliceBalanceAfter = token.balanceOf(alice);
        
        // Check Alice received her tokens back
        assertEq(aliceBalanceAfter - aliceBalanceBefore, TEST_AMOUNT);
        assertEq(token.balanceOf(address(flockIn)), 0);
        vm.stopPrank();
    }

    function test_GetRequestsByAddress() public {
        // Create requests
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(bob, address(token), TEST_AMOUNT, "First message");
        flockIn.requestFlockIn(charlie, address(token), TEST_AMOUNT, "Second message");
        vm.stopPrank();

        // Test getRequestsMadeByAddress
        FlockIn.Request[] memory requestsMadeByAlice = flockIn.getRequestsMadeByAddress(alice);
        assertEq(requestsMadeByAlice.length, 2);
        assertEq(requestsMadeByAlice[0].requester, alice);
        assertEq(requestsMadeByAlice[1].requester, alice);

        // Test getRequestsReceivedByAddress
        FlockIn.Request[] memory requestsReceivedByBob = flockIn.getRequestsReceivedByAddress(bob);
        assertEq(requestsReceivedByBob.length, 1);
        assertEq(requestsReceivedByBob[0].completer, bob);

        FlockIn.Request[] memory requestsReceivedByCharlie = flockIn.getRequestsReceivedByAddress(charlie);
        assertEq(requestsReceivedByCharlie.length, 1);
        assertEq(requestsReceivedByCharlie[0].completer, charlie);
    }

    function test_RevertWhen_CompleteRequestAsNonCompleter() public {
        // Create request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(bob, address(token), TEST_AMOUNT, "Test message");
        vm.stopPrank();
        
        // Try to complete as Charlie
        vm.startPrank(charlie);
        vm.expectRevert("Not the intended completer");
        flockIn.completeRequest(0, "");
    }

    function test_RevertWhen_CancelRequestAsNonRequester() public {
        // Create request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(bob, address(token), TEST_AMOUNT, "Test message");
        vm.stopPrank();
        
        // Try to cancel as Bob
        vm.startPrank(bob);
        vm.expectRevert("Not the requester");
        flockIn.cancelRequest(0);
    }

    function test_RevertWhen_CompleteRequestAfterCancellation() public {
        // Create request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(bob, address(token), TEST_AMOUNT, "Test message");
        
        // Cancel request
        flockIn.cancelRequest(0);
        vm.stopPrank();
        
        // Try to complete as Bob
        vm.startPrank(bob);
        vm.expectRevert("Request already cancelled");
        flockIn.completeRequest(0, "");
    }

    function test_RevertWhen_CancelRequestAfterCompletion() public {
        // Create request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(bob, address(token), TEST_AMOUNT, "Test message");
        vm.stopPrank();
        
        // Complete request as Bob
        vm.startPrank(bob);
        flockIn.completeRequest(0, "");
        vm.stopPrank();
        
        // Try to cancel as Alice
        vm.startPrank(alice);
        vm.expectRevert("Request already completed");
        flockIn.cancelRequest(0);
    }

    function test_RevertWhen_CompleteRequestTwice() public {
        // Create request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(bob, address(token), TEST_AMOUNT, "Test message");
        vm.stopPrank();
        
        // Complete request as Bob
        vm.startPrank(bob);
        flockIn.completeRequest(0, "");
        
        // Try to complete again
        vm.expectRevert("Already completed");
        flockIn.completeRequest(0, "");
    }

    function test_RevertWhen_CancelRequestTwice() public {
        // Create request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(bob, address(token), TEST_AMOUNT, "Test message");
        
        // Cancel request
        flockIn.cancelRequest(0);
        
        // Try to cancel again
        vm.expectRevert("Request already cancelled");
        flockIn.cancelRequest(0);
    }

    function test_CompleteRequestWithProof() public {
        // Create request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(bob, address(token), TEST_AMOUNT, "Test message");
        vm.stopPrank();
        
        // Complete request as Bob with proof
        vm.startPrank(bob);
        string memory proof = "https://github.com/bob/proof";
        flockIn.completeRequest(0, proof);
        
        // Check proof was stored correctly
        FlockIn.Request memory request = flockIn.getRequest(0);
        assertEq(request.completionProof, proof);
        assertEq(request.isCompleted, true);
        vm.stopPrank();
    }

    function test_UpdateCompletionProof() public {
        // Create and complete request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(bob, address(token), TEST_AMOUNT, "Test message");
        vm.stopPrank();
        
        vm.startPrank(bob);
        flockIn.completeRequest(0, "initial proof");
        
        // Update proof
        string memory newProof = "https://github.com/bob/updated-proof";
        flockIn.updateCompletionProof(0, newProof);
        
        // Check proof was updated
        FlockIn.Request memory request = flockIn.getRequest(0);
        assertEq(request.completionProof, newProof);
        vm.stopPrank();
    }

    function test_RevertWhen_UpdateProofAsNonCompleter() public {
        // Create and complete request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(bob, address(token), TEST_AMOUNT, "Test message");
        vm.stopPrank();
        
        vm.startPrank(bob);
        flockIn.completeRequest(0, "initial proof");
        vm.stopPrank();
        
        // Try to update proof as Alice
        vm.startPrank(alice);
        vm.expectRevert("Not the completer");
        flockIn.updateCompletionProof(0, "new proof");
    }

    function test_RevertWhen_UpdateProofForUncompletedRequest() public {
        // Create request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(bob, address(token), TEST_AMOUNT, "Test message");
        vm.stopPrank();
        
        // Try to update proof before completion
        vm.startPrank(bob);
        vm.expectRevert("Request not completed");
        flockIn.updateCompletionProof(0, "new proof");
    }

    function test_RevertWhen_UpdateProofForCancelledRequest() public {
        // Create request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(bob, address(token), TEST_AMOUNT, "Test message");
        
        // Cancel request
        flockIn.cancelRequest(0);
        vm.stopPrank();
        
        // Try to update proof
        vm.startPrank(bob);
        vm.expectRevert("Request not completed");
        flockIn.updateCompletionProof(0, "new proof");
    }
} 