// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

import "./BatchTransactionManager.sol";

contract BatchExecutor {
    BatchTransactionManager public manager;
    address public multiSendAddress;

    constructor(address _manager, address _multiSendAddress) {
        manager = BatchTransactionManager(_manager);
        multiSendAddress = _multiSendAddress;
    }

    function onBatchPrepared(uint256 batchesLeft) external {
        require(msg.sender == address(manager), "Unauthorized");

        if (batchesLeft > 0) {
            manager.executeNextBatch(multiSendAddress);
        }
    }
}