// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../src/FlockInSuggestedPaymentAmounts.sol";

contract MockToken is ERC20 {
    constructor() ERC20("Mock Token", "MTK") {
        _mint(msg.sender, 1000000 * 10**18);
    }
}

contract FlockInSuggestedPaymentAmountsTest is Test {
    FlockInSuggestedPaymentAmounts public suggestedAmounts;
    MockToken public token1;
    MockToken public token2;
    
    address public alice = address(0x1);
    address public bob = address(0x2);
    
    uint256 public constant TEST_AMOUNT1 = 10 * 10**18;
    uint256 public constant TEST_AMOUNT2 = 20 * 10**18;

    function setUp() public {
        // Deploy contracts
        suggestedAmounts = new FlockInSuggestedPaymentAmounts();
        token1 = new MockToken();
        token2 = new MockToken();
    }

    function test_AddSuggestedAmount() public {
        vm.startPrank(alice);
        suggestedAmounts.addSuggestedAmount(address(token1), TEST_AMOUNT1);
        vm.stopPrank();

        // Get suggested amounts by address
        FlockInSuggestedPaymentAmounts.SuggestedPaymentAmount[] memory amounts = 
            suggestedAmounts.getSuggestedAmountsByAddress(alice);
        
        assertEq(amounts.length, 1);
        assertEq(amounts[0].completer, alice);
        assertEq(amounts[0].token, address(token1));
        assertEq(amounts[0].amount, TEST_AMOUNT1);
    }

    function test_AddMultipleSuggestedAmounts() public {
        vm.startPrank(alice);
        suggestedAmounts.addSuggestedAmount(address(token1), TEST_AMOUNT1);
        suggestedAmounts.addSuggestedAmount(address(token2), TEST_AMOUNT2);
        vm.stopPrank();

        // Get suggested amounts by address
        FlockInSuggestedPaymentAmounts.SuggestedPaymentAmount[] memory amounts = 
            suggestedAmounts.getSuggestedAmountsByAddress(alice);
        
        assertEq(amounts.length, 2);
        
        // Check first amount
        assertEq(amounts[0].completer, alice);
        assertEq(amounts[0].token, address(token1));
        assertEq(amounts[0].amount, TEST_AMOUNT1);
        
        // Check second amount
        assertEq(amounts[1].completer, alice);
        assertEq(amounts[1].token, address(token2));
        assertEq(amounts[1].amount, TEST_AMOUNT2);
    }

    function test_RemoveSuggestedAmount() public {
        // Add two amounts
        vm.startPrank(alice);
        suggestedAmounts.addSuggestedAmount(address(token1), TEST_AMOUNT1);
        suggestedAmounts.addSuggestedAmount(address(token2), TEST_AMOUNT2);
        
        // Remove first amount
        suggestedAmounts.removeSuggestedAmount(address(token1));
        vm.stopPrank();

        // Get suggested amounts by address
        FlockInSuggestedPaymentAmounts.SuggestedPaymentAmount[] memory amounts = 
            suggestedAmounts.getSuggestedAmountsByAddress(alice);
        
        assertEq(amounts.length, 1);
        assertEq(amounts[0].token, address(token2));
        assertEq(amounts[0].amount, TEST_AMOUNT2);
    }

    function test_RevertWhen_AddSuggestedAmountWithZeroAmount() public {
        vm.startPrank(alice);
        vm.expectRevert("Amount must be greater than 0");
        suggestedAmounts.addSuggestedAmount(address(token1), 0);
    }

    function test_RevertWhen_AddSuggestedAmountWithZeroAddress() public {
        vm.startPrank(alice);
        vm.expectRevert("Invalid token address");
        suggestedAmounts.addSuggestedAmount(address(0), TEST_AMOUNT1);
    }

    function test_GetEmptySuggestedAmounts() public {
        // Get suggested amounts for address with no amounts
        FlockInSuggestedPaymentAmounts.SuggestedPaymentAmount[] memory amounts = 
            suggestedAmounts.getSuggestedAmountsByAddress(alice);
        assertEq(amounts.length, 0);
    }

    function test_MultipleUsersSuggestedAmounts() public {
        // Alice adds amounts
        vm.startPrank(alice);
        suggestedAmounts.addSuggestedAmount(address(token1), TEST_AMOUNT1);
        vm.stopPrank();

        // Bob adds amounts
        vm.startPrank(bob);
        suggestedAmounts.addSuggestedAmount(address(token1), TEST_AMOUNT2);
        vm.stopPrank();

        // Check Alice's amounts
        FlockInSuggestedPaymentAmounts.SuggestedPaymentAmount[] memory amounts = 
            suggestedAmounts.getSuggestedAmountsByAddress(alice);
        assertEq(amounts.length, 1);
        assertEq(amounts[0].completer, alice);
        assertEq(amounts[0].amount, TEST_AMOUNT1);

        // Check Bob's amounts
        amounts = suggestedAmounts.getSuggestedAmountsByAddress(bob);
        assertEq(amounts.length, 1);
        assertEq(amounts[0].completer, bob);
        assertEq(amounts[0].amount, TEST_AMOUNT2);
    }
}
