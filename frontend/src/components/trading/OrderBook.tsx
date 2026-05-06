'use client';

import { useDEXStore } from '@/store/dex';
import { useMemo, useState } from 'react';

type View = 'both' | 'bids' | 'asks';

export function OrderBook() {
  const { bids, asks, selectedMarket, prices } = useDEXStore();
  const [view, setView] = useState<View>('both');
  const [base] = selectedMarket.split('-');
  const markPrice = prices[base]?.price ?? 0;
  const isSmall   = markPrice < 10;

  const maxDepth = view === 'bids' ? 22 : view === 'asks' ? 22 : 11;

  const topAsks = useMemo(() => asks.slice(0, maxDepth), [asks, maxDepth]);
  const topBids = useMemo(() => bids.slice(0, maxDepth), [bids, maxDepth]);

  // Cumulative totals for depth visualization
  const cumulativeAsks = useMemo(() => {
    let cum = 0;
    return topAsks.map(l => { cum += parseFloat(l.size) / 1e18; return cum; });
  }, [topAsks]);

  const cumulativeBids = useMemo(() => {
    let cum = 0;
    return topBids.map(l => { cum += parseFloat(l.size) / 1e18; return cum; });
  }, [topBids]);

  const maxCumAsk = cumulativeAsks[cumulativeAsks.length - 1] || 1;
  const maxCumBid = cumulativeBids[cumulativeBids.length - 1] || 1;

  const spread = useMemo(() => {
    const a = topAsks[0]; const b = topBids[0];
    if (!a || !b) return null;
    const ap = parseFloat(a.price) / 1e6;
    const bp = parseFloat(b.price) / 1e6;
    const diff = ap - bp;
    return { abs: diff.toFixed(isSmall ? 4 : 2), pct: ((diff / ap) * 100).toFixed(3) };
  }, [topAsks, topBids, isSmall]);

  const fmtPrice = (raw: string) => {
    const p = parseFloat(raw) / 1e6;
    return p.toLocaleString(undefined, { minimumFractionDigits: isSmall ? 4 : 2, maximumFractionDigits: isSmall ? 5 : 2 });
  };

  const fmtSize = (raw: string) => {
    const s = parseFloat(raw) / 1e18;
    return s < 0.001 ? s.toFixed(5) : s < 0.1 ? s.toFixed(4) : s < 10 ? s.toFixed(3) : s.toFixed(1);
  };

  return (
    <div className="flex flex-col h-full text-xs select-none">

      {/* Header */}
      <div className="flex items-center justify-between px-3 h-9 border-b border-[#1a1a35] shrink-0">
        <span className="text-[10px] font-bold text-[#8890a8] uppercase tracking-widest">Order Book</span>
        <div className="flex gap-0.5">
          {(['both', 'bids', 'asks'] as View[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              title={v}
              className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                view === v ? 'bg-[#1a1a35]' : 'hover:bg-[#0d0d22]'
              }`}
            >
              {v === 'both' && (
                <span className="flex gap-0.5">
                  <span className="w-1.5 h-3 rounded-sm bg-emerald-500/70" />
                  <span className="w-1.5 h-3 rounded-sm bg-red-500/70" />
                </span>
              )}
              {v === 'bids' && <span className="w-3 h-3 rounded-sm bg-emerald-500/70" />}
              {v === 'asks' && <span className="w-3 h-3 rounded-sm bg-red-500/70" />}
            </button>
          ))}
        </div>
      </div>

      {/* Column labels */}
      <div className="grid grid-cols-3 px-3 py-1.5 text-[9px] font-bold text-[#6a7090] uppercase tracking-[0.1em] border-b border-[#1a1a35] shrink-0">
        <span>Price</span>
        <span className="text-right">{base}</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (reversed so lowest ask is at bottom) */}
      {view !== 'bids' && (
        <div className={`${view === 'asks' ? 'flex-1' : 'flex-none'} flex flex-col-reverse overflow-hidden`}>
          {[...topAsks].reverse().map((level, idx) => {
            const realIdx = topAsks.length - 1 - idx;
            const pct     = (cumulativeAsks[realIdx] / maxCumAsk) * 100;
            const total   = (parseFloat(level.price) / 1e6) * (parseFloat(level.size) / 1e18);
            return (
              <div key={idx} className="relative grid grid-cols-3 px-3 py-[3.5px] hover:bg-[#0d0d22] cursor-default group">
                <div
                  className="absolute right-0 top-0 h-full bg-red-500/[0.07] group-hover:bg-red-500/[0.12] transition-all"
                  style={{ width: `${pct}%` }}
                />
                <span className="text-red-400 font-mono z-10 text-[11px]">{fmtPrice(level.price)}</span>
                <span className="text-[#a0a8c0] font-mono text-right z-10 text-[10px]">{fmtSize(level.size)}</span>
                <span className="text-[#7a8099] font-mono text-right z-10 text-[10px]">
                  {total >= 1000 ? `${(total / 1000).toFixed(1)}K` : total.toFixed(0)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Spread / mid-price row */}
      {view === 'both' && (
        <div className="flex items-center justify-between px-3 py-2 bg-[#09091a] border-y border-[#1a1a35] shrink-0">
          <span className={`font-bold font-mono text-[13px] ${(prices[base]?.change24h ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            ${markPrice.toLocaleString(undefined, { minimumFractionDigits: isSmall ? 4 : 2, maximumFractionDigits: isSmall ? 5 : 2 })}
          </span>
          {spread && (
            <span className="text-[9px] text-[#6a7090] font-mono">
              {spread.pct}%
            </span>
          )}
        </div>
      )}

      {/* Bids */}
      {view !== 'asks' && (
        <div className={`${view === 'bids' ? 'flex-1' : 'flex-none'} overflow-hidden`}>
          {topBids.map((level, idx) => {
            const pct   = (cumulativeBids[idx] / maxCumBid) * 100;
            const total = (parseFloat(level.price) / 1e6) * (parseFloat(level.size) / 1e18);
            return (
              <div key={idx} className="relative grid grid-cols-3 px-3 py-[3.5px] hover:bg-[#0d0d22] cursor-default group">
                <div
                  className="absolute right-0 top-0 h-full bg-emerald-500/[0.07] group-hover:bg-emerald-500/[0.12] transition-all"
                  style={{ width: `${pct}%` }}
                />
                <span className="text-emerald-400 font-mono z-10 text-[11px]">{fmtPrice(level.price)}</span>
                <span className="text-[#a0a8c0] font-mono text-right z-10 text-[10px]">{fmtSize(level.size)}</span>
                <span className="text-[#7a8099] font-mono text-right z-10 text-[10px]">
                  {total >= 1000 ? `${(total / 1000).toFixed(1)}K` : total.toFixed(0)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
