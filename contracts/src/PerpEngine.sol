// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./interfaces/IInterfaces.sol";

/// @title  PerpEngine
/// @notice Perpetual futures engine with cross-margin accounts.
///         - Collateral: USDC only (1e6 decimals)
///         - Base token amounts: 1e18 decimals (ETH standard)
///         - Mark / oracle price: 1e8 decimals (Chainlink / Pyth standard)
///         - Funding index: 1e9 scale
///
/// Unit notes
/// ----------
/// size         : base token, 1e18 (ETH atoms).  Positive = long, negative = short.
/// margin       : USDC atoms,  1e6.
/// markPrice    : USD per base token, 1e8.  e.g. $3000 = 3_000_00000000
/// NOTIONAL_SCALE = BASE_DECIMALS × PRICE_SCALE / USDC_DECIMALS
///              = 1e18 × 1e8 / 1e6 = 1e20
///   → notional (USDC atoms) = abs(size) × markPrice / NOTIONAL_SCALE
contract PerpEngine is ReentrancyGuard, Ownable {
    using ECDSA for bytes32;

    // ── Scale constants ────────────────────────────────────────────────────
    uint256 constant PRICE_SCALE     = 1e8;
    uint256 constant USDC_SCALE      = 1e6;
    uint256 constant BASE_SCALE      = 1e18;
    /// @dev Converts (ETH atoms × 1e8 price) → USDC atoms: 1e18 × 1e8 / 1e6 = 1e20
    uint256 constant NOTIONAL_SCALE  = 1e20;
    uint256 constant FUNDING_SCALE   = 1e9;

    uint256 constant MAX_LEVERAGE    = 20;
    /// @dev 5% maintenance margin in basis points
    uint256 constant LIQ_THRESHOLD   = 500;
    /// @dev 1% liquidation bonus for the caller
    uint256 constant LIQ_FEE_BPS     = 100;
    /// @dev Oracle staleness limit: 60 seconds
    uint256 constant MAX_ORACLE_AGE  = 60;
    /// @dev Maximum mark price deviation from oracle: 1%
    uint256 constant MAX_PRICE_DEV_BPS = 100;

    // ── Types ──────────────────────────────────────────────────────────────

    struct Market {
        bytes32 assetId;      // e.g. keccak256("ETH/USD")
        string  symbol;
        bool    active;
        uint256 maxLeverage;
        uint256 takerFeeBps;
        uint256 makerFeeBps;
    }

    struct Position {
        int256  size;           // ETH atoms (1e18). positive = long, negative = short
        uint256 margin;         // USDC atoms (1e6)
        int256  entryPrice;     // USD/base, 1e8
        int256  fundingIndex;   // cumulative funding index at entry (1e9)
        uint256 lastUpdateTime;
    }

    struct TradeOrder {
        address trader;
        uint256 marketId;
        bool    isLong;
        uint256 sizeDelta;       // base token atoms (1e18), 0 = close
        uint256 collateralDelta; // USDC atoms (1e6) to add / remove
        bool    isIncrease;
        int256  acceptablePrice; // 1e8; slippage check
        uint256 nonce;
        uint256 expiry;
    }

    bytes32 public constant TRADE_TYPEHASH = keccak256(
        "TradeOrder(address trader,uint256 marketId,bool isLong,uint256 sizeDelta,uint256 collateralDelta,bool isIncrease,int256 acceptablePrice,uint256 nonce,uint256 expiry)"
    );

    bytes32 public immutable DOMAIN_SEPARATOR;

    // ── State ──────────────────────────────────────────────────────────────

    IVault          public immutable vault;
    IPriceFeed      public           priceFeed;
    address         public           usdc;
    address         public           relayer;

    Market[]        public           markets;
    // marketId => trader => Position
    mapping(uint256 => mapping(address => Position)) public positions;
    // per-market cumulative funding index (1e9)
    mapping(uint256 => int256)  public fundingIndex;
    mapping(uint256 => uint256) public fundingUpdatedAt;
    mapping(bytes32 => bool)    public processedOrders;

    address public feeRecipient;
    address public insuranceFund;

    /// @notice Total USDC margin currently locked in open positions (USDC atoms).
    /// The vault must hold at least this amount for the engine address.
    uint256 public totalMarginLocked;

    // ── Events ─────────────────────────────────────────────────────────────

    event MarketAdded(uint256 indexed id, string symbol);
    event PositionUpdated(
        uint256 indexed marketId,
        address indexed trader,
        int256  size,
        uint256 margin,
        int256  entryPrice
    );
    event Liquidated(
        uint256 indexed marketId,
        address indexed trader,
        address indexed liquidator,
        int256  size,
        uint256 remainingMargin
    );
    event FundingUpdated(uint256 indexed marketId, int256 index, int256 rate);

    // ── Constructor ────────────────────────────────────────────────────────

    constructor(
        address _vault,
        address _priceFeed,
        address _usdc,
        address _relayer,
        address initialOwner
    ) Ownable(initialOwner) {
        vault         = IVault(_vault);
        priceFeed     = IPriceFeed(_priceFeed);
        usdc          = _usdc;
        relayer       = _relayer;
        feeRecipient  = initialOwner;
        insuranceFund = initialOwner;

        DOMAIN_SEPARATOR = keccak256(abi.encode(
            keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
            keccak256("BaseDEX PerpEngine"),
            keccak256("1"),
            block.chainid,
            address(this)
        ));
    }

    // ── Admin ──────────────────────────────────────────────────────────────

    function addMarket(
        bytes32 assetId,
        string calldata symbol,
        uint256 maxLeverage,
        uint256 takerFee,
        uint256 makerFee
    ) external onlyOwner returns (uint256 id) {
        require(maxLeverage <= MAX_LEVERAGE, "leverage too high");
        require(takerFee <= 100 && makerFee <= 100, "fee too high"); // max 1%
        id = markets.length;
        markets.push(Market(assetId, symbol, true, maxLeverage, takerFee, makerFee));
        fundingUpdatedAt[id] = block.timestamp;
        emit MarketAdded(id, symbol);
    }

    function setRelayer(address _relayer)   external onlyOwner { relayer = _relayer; }
    function setPriceFeed(address _feed)    external onlyOwner { priceFeed = IPriceFeed(_feed); }
    function setFeeRecipient(address _fee)  external onlyOwner { feeRecipient = _fee; }
    function setInsuranceFund(address _ins) external onlyOwner { insuranceFund = _ins; }

    /// @notice Owner deposits USDC into this engine's vault balance to back profitable positions.
    ///         The USDC must already be in the caller's vault balance (call vault.deposit first).
    function depositInsurance(uint256 amount) external onlyOwner {
        vault.debit(msg.sender, usdc, amount);
        vault.credit(address(this), usdc, amount);
    }

    function setMarketActive(uint256 marketId, bool active) external onlyOwner {
        markets[marketId].active = active;
    }

    // ── Funding ────────────────────────────────────────────────────────────

    /// @notice Relayer pushes funding rate updates (computed off-chain from premium index).
    /// @param fundingRatePerSec  Funding rate in 1e9 scale, representing USDC atoms paid
    ///                           per (ETH atom of size) per second.  Off-chain: derive as
    ///                           premiumRate_per_sec * markPrice / NOTIONAL_SCALE.
    function applyFunding(uint256 marketId, int256 fundingRatePerSec) external {
        require(msg.sender == relayer, "not relayer");
        uint256 dt = block.timestamp - fundingUpdatedAt[marketId];
        fundingIndex[marketId]     += fundingRatePerSec * int256(dt);
        fundingUpdatedAt[marketId]  = block.timestamp;
        emit FundingUpdated(marketId, fundingIndex[marketId], fundingRatePerSec);
    }

    // ── Trade execution ────────────────────────────────────────────────────

    /// @notice Execute a signed trade order.  Callable by the relayer only.
    function executeOrder(
        TradeOrder calldata order,
        bytes      calldata sig,
        int256     markPrice  // 1e8 — validated against oracle (max 1% deviation, max 60s stale)
    ) external nonReentrant {
        require(msg.sender == relayer, "not relayer");
        require(block.timestamp <= order.expiry, "expired");
        require(markets[order.marketId].active, "market inactive");

        bytes32 orderHash = _hashOrder(order);
        require(!processedOrders[orderHash], "duplicate order");
        _verifySig(orderHash, order.trader, sig);
        processedOrders[orderHash] = true;

        _validateMarkPrice(markets[order.marketId].assetId, markPrice);

        // Slippage check
        if (order.isIncrease && order.acceptablePrice > 0) {
            if (order.isLong) {
                require(markPrice <= order.acceptablePrice, "price above limit");
            } else {
                require(markPrice >= order.acceptablePrice, "price below limit");
            }
        }

        if (order.isIncrease) {
            _increasePosition(order, markPrice);
        } else {
            _decreasePosition(order, markPrice);
        }
    }

    // ── Liquidation ────────────────────────────────────────────────────────

    /// @notice Anyone can liquidate an under-margined position.
    function liquidate(uint256 marketId, address trader) external nonReentrant {
        Market   memory mkt = markets[marketId];
        Position storage pos = positions[marketId][trader];
        require(pos.size != 0, "no position");

        (int256 markPrice,, uint256 updatedAt) = priceFeed.getLatestPrice(mkt.assetId);
        require(block.timestamp - updatedAt <= MAX_ORACLE_AGE, "oracle stale");

        _settleFunding(marketId, trader);

        int256 unrealizedPnl = _calcPnl(pos.size, pos.entryPrice, markPrice);
        int256 equity        = int256(pos.margin) + unrealizedPnl;

        uint256 notional         = _notional(pos.size, markPrice);
        uint256 maintenanceMargin = (notional * LIQ_THRESHOLD) / 10_000;

        require(equity < int256(maintenanceMargin), "not liquidatable");

        uint256 liqFee    = (notional * LIQ_FEE_BPS) / 10_000;
        uint256 remaining = equity > 0 ? uint256(equity) : 0;

        // Release the locked margin from engine's vault custody.
        // remaining ≤ pos.margin (equity = margin + unrealizedPnl, and liquidation
        // only triggers when equity < maintenanceMargin ≤ margin), so this never
        // over-draws the engine's vault balance for losing positions.
        // For shortfall (equity < 0), pos.margin absorbs the loss as protocol reserves.
        if (pos.margin > 0) {
            vault.debit(address(this), usdc, pos.margin);
            totalMarginLocked -= pos.margin;
        }

        if (remaining > liqFee) {
            vault.credit(msg.sender,   usdc, liqFee);
            vault.credit(insuranceFund, usdc, remaining - liqFee);
        } else {
            if (remaining > 0) vault.credit(msg.sender, usdc, remaining);
            // Any shortfall stays as reserves in the engine's insurance balance
        }

        emit Liquidated(marketId, trader, msg.sender, pos.size, remaining);
        delete positions[marketId][trader];
    }

    // ── Views ──────────────────────────────────────────────────────────────

    function getPosition(uint256 marketId, address trader) external view returns (Position memory) {
        return positions[marketId][trader];
    }

    function isLiquidatable(uint256 marketId, address trader) external view returns (bool) {
        Position memory pos = positions[marketId][trader];
        if (pos.size == 0) return false;
        (int256 markPrice,, uint256 updatedAt) = priceFeed.getLatestPrice(markets[marketId].assetId);
        if (block.timestamp - updatedAt > MAX_ORACLE_AGE) return false; // stale oracle — don't liquidate
        int256  pnl      = _calcPnl(pos.size, pos.entryPrice, markPrice);
        int256  equity   = int256(pos.margin) + pnl;
        uint256 notional = _notional(pos.size, markPrice);
        return equity < int256((notional * LIQ_THRESHOLD) / 10_000);
    }

    function getEquity(uint256 marketId, address trader) external view returns (int256) {
        Position memory pos = positions[marketId][trader];
        if (pos.size == 0) return 0;
        (int256 markPrice,,) = priceFeed.getLatestPrice(markets[marketId].assetId);
        return int256(pos.margin) + _calcPnl(pos.size, pos.entryPrice, markPrice);
    }

    function marketsCount() external view returns (uint256) { return markets.length; }

    // ── Internals ──────────────────────────────────────────────────────────

    function _increasePosition(TradeOrder calldata order, int256 markPrice) internal {
        require(order.collateralDelta != 0 || order.sizeDelta != 0, "no-op");
        Market   memory mkt = markets[order.marketId];
        Position storage pos = positions[order.marketId][order.trader];

        // Settle any accrued funding before changing position
        if (pos.size != 0) _settleFunding(order.marketId, order.trader);

        // Collect margin from trader and custody it under this engine's vault balance.
        // This ensures every credit on close/liquidation has a matching debit here.
        if (order.collateralDelta > 0) {
            vault.debit(order.trader, usdc, order.collateralDelta);
            vault.credit(address(this), usdc, order.collateralDelta); // engine holds margin
            pos.margin += order.collateralDelta;
            totalMarginLocked += order.collateralDelta;
        }

        int256 newSize  = pos.size + (order.isLong ? int256(order.sizeDelta) : -int256(order.sizeDelta));
        int256 newEntry = _newEntryPrice(pos.size, pos.entryPrice, int256(order.sizeDelta), markPrice, order.isLong);

        // notional and leverage check — both in USDC atoms (1e6)
        uint256 notional    = _notional(newSize, markPrice);
        uint256 maxNotional = pos.margin * mkt.maxLeverage;  // margin (1e6) × lever = USDC atoms × lever
        require(notional <= maxNotional, "leverage exceeded");

        // Fee in USDC atoms — deducted from engine-held margin and paid to fee recipient
        uint256 fee = (_notional(int256(order.sizeDelta), markPrice) * mkt.takerFeeBps) / 10_000;
        require(pos.margin > fee, "insufficient margin for fee");
        pos.margin -= fee;
        totalMarginLocked -= fee;
        vault.debit(address(this), usdc, fee);  // engine releases fee from its custody
        vault.credit(feeRecipient, usdc, fee);

        pos.size           = newSize;
        pos.entryPrice     = newEntry;
        pos.fundingIndex   = fundingIndex[order.marketId];
        pos.lastUpdateTime = block.timestamp;

        emit PositionUpdated(order.marketId, order.trader, pos.size, pos.margin, pos.entryPrice);
    }

    function _decreasePosition(TradeOrder calldata order, int256 markPrice) internal {
        Position storage pos = positions[order.marketId][order.trader];
        require(pos.size != 0, "no position");

        _settleFunding(order.marketId, order.trader);

        bool    isCloseFull = order.sizeDelta == 0 || uint256(_abs(pos.size)) <= order.sizeDelta;
        int256  closedSize  = isCloseFull ? pos.size
                              : (pos.size > 0 ? int256(order.sizeDelta) : -int256(order.sizeDelta));
        int256  pnl         = _calcPnl(closedSize, pos.entryPrice, markPrice);

        Market memory mkt = markets[order.marketId];
        uint256 fee = (_notional(_abs(closedSize), markPrice) * mkt.takerFeeBps) / 10_000;

        if (isCloseFull) {
            // Release margin from engine's custody before paying out
            vault.debit(address(this), usdc, pos.margin);
            totalMarginLocked -= pos.margin;

            int256 collateralReturn = int256(pos.margin) + pnl - int256(fee);
            // Positive PnL beyond margin requires insurance fund balance in this engine's vault slot.
            if (collateralReturn > 0) vault.credit(order.trader, usdc, uint256(collateralReturn));
            vault.credit(feeRecipient, usdc, fee);
            delete positions[order.marketId][order.trader];
        } else {
            // Partial close: release margin proportional to closed size
            uint256 releasedMargin = (pos.margin * uint256(_abs(closedSize))) / uint256(_abs(pos.size));

            vault.debit(address(this), usdc, releasedMargin);
            totalMarginLocked -= releasedMargin;

            int256 netReturn = int256(releasedMargin) + pnl - int256(fee);
            if (netReturn > 0) vault.credit(order.trader, usdc, uint256(netReturn));
            vault.credit(feeRecipient, usdc, fee);

            pos.margin -= releasedMargin;
            pos.size   -= closedSize;
            pos.lastUpdateTime = block.timestamp;
        }

        emit PositionUpdated(order.marketId, order.trader, pos.size, pos.margin, pos.entryPrice);
    }

    function _settleFunding(uint256 marketId, address trader) internal {
        Position storage pos = positions[marketId][trader];
        if (pos.size == 0) return;
        int256 delta = fundingIndex[marketId] - pos.fundingIndex;
        if (delta == 0) return;
        // fundingPnl (USDC atoms) = -size (ETH atoms) × delta (1e9 per ETH atom) / FUNDING_SCALE
        int256 fundingPnl = -(pos.size * delta) / int256(FUNDING_SCALE);
        if (fundingPnl > 0) {
            pos.margin += uint256(fundingPnl);
        } else {
            uint256 loss = uint256(-fundingPnl);
            pos.margin = loss < pos.margin ? pos.margin - loss : 0;
        }
        pos.fundingIndex = fundingIndex[marketId];
    }

    // ── Pure helpers ───────────────────────────────────────────────────────

    /// @dev PnL in USDC atoms (1e6).
    ///      size (1e18) × priceDelta (1e8) / NOTIONAL_SCALE (1e20) = USDC atoms (1e6)
    function _calcPnl(int256 size, int256 entryPrice, int256 markPrice) internal pure returns (int256) {
        return (size * (markPrice - entryPrice)) / int256(NOTIONAL_SCALE);
    }

    /// @dev Absolute notional value in USDC atoms (1e6).
    ///      abs(size) (1e18) × markPrice (1e8) / NOTIONAL_SCALE (1e20) = USDC atoms (1e6)
    function _notional(int256 size, int256 markPrice) internal pure returns (uint256) {
        int256 abs = size > 0 ? size : -size;
        return uint256(abs * markPrice / int256(NOTIONAL_SCALE));
    }

    /// @dev Overload accepting uint256 size (for fee calculations on deltas).
    function _notional(uint256 size, int256 markPrice) internal pure returns (uint256) {
        return uint256(int256(size) * markPrice / int256(NOTIONAL_SCALE));
    }

    function _newEntryPrice(
        int256 existingSize,
        int256 existingEntry,
        int256 addedSize,
        int256 addedPrice,
        bool   isLong
    ) internal pure returns (int256) {
        if (existingSize == 0) return addedPrice;
        int256 s = isLong ? addedSize : -addedSize;
        int256 totalCost = existingSize * existingEntry + s * addedPrice;
        int256 totalSize = existingSize + s;
        if (totalSize == 0) return addedPrice;
        return totalCost / totalSize;
    }

    function _validateMarkPrice(bytes32 assetId, int256 markPrice) internal view {
        (int256 oraclePrice,, uint256 updatedAt) = priceFeed.getLatestPrice(assetId);
        require(block.timestamp - updatedAt <= MAX_ORACLE_AGE, "oracle stale");
        int256 diff = markPrice - oraclePrice;
        if (diff < 0) diff = -diff;
        // Enforce max MAX_PRICE_DEV_BPS (1%) deviation
        require(diff * 10_000 <= oraclePrice * int256(MAX_PRICE_DEV_BPS), "mark price deviation >1%");
    }

    function _hashOrder(TradeOrder calldata o) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            keccak256(abi.encode(
                TRADE_TYPEHASH,
                o.trader, o.marketId, o.isLong, o.sizeDelta,
                o.collateralDelta, o.isIncrease, o.acceptablePrice, o.nonce, o.expiry
            ))
        ));
    }

    function _verifySig(bytes32 hash, address signer, bytes calldata sig) internal pure {
        require(ECDSA.recover(hash, sig) == signer, "invalid sig");
    }

    function _abs(int256 x) internal pure returns (int256) {
        return x < 0 ? -x : x;
    }
}
