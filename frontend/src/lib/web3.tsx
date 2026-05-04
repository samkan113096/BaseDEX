'use client';

import { WagmiProvider, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

const isProd = process.env.NEXT_PUBLIC_ENV === 'production' || process.env.NODE_ENV === 'production';

const config = getDefaultConfig({
  appName:    'BaseDEX',
  projectId:  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? 'demo',
  // Production: Base mainnet first; dev: Sepolia first for testing
  chains:     isProd ? [base, baseSepolia] : [baseSepolia, base],
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
