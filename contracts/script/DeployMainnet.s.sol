// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/Vault.sol";
import "../src/SpotEngine.sol";
import "../src/PerpEngine.sol";

/**
 * @title DeployMainnet
 * @notice Production deployment script for Base mainnet (chain ID 8453)
 *
 * Pre-deploy checklist:
 *   ☐ Audit completed and all findings resolved
 *   ☐ DEPLOYER_PRIVATE_KEY set in .env (funded with ~0.05 ETH for gas)
 *   ☐ MULTISIG_ADDRESS set (3/5 Gnosis Safe on Base)
 *   ☐ BASESCAN_API_KEY set for verification
 *   ☐ Tested on Base Sepolia first with Deploy.s.sol
 *
 * Usage:
 *   source .env
 *   forge script script/DeployMainnet.s.sol \
 *     --rpc-url base \
 *     --broadcast \
 *     --verify \
 *     -vvvv
 *
 * After deployment:
 *   1. Update frontend .env with contract addresses
 *   2. Update backend .env with contract addresses
 *   3. Transfer ownership to multi-sig (owner.transferOwnership(MULTISIG))
 *   4. Verify all 4 contracts on Basescan
 */
contract DeployMainnet is Script {
    // ── Base Mainnet Token Addresses ──────────────────────────────────────────
    // USDC on Base: https://basescan.org/token/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
    address constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;

    // WETH on Base (native wrapped ETH)
    address constant WETH = 0x4200000000000000000000000000000000000006;

    // cbBTC on Base: https://basescan.org/token/0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf
    address constant cbBTC = 0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf;

    // cbETH on Base: https://basescan.org/token/0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22
    address constant cbETH = 0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22;

    // USDT on Base: https://basescan.org/token/0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2
    address constant USDT = 0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2;

    // ── Oracle Addresses (Base Mainnet) ───────────────────────────────────────
    // NOTE: MockPriceFeed is ONLY for testnet.
    // For mainnet, implement IPriceFeed wrapping Chainlink or Pyth.
    //
    // Chainlink price feeds on Base mainnet:
    //   ETH/USD: 0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70
    //   BTC/USD: 0xCCADC697c55bbB68dc5bCdf8d3CBe83CdD4E071E
    //   SOL/USD: (verify on https://data.chain.link/base/mainnet)
    //
    // Pyth Network on Base:
    //   Contract: 0x8250f4aF4B972684F7b336503E2D6dFeDeB1487a
    //
    // TODO: Deploy a ChainlinkPriceFeed.sol adapter before running this script.
    // For now, using an admin-controlled price feed that can be updated by owner.
    // Replace PRICE_FEED_ADDRESS with your adapter contract address.
    address constant PRICE_FEED_ADDRESS = address(0); // <-- SET THIS before deploying

    function run() external {
        require(PRICE_FEED_ADDRESS != address(0),
            "DeployMainnet: set PRICE_FEED_ADDRESS to a deployed oracle adapter");

        uint256 deployerPk = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer   = vm.addr(deployerPk);
        address multisig   = vm.envOr("MULTISIG_ADDRESS", deployer); // fallback to deployer if not set

        console.log("=================================================");
        console.log("BaseDEX Mainnet Deployment");
        console.log("=================================================");
        console.log("Deployer  :", deployer);
        console.log("Multi-sig :", multisig);
        console.log("Chain ID  :", block.chainid);

        require(block.chainid == 8453, "DeployMainnet: must deploy on Base mainnet (8453)");

        vm.startBroadcast(deployerPk);

        // ── 1. Vault ──────────────────────────────────────────────────────────
        console.log("\n[1/4] Deploying Vault...");
        Vault vault = new Vault(deployer);

        // Whitelist supported collateral tokens
        vault.whitelistToken(USDC,  true);
        vault.whitelistToken(WETH,  true);
        vault.whitelistToken(cbBTC, true);
        vault.whitelistToken(cbETH, true);
        vault.whitelistToken(USDT,  true);
        console.log("Vault deployed at:", address(vault));

        // ── 2. Spot Engine ────────────────────────────────────────────────────
        console.log("\n[2/4] Deploying SpotEngine...");
        SpotEngine spot = new SpotEngine(address(vault), deployer, deployer);

        // Register spot markets (base token, quote token)
        spot.addMarket(WETH,  USDC);  // market 0: ETH/USDC
        spot.addMarket(WETH,  USDT);  // market 1: ETH/USDT
        spot.addMarket(cbBTC, USDC);  // market 2: cbBTC/USDC
        spot.addMarket(cbBTC, USDT);  // market 3: cbBTC/USDT
        spot.addMarket(cbETH, USDC);  // market 4: cbETH/USDC
        console.log("SpotEngine deployed at:", address(spot));

        // ── 3. Perp Engine ────────────────────────────────────────────────────
        console.log("\n[3/4] Deploying PerpEngine...");
        PerpEngine perp = new PerpEngine(
            address(vault),
            PRICE_FEED_ADDRESS,
            USDC,
            deployer,
            deployer
        );

        // Register perpetual markets
        // addMarket(priceKey, symbol, maxLeverage, maintenanceMarginBps, takerFeeBps)
        perp.addMarket(keccak256("ETH/USD"),   "ETH-PERP",   20, 50, 6);
        perp.addMarket(keccak256("BTC/USD"),   "BTC-PERP",   20, 50, 6);
        perp.addMarket(keccak256("SOL/USD"),   "SOL-PERP",   20, 50, 6);
        perp.addMarket(keccak256("DOGE/USD"),  "DOGE-PERP",  20, 50, 6);
        perp.addMarket(keccak256("AVAX/USD"),  "AVAX-PERP",  20, 50, 6);
        perp.addMarket(keccak256("LINK/USD"),  "LINK-PERP",  20, 50, 6);
        perp.addMarket(keccak256("ARB/USD"),   "ARB-PERP",   20, 50, 6);
        perp.addMarket(keccak256("cbBTC/USD"), "cbBTC-PERP", 20, 50, 6);
        perp.addMarket(keccak256("cbETH/USD"), "cbETH-PERP", 20, 50, 6);
        perp.addMarket(keccak256("AERO/USD"),  "AERO-PERP",  10, 75, 6);
        perp.addMarket(keccak256("POL/USD"),   "POL-PERP",   20, 50, 6);
        console.log("PerpEngine deployed at:", address(perp));

        // ── 4. Authorize engines in Vault ─────────────────────────────────────
        console.log("\n[4/4] Authorizing engines in Vault...");
        vault.setEngine(address(spot), true);
        vault.setEngine(address(perp), true);

        // ── 5. Transfer ownership to multi-sig ───────────────────────────────
        if (multisig != deployer) {
            console.log("\n[5/5] Transferring ownership to multi-sig:", multisig);
            vault.transferOwnership(multisig);
            spot.transferOwnership(multisig);
            perp.transferOwnership(multisig);
        } else {
            console.log("\n[WARN] Multi-sig not set - ownership remains with deployer.");
            console.log("       Transfer ownership ASAP: vault.transferOwnership(<multisig>)");
        }

        vm.stopBroadcast();

        // ── Deployment summary ────────────────────────────────────────────────
        console.log("\n=================================================");
        console.log("DEPLOYMENT COMPLETE");
        console.log("=================================================");
        console.log("VAULT_ADDRESS     =", address(vault));
        console.log("SPOT_ENGINE_ADDRESS =", address(spot));
        console.log("PERP_ENGINE_ADDRESS =", address(perp));
        console.log("PRICE_FEED_ADDRESS  =", PRICE_FEED_ADDRESS);
        console.log("\nNext steps:");
        console.log("1. Copy these addresses to frontend/.env and backend/.env");
        console.log("2. Verify on Basescan: forge verify-contract ...");
        console.log("3. If ownership NOT transferred, call transferOwnership() NOW");
        console.log("4. Set up Gnosis Safe as owner (3/5 multi-sig recommended)");
        console.log("=================================================");
    }
}
