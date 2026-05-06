/**
 * Contract addresses — read from environment variables.
 * Set these in .env.local (dev) or Netlify dashboard (production).
 *
 * Ethereum Sepolia (11155111) is the current testnet target.
 * Fill in addresses after running: forge script script/Deploy.s.sol --broadcast
 *
 * Base Mainnet (8453) addresses will be set after production deployment.
 */

export const CONTRACT_ADDRESSES = {
  vault:      (process.env.NEXT_PUBLIC_VAULT_ADDRESS        ?? '') as `0x${string}`,
  spotEngine: (process.env.NEXT_PUBLIC_SPOT_ENGINE_ADDRESS  ?? '') as `0x${string}`,
  perpEngine: (process.env.NEXT_PUBLIC_PERP_ENGINE_ADDRESS  ?? '') as `0x${string}`,
  priceFeed:  (process.env.NEXT_PUBLIC_PRICE_FEED_ADDRESS   ?? '') as `0x${string}`,
} as const;

/**
 * Chain the app targets:
 *   11155111 = Ethereum Sepolia (testnet, current default)
 *   84532    = Base Sepolia    (testnet)
 *   8453     = Base mainnet    (production)
 */
export const TARGET_CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_CHAIN_ID ?? 11155111
);

export const IS_MAINNET        = TARGET_CHAIN_ID === 8453;
export const IS_ETH_SEPOLIA    = TARGET_CHAIN_ID === 11155111;
export const IS_BASE_SEPOLIA   = TARGET_CHAIN_ID === 84532;

/** Mock token addresses — populated after deploy script runs */
export const TESTNET_TOKENS = {
  USDT: (process.env.NEXT_PUBLIC_MOCK_USDT_ADDRESS ?? '') as `0x${string}`,
  BTC:  (process.env.NEXT_PUBLIC_MOCK_BTC_ADDRESS  ?? '') as `0x${string}`,
  SOL:  (process.env.NEXT_PUBLIC_MOCK_SOL_ADDRESS  ?? '') as `0x${string}`,
  DOGE: (process.env.NEXT_PUBLIC_MOCK_DOGE_ADDRESS ?? '') as `0x${string}`,
  AVAX: (process.env.NEXT_PUBLIC_MOCK_AVAX_ADDRESS ?? '') as `0x${string}`,
  LINK: (process.env.NEXT_PUBLIC_MOCK_LINK_ADDRESS ?? '') as `0x${string}`,
  AERO: (process.env.NEXT_PUBLIC_MOCK_AERO_ADDRESS ?? '') as `0x${string}`,
} as const;
