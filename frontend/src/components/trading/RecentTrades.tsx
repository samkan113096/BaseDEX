'use client';

import { useDEXStore } from '@/store/dex';

export function RecentTrades() {
  const { recentTrades, selectedMarket } = useDEXStore();
  const [base] = selectedMarket.split('-');

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-3 px-3 py-1 text-[9px] font-bold text-[#2a2e48] uppercase tracking-[0.1em] border-b border-[#1a1a35] shrink-0">
        <span>Price</span>
        <span className="text-right">{base}</span>
        <span className="text-right">Time</span>
      </div>
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {recentTrades.slice(0, 50).map((trade, i) => {
          const price   = parseFloat(trade.price) / 1e6;
          const size    = parseFloat(trade.size) / 1e18;
          const isSmall = price < 10;
          const time    = new Date(trade.timestamp).toLocaleTimeString('en-US', {
            hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
          });
          return (
            <div
              key={trade.id ?? i}
              className="grid grid-cols-3 px-3 py-[3px] hover:bg-[#0d0d22] transition-colors group"
            >
              <span className={`font-mono text-[11px] font-medium ${trade.side === 'buy' ? 'text-emerald-400' : 'text-red-400'}`}>
                {price.toLocaleString(undefined, {
                  minimumFractionDigits: isSmall ? 4 : 2,
                  maximumFractionDigits: isSmall ? 5 : 2,
                })}
              </span>
              <span className="font-mono text-[10px] text-[#4a5068] text-right group-hover:text-[#8890a8] transition-colors">
                {size < 0.001 ? size.toFixed(5) : size < 0.1 ? size.toFixed(4) : size < 10 ? size.toFixed(3) : size.toFixed(1)}
              </span>
              <span className="font-mono text-[9px] text-[#2a2e48] text-right">{time}</span>
            </div>
          );
        })}
        {recentTrades.length === 0 && (
          <div className="flex items-center justify-center h-16 text-[#2a2e48] text-xs">
            Waiting for trades…
          </div>
        )}
      </div>
    </div>
  );
}
