'use client';

import { WagmiProvider, http } from 'wagmi';
import { base, baseSepolia, sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

/**
 * Chain targeting:
 *   NEXT_PUBLIC_CHAIN_ID=8453      → Base mainnet  (production)
 *   NEXT_PUBLIC_CHAIN_ID=84532     → Base Sepolia  (testnet)
 *   NEXT_PUBLIC_CHAIN_ID=11155111  → Ethereum Sepolia (testnet, current default)
 *   unset in production            → Base mainnet
 *   unset in dev                   → Ethereum Sepolia
 */
const targetChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 0);
const isProduction  =
  process.env.NEXT_PUBLIC_ENV === 'production' || process.env.NODE_ENV === 'production';

function resolveChainOrder() {
  if (targetChainId === 8453)     return [base, baseSepolia, sepolia] as const;
  if (targetChainId === 84532)    return [baseSepolia, base, sepolia] as const;
  if (targetChainId === 11155111) return [sepolia, baseSepolia, base] as const;
  // Default
  return isProduction
    ? ([base, baseSepolia, sepolia] as const)
    : ([sepolia, baseSepolia, base] as const);
}

const chains = resolveChainOrder();

const config = getDefaultConfig({
  appName:   'BaseDEX',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? 'demo',
  chains,
  transports: {
    [base.id]:        http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL),
    [sepolia.id]:     http(process.env.NEXT_PUBLIC_ETH_SEPOLIA_RPC_URL),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor:           '#3b82f6',
            accentColorForeground: 'white',
            borderRadius:          'medium',
            fontStack:             'system',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
