// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import { SafeMath } from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract BulkSender is ReentrancyGuard {
    using SafeMath for uint256;

    uint256 public constant BATCH_FEE = 0.0001 ether;
    uint256 public constant MAX_TRANSACTIONS = 300;

    event BulkSendExecuted(address indexed sender, address[] recipients, uint256[] values, address token);

    function bulkSend(address[] calldata recipients, uint256[] calldata values, address token) external payable nonReentrant {
        require(recipients.length == values.length, "Mismatched arrays");
        require(recipients.length <= MAX_TRANSACTIONS, "Too many txns");
        require(msg.value >= BATCH_FEE, "Low fee");

        uint256 totalAmount = 0;

        // Sprawdzenia i obliczenia
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid addr");
            require(values[i] > 0, "Invalid amount");
            totalAmount = totalAmount.add(values[i]);
        }

        if (token == address(0)) {
            require(totalAmount <= msg.value.sub(BATCH_FEE), "Low ETH");

            // Interakcje z zewnętrznymi kontraktami
            for (uint256 i = 0; i < recipients.length; i++) {
                (bool success, ) = payable(recipients[i]).call{value: values[i]}(""); // Zmieniono na `call`
                require(success, "Tx failed");
            }
        } else {
            IERC20 erc20 = IERC20(token);
            require(erc20.allowance(msg.sender, address(this)) >= totalAmount, "Low allowance");

            // Interakcje z zewnętrznymi kontraktami
            for (uint256 i = 0; i < recipients.length; i++) {
                bool success = erc20.transferFrom(msg.sender, recipients[i], values[i]);
                require(success, "Token tx failed");
            }
        }

        emit BulkSendExecuted(msg.sender, recipients, values, token);
    }
}
