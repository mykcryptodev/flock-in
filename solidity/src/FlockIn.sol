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
        uint256 amount;
        bool isCompleted;
        bool isCancelled;
        string message;
    }

    // Main storage for requests
    mapping(uint256 => Request) public requests;
    
    // Index mappings that store request IDs instead of full Request structs
    mapping(address => uint256[]) private requestIdsByRequester;
    mapping(address => uint256[]) private requestIdsByCompleter;
    mapping(uint256 => uint256[]) private requestIdsByRequesterFid;
    mapping(uint256 => uint256[]) private requestIdsByCompleterFid;

    /// @notice The ERC20 token used for requests
    IERC20 public immutable token;

    /// @notice The fixed amount required for each request
    uint256 public constant REQUEST_AMOUNT = 10 * 10**6;
    
    /// @notice Counter to generate unique request IDs
    uint256 public requestCounter;

    // Events remain the same
    event RequestCreated(uint256 indexed requestId, address indexed requester, address indexed completer, uint256 amount, string message);
    event RequestCompleted(uint256 indexed requestId, address indexed completer);
    event RequestCancelled(uint256 indexed requestId, address indexed requester);

    constructor(address _token) {
        require(_token != address(0), "Invalid token address");
        token = IERC20(_token);
    }

    /// @notice Creates a new request by transferring tokens to the contract
    function requestFlockIn(
        uint256 requesterFid,
        address completer,
        uint256 completerFid,
        string memory message
    ) external nonReentrant {
        require(completer != address(0), "Invalid completer address");
        token.safeTransferFrom(msg.sender, address(this), REQUEST_AMOUNT);
        
        uint256 requestId = requestCounter++;
        Request memory newRequest = Request({
            id: requestId,
            requester: msg.sender,
            requesterFid: requesterFid,
            completer: completer,
            completerFid: completerFid,
            amount: REQUEST_AMOUNT,
            isCompleted: false,
            isCancelled: false,
            message: message
        });
        
        requests[requestId] = newRequest;
        
        // Store only the request ID in the index mappings
        requestIdsByRequester[msg.sender].push(requestId);
        requestIdsByCompleter[completer].push(requestId);
        requestIdsByRequesterFid[requesterFid].push(requestId);
        requestIdsByCompleterFid[completerFid].push(requestId);

        emit RequestCreated(requestId, msg.sender, completer, REQUEST_AMOUNT, message);
    }

    /// @notice Completes a request and transfers the funds to the completer
    function completeRequest(uint256 requestId) external nonReentrant {
        Request storage request = requests[requestId];
        require(request.completer == msg.sender, "Not the intended completer");
        require(!request.isCompleted, "Already completed");
        require(!request.isCancelled, "Request already cancelled");

        request.isCompleted = true;
        token.safeTransfer(msg.sender, request.amount);
        
        emit RequestCompleted(requestId, msg.sender);
    }

    /// @notice Cancels a request and returns the funds to the requester
    function cancelRequest(uint256 requestId) external nonReentrant {
        Request storage request = requests[requestId];
        require(request.requester == msg.sender, "Not the requester");
        require(!request.isCompleted, "Request already completed");
        require(!request.isCancelled, "Request already cancelled");
        
        request.isCancelled = true;
        token.safeTransfer(msg.sender, request.amount);
        
        emit RequestCancelled(requestId, msg.sender);
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
} 