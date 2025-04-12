// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../src/FlockIn.sol";
import "../src/FlockInReviews.sol";

contract MockToken is ERC20 {
    constructor() ERC20("Mock Token", "MTK") {
        _mint(msg.sender, 1000000 * 10**18);
    }
}

contract FlockInReviewsTest is Test {
    FlockIn public flockIn;
    FlockInReviews public reviews;
    MockToken public token;
    
    address public alice = address(0x1);
    address public bob = address(0x2);
    address public charlie = address(0x3);
    
    uint256 public aliceFid = 1;
    uint256 public bobFid = 2;
    uint256 public charlieFid = 3;
    uint256 public constant TEST_AMOUNT = 10 * 10**18;

    function setUp() public {
        // Deploy mock token
        token = new MockToken();
        
        // Deploy FlockIn contract
        flockIn = new FlockIn();
        
        // Deploy Reviews contract
        reviews = new FlockInReviews(address(flockIn));
        
        // Mint tokens to test accounts
        token.transfer(alice, 10000 * 10**18);
        token.transfer(bob, 10000 * 10**18);
        token.transfer(charlie, 10000 * 10**18);
    }

    function test_CreateReview() public {
        // Create and complete request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid, address(token), TEST_AMOUNT, "Test message");
        vm.stopPrank();
        
        vm.startPrank(bob);
        flockIn.completeRequest(0, "");
        vm.stopPrank();
        
        // Create review
        vm.startPrank(alice);
        string memory comment = "Great work!";
        bytes memory metadata = "0x1234";
        reviews.createReview(0, aliceFid, bob, bobFid, 5, comment, metadata);
        
        // Check review was created correctly
        FlockInReviews.Review memory review = reviews.getReview(1);
        assertEq(review.id, 1);
        assertEq(review.requestId, 0);
        assertEq(review.reviewer, alice);
        assertEq(review.reviewerFid, aliceFid);
        assertEq(review.reviewee, bob);
        assertEq(review.revieweeFid, bobFid);
        assertEq(review.rating, 5);
        assertEq(review.comment, comment);
        assertEq(review.metadata, metadata);
        assertEq(review.reviewCreatedBeforeCompletion, false);
        vm.stopPrank();
    }

    function test_LeaveRevieweeComment() public {
        // Create request, complete it, and create review
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid, address(token), TEST_AMOUNT, "Test message");
        vm.stopPrank();
        
        vm.startPrank(bob);
        flockIn.completeRequest(0, "");
        vm.stopPrank();
        
        vm.startPrank(alice);
        reviews.createReview(0, aliceFid, bob, bobFid, 5, "Great work!", "");
        vm.stopPrank();
        
        // Leave reviewee comment
        vm.startPrank(bob);
        string memory revieweeComment = "Thanks for the review!";
        reviews.leaveRevieweeComment(0, revieweeComment);
        
        // Check comment was stored correctly
        FlockInReviews.Review memory review = reviews.getReview(1);
        assertEq(review.revieweeComment, revieweeComment);
        vm.stopPrank();
    }

    function test_GetReviewsByRevieweeFid() public {
        // Create two requests and reviews
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid, address(token), TEST_AMOUNT, "First message");
        flockIn.requestFlockIn(aliceFid, bob, bobFid, address(token), TEST_AMOUNT, "Second message");
        vm.stopPrank();
        
        vm.startPrank(bob);
        flockIn.completeRequest(0, "");
        flockIn.completeRequest(1, "");
        vm.stopPrank();
        
        vm.startPrank(alice);
        reviews.createReview(0, aliceFid, bob, bobFid, 5, "First review", "");
        reviews.createReview(1, aliceFid, bob, bobFid, 4, "Second review", "");
        vm.stopPrank();
        
        // Get reviews for Bob
        uint256[] memory bobReviews = reviews.getReviewsByRevieweeFid(bobFid);
        assertEq(bobReviews.length, 2);
        assertEq(bobReviews[0], 1);
        assertEq(bobReviews[1], 2);
    }

    function test_RevertWhen_CreateReviewForNonExistentRequest() public {
        vm.startPrank(alice);
        vm.expectRevert();
        reviews.createReview(999, aliceFid, bob, bobFid, 5, "Test review", "");
    }

    function test_RevertWhen_CreateReviewAsNonRequester() public {
        // Create request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid, address(token), TEST_AMOUNT, "Test message");
        vm.stopPrank();
        
        // Try to create review as Bob
        vm.startPrank(bob);
        vm.expectRevert("Only the requester can create a review");
        reviews.createReview(0, bobFid, bob, bobFid, 5, "Test review", "");
    }

    function test_RevertWhen_CreateReviewWithInvalidRating() public {
        // Create and complete request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid, address(token), TEST_AMOUNT, "Test message");
        vm.stopPrank();
        
        vm.startPrank(bob);
        flockIn.completeRequest(0, "");
        vm.stopPrank();
        
        // Try to create review with invalid rating
        vm.startPrank(alice);
        vm.expectRevert("Rating must be between 1 and 5");
        reviews.createReview(0, aliceFid, bob, bobFid, 6, "Test review", "");
    }

    function test_RevertWhen_LeaveRevieweeCommentAsNonReviewee() public {
        // Create request, complete it, and create review
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid, address(token), TEST_AMOUNT, "Test message");
        vm.stopPrank();
        
        vm.startPrank(bob);
        flockIn.completeRequest(0, "");
        vm.stopPrank();
        
        vm.startPrank(alice);
        reviews.createReview(0, aliceFid, bob, bobFid, 5, "Great work!", "");
        vm.stopPrank();
        
        // Try to leave comment as Charlie
        vm.startPrank(charlie);
        vm.expectRevert("Only the reviewee can leave a comment");
        reviews.leaveRevieweeComment(0, "Test comment");
    }
} 