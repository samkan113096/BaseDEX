// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/Vault.sol";
import "../src/SpotEngine.sol";
import "../src/PerpEngine.sol";
import "../src/MockPriceFeed.sol";

contract Deploy is Script {
    // Base Sepolia USDC
    address constant USDC = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;
    // Base Sepolia WETH (mock — replace with real wrapped token)
    address constant WETH = 0x4200000000000000000000000000000000000006;

    function run() external {
        uint256 deployerPk = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer   = vm.addr(deployerPk);

        vm.startBroadcast(deployerPk);

        // 1. Price feed
        MockPriceFeed priceFeed = new MockPriceFeed();

        // 2. Vault
        Vault vault = new Vault(deployer);
        vault.whitelistToken(USDC, true);
        vault.whitelistToken(WETH, true);

        // 3. Spot engine
        SpotEngine spot = new SpotEngine(address(vault), deployer, deployer);
        spot.addMarket(WETH, USDC);  // market 0: ETH/USDC

        // 4. Perp engine
        PerpEngine perp = new PerpEngine(
            address(vault),
            address(priceFeed),
            USDC,
            deployer,
            deployer
        );
        perp.addMarket(keccak256("ETH/USD"), "ETH-PERP", 20, 5, 2);
        perp.addMarket(keccak256("BTC/USD"), "BTC-PERP", 20, 5, 2);
        perp.addMarket(keccak256("SOL/USD"), "SOL-PERP", 20, 5, 2);

        // 5. Authorise engines in vault
        vault.setEngine(address(spot), true);
        vault.setEngine(address(perp), true);

        vm.stopBroadcast();

        console.log("PriceFeed :", address(priceFeed));
        console.log("Vault     :", address(vault));
        console.log("Spot      :", address(spot));
        console.log("Perp      :", address(perp));
    }
}
