'use client';

import dynamic from 'next/dynamic';
import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMarketDataSocket } from '@/hooks/useMarketData';
import { useDEXStore } from '@/store/dex';
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
      <div className="w-full h-full bg-[#07071a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#1a1a35] border-t-blue-500 rounded-full animate-spin" />
          <span className="text-[#4a5068] text-xs">Initializing chart…</span>
        </div>
      </div>
    ),
  }
);

function MarketParamSync() {
  const params    = useSearchParams();
  const setMarket = useDEXStore(s => s.setMarket);

  useEffect(() => {
    const requested = params.get('market');
    if (requested) setMarket(requested.toUpperCase());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export default function TradePage() {
  useMarketDataSocket();

  return (
    <div className="flex flex-col h-screen bg-[#05050f] text-white overflow-hidden">
      <Suspense fallback={null}>
        <MarketParamSync />
      </Suspense>

      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <TradeHeader />
      <MarketStats />

      {/* ── Main trading grid ────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* Left: Order Book */}
        <aside className="w-[200px] xl:w-[224px] border-r border-[#1a1a35] flex flex-col shrink-0 bg-[#09091a] overflow-hidden">
          <OrderBook />
        </aside>

        {/* Center: Chart + Bottom panel */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Chart takes up remaining height above bottom panel */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <TradingChart />
          </div>
          {/* Bottom panel: positions / open orders / trade history */}
          <div className="h-[220px] border-t border-[#1a1a35] shrink-0 bg-[#09091a] overflow-hidden">
            <BottomPanel />
          </div>
        </div>

        {/* Right: Order form + Recent trades */}
        <aside className="w-[280px] xl:w-[308px] border-l border-[#1a1a35] flex flex-col shrink-0 bg-[#09091a] overflow-hidden">
          {/* Order form — scrollable */}
          <div className="flex-1 overflow-y-auto hide-scrollbar min-h-0">
            <OrderForm />
          </div>
          {/* Recent trades — fixed height at bottom */}
          <div className="h-[196px] shrink-0 border-t border-[#1a1a35] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-3 h-9 border-b border-[#1a1a35] shrink-0">
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
