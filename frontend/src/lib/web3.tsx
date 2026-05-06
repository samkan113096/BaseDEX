'use client';

import { WagmiProvider, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

// NEXT_PUBLIC_CHAIN_ID=84532  → Base Sepolia (testnet)
// NEXT_PUBLIC_CHAIN_ID=8453   → Base mainnet  (production)
// Falls back to: production env → mainnet, otherwise → sepolia
const targetChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 0);
const useMainnet =
  targetChainId === 8453 ||
  (targetChainId === 0 && (process.env.NEXT_PUBLIC_ENV === 'production' || process.env.NODE_ENV === 'production'));

const config = getDefaultConfig({
  appName:    'BaseDEX',
  projectId:  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? 'demo',
  chains:     useMainnet ? [base, baseSepolia] : [baseSepolia, base],
  transports: {
    [base.id]:        http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL),
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
            accentColor:          '#3b82f6',
            accentColorForeground: 'white',
            borderRadius:         'medium',
            fontStack:            'system',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
