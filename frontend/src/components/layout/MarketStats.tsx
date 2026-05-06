'use client';

import { useDEXStore } from '@/store/dex';
import { useMemo, useEffect, useState } from 'react';
import { apiPath } from '@/lib/api';
import { TARGET_CHAIN_ID } from '@/lib/contracts';

interface MarketStat {
  marketId:  string;
  volume24h: number;
  oi:        number;
  funding:   number;
  price:     number;
  change24h: number;
  high24h:   number;
  low24h:    number;
}

const CHAIN_LABEL: Record<number, string> = {
  8453:     'Base',
  84532:    'Base Sepolia',
  11155111: 'ETH Sepolia',
};

export function MarketStats() {
  const { selectedMarket, prices, bids, asks } = useDEXStore();
  const [stat, setStat] = useState<MarketStat | null>(null);
  const [base] = selectedMarket.split('-');
  const info    = prices[base];
  const price   = info?.price    ?? 0;
  const change  = info?.change24h ?? 0;
  const high24h = info?.high24h  ?? 0;
  const low24h  = info?.low24h   ?? 0;
  const isPerp  = selectedMarket.endsWith('-PERP');

  // /api/stats?marketId=... returns a single object when marketId is specified
  useEffect(() => {
    function loadStats() {
      fetch(apiPath(`/api/stats?marketId=${encodeURIComponent(selectedMarket)}`))
        .then(r => r.ok ? r.json() : null)
        .then((data: MarketStat | null) => { if (data?.marketId) setStat(data); })
        .catch(() => {});
    }
    loadStats();
    const id = setInterval(loadStats, 15_000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMarket]);

  const { spread, spreadPct } = useMemo(() => {
    const bestAsk = asks[0];
    const bestBid = bids[0];
    if (!bestAsk || !bestBid) return { spread: null, spreadPct: null };
    const a = parseFloat(bestAsk.price) / 1e6;
    const b = parseFloat(bestBid.price) / 1e6;
    return { spread: (a - b).toFixed(a > 1000 ? 2 : 4), spreadPct: (((a - b) / a) * 100).toFixed(3) };
  }, [bids, asks]);

  const volume24h   = stat?.volume24h ?? 0;
  const oi          = stat?.oi        ?? 0;
  const fundingRate = stat?.funding   ?? 0;
  const chainLabel  = CHAIN_LABEL[TARGET_CHAIN_ID] ?? `Chain ${TARGET_CHAIN_ID}`;

  const fmt = (n: number) =>
    n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000   ? `$${(n / 1_000).toFixed(0)}K`
    : `$${n.toFixed(2)}`;

  return (
    <div className="h-11 bg-[#0b0b1e] border-b border-[#1a1a35] flex items-center px-4 gap-0 overflow-x-auto hide-scrollbar shrink-0">

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

      <div className="ml-auto flex items-center gap-1.5 shrink-0 pl-4">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">{chainLabel}</span>
      </div>
    </div>
  );
}

function Stat({ label, value, valueClass = 'text-[#c8d0e0]' }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex flex-col justify-center px-3.5 shrink-0 h-full gap-0.5">
      <span className="text-[9px] text-[#6a7090] uppercase tracking-[0.1em] font-bold">{label}</span>
      <span className={`text-[12px] font-semibold font-mono leading-none ${valueClass}`}>{value}</span>
    </div>
  );
}

function Sep() {
  return <div className="w-px h-4 bg-[#1a1a35] shrink-0" />;
}
