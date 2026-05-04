// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IInterfaces.sol";

/// @title  Vault
/// @notice Central collateral ledger.  Users deposit whitelisted tokens here;
///         the SpotEngine and PerpEngine debit / credit balances when trades settle.
contract Vault is IVault, ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // token => (user => balance)
    mapping(address => mapping(address => uint256)) private _balances;

    mapping(address => bool) public whitelistedTokens;
    mapping(address => bool) public authorizedEngines;

    event Deposit(address indexed user, address indexed token, uint256 amount);
    event Withdraw(address indexed user, address indexed token, uint256 amount);
    event EngineAuthorized(address indexed engine, bool authorized);
    event TokenWhitelisted(address indexed token, bool listed);

    constructor(address initialOwner) Ownable(initialOwner) {}

    // ── Admin ──────────────────────────────────────────────────────────────

    function setEngine(address engine, bool authorized) external onlyOwner {
        authorizedEngines[engine] = authorized;
        emit EngineAuthorized(engine, authorized);
    }

    function whitelistToken(address token, bool listed) external onlyOwner {
        whitelistedTokens[token] = listed;
        emit TokenWhitelisted(token, listed);
    }

    // ── User-facing ────────────────────────────────────────────────────────

    /// @notice Deposit `amount` of `token` into the vault.
    function deposit(address token, uint256 amount) external nonReentrant {
        require(whitelistedTokens[token], "token not whitelisted");
        require(amount != 0, "zero amount");
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        _balances[token][msg.sender] += amount;
        emit Deposit(msg.sender, token, amount);
    }

    /// @notice Withdraw `amount` of `token` from the vault.
    function withdraw(address token, uint256 amount) external nonReentrant {
        require(_balances[token][msg.sender] >= amount, "insufficient balance");
        _balances[token][msg.sender] -= amount;
        IERC20(token).safeTransfer(msg.sender, amount);
        emit Withdraw(msg.sender, token, amount);
    }

    // ── Engine-facing ──────────────────────────────────────────────────────

    function credit(address user, address token, uint256 amount) external override {
        require(authorizedEngines[msg.sender], "not engine");
        _balances[token][user] += amount;
    }

    function debit(address user, address token, uint256 amount) external override {
        require(authorizedEngines[msg.sender], "not engine");
        require(_balances[token][user] >= amount, "insufficient");
        _balances[token][user] -= amount;
    }

    function balanceOf(address user, address token) external view override returns (uint256) {
        return _balances[token][user];
    }
}
