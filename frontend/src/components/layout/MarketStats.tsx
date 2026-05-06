'use client';

import { useDEXStore } from '@/store/dex';
import { useMemo, useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface Stats24h {
  totalVolume:  number;
  totalTrades:  number;
  openInterest: number;
  markets:      Record<string, { volume: number; trades: number; funding: number }>;
}

export function MarketStats() {
  const { selectedMarket, prices, bids, asks } = useDEXStore();
  const [stats, setStats] = useState<Stats24h | null>(null);
  const [base] = selectedMarket.split('-');
  const info     = prices[base];
  const price    = info?.price    ?? 0;
  const change   = info?.change24h ?? 0;
  const high24h  = info?.high24h  ?? 0;
  const low24h   = info?.low24h   ?? 0;
  const isPerp   = selectedMarket.endsWith('-PERP');

  // Fetch real stats from backend
  useEffect(() => {
    function loadStats() {
      fetch(`${API_URL}/api/stats`)
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) setStats(data as Stats24h); })
        .catch(() => {});
    }
    loadStats();
    const id = setInterval(loadStats, 15_000);
    return () => clearInterval(id);
  }, []);

  // Compute best bid/ask spread from live orderbook
  const { spread, spreadPct } = useMemo(() => {
    const bestAsk = asks[0];
    const bestBid = bids[0];
    if (!bestAsk || !bestBid) return { spread: null, spreadPct: null };
    const a = parseFloat(bestAsk.price) / 1e6;
    const b = parseFloat(bestBid.price) / 1e6;
    return { spread: (a - b).toFixed(a > 1000 ? 2 : 4), spreadPct: (((a - b) / a) * 100).toFixed(3) };
  }, [bids, asks]);

  const mktStats    = stats?.markets?.[selectedMarket];
  const volume24h   = mktStats?.volume   ?? 0;
  const oi          = stats?.openInterest ?? 0;
  const fundingRate = mktStats?.funding   ?? 0;

  const fmt = (n: number) =>
    n >= 1_000_000
      ? `$${(n / 1_000_000).toFixed(1)}M`
      : n >= 1_000
      ? `$${(n / 1_000).toFixed(0)}K`
      : `$${n.toFixed(2)}`;

  return (
    <div className="h-9 bg-[#09091a] border-b border-[#1a1a35] flex items-center px-4 gap-0 overflow-x-auto hide-scrollbar shrink-0">

      <Stat
        label="24h Change"
        value={`${change >= 0 ? '+' : ''}${change.toFixed(2)}%`}
        valueClass={change >= 0 ? 'text-emerald-400' : 'text-red-400'}
      />
      <Sep />
      <Stat label="24h High" value={high24h > 0 ? `$${high24h.toLocaleString(undefined, { maximumFractionDigits: high24h < 10 ? 4 : 2 })}` : '—'} />
      <Stat label="24h Low"  value={low24h  > 0 ? `$${low24h.toLocaleString(undefined,  { maximumFractionDigits: low24h  < 10 ? 4 : 2 })}` : '—'} />
      <Sep />
      <Stat label="24h Volume" value={volume24h > 0 ? fmt(volume24h) : '—'} />

      {spread && (
        <>
          <Sep />
          <Stat label="Spread" value={`$${spread} (${spreadPct}%)`} valueClass="text-[#8890a8]" />
        </>
      )}

      {isPerp && (
        <>
          <Sep />
          <Stat label="Open Interest" value={oi > 0 ? fmt(oi) : '—'} />
          <Stat
            label="Funding / 8h"
            value={`${fundingRate >= 0 ? '+' : ''}${(fundingRate * 100).toFixed(4)}%`}
            valueClass={fundingRate >= 0 ? 'text-emerald-400' : 'text-red-400'}
          />
        </>
      )}

      {/* Network badge */}
      <div className="ml-auto flex items-center gap-1.5 shrink-0 pl-4">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        <span className="text-[9px] text-blue-400 font-bold uppercase tracking-widest">Base</span>
      </div>
    </div>
  );
}

function Stat({ label, value, valueClass = 'text-[#e8eaf0]' }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 shrink-0 h-full">
      <span className="text-[9px] text-[#2a2e48] uppercase tracking-[0.08em] font-semibold">{label}</span>
      <span className={`text-[11px] font-semibold font-mono ${valueClass}`}>{value}</span>
    </div>
  );
}

function Sep() {
  return <div className="w-px h-4 bg-[#1a1a35] shrink-0" />;
}
