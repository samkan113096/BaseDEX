'use client';

import Link from 'next/link';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiPath } from '@/lib/api';

interface PriceRow { price: number; change24h: number; }

const MARKETS = [
  { symbol: 'ETH',  name: 'Ethereum',   oi: '$92M',  maxLev: '20×' },
  { symbol: 'BTC',  name: 'Bitcoin',    oi: '$195M', maxLev: '20×' },
  { symbol: 'SOL',  name: 'Solana',     oi: '$44M',  maxLev: '20×' },
  { symbol: 'DOGE', name: 'Dogecoin',   oi: '$18M',  maxLev: '10×' },
  { symbol: 'AVAX', name: 'Avalanche',  oi: '$14M',  maxLev: '10×' },
  { symbol: 'LINK', name: 'Chainlink',  oi: '$8M',   maxLev: '10×' },
  { symbol: 'ARB',  name: 'Arbitrum',   oi: '$12M',  maxLev: '10×' },
];

function fmt(p: number) {
  if (p >= 10000) return `$${p.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (p >= 100)   return `$${p.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  if (p >= 1)     return `$${p.toFixed(3)}`;
  return `$${p.toFixed(5)}`;
}

export function MarketsSection() {
  const [prices, setPrices] = useState<Record<string, PriceRow>>({});

  useEffect(() => {
    fetch(apiPath('/api/prices'))
      .then(r => r.ok ? r.json() : {})
      .then((d: Record<string, PriceRow>) => setPrices(d))
      .catch(() => {});
  }, []);

  return (
    <section id="markets" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Markets
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Trade the Markets You Know
          </h2>
          <p className="text-[#6a6a8a] max-w-xl mx-auto">
            Spot and perpetual markets for the most liquid crypto assets — live prices, real order books.
          </p>
        </div>

        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e1e3a]">
                  {['Market', 'Price', '24h Change', 'Open Interest', 'Max Leverage', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-[#3a3a5a] uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MARKETS.map((m) => {
                  const p = prices[m.symbol];
                  const price  = p?.price    ?? 0;
                  const change = p?.change24h ?? 0;
                  return (
                    <tr key={m.symbol} className="border-b border-[#0f0f1e] hover:bg-[#0f0f22] transition-colors group">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/30 to-violet-500/30 border border-blue-500/20 flex items-center justify-center text-xs font-black text-blue-300">
                            {m.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <div className="text-white font-bold text-sm">{m.symbol}-PERP</div>
                            <div className="text-[#4a4a6a] text-xs">{m.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono text-white font-bold">
                        {price > 0 ? fmt(price) : <span className="text-[#3a3a5a]">—</span>}
                      </td>
                      <td className="px-4 py-4">
                        {price > 0 ? (
                          <span className={`flex items-center gap-1 font-mono text-sm font-semibold ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {change >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                            {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                          </span>
                        ) : <span className="text-[#3a3a5a]">—</span>}
                      </td>
                      <td className="px-4 py-4 text-[#6a6a8a] font-mono">{m.oi}</td>
                      <td className="px-4 py-4">
                        <span className="bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded text-xs font-bold">{m.maxLev}</span>
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          href={`/trade?market=${m.symbol}-PERP`}
                          className="opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
                        >
                          Trade
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-[#4a4a6a] text-sm">
            Cross-chain to <span className="text-white font-semibold">Arbitrum</span> coming soon — trade seamlessly across Base &amp; ARB
          </p>
        </div>
      </div>
    </section>
  );
}
