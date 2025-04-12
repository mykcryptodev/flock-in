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
    
    uint256 public aliceFid = 1;
    uint256 public bobFid = 2;
    uint256 public charlieFid = 3;

    function setUp() public {
        // Deploy mock token
        token = new MockToken();
        
        // Deploy FlockIn contract
        flockIn = new FlockIn(address(token));
        
        // Mint tokens to test accounts
        token.transfer(alice, 10000 * 10**18);
        token.transfer(bob, 10000 * 10**18);
        token.transfer(charlie, 10000 * 10**18);
    }

    function test_RequestFlockIn() public {
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        
        string memory message = "Hey Bob, can you help me with this?";
        flockIn.requestFlockIn(aliceFid, bob, bobFid, message);
        
        // Check request was created correctly
        (
            uint256 id,
            address requester,
            uint256 requesterFid,
            address completer,
            uint256 completerFid,
            uint256 amount,
            bool isCompleted,
            bool isCancelled,
            string memory storedMessage,
            string memory completionProof
        ) = flockIn.requests(0);
        
        assertEq(id, 0);
        assertEq(requester, alice);
        assertEq(requesterFid, aliceFid);
        assertEq(completer, bob);
        assertEq(completerFid, bobFid);
        assertEq(amount, flockIn.REQUEST_AMOUNT());
        assertEq(isCompleted, false);
        assertEq(isCancelled, false);
        assertEq(storedMessage, message);
        assertEq(completionProof, "");
        
        // Check token transfer
        assertEq(token.balanceOf(address(flockIn)), flockIn.REQUEST_AMOUNT());
        assertEq(token.balanceOf(alice), 10000 * 10**18 - flockIn.REQUEST_AMOUNT());
        vm.stopPrank();
    }

    function test_CompleteRequest() public {
        // Create request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid, "Test message");
        vm.stopPrank();
        
        // Complete request as Bob
        vm.startPrank(bob);
        uint256 bobBalanceBefore = token.balanceOf(bob);
        flockIn.completeRequest(0, "");
        uint256 bobBalanceAfter = token.balanceOf(bob);
        
        // Check Bob received the tokens
        assertEq(bobBalanceAfter - bobBalanceBefore, flockIn.REQUEST_AMOUNT());
        assertEq(token.balanceOf(address(flockIn)), 0);
        vm.stopPrank();
    }

    function test_CancelRequest() public {
        // Create request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid, "Test message");
        
        // Cancel request
        uint256 aliceBalanceBefore = token.balanceOf(alice);
        flockIn.cancelRequest(0);
        uint256 aliceBalanceAfter = token.balanceOf(alice);
        
        // Check Alice received her tokens back
        assertEq(aliceBalanceAfter - aliceBalanceBefore, flockIn.REQUEST_AMOUNT());
        assertEq(token.balanceOf(address(flockIn)), 0);
        vm.stopPrank();
    }

    function test_GetRequestsByFarcasterId() public {
        // Create requests
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid, "First message");
        flockIn.requestFlockIn(aliceFid, charlie, charlieFid, "Second message");
        vm.stopPrank();

        // Test getRequestsMadeByFid
        FlockIn.Request[] memory requestsMadeByAlice = flockIn.getRequestsMadeByFid(aliceFid);
        assertEq(requestsMadeByAlice.length, 2);
        assertEq(requestsMadeByAlice[0].requesterFid, aliceFid);
        assertEq(requestsMadeByAlice[1].requesterFid, aliceFid);

        // Test getRequestsReceivedByFid
        FlockIn.Request[] memory requestsReceivedByBob = flockIn.getRequestsReceivedByFid(bobFid);
        assertEq(requestsReceivedByBob.length, 1);
        assertEq(requestsReceivedByBob[0].completerFid, bobFid);

        FlockIn.Request[] memory requestsReceivedByCharlie = flockIn.getRequestsReceivedByFid(charlieFid);
        assertEq(requestsReceivedByCharlie.length, 1);
        assertEq(requestsReceivedByCharlie[0].completerFid, charlieFid);
    }

    function test_RevertWhen_CompleteRequestAsNonCompleter() public {
        // Create request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid, "Test message");
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
        flockIn.requestFlockIn(aliceFid, bob, bobFid, "Test message");
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
        flockIn.requestFlockIn(aliceFid, bob, bobFid, "Test message");
        
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
        flockIn.requestFlockIn(aliceFid, bob, bobFid, "Test message");
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
        flockIn.requestFlockIn(aliceFid, bob, bobFid, "Test message");
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
        flockIn.requestFlockIn(aliceFid, bob, bobFid, "Test message");
        
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
        flockIn.requestFlockIn(aliceFid, bob, bobFid, "Test message");
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
        flockIn.requestFlockIn(aliceFid, bob, bobFid, "Test message");
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
        flockIn.requestFlockIn(aliceFid, bob, bobFid, "Test message");
        vm.stopPrank();
        
        vm.startPrank(bob);
        flockIn.completeRequest(0, "initial proof");
        vm.stopPrank();
        
        // Try to update proof as Charlie
        vm.startPrank(charlie);
        vm.expectRevert("Not the completer");
        flockIn.updateCompletionProof(0, "new proof");
    }

    function test_RevertWhen_UpdateProofForUncompletedRequest() public {
        // Create request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid, "Test message");
        vm.stopPrank();
        
        // Try to update proof before completion
        vm.startPrank(bob);
        vm.expectRevert("Request not completed");
        flockIn.updateCompletionProof(0, "new proof");
    }

    function test_RevertWhen_UpdateProofForCancelledRequest() public {
        // Create and cancel request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid, "Test message");
        flockIn.cancelRequest(0);
        vm.stopPrank();
        
        // Try to update proof for cancelled request
        vm.startPrank(bob);
        vm.expectRevert("Request not completed");
        flockIn.updateCompletionProof(0, "new proof");
    }
} 