// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Minimal ERC-20 interface used by the DEX engines
interface IERC20Minimal {
    function decimals() external view returns (uint8);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

/// @notice Price oracle interface — returns (price, confidence, publishTime)
interface IPriceFeed {
    /// @return price     Current price scaled to 1e8 (e.g. 3000_00000000 = $3000)
    /// @return conf      Confidence interval (same scale)
    /// @return updatedAt Unix timestamp of the last update
    function getLatestPrice(bytes32 assetId)
        external
        view
        returns (int256 price, uint256 conf, uint256 updatedAt);
}

interface IVault {
    function credit(address user, address token, uint256 amount) external;
    function debit(address user, address token, uint256 amount) external;
    function balanceOf(address user, address token) external view returns (uint256);
}
