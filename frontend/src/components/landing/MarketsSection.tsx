'use client';

import Link from 'next/link';
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiPath } from '@/lib/api';

interface PriceRow { price: number; change24h: number; }

const MARKETS = [
  { symbol: 'ETH',  name: 'Ethereum',  oi: '$92M',  maxLev: '20×', color: '#627EEA' },
  { symbol: 'BTC',  name: 'Bitcoin',   oi: '$195M', maxLev: '20×', color: '#F7931A' },
  { symbol: 'SOL',  name: 'Solana',    oi: '$44M',  maxLev: '20×', color: '#9945FF' },
  { symbol: 'DOGE', name: 'Dogecoin',  oi: '$18M',  maxLev: '10×', color: '#C2A633' },
  { symbol: 'AVAX', name: 'Avalanche', oi: '$14M',  maxLev: '10×', color: '#E84142' },
  { symbol: 'LINK', name: 'Chainlink', oi: '$8M',   maxLev: '10×', color: '#2A5ADA' },
  { symbol: 'ARB',  name: 'Arbitrum',  oi: '$12M',  maxLev: '10×', color: '#12AAFF' },
];

function fmt(p: number) {
  if (p >= 10000) return `$${p.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (p >= 100)   return `$${p.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  if (p >= 1)     return `$${p.toFixed(3)}`;
  return `$${p.toFixed(5)}`;
}

function TokenIcon({ symbol, color }: { symbol: string; color: string }) {
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg shrink-0"
      style={{
        background: `radial-gradient(circle at 35% 35%, ${color}50 0%, ${color}20 100%)`,
        border: `1px solid ${color}40`,
        boxShadow: `0 0 12px ${color}25`,
      }}
    >
      {symbol.slice(0, 2)}
    </div>
  );
}

export function MarketsSection() {
  const [prices, setPrices] = useState<Record<string, PriceRow>>({});

  useEffect(() => {
    fetch(apiPath('/api/prices'))
      .then(r => r.ok ? r.json() : {})
      .then((d: Record<string, PriceRow>) => setPrices(d))
      .catch(() => {});

    const id = setInterval(() => {
      fetch(apiPath('/api/prices'))
        .then(r => r.ok ? r.json() : {})
        .then((d: Record<string, PriceRow>) => setPrices(d))
        .catch(() => {});
    }, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="markets" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#05050f]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2a2a55] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Markets
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 tracking-tight">
            Trade the Markets{' '}
            <span className="text-gradient">You Know</span>
          </h2>
          <p className="text-[#8890a8] max-w-xl mx-auto text-lg">
            Spot and perpetual markets for the most liquid crypto assets — live prices, real order books.
          </p>
        </div>

        {/* Markets table */}
        <div className="bg-[#0d0d22] border border-[#1a1a35] rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a1a35]">
                  <th className="px-5 py-4 text-left text-[10px] font-bold text-[#3a3e58] uppercase tracking-widest">Market</th>
                  <th className="px-5 py-4 text-right text-[10px] font-bold text-[#3a3e58] uppercase tracking-widest">Price</th>
                  <th className="px-5 py-4 text-right text-[10px] font-bold text-[#3a3e58] uppercase tracking-widest">24h Change</th>
                  <th className="px-5 py-4 text-right text-[10px] font-bold text-[#3a3e58] uppercase tracking-widest hidden sm:table-cell">Open Interest</th>
                  <th className="px-5 py-4 text-center text-[10px] font-bold text-[#3a3e58] uppercase tracking-widest hidden md:table-cell">Max Lev</th>
                  <th className="px-5 py-4 text-right text-[10px] font-bold text-[#3a3e58] uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody>
                {MARKETS.map((m, idx) => {
                  const p      = prices[m.symbol];
                  const price  = p?.price    ?? 0;
                  const change = p?.change24h ?? 0;
                  const up     = change >= 0;
                  return (
                    <tr
                      key={m.symbol}
                      className="border-b border-[#111128] hover:bg-[#111128] transition-colors group"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <TokenIcon symbol={m.symbol} color={m.color} />
                          <div>
                            <div className="text-white font-black text-sm">{m.symbol}-PERP</div>
                            <div className="text-[#4a5068] text-xs mt-0.5">{m.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right font-mono font-bold">
                        {price > 0
                          ? <span className="text-white">{fmt(price)}</span>
                          : <span className="text-[#3a3e58]">—</span>
                        }
                      </td>
                      <td className="px-5 py-4 text-right">
                        {price > 0 ? (
                          <span className={`inline-flex items-center justify-end gap-1 font-mono text-sm font-bold ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                            {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                            {up ? '+' : ''}{change.toFixed(2)}%
                          </span>
                        ) : <span className="text-[#3a3e58] text-right block">—</span>}
                      </td>
                      <td className="px-5 py-4 text-right font-mono text-[#6a7090] hidden sm:table-cell">{m.oi}</td>
                      <td className="px-5 py-4 text-center hidden md:table-cell">
                        <span className="bg-blue-500/12 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-lg text-xs font-black">{m.maxLev}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/trade?market=${m.symbol}-PERP`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600 border border-blue-600/25 hover:border-blue-600 text-blue-400 hover:text-white text-xs font-bold transition-all duration-200"
                        >
                          Trade <ExternalLink size={11} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-5 py-3 bg-[#09091a] border-t border-[#1a1a35] flex items-center justify-between">
            <span className="text-[11px] text-[#3a3e58]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block mr-1.5" />
              Prices update every 15s via CoinGecko
            </span>
            <span className="text-[11px] text-[#3a3e58]">
              Cross-chain to <span className="text-white font-semibold">Arbitrum</span> coming Q3 2026
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
