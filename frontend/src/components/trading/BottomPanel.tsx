'use client';

import { useState, useEffect } from 'react';
import { useDEXStore } from '@/store/dex';
import type { Position, OpenOrder, Fill } from '@/store/dex';
import { X, TrendingUp, TrendingDown, Clock, BarChart2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { apiPath } from '@/lib/api';

export function BottomPanel() {
  const [tab, setTab] = useState<'positions' | 'orders' | 'trades'>('positions');
  const [refreshing, setRefreshing] = useState(false);
  const { positions, openOrders, tradeHistory, removeOpenOrder, setOpenOrders, prices, selectedMarket } = useDEXStore();
  const { address } = useAccount();

  // Load open orders for connected wallet on mount / address change
  useEffect(() => {
    if (!address) return;
    fetch(apiPath(`/api/orders?trader=${address}`))
      .then(r => r.ok ? r.json() : [])
      .then((orders: OpenOrder[]) => { if (Array.isArray(orders)) setOpenOrders(orders); })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  async function refreshOrders() {
    if (!address) return;
    setRefreshing(true);
    try {
      const res = await fetch(apiPath(`/api/orders?trader=${address}`));
      if (!res.ok) { toast.error('Could not refresh orders'); return; }
      const orders: OpenOrder[] = await res.json();
      setOpenOrders(Array.isArray(orders) ? orders : []);
    } catch {
      toast.error('Could not refresh orders');
    } finally {
      setRefreshing(false);
    }
  }

  async function cancelOrder(marketId: string, orderId: string) {
    try {
      const res = await fetch(apiPath(`/api/orders/${marketId}/${orderId}`), { method: 'DELETE' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error((body as { error?: string }).error ?? 'Failed to cancel order');
        return;
      }
      removeOpenOrder(orderId);
      toast.success('Order cancelled');
    } catch { toast.error('Network error — could not cancel'); }
  }

  const tabs = [
    { id: 'positions' as const, label: 'Positions',     count: positions.length,   icon: <BarChart2 size={11} /> },
    { id: 'orders'    as const, label: 'Open Orders',   count: openOrders.length,  icon: <Clock size={11} />    },
    { id: 'trades'    as const, label: 'Trade History', count: tradeHistory.length, icon: null },
  ];

  return (
    <div className="flex flex-col h-full bg-[#09091a]">

      {/* Tab bar */}
      <div className="flex items-center border-b border-[#1a1a35] px-2 shrink-0 h-9">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 h-full text-xs font-semibold transition-all border-b-2 ${
              tab === t.id
                ? 'text-white border-blue-500'
                : 'text-[#7a8099] border-transparent hover:text-[#c8d0e0]'
            }`}
          >
            {t.icon && <span className={tab === t.id ? 'text-blue-400' : ''}>{t.icon}</span>}
            {t.label}
            {t.count > 0 && (
              <span className="bg-blue-500/15 text-blue-400 border border-blue-500/20 rounded px-1 py-px text-[9px] font-bold">
                {t.count}
              </span>
            )}
          </button>
        ))}
        <button
          onClick={refreshOrders}
          disabled={refreshing || !address}
          title="Refresh orders"
          className="ml-auto mr-1 p-1.5 text-[#6a7090] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded"
        >
          <RefreshCw size={11} className={refreshing ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex-1 overflow-auto hide-scrollbar">
        {tab === 'positions' && <PositionsTab positions={positions} prices={prices} />}
        {tab === 'orders'    && <OrdersTab orders={openOrders} onCancel={cancelOrder} />}
        {tab === 'trades'    && <TradesTab trades={tradeHistory} />}
      </div>
    </div>
  );
}

function PositionsTab({ positions, prices }: { positions: Position[]; prices: Record<string, { price: number }> }) {
  if (!positions.length) return <EmptyState icon="📊" text="No open positions" sub="Place a trade to get started" />;
  return (
    <table className="w-full text-xs">
      <Thead cols={['Market', 'Side', 'Size', 'Entry', 'Mark', 'PnL', 'Margin', 'Liq.', 'Lev.']} />
      <tbody>
        {positions.map((pos, i) => {
          const [base]  = pos.marketId.split('-');
          const mark    = prices[base]?.price ?? 0;
          const entry   = parseFloat(pos.entryPrice) / 1e6;  // 1e6 micro-USD
          const size    = parseFloat(pos.size) / 1e18;
          const isLong  = size >= 0;
          const pnl     = (mark - entry) * Math.abs(size) * (isLong ? 1 : -1);
          const pnlPct  = entry > 0 ? ((mark - entry) / entry) * 100 * (isLong ? 1 : -1) : 0;
          // Liquidation: long → entry*(1 - maintenanceMargin/leverage), short → entry*(1 + maintenanceMargin/leverage)
          const mm      = 0.05 / pos.leverage;
          const liqP    = isLong ? entry * (1 - mm) : entry * (1 + mm);
          return (
            <tr key={i} className="border-b border-[#0d0d22] hover:bg-[#0d0d22] transition-colors">
              <Td><span className="text-white font-semibold">{pos.marketId}</span></Td>
              <Td>
                <span className={`flex items-center gap-1 font-bold ${isLong ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isLong ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {isLong ? 'LONG' : 'SHORT'}
                </span>
              </Td>
              <Td>{Math.abs(size).toFixed(4)} {base}</Td>
              <Td>${entry.toFixed(2)}</Td>
              <Td>${mark.toFixed(2)}</Td>
              <Td className={pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                <span className="text-[9px] opacity-60 ml-1">({pnlPct.toFixed(2)}%)</span>
              </Td>
              <Td>${(parseFloat(pos.margin) / 1e6).toFixed(2)}</Td>
              <Td className="text-amber-400">${liqP.toFixed(2)}</Td>
              <Td>{pos.leverage}×</Td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function OrdersTab({ orders, onCancel }: { orders: OpenOrder[]; onCancel: (m: string, id: string) => void }) {
  if (!orders.length) return <EmptyState icon="⏳" text="No open orders" sub="Active limit orders appear here" />;
  return (
    <table className="w-full text-xs">
      <Thead cols={['Market', 'Side', 'Type', 'Price', 'Size', 'Filled', 'Status', '']} />
      <tbody>
        {orders.map(o => {
          const filled = (1 - parseFloat(o.remainingSize) / parseFloat(o.size)) * 100;
          return (
            <tr key={o.id} className="border-b border-[#0d0d22] hover:bg-[#0d0d22] transition-colors">
              <Td><span className="text-white font-semibold">{o.marketId}</span></Td>
              <Td className={o.side === 'buy' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>{o.side.toUpperCase()}</Td>
              <Td className="capitalize text-[#8890a8]">{o.type}</Td>
              <Td>${(parseFloat(o.price) / 1e6).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Td>
              <Td>{(parseFloat(o.size) / 1e18).toFixed(4)}</Td>
              <Td>
                <div className="flex items-center gap-1.5">
                  <div className="w-14 bg-[#1a1a35] rounded-full h-1">
                    <div className="h-1 bg-blue-500 rounded-full transition-all" style={{ width: `${filled}%` }} />
                  </div>
                  <span className="text-[9px] text-[#8890a8]">{filled.toFixed(0)}%</span>
                </div>
              </Td>
              <Td>
                <span className="capitalize text-[#8890a8] bg-[#0d0d22] border border-[#252545] px-1.5 py-0.5 rounded text-[9px]">
                  {o.status}
                </span>
              </Td>
              <Td>
                <button
                  onClick={() => onCancel(o.marketId, o.id)}
                  className="text-[#6a7090] hover:text-red-400 hover:bg-red-500/10 rounded p-0.5 transition-all"
                >
                  <X size={12} />
                </button>
              </Td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function TradesTab({ trades }: { trades: Fill[] }) {
  if (!trades.length) return <EmptyState icon="📜" text="No trade history" sub="Your executed trades appear here" />;
  return (
    <table className="w-full text-xs">
      <Thead cols={['Market', 'Side', 'Price', 'Size', 'Time']} />
      <tbody>
        {trades.map(t => (
          <tr key={t.id} className="border-b border-[#0d0d22] hover:bg-[#0d0d22] transition-colors">
            <Td><span className="text-white">{t.marketId}</span></Td>
            <Td className={t.side === 'buy' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>{t.side.toUpperCase()}</Td>
            <Td>${(parseFloat(t.price) / 1e6).toFixed(2)}</Td>
            <Td>{(parseFloat(t.size) / 1e18).toFixed(4)}</Td>
              <Td className="text-[#8890a8]">{new Date(t.timestamp).toLocaleTimeString()}</Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function EmptyState({ icon, text, sub }: { icon: string; text: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-1 py-5">
      <span className="text-2xl mb-1 opacity-30">{icon}</span>
      <p className="text-[#a0a8c0] text-xs font-semibold">{text}</p>
      <p className="text-[#6a7090] text-[10px]">{sub}</p>
    </div>
  );
}

function Thead({ cols }: { cols: string[] }) {
  return (
    <thead className="sticky top-0 bg-[#09091a] z-10">
      <tr className="border-b border-[#1a1a35]">
        {cols.map(c => (
          <th key={c} className="px-3 py-2 text-left text-[9px] text-[#6a7090] uppercase tracking-[0.12em] font-bold whitespace-nowrap">{c}</th>
        ))}
      </tr>
    </thead>
  );
}

function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 text-[#8890a8] font-mono text-[11px] whitespace-nowrap ${className}`}>{children}</td>;
}
