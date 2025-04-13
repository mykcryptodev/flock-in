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
        flockIn.requestFlockIn(bob, address(token), TEST_AMOUNT, "Test message");
        vm.stopPrank();
        
        vm.startPrank(bob);
        flockIn.completeRequest(0, "");
        vm.stopPrank();
        
        // Create review
        vm.startPrank(alice);
        string memory comment = "Great work!";
        bytes memory metadata = "0x1234";
        reviews.createReview(0, bob, 5, comment, metadata);
        
        // Check review was created correctly
        FlockInReviews.Review memory review = reviews.getReview(1);
        assertEq(review.id, 1);
        assertEq(review.requestId, 0);
        assertEq(review.reviewer, alice);
        assertEq(review.reviewee, bob);
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
        flockIn.requestFlockIn(bob, address(token), TEST_AMOUNT, "Test message");
        vm.stopPrank();
        
        vm.startPrank(bob);
        flockIn.completeRequest(0, "");
        vm.stopPrank();
        
        vm.startPrank(alice);
        reviews.createReview(0, bob, 5, "Great work!", "");
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

    function test_GetReviewsByReviewee() public {
        // Create two requests and reviews
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(bob, address(token), TEST_AMOUNT, "First message");
        flockIn.requestFlockIn(bob, address(token), TEST_AMOUNT, "Second message");
        vm.stopPrank();
        
        vm.startPrank(bob);
        flockIn.completeRequest(0, "");
        flockIn.completeRequest(1, "");
        vm.stopPrank();
        
        vm.startPrank(alice);
        reviews.createReview(0, bob, 5, "First review", "");
        reviews.createReview(1, bob, 4, "Second review", "");
        vm.stopPrank();
        
        // Get reviews for Bob
        uint256[] memory bobReviews = reviews.getReviewsByReviewee(bob);
        assertEq(bobReviews.length, 2);
        assertEq(bobReviews[0], 1);
        assertEq(bobReviews[1], 2);
    }

    function test_GetFullReviewByReviewee() public {
        // Create two requests and reviews
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(bob, address(token), TEST_AMOUNT, "First message");
        flockIn.requestFlockIn(bob, address(token), TEST_AMOUNT, "Second message");
        vm.stopPrank();
        
        vm.startPrank(bob);
        flockIn.completeRequest(0, "");
        flockIn.completeRequest(1, "");
        vm.stopPrank();
        
        vm.startPrank(alice);
        reviews.createReview(0, bob, 5, "First review", "");
        reviews.createReview(1, bob, 4, "Second review", "");
        vm.stopPrank();
        
        // Get full reviews for Bob
        FlockInReviews.Review[] memory bobReviews = reviews.getFullReviewByReviewee(bob);
        
        // Debug assertions
        assertEq(bobReviews.length, 2, "Expected 2 reviews");
        
        // Verify the reviews exist in the mapping
        FlockInReviews.Review memory review1 = reviews.getReview(1);
        FlockInReviews.Review memory review2 = reviews.getReview(2);
        assertEq(review1.id, 1, "Review 1 should exist");
        assertEq(review2.id, 2, "Review 2 should exist");
        
        // Check first review
        assertEq(bobReviews[0].id, 1, "First review ID mismatch");
        assertEq(bobReviews[0].requestId, 0, "First review request ID mismatch");
        assertEq(bobReviews[0].reviewer, alice, "First review reviewer mismatch");
        assertEq(bobReviews[0].reviewee, bob, "First review reviewee mismatch");
        assertEq(bobReviews[0].rating, 5, "First review rating mismatch");
        assertEq(bobReviews[0].comment, "First review", "First review comment mismatch");
        assertEq(bobReviews[0].revieweeComment, "", "First review reviewee comment mismatch");
        assertEq(bobReviews[0].reviewCreatedBeforeCompletion, false, "First review completion flag mismatch");
        
        // Check second review
        assertEq(bobReviews[1].id, 2, "Second review ID mismatch");
        assertEq(bobReviews[1].requestId, 1, "Second review request ID mismatch");
        assertEq(bobReviews[1].reviewer, alice, "Second review reviewer mismatch");
        assertEq(bobReviews[1].reviewee, bob, "Second review reviewee mismatch");
        assertEq(bobReviews[1].rating, 4, "Second review rating mismatch");
        assertEq(bobReviews[1].comment, "Second review", "Second review comment mismatch");
        assertEq(bobReviews[1].revieweeComment, "", "Second review reviewee comment mismatch");
        assertEq(bobReviews[1].reviewCreatedBeforeCompletion, false, "Second review completion flag mismatch");
    }

    function test_RevertWhen_CreateReviewForNonExistentRequest() public {
        vm.startPrank(alice);
        vm.expectRevert();
        reviews.createReview(999, bob, 5, "Test review", "");
    }

    function test_RevertWhen_CreateReviewAsNonRequester() public {
        // Create request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(bob, address(token), TEST_AMOUNT, "Test message");
        vm.stopPrank();
        
        // Try to create review as Bob
        vm.startPrank(bob);
        vm.expectRevert("Only the requester can create a review");
        reviews.createReview(0, bob, 5, "Test review", "");
    }

    function test_RevertWhen_CreateReviewWithInvalidRating() public {
        // Create and complete request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(bob, address(token), TEST_AMOUNT, "Test message");
        vm.stopPrank();
        
        vm.startPrank(bob);
        flockIn.completeRequest(0, "");
        vm.stopPrank();
        
        // Try to create review with invalid rating
        vm.startPrank(alice);
        vm.expectRevert("Rating must be between 1 and 5");
        reviews.createReview(0, bob, 6, "Test review", "");
    }

    function test_RevertWhen_LeaveRevieweeCommentAsNonReviewee() public {
        // Create request, complete it, and create review
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(bob, address(token), TEST_AMOUNT, "Test message");
        vm.stopPrank();
        
        vm.startPrank(bob);
        flockIn.completeRequest(0, "");
        vm.stopPrank();
        
        vm.startPrank(alice);
        reviews.createReview(0, bob, 5, "Great work!", "");
        vm.stopPrank();
        
        // Try to leave comment as Charlie
        vm.startPrank(charlie);
        vm.expectRevert("Only the reviewee can leave a comment");
        reviews.leaveRevieweeComment(0, "Test comment");
    }
} 