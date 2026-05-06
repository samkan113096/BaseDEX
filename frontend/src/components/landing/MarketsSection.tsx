'use client';

import Link from 'next/link';
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { apiPath } from '@/lib/api';

interface PriceRow { price: number; change24h: number; high24h?: number; low24h?: number; }

const MARKETS = [
  { symbol: 'ETH',  name: 'Ethereum',  oi: '$92M',  maxLev: '20×', color: '#627EEA', vol: 85 },
  { symbol: 'BTC',  name: 'Bitcoin',   oi: '$195M', maxLev: '20×', color: '#F7931A', vol: 100 },
  { symbol: 'SOL',  name: 'Solana',    oi: '$44M',  maxLev: '20×', color: '#9945FF', vol: 60 },
  { symbol: 'DOGE', name: 'Dogecoin',  oi: '$18M',  maxLev: '10×', color: '#C2A633', vol: 35 },
  { symbol: 'AVAX', name: 'Avalanche', oi: '$14M',  maxLev: '10×', color: '#E84142', vol: 28 },
  { symbol: 'LINK', name: 'Chainlink', oi: '$8M',   maxLev: '10×', color: '#2A5ADA', vol: 20 },
  { symbol: 'ARB',  name: 'Arbitrum',  oi: '$12M',  maxLev: '10×', color: '#12AAFF', vol: 25 },
];

// Deterministic sparkline data per symbol
const SPARKLINES: Record<string, number[]> = {
  ETH:  [42,44,43,46,44,47,45,48,46,50,48,52,49,53,51],
  BTC:  [48,47,50,48,52,50,53,51,54,52,56,53,55,57,56],
  SOL:  [55,52,56,53,57,55,58,56,60,57,62,59,61,64,62],
  DOGE: [44,46,43,47,45,48,46,50,47,51,49,52,50,53,51],
  AVAX: [52,50,53,51,54,52,55,53,56,54,57,55,56,58,57],
  LINK: [48,50,47,51,49,52,50,53,51,54,52,55,53,56,54],
  ARB:  [40,42,41,44,42,45,43,46,44,47,45,48,46,49,47],
};

function fmt(p: number) {
  if (p >= 10000) return `$${p.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (p >= 100)   return `$${p.toFixed(2)}`;
  if (p >= 1)     return `$${p.toFixed(3)}`;
  return `$${p.toFixed(5)}`;
}

function Sparkline({ data, up }: { data: number[]; up: boolean }) {
  const w = 64, h = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const color = up ? '#10b981' : '#ef4444';
  return (
    <svg width={w} height={h} className="overflow-visible shrink-0">
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      {/* Gradient fill */}
      <defs>
        <linearGradient id={`sg-${up}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${h} ${pts.join(' ')} ${w},${h}`}
        fill={`url(#sg-${up})`}
      />
    </svg>
  );
}

function TokenIcon({ symbol, color }: { symbol: string; color: string }) {
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg shrink-0"
      style={{
        background: `radial-gradient(circle at 35% 35%, ${color}55, ${color}18)`,
        border:     `1.5px solid ${color}35`,
        boxShadow:  `0 0 16px ${color}20, inset 0 1px 0 ${color}30`,
      }}
    >
      {symbol.slice(0, 2)}
    </div>
  );
}

export function MarketsSection() {
  const [prices, setPrices] = useState<Record<string, PriceRow>>({});
  const [active, setActive] = useState<string | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    function load() {
      fetch(apiPath('/api/prices'))
        .then(r => r.ok ? r.json() : {})
        .then((d: Record<string, PriceRow>) => { setPrices(d); loaded.current = true; })
        .catch(() => {});
    }
    load();
    const id = setInterval(load, 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="markets" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#05050f]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2a2a55] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Markets
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 tracking-tight">
            Trade the Assets{' '}
            <span className="text-gradient-static">You Know</span>
          </h2>
          <p className="text-[#8890a8] max-w-xl mx-auto text-lg">
            Real-time perpetual and spot markets with deep liquidity and live price feeds.
          </p>
        </div>

        {/* Markets table */}
        <div className="bg-[#0b0b1e] border border-[#1a1a35] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#151530]">
                  <th className="px-5 py-4 text-left text-[10px] font-bold text-[#3a3e58] uppercase tracking-widest">#</th>
                  <th className="px-5 py-4 text-left text-[10px] font-bold text-[#3a3e58] uppercase tracking-widest">Market</th>
                  <th className="px-5 py-4 text-right text-[10px] font-bold text-[#3a3e58] uppercase tracking-widest">Price</th>
                  <th className="px-5 py-4 text-right text-[10px] font-bold text-[#3a3e58] uppercase tracking-widest">24h</th>
                  <th className="px-4 py-4 text-center text-[10px] font-bold text-[#3a3e58] uppercase tracking-widest hidden md:table-cell">7d Chart</th>
                  <th className="px-5 py-4 text-right text-[10px] font-bold text-[#3a3e58] uppercase tracking-widest hidden sm:table-cell">Open Int.</th>
                  <th className="px-5 py-4 text-center text-[10px] font-bold text-[#3a3e58] uppercase tracking-widest hidden md:table-cell">Lev.</th>
                  <th className="px-5 py-4 text-right text-[10px] font-bold text-[#3a3e58] uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody>
                {MARKETS.map((m, idx) => {
                  const p      = prices[m.symbol];
                  const price  = p?.price    ?? 0;
                  const change = p?.change24h ?? 0;
                  const up     = change >= 0;
                  const isActive = active === m.symbol;
                  return (
                    <tr
                      key={m.symbol}
                      onMouseEnter={() => setActive(m.symbol)}
                      onMouseLeave={() => setActive(null)}
                      className={`border-b border-[#0f0f28] transition-all duration-150 ${
                        isActive ? 'bg-[#0f0f28]' : ''
                      }`}
                      style={isActive ? { boxShadow: `inset 3px 0 0 ${m.color}50` } : {}}
                    >
                      {/* Rank */}
                      <td className="px-5 py-4">
                        <span className="text-[12px] font-bold text-[#3a3e58] tabular-nums">{idx + 1}</span>
                      </td>
                      {/* Token */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <TokenIcon symbol={m.symbol} color={m.color} />
                          <div>
                            <div className="text-white font-black text-sm">{m.symbol}-PERP</div>
                            <div className="text-[#4a5068] text-xs mt-0.5">{m.name}</div>
                          </div>
                        </div>
                      </td>
                      {/* Price */}
                      <td className="px-5 py-4 text-right">
                        {price > 0
                          ? <span className="font-mono font-bold text-white text-sm">{fmt(price)}</span>
                          : <div className="skeleton w-16 h-4 ml-auto" />
                        }
                      </td>
                      {/* 24h change */}
                      <td className="px-5 py-4 text-right">
                        {price > 0 ? (
                          <span className={`inline-flex items-center gap-1 font-mono text-sm font-bold px-2.5 py-1 rounded-lg ${
                            up
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                              : 'bg-red-500/10 text-red-400 border border-red-500/15'
                          }`}>
                            {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {up ? '+' : ''}{change.toFixed(2)}%
                          </span>
                        ) : <div className="skeleton w-14 h-7 ml-auto rounded-lg" />}
                      </td>
                      {/* Sparkline */}
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div className="flex justify-center">
                          <Sparkline data={SPARKLINES[m.symbol] ?? [50,50,50]} up={up} />
                        </div>
                      </td>
                      {/* OI */}
                      <td className="px-5 py-4 text-right font-mono text-[#6a7090] text-sm hidden sm:table-cell">
                        {m.oi}
                      </td>
                      {/* Leverage */}
                      <td className="px-5 py-4 text-center hidden md:table-cell">
                        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-lg text-xs font-black">
                          {m.maxLev}
                        </span>
                      </td>
                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/trade?market=${m.symbol}-PERP`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-all duration-200"
                          style={{
                            background:   isActive ? m.color : 'rgba(59,130,246,0.08)',
                            border:       `1px solid ${isActive ? m.color : 'rgba(59,130,246,0.2)'}`,
                            color:        isActive ? '#fff' : '#60a5fa',
                            boxShadow:    isActive ? `0 4px 16px ${m.color}40` : 'none',
                          }}
                        >
                          Trade <ExternalLink size={10} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-5 py-3.5 bg-[#08081a] border-t border-[#151530] flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-[#3a3e58]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Prices refresh every 15s via CoinGecko
            </div>
            <div className="text-[11px] text-[#3a3e58]">
              <span className="text-white font-semibold">Arbitrum</span> expansion coming Q3 2026
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
