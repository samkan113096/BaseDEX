'use client';

import { useState } from 'react';

/* CoinGecko stable image URLs — tested as of 2026 */
const LOGO_URLS: Record<string, string> = {
  BTC:   'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  ETH:   'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  USDT:  'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  USDC:  'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
  SOL:   'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  DOGE:  'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
  AVAX:  'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png',
  LINK:  'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
  ARB:   'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg',
  cbBTC: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  MATIC: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
  OP:    'https://assets.coingecko.com/coins/images/25244/small/Optimism.png',
  AERO:  'https://assets.coingecko.com/coins/images/31825/small/aerodrome.png',
  PEPE:  'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg',
};

const TOKEN_COLORS: Record<string, string> = {
  BTC:   '#F7931A', ETH:   '#627EEA', USDT:  '#26A17B', USDC:  '#2775CA',
  SOL:   '#9945FF', DOGE:  '#C2A633', AVAX:  '#E84142', LINK:  '#2A5ADA',
  ARB:   '#12AAFF', cbBTC: '#F7931A', MATIC: '#8247E5', OP:    '#FF0420',
  AERO:  '#0052FF', PEPE:  '#4DA83D',
};

interface TokenLogoProps {
  symbol: string;
  size?: number;
  className?: string;
}

export function TokenLogo({ symbol, size = 40, className = '' }: TokenLogoProps) {
  const [failed, setFailed] = useState(false);
  const src = LOGO_URLS[symbol];
  const color = TOKEN_COLORS[symbol] ?? '#4a5068';

  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={symbol}
        width={size}
        height={size}
        onError={() => setFailed(true)}
        className={`rounded-full object-cover shrink-0 ${className}`}
        style={{ width: size, height: size, boxShadow: `0 0 14px ${color}40` }}
      />
    );
  }

  /* Fallback: colored circle with text abbreviation */
  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-black shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.28),
        background: `radial-gradient(circle at 35% 35%, ${color}60, ${color}18)`,
        border: `1.5px solid ${color}40`,
        boxShadow: `0 0 14px ${color}25`,
      }}
    >
      {symbol.slice(0, symbol.length > 3 ? 2 : symbol.length)}
    </div>
  );
}
