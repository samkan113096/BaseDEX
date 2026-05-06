// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/Vault.sol";
import "../src/SpotEngine.sol";
import "../src/PerpEngine.sol";
import "../src/MockPriceFeed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @dev Minimal mock ERC20 for testnet spot pairs
contract MockToken is ERC20 {
    uint8 private _dec;
    constructor(string memory name, string memory symbol, uint8 dec) ERC20(name, symbol) {
        _dec = dec;
    }
    function decimals() public view override returns (uint8) { return _dec; }
    function mint(address to, uint256 amount) external { _mint(to, amount); }
}

contract Deploy is Script {
    // ── Ethereum Sepolia canonical tokens ─────────────────────
    // USDC: Circle's official Sepolia USDC
    address constant USDC = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238;
    // WETH: Sepolia WETH (UniV2-compatible)
    address constant WETH = 0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14;

    function run() external {
        uint256 deployerPk = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer   = vm.addr(deployerPk);

        vm.startBroadcast(deployerPk);

        // ── 1. Price feed ──────────────────────────────────────
        MockPriceFeed priceFeed = new MockPriceFeed();

        // ── 2. Mock ERC-20 tokens for spot pairs ──────────────
        // (Base Sepolia doesn't have canonical BTC/SOL/DOGE tokens)
        MockToken mockUSDT = new MockToken("Tether USD",     "USDT", 6);
        MockToken mockBTC  = new MockToken("Wrapped Bitcoin","WBTC", 8);
        MockToken mockSOL  = new MockToken("Wrapped SOL",    "SOL",  9);
        MockToken mockDOGE = new MockToken("Dogecoin",       "DOGE", 8);
        MockToken mockAVAX = new MockToken("Avalanche",      "AVAX", 18);
        MockToken mockLINK = new MockToken("Chainlink",      "LINK", 18);
        MockToken mockAERO = new MockToken("Aerodrome",      "AERO", 18);

        // Mint test supply to deployer for seeding / testing
        uint256 largeAmount = 1_000_000e18;
        mockUSDT.mint(deployer, 1_000_000e6);
        mockBTC.mint(deployer, 100e8);
        mockSOL.mint(deployer, largeAmount);
        mockDOGE.mint(deployer, largeAmount);
        mockAVAX.mint(deployer, largeAmount);
        mockLINK.mint(deployer, largeAmount);
        mockAERO.mint(deployer, largeAmount);

        // ── 3. Vault ───────────────────────────────────────────
        Vault vault = new Vault(deployer);
        vault.whitelistToken(USDC,                  true);
        vault.whitelistToken(WETH,                  true);
        vault.whitelistToken(address(mockUSDT),     true);
        vault.whitelistToken(address(mockBTC),      true);
        vault.whitelistToken(address(mockSOL),      true);
        vault.whitelistToken(address(mockDOGE),     true);
        vault.whitelistToken(address(mockAVAX),     true);
        vault.whitelistToken(address(mockLINK),     true);
        vault.whitelistToken(address(mockAERO),     true);

        // ── 4. Spot engine ─────────────────────────────────────
        SpotEngine spot = new SpotEngine(address(vault), deployer, deployer);
        // ETH/USDC (canonical)
        spot.addMarket(WETH,                address(mockUSDT));  // ETH/USDT
        spot.addMarket(WETH,                USDC);               // ETH/USDC
        spot.addMarket(address(mockBTC),    USDC);               // BTC/USDC
        spot.addMarket(address(mockBTC),    address(mockUSDT));  // BTC/USDT
        spot.addMarket(address(mockSOL),    USDC);               // SOL/USDC
        spot.addMarket(address(mockSOL),    address(mockUSDT));  // SOL/USDT
        spot.addMarket(address(mockDOGE),   USDC);               // DOGE/USDC
        spot.addMarket(address(mockAVAX),   USDC);               // AVAX/USDC
        spot.addMarket(address(mockLINK),   USDC);               // LINK/USDC
        spot.addMarket(address(mockAERO),   USDC);               // AERO/USDC

        // ── 5. Perp engine ─────────────────────────────────────
        //      addMarket(assetId, label, maxLeverage, maintenanceMarginBps, takerFeeBps)
        PerpEngine perp = new PerpEngine(
            address(vault),
            address(priceFeed),
            USDC,
            deployer,
            deployer
        );
        perp.addMarket(keccak256("ETH/USD"),   "ETH-PERP",   20, 5, 6);
        perp.addMarket(keccak256("BTC/USD"),   "BTC-PERP",   20, 5, 6);
        perp.addMarket(keccak256("SOL/USD"),   "SOL-PERP",   20, 5, 6);
        perp.addMarket(keccak256("DOGE/USD"),  "DOGE-PERP",  10, 5, 6);
        perp.addMarket(keccak256("AVAX/USD"),  "AVAX-PERP",  10, 5, 6);
        perp.addMarket(keccak256("LINK/USD"),  "LINK-PERP",  10, 5, 6);
        perp.addMarket(keccak256("cbBTC/USD"), "cbBTC-PERP", 20, 5, 6);
        perp.addMarket(keccak256("cbETH/USD"), "cbETH-PERP", 20, 5, 6);
        perp.addMarket(keccak256("AERO/USD"),  "AERO-PERP",  10, 5, 6);
        perp.addMarket(keccak256("ARB/USD"),   "ARB-PERP",   10, 5, 6);
        perp.addMarket(keccak256("POL/USD"),   "POL-PERP",   10, 5, 6);

        // ── 6. Authorize engines in vault ──────────────────────
        vault.setEngine(address(spot), true);
        vault.setEngine(address(perp), true);

        vm.stopBroadcast();

        // ── Output addresses ───────────────────────────────────
        console.log("=== BaseDEX Testnet Deployment ===");
        console.log("Network    : Ethereum Sepolia (11155111)");
        console.log("Deployer   :", deployer);
        console.log("");
        console.log("PriceFeed  :", address(priceFeed));
        console.log("Vault      :", address(vault));
        console.log("SpotEngine :", address(spot));
        console.log("PerpEngine :", address(perp));
        console.log("");
        console.log("--- Mock Tokens ---");
        console.log("MockUSDT   :", address(mockUSDT));
        console.log("MockBTC    :", address(mockBTC));
        console.log("MockSOL    :", address(mockSOL));
        console.log("MockDOGE   :", address(mockDOGE));
        console.log("MockAVAX   :", address(mockAVAX));
        console.log("MockLINK   :", address(mockLINK));
        console.log("MockAERO   :", address(mockAERO));
        console.log("");
        console.log("NEXT_PUBLIC_VAULT_ADDRESS=", address(vault));
        console.log("NEXT_PUBLIC_SPOT_ENGINE_ADDRESS=", address(spot));
        console.log("NEXT_PUBLIC_PERP_ENGINE_ADDRESS=", address(perp));
    }
}
