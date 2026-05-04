// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IInterfaces.sol";

/// @title  MockPriceFeed
/// @notice Simple updatable price feed for local / testnet use.
///         Prices are stored with 8 decimals (same scale as Chainlink / Pyth).
contract MockPriceFeed is IPriceFeed {
    struct Price {
        int256 price;
        uint256 conf;
        uint256 updatedAt;
    }

    address public owner;
    mapping(bytes32 => Price) private _prices;

    // Pre-defined asset IDs matching the backend's market config
    bytes32 public constant ETH_USD  = keccak256("ETH/USD");
    bytes32 public constant BTC_USD  = keccak256("BTC/USD");
    bytes32 public constant SOL_USD  = keccak256("SOL/USD");
    bytes32 public constant ARB_USD  = keccak256("ARB/USD");
    bytes32 public constant OP_USD   = keccak256("OP/USD");

    event PriceUpdated(bytes32 indexed assetId, int256 price, uint256 updatedAt);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        // Seed with reasonable starting prices
        _set(ETH_USD,  int256(3_000e8), 5e5);
        _set(BTC_USD,  int256(65_000e8), 50e5);
        _set(SOL_USD,  int256(160e8), 2e5);
        _set(ARB_USD,  int256(1_10e6), 1e5);   // $1.10
        _set(OP_USD,   int256(2_50e6), 1e5);   // $2.50
    }

    function setPrice(bytes32 assetId, int256 price, uint256 conf) external onlyOwner {
        _set(assetId, price, conf);
    }

    function batchSetPrices(
        bytes32[] calldata assetIds,
        int256[]  calldata prices,
        uint256[] calldata confs
    ) external onlyOwner {
        require(assetIds.length == prices.length && prices.length == confs.length, "len");
        for (uint256 i; i < assetIds.length; i++) {
            _set(assetIds[i], prices[i], confs[i]);
        }
    }

    function getLatestPrice(bytes32 assetId)
        external
        view
        override
        returns (int256 price, uint256 conf, uint256 updatedAt)
    {
        Price memory p = _prices[assetId];
        require(p.updatedAt != 0, "unknown asset");
        return (p.price, p.conf, p.updatedAt);
    }

    function _set(bytes32 assetId, int256 price, uint256 conf) internal {
        _prices[assetId] = Price(price, conf, block.timestamp);
        emit PriceUpdated(assetId, price, block.timestamp);
    }
}
