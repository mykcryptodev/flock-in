// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title FlockIn
/// @notice A contract that manages token requests where requesters can complete requests to claim funds
/// @dev Uses SafeERC20 for safe token transfers and ReentrancyGuard for protection against reentrancy attacks
contract FlockIn is ReentrancyGuard {
    using SafeERC20 for IERC20;

    /// @notice Structure to store request information
    struct Request {
        uint256 id;
        address requester;
        uint256 requesterFid;
        address completer;
        uint256 completerFid;
        address token;
        uint256 amount;
        bool isCompleted;
        bool isCancelled;
        string message;
        string completionProof;
    }

    // Main storage for requests
    mapping(uint256 => Request) public requests;
    
    // Index mappings that store request IDs instead of full Request structs
    mapping(address => uint256[]) private requestIdsByRequester;
    mapping(address => uint256[]) private requestIdsByCompleter;
    mapping(uint256 => uint256[]) private requestIdsByRequesterFid;
    mapping(uint256 => uint256[]) private requestIdsByCompleterFid;

    /// @notice Counter to generate unique request IDs
    uint256 public requestCounter;

    // Events remain the same
    event RequestCreated(uint256 indexed requestId, address indexed requester, address indexed completer, address token, uint256 amount, string message);
    event RequestCompleted(uint256 indexed requestId, address indexed completer, string completionProof);
    event RequestCancelled(uint256 indexed requestId, address indexed requester);
    event CompletionProofUpdated(uint256 indexed requestId, address indexed completer, string newProof);

    constructor() {}

    /// @notice Creates a new request by transferring tokens to the contract
    /// @param requesterFid The Farcaster ID of the requester
    /// @param completer The address of the completer
    /// @param completerFid The Farcaster ID of the completer
    /// @param token The address of the ERC20 token to use
    /// @param amount The amount of tokens to transfer
    /// @param message The message associated with the request
    function requestFlockIn(
        uint256 requesterFid,
        address completer,
        uint256 completerFid,
        address token,
        uint256 amount,
        string memory message
    ) external nonReentrant {
        require(completer != address(0), "Invalid completer address");
        require(token != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than 0");
        
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        
        uint256 requestId = requestCounter++;
        Request memory newRequest = Request({
            id: requestId,
            requester: msg.sender,
            requesterFid: requesterFid,
            completer: completer,
            completerFid: completerFid,
            token: token,
            amount: amount,
            isCompleted: false,
            isCancelled: false,
            message: message,
            completionProof: ""
        });
        
        requests[requestId] = newRequest;
        
        // Store only the request ID in the index mappings
        requestIdsByRequester[msg.sender].push(requestId);
        requestIdsByCompleter[completer].push(requestId);
        requestIdsByRequesterFid[requesterFid].push(requestId);
        requestIdsByCompleterFid[completerFid].push(requestId);

        emit RequestCreated(requestId, msg.sender, completer, token, amount, message);
    }

    /// @notice Completes a request and transfers the funds to the completer
    function completeRequest(uint256 requestId, string memory completionProof) external nonReentrant {
        Request storage request = requests[requestId];
        require(request.completer == msg.sender, "Not the intended completer");
        require(!request.isCompleted, "Already completed");
        require(!request.isCancelled, "Request already cancelled");

        request.isCompleted = true;
        request.completionProof = completionProof;
        IERC20(request.token).safeTransfer(msg.sender, request.amount);
        
        emit RequestCompleted(requestId, msg.sender, completionProof);
    }

    /// @notice Cancels a request and returns the funds to the requester
    function cancelRequest(uint256 requestId) external nonReentrant {
        Request storage request = requests[requestId];
        require(request.requester == msg.sender, "Not the requester");
        require(!request.isCompleted, "Request already completed");
        require(!request.isCancelled, "Request already cancelled");
        
        request.isCancelled = true;
        IERC20(request.token).safeTransfer(msg.sender, request.amount);
        
        emit RequestCancelled(requestId, msg.sender);
    }

    /// @notice Updates the completion proof for a completed request
    /// @dev Only the completer can update the proof and the request must be completed
    function updateCompletionProof(uint256 requestId, string memory newProof) external {
        Request storage request = requests[requestId];
        require(request.completer == msg.sender, "Not the completer");
        require(request.isCompleted, "Request not completed");
        require(!request.isCancelled, "Request was cancelled");

        request.completionProof = newProof;
        emit CompletionProofUpdated(requestId, msg.sender, newProof);
    }

    /// @notice Gets all requests made by a specific address
    function getRequestsMadeByAddress(address requester) external view returns (Request[] memory) {
        uint256[] storage requestIds = requestIdsByRequester[requester];
        Request[] memory result = new Request[](requestIds.length);
        
        for (uint256 i = 0; i < requestIds.length; i++) {
            result[i] = requests[requestIds[i]];
        }
        return result;
    }

    /// @notice Gets all requests received by a specific address
    function getRequestsReceivedByAddress(address completer) external view returns (Request[] memory) {
        uint256[] storage requestIds = requestIdsByCompleter[completer];
        Request[] memory result = new Request[](requestIds.length);
        
        for (uint256 i = 0; i < requestIds.length; i++) {
            result[i] = requests[requestIds[i]];
        }
        return result;
    }

    /// @notice Gets all requests made by a specific Farcaster ID
    function getRequestsMadeByFid(uint256 requesterFid) external view returns (Request[] memory) {
        uint256[] storage requestIds = requestIdsByRequesterFid[requesterFid];
        Request[] memory result = new Request[](requestIds.length);
        
        for (uint256 i = 0; i < requestIds.length; i++) {
            result[i] = requests[requestIds[i]];
        }
        return result;
    }

    /// @notice Gets all requests received by a specific Farcaster ID
    function getRequestsReceivedByFid(uint256 completerFid) external view returns (Request[] memory) {
        uint256[] storage requestIds = requestIdsByCompleterFid[completerFid];
        Request[] memory result = new Request[](requestIds.length);
        
        for (uint256 i = 0; i < requestIds.length; i++) {
            result[i] = requests[requestIds[i]];
        }
        return result;
    }

    /// @notice Gets a request by its ID
    /// @param requestId The ID of the request to get
    /// @return The request struct containing all request data
    function getRequest(uint256 requestId) external view returns (Request memory) {
        return requests[requestId];
    }
} 