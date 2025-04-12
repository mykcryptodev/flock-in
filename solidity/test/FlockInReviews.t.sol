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
    FlockInReviews public flockInReviews;
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
        
        // Deploy FlockInReviews contract
        flockInReviews = new FlockInReviews(address(flockIn));
        
        // Mint tokens to test accounts
        token.transfer(alice, 10000 * 10**18);
        token.transfer(bob, 10000 * 10**18);
        token.transfer(charlie, 10000 * 10**18);
    }

    function test_CreateReview() public {
        // Create and complete a request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid, "Test request");
        vm.stopPrank();

        vm.startPrank(bob);
        flockIn.completeRequest(0, "");
        vm.stopPrank();

        // Create a review
        vm.startPrank(alice);
        bytes memory metadata = "test metadata";
        flockInReviews.createReview(
            0, // requestId
            aliceFid,
            bob,
            bobFid,
            5, // rating
            "Great service!",
            metadata
        );

        // Verify the review was created correctly
        (
            uint256 id,
            uint256 requestId,
            address reviewer,
            uint256 reviewerFid,
            address reviewee,
            uint256 revieweeFid,
            uint256 rating,
            string memory comment,
            string memory revieweeComment,
            bytes memory storedMetadata,
            bool reviewCreatedBeforeCompletion
        ) = flockInReviews.reviews(1);
        
        assertEq(id, 1);
        assertEq(requestId, 0);
        assertEq(reviewer, alice);
        assertEq(reviewerFid, aliceFid);
        assertEq(reviewee, bob);
        assertEq(revieweeFid, bobFid);
        assertEq(rating, 5);
        assertEq(comment, "Great service!");
        assertEq(revieweeComment, "");
        assertEq(storedMetadata, metadata);
        assertEq(reviewCreatedBeforeCompletion, false);
        vm.stopPrank();
    }

    function test_CreateReviewBeforeCompletion() public {
        // Create a request but don't complete it
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid, "Test request");

        // Create a review before completion
        bytes memory metadata = "test metadata";
        flockInReviews.createReview(
            0, // requestId
            aliceFid,
            bob,
            bobFid,
            5, // rating
            "Great service!",
            metadata
        );

        // Verify the review was created correctly
        (
            uint256 id,
            uint256 requestId,
            address reviewer,
            uint256 reviewerFid,
            address reviewee,
            uint256 revieweeFid,
            uint256 rating,
            string memory comment,
            string memory revieweeComment,
            bytes memory storedMetadata,
            bool reviewCreatedBeforeCompletion
        ) = flockInReviews.reviews(1);
        
        assertEq(id, 1);
        assertEq(requestId, 0);
        assertEq(reviewer, alice);
        assertEq(reviewerFid, aliceFid);
        assertEq(reviewee, bob);
        assertEq(revieweeFid, bobFid);
        assertEq(rating, 5);
        assertEq(comment, "Great service!");
        assertEq(revieweeComment, "");
        assertEq(storedMetadata, metadata);
        assertEq(reviewCreatedBeforeCompletion, true);
        vm.stopPrank();
    }

    function test_RevertWhen_ReviewNonExistentRequest() public {
        vm.startPrank(alice);
        vm.expectRevert();
        flockInReviews.createReview(
            999, // non-existent requestId
            aliceFid,
            bob,
            bobFid,
            5,
            "Test review",
            ""
        );
        vm.stopPrank();
    }


    function test_RevertWhen_MultipleReviewsForSameRequest() public {
        // Create and complete request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid, "Test request");
        vm.stopPrank();

        vm.startPrank(bob);
        flockIn.completeRequest(0, "");
        vm.stopPrank();

        // Create first review
        vm.startPrank(alice);
        flockInReviews.createReview(
            0,
            aliceFid,
            bob,
            bobFid,
            5,
            "First review",
            ""
        );

        // Try to create second review
        vm.expectRevert("Review already exists for this request");
        flockInReviews.createReview(
            0,
            aliceFid,
            bob,
            bobFid,
            5,
            "Second review",
            ""
        );
        vm.stopPrank();
    }

    function test_RevertWhen_InvalidRating() public {
        // Create and complete request
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid, "Test request");
        vm.stopPrank();

        vm.startPrank(bob);
        flockIn.completeRequest(0, "");
        vm.stopPrank();

        // Try to create review with rating 0
        vm.startPrank(alice);
        vm.expectRevert("Rating must be between 1 and 5");
        flockInReviews.createReview(
            0,
            aliceFid,
            bob,
            bobFid,
            0,
            "Test review",
            ""
        );

        // Try to create review with rating 6
        vm.expectRevert("Rating must be between 1 and 5");
        flockInReviews.createReview(
            0,
            aliceFid,
            bob,
            bobFid,
            6,
            "Test review",
            ""
        );
        vm.stopPrank();
    }

    function test_GetReviewByRequestId() public {
        // Create, complete request and create review
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid, "Test request");
        vm.stopPrank();

        vm.startPrank(bob);
        flockIn.completeRequest(0, "");
        vm.stopPrank();

        vm.startPrank(alice);
        bytes memory metadata = "test metadata";
        flockInReviews.createReview(
            0,
            aliceFid,
            bob,
            bobFid,
            5,
            "Great service!",
            metadata
        );

        // Get review by request ID
        (
            uint256 id,
            uint256 requestId,
            address reviewer,
            uint256 reviewerFid,
            address reviewee,
            uint256 revieweeFid,
            uint256 rating,
            string memory comment,
            string memory revieweeComment,
            bytes memory storedMetadata,
            bool reviewCreatedBeforeCompletion
        ) = flockInReviews.reviews(flockInReviews.reviewIdByRequestId(0));
        
        assertEq(id, 1);
        assertEq(requestId, 0);
        assertEq(reviewer, alice);
        assertEq(reviewerFid, aliceFid);
        assertEq(reviewee, bob);
        assertEq(revieweeFid, bobFid);
        assertEq(rating, 5);
        assertEq(comment, "Great service!");
        assertEq(revieweeComment, "");
        assertEq(storedMetadata, metadata);
        vm.stopPrank();
    }

    function test_GetReviewByNonExistentRequestId() public {
        // Get review for non-existent request
        (
            uint256 id,
            uint256 requestId,
            address reviewer,
            uint256 reviewerFid,
            address reviewee,
            uint256 revieweeFid,
            uint256 rating,
            string memory comment,
            string memory revieweeComment,
            bytes memory metadata,
            bool reviewCreatedBeforeCompletion
        ) = flockInReviews.reviews(flockInReviews.reviewIdByRequestId(999));
        
        assertEq(id, 0);
        assertEq(requestId, 0);
        assertEq(reviewer, address(0));
        assertEq(reviewerFid, 0);
        assertEq(reviewee, address(0));
        assertEq(revieweeFid, 0);
        assertEq(rating, 0);
        assertEq(comment, "");
        assertEq(revieweeComment, "");
        assertEq(metadata, "");
    }

    function test_LeaveRevieweeComment() public {
        // Create, complete request and create review
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid, "Test request");
        vm.stopPrank();

        vm.startPrank(bob);
        flockIn.completeRequest(0, "");
        vm.stopPrank();

        vm.startPrank(alice);
        flockInReviews.createReview(
            0,
            aliceFid,
            bob,
            bobFid,
            5,
            "Great service!",
            ""
        );
        vm.stopPrank();

        // Leave reviewee comment
        vm.startPrank(bob);
        flockInReviews.leaveRevieweeComment(0, "Thanks for the kind words!");

        // Verify the comment was added
        FlockInReviews.Review memory review = flockInReviews.getReviewByRequestId(0);
        assertEq(review.revieweeComment, "Thanks for the kind words!");
        vm.stopPrank();
    }

    function test_RevertWhen_NonRevieweeLeavesComment() public {
        // Create, complete request and create review
        vm.startPrank(alice);
        token.approve(address(flockIn), type(uint256).max);
        flockIn.requestFlockIn(aliceFid, bob, bobFid, "Test request");
        vm.stopPrank();

        vm.startPrank(bob);
        flockIn.completeRequest(0, "");
        vm.stopPrank();

        vm.startPrank(alice);
        flockInReviews.createReview(
            0,
            aliceFid,
            bob,
            bobFid,
            5,
            "Great service!",
            ""
        );
        vm.stopPrank();

        // Try to leave comment as non-reviewee
        vm.startPrank(charlie);
        vm.expectRevert("Only the reviewee can leave a comment");
        flockInReviews.leaveRevieweeComment(0, "I'm not the reviewee!");
        vm.stopPrank();
    }

    function test_RevertWhen_CommentOnNonExistentReview() public {
        vm.startPrank(bob);
        vm.expectRevert("Review does not exist");
        flockInReviews.leaveRevieweeComment(999, "This review doesn't exist!");
        vm.stopPrank();
    }
} 