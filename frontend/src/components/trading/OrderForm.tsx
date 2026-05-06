'use client';

import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useDEXStore } from '@/store/dex';
import { Info, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiPath } from '@/lib/api';
import { parseUnits } from 'viem';

const LEVERAGE_PRESETS = [1, 2, 3, 5, 10, 15, 20];
const MAINTENANCE_MARGIN = 0.05;

export function OrderForm() {
  const { address, isConnected } = useAccount();
  const { selectedMarket, prices, addOpenOrder } = useDEXStore();

  const [side,      setSide]      = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [price,     setPrice]     = useState('');
  const [size,      setSize]      = useState('');
  const [leverage,  setLeverage]  = useState(5);
  const [loading,   setLoading]   = useState(false);

  const isPerp    = selectedMarket.endsWith('-PERP');
  const [base]    = selectedMarket.split('-');
  const priceInfo = prices[base];
  const markPrice = priceInfo?.price ?? 0;
  const isSmall   = markPrice < 10;

  const execPrice = orderType === 'market' ? markPrice : (parseFloat(price) || 0);
  const sizeNum   = parseFloat(size) || 0;
  const notional  = sizeNum * execPrice;
  const marginReq = isPerp && leverage > 0 ? notional / leverage : notional;
  const fee       = notional * (orderType === 'market' ? 0.0006 : 0.0001);
  const liqPrice  = isPerp && execPrice > 0 && leverage > 0
    ? side === 'buy'
      ? execPrice * (1 - (1 - MAINTENANCE_MARGIN) / leverage)
      : execPrice * (1 + (1 - MAINTENANCE_MARGIN) / leverage)
    : 0;

  const pctOfMark = execPrice > 0 && markPrice > 0
    ? ((execPrice - markPrice) / markPrice) * 100
    : null;

  const handlePct = useCallback((pct: number) => {
    const balance = markPrice > 0 ? (2 * markPrice * pct) / 100 / (isPerp ? leverage : 1) / execPrice : 0;
    setSize(balance > 0 ? balance.toFixed(isSmall ? 0 : 4) : '');
  }, [markPrice, execPrice, leverage, isPerp, isSmall]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isConnected || !address) { toast.error('Connect your wallet first'); return; }
    if (!size || sizeNum <= 0)    { toast.error('Enter a valid size'); return; }
    if (orderType === 'limit' && (!price || parseFloat(price) <= 0)) { toast.error('Enter a valid price'); return; }

    setLoading(true);
    try {
      const execPriceStr = (parseFloat(price) || markPrice).toFixed(isSmall ? 6 : 2);
      const sizeStr      = sizeNum.toFixed(isSmall ? 4 : 6);

      const body = {
        marketId:  selectedMarket,
        trader:    address,
        side,
        type:      orderType,
        price:     parseUnits(execPriceStr, 6).toString(),
        size:      parseUnits(sizeStr,      18).toString(),
        leverage:  isPerp ? leverage : undefined,
        nonce:     Date.now().toString(),
        expiry:    Math.floor(Date.now() / 1000) + 3600,
        signature: '0x',
      };

      const res  = await fetch(apiPath('/api/orders'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json() as {
        id?: string; side?: 'buy' | 'sell'; type?: 'limit' | 'market';
        price?: string; size?: string; remainingSize?: string; status?: string; createdAt?: number;
        error?: string | object;
      };

      if (!res.ok) {
        toast.error(typeof data.error === 'string' ? data.error : 'Order failed');
      } else if (data.id) {
        addOpenOrder({
          id: data.id, side: data.side!, type: data.type!,
          price: data.price!, size: data.size!, remainingSize: data.remainingSize!,
          status: data.status!, createdAt: data.createdAt!,
          marketId: selectedMarket,
        });
        toast.success(`${side === 'buy' ? 'Long' : 'Short'} order placed`);
        setSize(''); setPrice('');
      }
    } catch { toast.error('Network error'); }
    finally  { setLoading(false); }
  }

  const isBuy = side === 'buy';

  return (
    <div className="flex flex-col bg-[#09091a]">

      {/* ── Long / Short tabs ─────────────────────────────────── */}
      <div className="p-3 pb-2">
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#060613] rounded-2xl border border-[#141430]">
          {(['buy', 'sell'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSide(s)}
              className={`py-2.5 rounded-xl text-sm font-black transition-all duration-200 ${
                side === s
                  ? s === 'buy'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25'
                  : 'text-[#4a5068] hover:text-[#8890a8]'
              }`}
            >
              {s === 'buy' ? 'Long / Buy' : 'Short / Sell'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Order type + fee ──────────────────────────────────── */}
      <div className="flex items-center gap-1 px-3 pb-2.5">
        {(['limit', 'market'] as const).map(t => (
          <button
            key={t}
            onClick={() => setOrderType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
              orderType === t
                ? 'bg-[#1a1a35] text-white border border-[#2a2a55]'
                : 'text-[#4a5068] hover:text-[#8890a8] hover:bg-[#0d0d22]'
            }`}
          >
            {t}
          </button>
        ))}
        <div className="ml-auto text-[10px]">
          <span className={orderType === 'limit' ? 'text-emerald-400 font-bold' : 'text-[#4a5068]'}>
            {orderType === 'limit' ? 'Maker −0.01%' : 'Taker 0.06%'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 px-3 pb-3">

        {/* ── Price ──────────────────────────────────────────── */}
        {orderType === 'limit' ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-[#4a5068] font-bold uppercase tracking-wide">Price</label>
              {pctOfMark !== null && Math.abs(pctOfMark) > 0.01 && (
                <span className={`text-[9px] font-semibold ${pctOfMark > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {pctOfMark > 0 ? '+' : ''}{pctOfMark.toFixed(2)}% vs mark
                </span>
              )}
            </div>
            <NumberInput
              value={price}
              onChange={setPrice}
              placeholder={markPrice > 0 ? markPrice.toFixed(isSmall ? 4 : 2) : '0.00'}
              right="USDC"
              onMarkPrice={() => setPrice(markPrice.toFixed(isSmall ? 4 : 2))}
            />
          </div>
        ) : (
          <div className="bg-[#0d0d22] border border-[#1a1a35] rounded-xl px-3 py-2.5 flex items-center justify-between">
            <span className="text-[10px] text-[#4a5068] font-bold uppercase tracking-wide">Price</span>
            <span className="text-[11px] text-[#8890a8] font-mono">
              Market ~{markPrice > 0 ? `$${markPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '—'}
            </span>
          </div>
        )}

        {/* ── Amount ─────────────────────────────────────────── */}
        <div className="space-y-1">
          <label className="text-[10px] text-[#4a5068] font-bold uppercase tracking-wide">{`Amount (${base})`}</label>
          <NumberInput value={size} onChange={setSize} placeholder="0.0000" right={base} />
          <div className="grid grid-cols-4 gap-1 mt-1">
            {[25, 50, 75, 100].map(pct => (
              <button
                key={pct}
                type="button"
                onClick={() => handlePct(pct)}
                className={`py-1 text-[10px] font-bold rounded-lg transition-all border active:scale-95 ${
                  isBuy
                    ? 'text-[#4a5068] bg-[#0d0d22] border-[#1a1a35] hover:bg-emerald-500/8 hover:text-emerald-400 hover:border-emerald-500/20'
                    : 'text-[#4a5068] bg-[#0d0d22] border-[#1a1a35] hover:bg-red-500/8 hover:text-red-400 hover:border-red-500/20'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* ── Leverage (perps only) ──────────────────────────── */}
        {isPerp && (
          <div className="bg-[#0a0a1e] rounded-xl p-3 space-y-2.5 border border-[#141430]">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-[#4a5068] font-bold uppercase tracking-wide">Leverage</span>
              <span className={`text-sm font-black px-2 py-0.5 rounded-lg ${
                leverage >= 15
                  ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                  : leverage >= 10
                  ? 'text-orange-400 bg-orange-500/10 border border-orange-500/20'
                  : 'text-blue-400 bg-blue-500/10 border border-blue-500/20'
              }`}>
                {leverage}×
              </span>
            </div>
            <input
              type="range"
              min={1} max={20}
              value={leverage}
              onChange={e => setLeverage(Number(e.target.value))}
              className="w-full"
              style={{
                background: `linear-gradient(to right, ${
                  leverage >= 15 ? '#f59e0b' : leverage >= 10 ? '#f97316' : '#3b82f6'
                } 0%, ${
                  leverage >= 15 ? '#f59e0b' : leverage >= 10 ? '#f97316' : '#3b82f6'
                } ${((leverage - 1) / 19) * 100}%, #1a1a35 ${((leverage - 1) / 19) * 100}%, #1a1a35 100%)`,
              }}
            />
            <div className="flex justify-between">
              {LEVERAGE_PRESETS.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setLeverage(p)}
                  className={`text-[9px] font-black px-1.5 py-0.5 rounded transition-all ${
                    leverage === p
                      ? p >= 15
                        ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                        : p >= 10
                        ? 'text-orange-400 bg-orange-500/10 border border-orange-500/20'
                        : 'text-blue-400 bg-blue-500/10 border border-blue-500/20'
                      : 'text-[#2a2e48] hover:text-[#8890a8]'
                  }`}
                >
                  {p}×
                </button>
              ))}
            </div>
            {leverage >= 10 && (
              <div className="flex items-start gap-1.5 bg-amber-500/5 border border-amber-500/15 rounded-lg px-2 py-1.5">
                <Info size={11} className="text-amber-400 shrink-0 mt-px" />
                <span className="text-[9px] text-amber-400/75 leading-tight">
                  High leverage — small moves can liquidate your position
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── Order summary ──────────────────────────────────── */}
        <div className="bg-[#06060f] rounded-xl p-3 space-y-2 border border-[#111128]">
          <Row label="Order Value"     value={notional > 0 ? `$${notional.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '—'} />
          {isPerp && <Row label="Margin Required" value={marginReq > 0 ? `$${marginReq.toFixed(2)}` : '—'} />}
          {isPerp && liqPrice > 0 && (
            <Row
              label="Est. Liq. Price"
              value={`$${liqPrice.toLocaleString(undefined, { maximumFractionDigits: isSmall ? 4 : 2 })}`}
              valueClass="text-amber-400"
            />
          )}
          <div className="border-t border-[#111128] pt-1.5 mt-1">
            <Row
              label={orderType === 'limit' ? 'Maker Rebate (0.01%)' : 'Taker Fee (0.06%)'}
              value={fee > 0
                ? orderType === 'limit' ? `+$${fee.toFixed(4)}` : `-$${fee.toFixed(4)}`
                : '—'}
              valueClass={orderType === 'limit' ? 'text-emerald-400' : 'text-[#8890a8]'}
            />
          </div>
        </div>

        {/* ── Submit ─────────────────────────────────────────── */}
        {!isConnected ? (
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <button
                type="button"
                onClick={openConnectModal}
                className="w-full py-3.5 rounded-2xl font-bold text-sm bg-[#0d0d22] hover:bg-[#111130] text-white transition-all border border-[#2a2a45] hover:border-blue-500/30 flex items-center justify-center gap-2 active:scale-[0.99] shadow-lg"
              >
                <Wallet size={16} className="text-blue-400" />
                Connect Wallet to Trade
              </button>
            )}
          </ConnectButton.Custom>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] shadow-lg relative overflow-hidden group ${
              isBuy
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-emerald-500/20'
                : 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white shadow-red-500/20'
            }`}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Placing order…
              </span>
            ) : (
              `${isBuy ? '▲ Buy / Long' : '▼ Sell / Short'} ${base}`
            )}
          </button>
        )}
      </form>
    </div>
  );
}

function NumberInput({ value, onChange, placeholder, right, onMarkPrice }: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  right: string;
  onMarkPrice?: () => void;
}) {
  return (
    <div className="flex items-center bg-[#0a0a1e] border border-[#1a1a35] rounded-xl px-3 py-2.5 gap-2 focus-within:border-blue-500/40 focus-within:bg-[#0a0a24] transition-all">
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-white text-sm font-mono outline-none placeholder-[#2a2e48] min-w-0"
      />
      {onMarkPrice && (
        <button
          type="button"
          onClick={onMarkPrice}
          className="text-[9px] font-bold text-blue-400/70 hover:text-blue-400 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/15 hover:border-blue-500/30 rounded px-1.5 py-0.5 transition-all shrink-0"
        >
          MKT
        </button>
      )}
      <span className="text-[#3a3e58] text-xs font-bold shrink-0">{right}</span>
    </div>
  );
}

function Row({ label, value, valueClass = 'text-[#8890a8]' }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[10px] text-[#2a2e48]">{label}</span>
      <span className={`text-[11px] font-mono font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}

