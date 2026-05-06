'use client';

import { WagmiProvider, http, createConfig } from 'wagmi';
import { base, baseSepolia, sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  RainbowKitProvider,
  connectorsForWallets,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  metaMaskWallet,
  coinbaseWallet,
  rainbowWallet,
  walletConnectWallet,
  rabbyWallet,
  trustWallet,
} from '@rainbow-me/rainbowkit/wallets';
import '@rainbow-me/rainbowkit/styles.css';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '';
const hasValidProjectId = projectId.length > 10 && projectId !== 'demo';

const targetChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 0);
const isProduction  =
  process.env.NEXT_PUBLIC_ENV === 'production' || process.env.NODE_ENV === 'production';

function resolveChains() {
  if (targetChainId === 8453)     return [base, baseSepolia, sepolia] as const;
  if (targetChainId === 84532)    return [baseSepolia, base, sepolia] as const;
  if (targetChainId === 11155111) return [sepolia, baseSepolia, base] as const;
  return isProduction
    ? ([base, baseSepolia, sepolia] as const)
    : ([sepolia, baseSepolia, base] as const);
}

const chains = resolveChains();

/* Build wallet list — always include injected/MetaMask/Coinbase (no WC needed);
   add WalletConnect-based wallets only when a real project ID is available. */
const wallets = [
  {
    groupName: 'Popular',
    wallets: [
      injectedWallet,
      metaMaskWallet,
      coinbaseWallet,
      rabbyWallet,
      trustWallet,
      ...(hasValidProjectId ? [rainbowWallet, walletConnectWallet] : []),
    ],
  },
];

const connectors = connectorsForWallets(wallets, {
  appName:   'BaseDEX',
  projectId: hasValidProjectId ? projectId : 'placeholder-no-wc',
});

const config = createConfig({
  connectors,
  chains,
  transports: {
    [base.id]:        http(process.env.NEXT_PUBLIC_BASE_RPC_URL ?? 'https://mainnet.base.org'),
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL ?? 'https://sepolia.base.org'),
    [sepolia.id]:     http(process.env.NEXT_PUBLIC_ETH_SEPOLIA_RPC_URL ?? 'https://rpc.sepolia.org'),
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
