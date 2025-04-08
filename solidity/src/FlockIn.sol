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
        address requester;  // Address of the request requester (Alice)
        uint256 requesterFid; // Farcaster ID of the requester (Alice)
        address completer;  // Address of the intended completer (Bob)
        uint256 completerFid; // Farcaster ID of the intended completer (Bob)
        uint256 amount;    // Amount of tokens requested
        bool isClaimed;    // Whether the request has been claimed or cancelled
    }

    /// @notice The ERC20 token used for requests
    IERC20 public immutable token;

    /// @notice The fixed amount required for each request
    /// @dev Set to 4500 tokens (assuming 18 decimals)
    uint256 public constant REQUEST_AMOUNT = 4500 * 10**18;
    
    /// @notice Mapping of request IDs to Request structs
    mapping(uint256 => Request) public requests;

    /// @notice Counter to generate unique request IDs
    uint256 public requestCounter;

    /// @notice Emitted when a new request is created
    /// @param requestId The ID of the created request
    /// @param requester The address of the request requester
    /// @param completer The address of the intended completer
    /// @param amount The amount of tokens requested
    event RequestCreated(uint256 indexed requestId, address indexed requester, address indexed completer, uint256 amount);

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
        uint256 completerFid
    ) external nonReentrant {
        require(completer != address(0), "Invalid completer address");
        token.safeTransferFrom(msg.sender, address(this), REQUEST_AMOUNT);
        
        uint256 requestId = requestCounter++;
        requests[requestId] = Request({
            requester: msg.sender,
            requesterFid: requesterFid,
            completer: completer,
            completerFid: completerFid,
            amount: REQUEST_AMOUNT,
            isClaimed: false
        });

        emit RequestCreated(requestId, msg.sender, completer, REQUEST_AMOUNT);
    }

    /// @notice Completes a request and transfers the funds to the completer
    /// @param requestId The ID of the request to complete
    /// @dev Only the intended completer can complete the request, and it must not be already claimed
    function completeRequest(uint256 requestId) external nonReentrant {
        Request storage request = requests[requestId];
        require(request.completer == msg.sender, "Not the intended completer");
        require(!request.isClaimed, "Already claimed");
        
        request.isClaimed = true;
        token.safeTransfer(msg.sender, request.amount);
        
        emit RequestCompleted(requestId, msg.sender);
    }

    /// @notice Cancels a request and returns the funds to the requester
    /// @param requestId The ID of the request to cancel
    /// @dev Only the requester can cancel their request, and it must not be already claimed
    function cancelRequest(uint256 requestId) external nonReentrant {
        Request storage request = requests[requestId];
        require(request.requester == msg.sender, "Not the requester");
        require(!request.isClaimed, "Request already claimed");
        
        request.isClaimed = true;
        token.safeTransfer(msg.sender, request.amount);
        
        emit RequestCancelled(requestId, msg.sender);
    }
}
