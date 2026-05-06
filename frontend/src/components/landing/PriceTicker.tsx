'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { apiPath } from '@/lib/api';

interface Ticker {
  symbol: string;
  name:   string;
  price:  number;
  change: number;
  color:  string;
}

const SEED: Ticker[] = [
  { symbol: 'ETH',  name: 'Ethereum',  price: 2847,  change: 0, color: '#627EEA' },
  { symbol: 'BTC',  name: 'Bitcoin',   price: 97000, change: 0, color: '#F7931A' },
  { symbol: 'SOL',  name: 'Solana',    price: 148,   change: 0, color: '#9945FF' },
  { symbol: 'DOGE', name: 'Dogecoin',  price: 0.162, change: 0, color: '#C2A633' },
  { symbol: 'AVAX', name: 'Avalanche', price: 28.5,  change: 0, color: '#E84142' },
  { symbol: 'LINK', name: 'Chainlink', price: 14.2,  change: 0, color: '#2A5ADA' },
  { symbol: 'ARB',  name: 'Arbitrum',  price: 0.62,  change: 0, color: '#12AAFF' },
  { symbol: 'cbBTC', name: 'cbBTC',    price: 97000, change: 0, color: '#F7931A' },
];

function fmtPrice(p: number) {
  if (p >= 10000) return `$${p.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (p >= 100)   return `$${p.toFixed(2)}`;
  if (p >= 1)     return `$${p.toFixed(3)}`;
  return `$${p.toFixed(5)}`;
}

export function PriceTicker() {
  const [tickers, setTickers] = useState<Ticker[]>(SEED);
  const prevRef = useRef<Record<string, number>>({});

  useEffect(() => {
    function load() {
      fetch(apiPath('/api/prices'))
        .then(r => r.ok ? r.json() : null)
        .then((data: Record<string, { price: number; change24h: number }> | null) => {
          if (!data) return;
          setTickers(SEED.map(s => ({
            ...s,
            price:  data[s.symbol]?.price    ?? s.price,
            change: data[s.symbol]?.change24h ?? s.change,
          })));
        })
        .catch(() => {});
    }
    load();
    const id = setInterval(load, 15_000);
    return () => clearInterval(id);
  }, []);

  // Build a doubled array for seamless infinite scroll
  const items = [...tickers, ...tickers];

  return (
    <div className="ticker-strip h-9 flex items-center overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#09091a] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#09091a] to-transparent z-10 pointer-events-none" />

      <div className="marquee-wrap">
        <div className="marquee-inner">
          {items.map((t, i) => {
            const up = t.change >= 0;
            const key = `${t.symbol}-${i}`;
            return (
              <Link
                href={`/trade?market=${t.symbol}-PERP`}
                key={key}
                className="inline-flex items-center gap-2.5 px-5 py-1 hover:bg-white/[0.03] transition-colors rounded-full cursor-pointer"
              >
                {/* Token dot */}
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: t.color, boxShadow: `0 0 6px ${t.color}80` }}
                />
                <span className="text-xs font-black text-white tracking-tight">{t.symbol}</span>
                <span className="font-mono text-xs font-bold text-[#c8d0e0]">{fmtPrice(t.price)}</span>
                <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {up ? '+' : ''}{t.change.toFixed(2)}%
                </span>
                <span className="w-px h-3 bg-[#1a1a35] ml-1" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
