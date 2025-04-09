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
    /// @dev Contains requester and completer details, amount, and claim status
    struct Request {
        uint256 id; // the id of the request
        address requester;  // Address of the request requester (Alice)
        uint256 requesterFid; // Farcaster ID of the requester (Alice)
        address completer;  // Address of the intended completer (Bob)
        uint256 completerFid; // Farcaster ID of the intended completer (Bob)
        uint256 amount;    // Amount of tokens requested
        bool isCompleted;    // Whether the request has been completed
        bool isCancelled;    // Whether the request has been cancelled
        string message;    // Message from the requester to the completer
    }

    mapping(address => Request[]) public requestsMadeByAddress;
    mapping(address => Request[]) public requestsReceivedByAddress;
    mapping(uint256 => Request[]) public requestsMadeByFid;
    mapping(uint256 => Request[]) public requestsReceivedByFid;

    /// @notice The ERC20 token used for requests
    IERC20 public immutable token;

    /// @notice The fixed amount required for each request
    /// @dev Set to 4500 tokens (assuming 6 decimals)
    uint256 public constant REQUEST_AMOUNT = 10 * 10**6;
    
    /// @notice Mapping of request IDs to Request structs
    mapping(uint256 => Request) public requests;

    /// @notice Counter to generate unique request IDs
    uint256 public requestCounter;

    /// @notice Emitted when a new request is created
    /// @param requestId The ID of the created request
    /// @param requester The address of the request requester
    /// @param completer The address of the intended completer
    /// @param amount The amount of tokens requested
    event RequestCreated(uint256 indexed requestId, address indexed requester, address indexed completer, uint256 amount, string message);

    /// @notice Emitted when a request is completed and funds are claimed
    /// @param requestId The ID of the completed request
    /// @param completer The address of the request completer
    event RequestCompleted(uint256 indexed requestId, address indexed completer);

    /// @notice Emitted when a request is cancelled and funds are returned
    /// @param requestId The ID of the cancelled request
    /// @param requester The address of the request requester
    event RequestCancelled(uint256 indexed requestId, address indexed requester);

    /// @notice Initializes the contract with the token address
    /// @param _token The address of the ERC20 token to be used
    constructor(address _token) {
        require(_token != address(0), "Invalid token address");
        token = IERC20(_token);
    }

    /// @notice Creates a new request by transferring tokens to the contract
    /// @param requesterFid The Farcaster ID of the requester (Alice)
    /// @param completer The address of the intended completer (Bob)
    /// @param completerFid The Farcaster ID of the intended completer (Bob)
    /// @dev Uses safeTransferFrom to safely handle token transfers
    function requestFlockIn(
        uint256 requesterFid,
        address completer,
        uint256 completerFid,
        string memory message
    ) external nonReentrant {
        require(completer != address(0), "Invalid completer address");
        token.safeTransferFrom(msg.sender, address(this), REQUEST_AMOUNT);
        
        uint256 requestId = requestCounter++;
        requests[requestId] = Request({
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
        
        requestsMadeByAddress[msg.sender].push(requests[requestId]);
        requestsReceivedByAddress[completer].push(requests[requestId]);
        requestsMadeByFid[requesterFid].push(requests[requestId]);
        requestsReceivedByFid[completerFid].push(requests[requestId]);

        emit RequestCreated(requestId, msg.sender, completer, REQUEST_AMOUNT, message);
    }

    /// @notice Completes a request and transfers the funds to the completer
    /// @param requestId The ID of the request to complete
    /// @dev Only the intended completer can complete the request, and it must not be already completed or cancelled
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
    /// @param requestId The ID of the request to cancel
    /// @dev Only the requester can cancel their request, and it must not be already completed or cancelled
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
    /// @param requester The address to get requests for
    /// @return An array of Request structs representing all requests made by the requester
    /// @dev Returns requests from the requestsMadeByAddress mapping for the given address
    function getRequestsMadeByAddress(address requester) external view returns (Request[] memory) {
        return requestsMadeByAddress[requester];
    }

    /// @notice Gets all requests received by a specific address
    /// @param completer The address to get requests for
    /// @return An array of Request structs representing all requests where completer is the intended recipient
    /// @dev Returns requests from the requestsReceivedByAddress mapping for the given address
    function getRequestsReceivedByAddress(address completer) external view returns (Request[] memory) {
        return requestsReceivedByAddress[completer];
    }

    /// @notice Gets all requests made by a specific Farcaster ID
    /// @param requesterFid The Farcaster ID to get requests for
    /// @return An array of Request structs representing all requests made by the given Farcaster ID
    /// @dev Returns requests from the requestsMadeByFid mapping for the given FID
    function getRequestsMadeByFid(uint256 requesterFid) external view returns (Request[] memory) {
        return requestsMadeByFid[requesterFid];
    }

    /// @notice Gets all requests received by a specific Farcaster ID
    /// @param completerFid The Farcaster ID to get requests for
    /// @return An array of Request structs representing all requests where the given Farcaster ID is the intended recipient
    /// @dev Returns requests from the requestsReceivedByFid mapping for the given FID
    function getRequestsReceivedByFid(uint256 completerFid) external view returns (Request[] memory) {
        return requestsReceivedByFid[completerFid];
    }
}
