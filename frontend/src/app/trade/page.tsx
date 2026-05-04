'use client';

import dynamic from 'next/dynamic';
import { useMarketDataSocket } from '@/hooks/useMarketData';
import { TradeHeader }  from '@/components/layout/TradeHeader';
import { MarketStats }  from '@/components/layout/MarketStats';
import { OrderBook }    from '@/components/trading/OrderBook';
import { OrderForm }    from '@/components/trading/OrderForm';
import { RecentTrades } from '@/components/trading/RecentTrades';
import { BottomPanel }  from '@/components/trading/BottomPanel';

const TradingChart = dynamic(
  () => import('@/components/charts/TradingChart').then(m => m.TradingChart),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#09091a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#1a1a35] border-t-blue-500 rounded-full animate-spin" />
          <span className="text-[#4a5068] text-xs">Loading chart…</span>
        </div>
      </div>
    ),
  }
);

export default function TradePage() {
  useMarketDataSocket();

  return (
    <div className="flex flex-col h-screen bg-[#05050f] text-white overflow-hidden">
      <TradeHeader />
      <MarketStats />

      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* ── Left: Order Book ─────────────────────────────────────── */}
        <aside className="w-[200px] xl:w-[220px] border-r border-[#1a1a35] flex flex-col shrink-0 bg-[#09091a]">
          <OrderBook />
        </aside>

        {/* ── Center: Chart + Bottom Panel ─────────────────────────── */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <div className="flex-1 min-h-0">
            <TradingChart />
          </div>
          <div className="h-[180px] border-t border-[#1a1a35] shrink-0 bg-[#09091a]">
            <BottomPanel />
          </div>
        </div>

        {/* ── Right: Order Form + Recent Trades ─────────────────────── */}
        <aside className="w-[280px] xl:w-[300px] border-l border-[#1a1a35] flex flex-col shrink-0 bg-[#09091a]">
          <div className="flex-1 overflow-y-auto border-b border-[#1a1a35] min-h-0">
            <OrderForm />
          </div>
          <div className="h-[220px] shrink-0 flex flex-col">
            <div className="px-3 h-9 flex items-center border-b border-[#1a1a35] shrink-0">
              <span className="text-[10px] font-bold text-[#4a5068] uppercase tracking-widest">Recent Trades</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <RecentTrades />
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
