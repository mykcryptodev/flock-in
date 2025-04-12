// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./FlockIn.sol";

/// @title FlockInReviews
/// @notice A contract that manages reviews for FlockIn requests
/// @dev Reviews can only be created by the requester of a FlockIn request
contract FlockInReviews {
    /// @notice Structure to store review information
    struct Review {
        uint256 id;
        uint256 requestId;
        address reviewer;
        uint256 reviewerFid;
        address reviewee;
        uint256 revieweeFid;
        uint256 rating;
        string comment;
        string revieweeComment;
        bytes metadata;
        bool reviewCreatedBeforeCompletion;
    }

    // Main storage for reviews
    mapping(uint256 => Review) public reviews;
    
    // Mapping from requestId to reviewId
    mapping(uint256 => uint256) public reviewIdByRequestId;
    
    // Mapping from reviewId to requestId
    mapping(uint256 => uint256) public requestIdByReviewId;

    // Reference to the FlockIn contract
    FlockIn public immutable flockIn;

    /// @notice Counter to generate unique review IDs
    uint256 public reviewCounter = 1;

    // Events
    event ReviewCreated(
        uint256 indexed reviewId,
        uint256 indexed requestId,
        address indexed reviewer,
        address reviewee,
        uint256 rating,
        string comment,
        bool reviewCreatedBeforeCompletion
    );

    constructor(address _flockIn) {
        require(_flockIn != address(0), "Invalid FlockIn address");
        flockIn = FlockIn(_flockIn);
    }

    /// @notice Creates a new review for a completed FlockIn request
    /// @dev Only the requester of the original request can create a review
    function createReview(
        uint256 requestId,
        uint256 reviewerFid,
        address reviewee,
        uint256 revieweeFid,
        uint256 rating,
        string memory comment,
        bytes memory metadata
    ) external {
        // Check if review already exists
        require(reviewIdByRequestId[requestId] == 0, "Review already exists for this request");
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");
        
        // Get the request details from FlockIn contract
        FlockIn.Request memory request = flockIn.getRequest(requestId);
        require(request.requester == msg.sender, "Only the requester can create a review");

        uint256 reviewId = reviewCounter;
        reviewCounter++;
        Review memory newReview = Review({
            id: reviewId,
            requestId: requestId,
            reviewer: msg.sender,
            reviewerFid: reviewerFid,
            reviewee: reviewee,
            revieweeFid: revieweeFid,
            rating: rating,
            comment: comment,
            revieweeComment: "",
            metadata: metadata,
            reviewCreatedBeforeCompletion: !request.isCompleted
        });

        reviews[reviewId] = newReview;
        reviewIdByRequestId[requestId] = reviewId;
        requestIdByReviewId[reviewId] = requestId;

        emit ReviewCreated(reviewId, requestId, msg.sender, reviewee, rating, comment, !request.isCompleted);
    }

    /// @notice Gets a review by its ID
    /// @param reviewId The ID of the review to get
    /// @return The review struct containing all review data
    function getReview(uint256 reviewId) external view returns (Review memory) {
        require(reviewId < reviewCounter, "Review does not exist");
        return reviews[reviewId];
    }

    /// @notice Gets a review by request ID
    /// @param requestId The ID of the request to get the review for
    /// @return The review struct containing all review data
    function getReviewByRequestId(uint256 requestId) external view returns (Review memory) {
        uint256 reviewId = reviewIdByRequestId[requestId];
        return reviews[reviewId];
    }

    /// @notice Allows the reviewee to leave a comment on a review
    /// @dev Only the reviewee can leave a comment
    function leaveRevieweeComment(uint256 requestId, string memory comment) external {
        uint256 reviewId = reviewIdByRequestId[requestId];
        require(reviewId != 0, "Review does not exist");
        Review storage review = reviews[reviewId];
        require(review.reviewee == msg.sender, "Only the reviewee can leave a comment");
        
        review.revieweeComment = comment;
    }
} 