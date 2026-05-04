// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "./interfaces/IInterfaces.sol";

/// @title  SpotEngine
/// @notice Off-chain-matched, on-chain-settled spot order book.
///         The relayer (backend) submits matched order pairs; this contract
///         verifies EIP-712 signatures and settles via the Vault.
contract SpotEngine is ReentrancyGuard, Ownable {
    using ECDSA for bytes32;

    // ── Types ──────────────────────────────────────────────────────────────

    struct Market {
        address baseToken;
        address quoteToken;  // always USDC on this DEX
        bool    active;
    }

    struct Order {
        address maker;
        uint256 marketId;
        bool    isBuy;       // true = buy base with quote, false = sell base for quote
        uint256 price;       // quote per base, 1e6 (USDC decimals)
        uint256 baseAmount;  // base token amount (token decimals)
        uint256 nonce;
        uint256 expiry;
    }

    bytes32 public constant ORDER_TYPEHASH = keccak256(
        "Order(address maker,uint256 marketId,bool isBuy,uint256 price,uint256 baseAmount,uint256 nonce,uint256 expiry)"
    );

    bytes32 public immutable DOMAIN_SEPARATOR;

    // ── State ──────────────────────────────────────────────────────────────

    IVault public immutable vault;
    Market[] public markets;
    address public relayer;

    mapping(bytes32 => bool) public filledOrders;
    mapping(address => uint256) public nonces;

    uint256 public takerFeeBps = 6;  // 0.06%
    uint256 public makerFeeBps = 1;  // 0.01% rebate

    address public feeRecipient;

    // mapping: user => nonce => cancelled
    mapping(address => mapping(uint256 => bool)) public cancelledNonces;

    // ── Events ─────────────────────────────────────────────────────────────

    event MarketAdded(uint256 indexed marketId, address baseToken, address quoteToken);
    event SpotTrade(
        uint256 indexed marketId,
        address indexed buyer,
        address indexed seller,
        uint256 price,
        uint256 baseAmount,
        uint256 quoteAmount
    );

    // ── Constructor ────────────────────────────────────────────────────────

    constructor(address _vault, address _relayer, address initialOwner) Ownable(initialOwner) {
        vault        = IVault(_vault);
        relayer      = _relayer;
        feeRecipient = initialOwner;

        DOMAIN_SEPARATOR = keccak256(abi.encode(
            keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
            keccak256("BaseDEX SpotEngine"),
            keccak256("1"),
            block.chainid,
            address(this)
        ));
    }

    // ── Admin ──────────────────────────────────────────────────────────────

    function addMarket(address baseToken, address quoteToken) external onlyOwner returns (uint256 id) {
        id = markets.length;
        markets.push(Market(baseToken, quoteToken, true));
        emit MarketAdded(id, baseToken, quoteToken);
    }

    function setRelayer(address _relayer) external onlyOwner { relayer = _relayer; }
    function setFeeRecipient(address _rec) external onlyOwner { feeRecipient = _rec; }
    function setFees(uint256 _taker, uint256 _maker) external onlyOwner {
        require(_taker <= 100 && _maker <= 100, "fee too high"); // max 1%
        takerFeeBps = _taker;
        makerFeeBps = _maker;
    }

    /// @notice User can cancel a specific nonce to prevent future use of orders with that nonce.
    function cancelNonce(uint256 nonce) external {
        cancelledNonces[msg.sender][nonce] = true;
    }

    // ── Settlement ─────────────────────────────────────────────────────────

    /// @notice Called by the relayer to settle a matched pair of orders.
    function settleMatch(
        Order calldata buyOrder,
        Order calldata sellOrder,
        bytes calldata buyerSig,
        bytes calldata sellerSig,
        uint256 fillBaseAmount  // actual fill size (≤ both order sizes)
    ) external nonReentrant {
        require(msg.sender == relayer, "not relayer");
        require(buyOrder.marketId == sellOrder.marketId, "market mismatch");
        require(buyOrder.isBuy && !sellOrder.isBuy,       "side mismatch");
        require(buyOrder.price >= sellOrder.price,         "price cross invalid");
        require(block.timestamp <= buyOrder.expiry && block.timestamp <= sellOrder.expiry, "expired");

        Market memory mkt = markets[buyOrder.marketId];
        require(mkt.active, "market inactive");

        bytes32 buyHash  = _hash(buyOrder);
        bytes32 sellHash = _hash(sellOrder);
        require(!filledOrders[buyHash] && !filledOrders[sellHash], "already filled");
        require(!cancelledNonces[buyOrder.maker][buyOrder.nonce], "buy nonce cancelled");
        require(!cancelledNonces[sellOrder.maker][sellOrder.nonce], "sell nonce cancelled");

        _verifySignature(buyHash,  buyOrder.maker,  buyerSig);
        _verifySignature(sellHash, sellOrder.maker, sellerSig);

        filledOrders[buyHash]  = true;
        filledOrders[sellHash] = true;

        // Execute at buyer's price (price improvement goes to buyer)
        uint256 execPrice   = buyOrder.price;
        uint256 quoteAmount = (fillBaseAmount * execPrice) / 1e18;

        // Taker = buyer (crosses the spread), Maker = seller
        uint256 takerFee = (quoteAmount * takerFeeBps) / 10_000;
        uint256 makerFee = (quoteAmount * makerFeeBps) / 10_000;

        // Debit buyer quote, credit seller base
        vault.debit(buyOrder.maker,  mkt.quoteToken, quoteAmount + takerFee);
        vault.debit(sellOrder.maker, mkt.baseToken,  fillBaseAmount);

        vault.credit(buyOrder.maker,  mkt.baseToken,  fillBaseAmount);
        vault.credit(sellOrder.maker, mkt.quoteToken, quoteAmount - makerFee);

        if (takerFee + makerFee > 0) {
            vault.credit(feeRecipient, mkt.quoteToken, takerFee + makerFee);
        }

        emit SpotTrade(buyOrder.marketId, buyOrder.maker, sellOrder.maker, execPrice, fillBaseAmount, quoteAmount);
    }

    // ── Views ──────────────────────────────────────────────────────────────

    function marketsCount() external view returns (uint256) { return markets.length; }

    // ── Internals ──────────────────────────────────────────────────────────

    function _hash(Order calldata o) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            keccak256(abi.encode(
                ORDER_TYPEHASH,
                o.maker, o.marketId, o.isBuy, o.price, o.baseAmount, o.nonce, o.expiry
            ))
        ));
    }

    function _verifySignature(bytes32 hash, address signer, bytes calldata sig) internal pure {
        address recovered = ECDSA.recover(hash, sig);
        require(recovered == signer, "invalid sig");
    }
}
