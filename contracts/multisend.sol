// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BatchTransactionManager {
    uint256 public fee = 0.001 ether;
    uint256 public batchSize = 250;
    uint256 public maxBatches = 20;
    address public token;

    struct Transaction {
        address to;
        uint256 amount;
    }

    Transaction[] public transactions;
    uint256 public currentBatch;

    event BatchPrepared(uint256 batchesLeft);

    constructor(address _token) {
        token = _token;
    }

    function uploadTransactions(Transaction[] memory _transactions) public payable {
        uint256 totalBatches = (_transactions.length + batchSize - 1) / batchSize;
        require(totalBatches <= maxBatches, "Exceeds maximum batches");
        require(msg.value >= fee * totalBatches, "Insufficient fee");

        for (uint256 i = 0; i < _transactions.length; i++) {
            transactions.push(_transactions[i]);
        }

        currentBatch = 0;
        emit BatchPrepared(totalBatches);
    }

    function executeFirstBatch(address multiSendAddress) public {
        require(currentBatch * batchSize < transactions.length, "No more batches");

        bytes memory batchData = encodeBatch(currentBatch);
        MultiSend(multiSendAddress).multiSend{value: fee}(batchData);

        currentBatch++;
        uint256 batchesLeft = (transactions.length + batchSize - 1) / batchSize - currentBatch;
        emit BatchPrepared(batchesLeft);
    }

    function encodeBatch(uint256 batchIndex) internal view returns (bytes memory) {
        bytes memory batchData;
        uint256 start = batchIndex * batchSize;
        uint256 end = start + batchSize > transactions.length ? transactions.length : start + batchSize;

        for (uint256 i = start; i < end; i++) {
            batchData = abi.encodePacked(
                batchData,
                uint8(0), // operation: call
                token,
                uint256(0), // value: 0 for ERC20 transfer
                uint256(68), // data length: 4 bytes for function selector + 32 bytes for address + 32 bytes for amount
                abi.encodeWithSelector(IERC20.transfer.selector, transactions[i].to, transactions[i].amount)
            );
        }

        return batchData;
    }
}

interface MultiSend {
    function multiSend(bytes memory transactions) external payable;
}