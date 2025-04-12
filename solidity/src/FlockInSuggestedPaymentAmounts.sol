// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title FlockInSuggestedPaymentAmounts
/// @notice A contract that manages suggested payment amounts for FlockIn completers
contract FlockInSuggestedPaymentAmounts {
    /// @notice Structure to store suggested payment amounts
    struct SuggestedPaymentAmount {
        address completer;
        uint256 completerFid;
        address token;
        uint256 amount;
    }

    // Mapping from completer address to their suggested payment amounts
    mapping(address => SuggestedPaymentAmount[]) private suggestedAmountsByAddress;
    
    // Mapping from completer FID to their suggested payment amounts
    mapping(uint256 => SuggestedPaymentAmount[]) private suggestedAmountsByFid;

    // Events
    event SuggestedAmountAdded(address indexed completer, uint256 indexed completerFid, address token, uint256 amount);
    event SuggestedAmountRemoved(address indexed completer, uint256 indexed completerFid, address token);

    /// @notice Adds a suggested payment amount for a completer
    /// @dev Only the completer can add their own suggested amounts
    function addSuggestedAmount(uint256 completerFid, address token, uint256 amount) external {
        require(token != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than 0");

        SuggestedPaymentAmount memory newAmount = SuggestedPaymentAmount({
            completer: msg.sender,
            completerFid: completerFid,
            token: token,
            amount: amount
        });

        suggestedAmountsByAddress[msg.sender].push(newAmount);
        suggestedAmountsByFid[completerFid].push(newAmount);

        emit SuggestedAmountAdded(msg.sender, completerFid, token, amount);
    }

    /// @notice Removes a suggested payment amount for a specific token
    /// @dev Only the completer can remove their own suggested amounts
    function removeSuggestedAmount(address token) external {
        SuggestedPaymentAmount[] storage amounts = suggestedAmountsByAddress[msg.sender];
        uint256 completerFid;

        for (uint256 i = 0; i < amounts.length; i++) {
            if (amounts[i].token == token) {
                completerFid = amounts[i].completerFid;
                // Remove from address mapping
                amounts[i] = amounts[amounts.length - 1];
                amounts.pop();
                break;
            }
        }

        // Remove from FID mapping
        SuggestedPaymentAmount[] storage fidAmounts = suggestedAmountsByFid[completerFid];
        for (uint256 i = 0; i < fidAmounts.length; i++) {
            if (fidAmounts[i].token == token && fidAmounts[i].completer == msg.sender) {
                fidAmounts[i] = fidAmounts[fidAmounts.length - 1];
                fidAmounts.pop();
                break;
            }
        }

        emit SuggestedAmountRemoved(msg.sender, completerFid, token);
    }

    /// @notice Gets all suggested payment amounts for a completer by their address
    /// @param completer The address of the completer
    /// @return An array of suggested payment amounts
    function getSuggestedAmountsByAddress(address completer) external view returns (SuggestedPaymentAmount[] memory) {
        return suggestedAmountsByAddress[completer];
    }

    /// @notice Gets all suggested payment amounts for a completer by their FID
    /// @param completerFid The FID of the completer
    /// @return An array of suggested payment amounts
    function getSuggestedAmountsByFid(uint256 completerFid) external view returns (SuggestedPaymentAmount[] memory) {
        return suggestedAmountsByFid[completerFid];
    }
}
