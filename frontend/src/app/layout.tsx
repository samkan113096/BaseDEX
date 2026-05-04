import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Web3Provider } from '@/lib/web3';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://basedex.fi'),
  title: {
    default: 'BaseDEX — Perpetual Futures & Spot DEX on Base Network',
    template: '%s | BaseDEX',
  },
  description: 'BaseDEX is the leading decentralized perpetual futures and spot exchange on Base network. Trade ETH, cbBTC, SOL and more with up to 20× leverage. No KYC. Self-custody. Sub-200ms execution.',
  keywords: [
    'BaseDEX', 'Base DEX', 'Base network DEX', 'perpetual futures DEX',
    'crypto derivatives', 'DeFi trading', 'on-chain perpetuals', 'cbBTC trading',
    'ETH perps', 'BTC perpetuals', 'no KYC DEX', 'decentralized exchange Base',
    'Coinbase Layer 2 DEX', 'leverage trading Base', 'CLOB DEX', 'Hyperliquid alternative',
    'Base network DeFi', 'cbETH trading', 'AERO perps', 'cross-chain DEX',
  ],
  authors: [{ name: 'BaseDEX Team' }],
  creator: 'BaseDEX',
  publisher: 'BaseDEX',
  category: 'Finance',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://basedex.fi',
    siteName: 'BaseDEX',
    title: 'BaseDEX — Perpetual & Spot DEX on Base Network',
    description: 'Trade cbBTC, ETH, SOL perpetual futures with up to 20× leverage on Base. No KYC, self-custody, deep liquidity. The pro DEX for Base.',
    images: [
      { url: '/og.svg', width: 1200, height: 630, alt: 'BaseDEX — Trade Perpetuals & Spot on Base Network' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BaseDEX — Perpetual & Spot DEX on Base Network',
    description: 'Trade cbBTC, ETH, SOL perpetuals with 20× leverage on Base. No KYC. Self-custody.',
    creator: '@BaseDEX',
    site:    '@BaseDEX',
    images: ['/og.svg'],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.svg', type: 'image/svg+xml' },
    ],
  },
  manifest: '/site.webmanifest',
  alternates: { canonical: 'https://basedex.fi' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="font-sans bg-[#070710] text-white antialiased">
        <Web3Provider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: { background: '#1a1a2e', color: '#fff', border: '1px solid #2a2a4a', fontSize: '13px' },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </Web3Provider>
      </body>
    </html>
  );
}
