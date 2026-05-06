/**
 * Contract addresses — read from environment variables.
 * Set these in .env.local (dev) or Netlify dashboard (production).
 *
 * Base Sepolia (testnet) addresses are the deterministic predictions
 * from the deployer wallet nonce=0 simulation.
 *
 * Base Mainnet addresses will be filled in after mainnet deployment.
 */

export const CONTRACT_ADDRESSES = {
  vault:      (process.env.NEXT_PUBLIC_VAULT_ADDRESS        ?? '') as `0x${string}`,
  spotEngine: (process.env.NEXT_PUBLIC_SPOT_ENGINE_ADDRESS  ?? '') as `0x${string}`,
  perpEngine: (process.env.NEXT_PUBLIC_PERP_ENGINE_ADDRESS  ?? '') as `0x${string}`,
  priceFeed:  (process.env.NEXT_PUBLIC_PRICE_FEED_ADDRESS   ?? '') as `0x${string}`,
} as const;

/** Chain the app targets (84532 = Base Sepolia, 8453 = Base mainnet) */
export const TARGET_CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_CHAIN_ID ?? 84532
);

/** True when the app is pointing at Base mainnet */
export const IS_MAINNET = TARGET_CHAIN_ID === 8453;

/** Base Sepolia mock token addresses (for testnet trading) */
export const TESTNET_TOKENS = {
  USDT: (process.env.NEXT_PUBLIC_MOCK_USDT_ADDRESS ?? '0x8efDDcE32bCe9D5C69CeE5e23adE8c6Aafef2070') as `0x${string}`,
  BTC:  (process.env.NEXT_PUBLIC_MOCK_BTC_ADDRESS  ?? '0x826E8477967325D490523Ff6eFF87cCA7FfdD62e') as `0x${string}`,
  SOL:  (process.env.NEXT_PUBLIC_MOCK_SOL_ADDRESS  ?? '0x22198A7B483DC55368E39f9fbC6c3573eAC9fcA2') as `0x${string}`,
  DOGE: (process.env.NEXT_PUBLIC_MOCK_DOGE_ADDRESS ?? '0xb25580d8688bF96D1162870335ED4731ef1F1cc1') as `0x${string}`,
  AVAX: (process.env.NEXT_PUBLIC_MOCK_AVAX_ADDRESS ?? '0xb7647C7D742D873f99bD46E2A1535B065e6Cbdd1') as `0x${string}`,
  LINK: (process.env.NEXT_PUBLIC_MOCK_LINK_ADDRESS ?? '0xd3D781cEb967b7A6c423Acab05C8d29FDcFF1386') as `0x${string}`,
  AERO: (process.env.NEXT_PUBLIC_MOCK_AERO_ADDRESS ?? '0xfeB2319E4F7e95f71305F0036754c273EAB9cb6f') as `0x${string}`,
} as const;
