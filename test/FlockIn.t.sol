// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../contracts/FlockIn.sol";

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
        
        flockIn.requestFlockIn(aliceFid, bob, bobFid);
        
        // Check request was created correctly
        (
            address requester,
            uint256 requesterFid,
            address completer,
            uint256 completerFid,
            uint256 amount,
            bool isClaimed
        ) = flockIn.requests(0);
        
        assertEq(requester, alice);
        assertEq(requesterFid, aliceFid);
        assertEq(completer, bob);
        assertEq(completerFid, bobFid);
        assertEq(amount, flockIn.REQUEST_AMOUNT());
        assertEq(isClaimed, false);
        
        // Check token transfer
        assertEq(token.balanceOf(address(flockIn)), flockIn.REQUEST_AMOUNT());
        assertEq(token.balanceOf(alice), 10000 * 10**18 - flockIn.REQUEST_AMOUNT());
        vm.stopPrank();
    }

    function test_CompleteRequest() public {
        // Create request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid);
        vm.stopPrank();
        
        // Complete request as Bob
        vm.startPrank(bob);
        uint256 bobBalanceBefore = token.balanceOf(bob);
        flockIn.completeRequest(0);
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
        flockIn.requestFlockIn(aliceFid, bob, bobFid);
        
        // Cancel request
        uint256 aliceBalanceBefore = token.balanceOf(alice);
        flockIn.cancelRequest(0);
        uint256 aliceBalanceAfter = token.balanceOf(alice);
        
        // Check Alice received her tokens back
        assertEq(aliceBalanceAfter - aliceBalanceBefore, flockIn.REQUEST_AMOUNT());
        assertEq(token.balanceOf(address(flockIn)), 0);
        vm.stopPrank();
    }

    function testFail_CompleteRequestAsNonCompleter() public {
        // Create request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid);
        vm.stopPrank();
        
        // Try to complete as Charlie
        vm.startPrank(charlie);
        flockIn.completeRequest(0);
    }

    function testFail_CancelRequestAsNonRequester() public {
        // Create request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid);
        vm.stopPrank();
        
        // Try to cancel as Bob
        vm.startPrank(bob);
        flockIn.cancelRequest(0);
    }

    function testFail_CompleteRequestAfterCancellation() public {
        // Create request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid);
        
        // Cancel request
        flockIn.cancelRequest(0);
        vm.stopPrank();
        
        // Try to complete as Bob
        vm.startPrank(bob);
        flockIn.completeRequest(0);
    }

    function testFail_CancelRequestAfterCompletion() public {
        // Create request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid);
        vm.stopPrank();
        
        // Complete request as Bob
        vm.startPrank(bob);
        flockIn.completeRequest(0);
        vm.stopPrank();
        
        // Try to cancel as Alice
        vm.startPrank(alice);
        flockIn.cancelRequest(0);
    }

    function testFail_CompleteRequestTwice() public {
        // Create request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid);
        vm.stopPrank();
        
        // Complete request as Bob
        vm.startPrank(bob);
        flockIn.completeRequest(0);
        
        // Try to complete again
        flockIn.completeRequest(0);
    }

    function testFail_CancelRequestTwice() public {
        // Create request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid);
        
        // Cancel request
        flockIn.cancelRequest(0);
        
        // Try to cancel again
        flockIn.cancelRequest(0);
    }
} 