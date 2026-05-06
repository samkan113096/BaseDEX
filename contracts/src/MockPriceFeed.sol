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

    // Asset IDs matching the backend's market config
    bytes32 public constant ETH_USD   = keccak256("ETH/USD");
    bytes32 public constant BTC_USD   = keccak256("BTC/USD");
    bytes32 public constant SOL_USD   = keccak256("SOL/USD");
    bytes32 public constant DOGE_USD  = keccak256("DOGE/USD");
    bytes32 public constant AVAX_USD  = keccak256("AVAX/USD");
    bytes32 public constant LINK_USD  = keccak256("LINK/USD");
    bytes32 public constant CBBTC_USD = keccak256("cbBTC/USD");
    bytes32 public constant CBETH_USD = keccak256("cbETH/USD");
    bytes32 public constant AERO_USD  = keccak256("AERO/USD");
    bytes32 public constant ARB_USD   = keccak256("ARB/USD");
    bytes32 public constant POL_USD   = keccak256("POL/USD");

    event PriceUpdated(bytes32 indexed assetId, int256 price, uint256 updatedAt);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        // Seed with approximate market prices (8 decimals, same as Chainlink)
        _set(ETH_USD,   int256(3_000_00000000),  50_00000);   // $3,000
        _set(BTC_USD,   int256(97_000_00000000), 500_00000);  // $97,000
        _set(SOL_USD,   int256(175_00000000),    2_00000);    // $175
        _set(DOGE_USD,  int256(16000000),        1000);        // $0.16
        _set(AVAX_USD,  int256(35_00000000),     50000);      // $35
        _set(LINK_USD,  int256(14_00000000),     20000);      // $14
        _set(CBBTC_USD, int256(97_000_00000000), 500_00000);  // $97,000 (tracks BTC)
        _set(CBETH_USD, int256(3_200_00000000),  60_00000);   // $3,200 (tracks ETH)
        _set(AERO_USD,  int256(85000000),        5000);       // $0.85
        _set(ARB_USD,   int256(62000000),        3000);       // $0.62
        _set(POL_USD,   int256(38000000),        2000);       // $0.38
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
