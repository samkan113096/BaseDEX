'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useDEXStore } from '@/store/dex';
import { TrendingUp, TrendingDown, ChevronDown, Layers } from 'lucide-react';
import { TARGET_CHAIN_ID } from '@/lib/contracts';

const CHAIN_LABEL: Record<number, { name: string; color: string }> = {
  8453:     { name: 'Base',         color: 'text-blue-400' },
  84532:    { name: 'Base Sepolia', color: 'text-violet-400' },
  11155111: { name: 'ETH Sepolia',  color: 'text-amber-400' },
};
import { useState, useEffect, useRef } from 'react';

export const MARKETS = [
  // ── Perpetuals ─────────────────────────────────────────────────
  { id: 'ETH-PERP',   label: 'ETH-PERP',   symbol: 'ETH',   tag: 'PERP', icon: '⟠' },
  { id: 'BTC-PERP',   label: 'BTC-PERP',   symbol: 'BTC',   tag: 'PERP', icon: '₿' },
  { id: 'SOL-PERP',   label: 'SOL-PERP',   symbol: 'SOL',   tag: 'PERP', icon: '◎' },
  { id: 'DOGE-PERP',  label: 'DOGE-PERP',  symbol: 'DOGE',  tag: 'PERP', icon: 'Ð' },
  { id: 'AVAX-PERP',  label: 'AVAX-PERP',  symbol: 'AVAX',  tag: 'PERP', icon: '▲' },
  { id: 'cbBTC-PERP', label: 'cbBTC-PERP', symbol: 'cbBTC', tag: 'PERP', icon: '₿' },
  { id: 'cbETH-PERP', label: 'cbETH-PERP', symbol: 'cbETH', tag: 'PERP', icon: '⟠' },
  { id: 'AERO-PERP',  label: 'AERO-PERP',  symbol: 'AERO',  tag: 'PERP', icon: '✦' },
  { id: 'ARB-PERP',   label: 'ARB-PERP',   symbol: 'ARB',   tag: 'PERP', icon: '◈' },
  { id: 'LINK-PERP',  label: 'LINK-PERP',  symbol: 'LINK',  tag: 'PERP', icon: '⬡' },
  { id: 'POL-PERP',   label: 'POL-PERP',   symbol: 'POL',   tag: 'PERP', icon: '⬟' },
  // ── Spot ───────────────────────────────────────────────────────
  { id: 'ETH-USDC',   label: 'ETH/USDC',   symbol: 'ETH',   tag: 'SPOT', icon: '⟠' },
  { id: 'BTC-USDC',   label: 'BTC/USDC',   symbol: 'BTC',   tag: 'SPOT', icon: '₿' },
  { id: 'ETH-USDT',   label: 'ETH/USDT',   symbol: 'ETH',   tag: 'SPOT', icon: '⟠' },
  { id: 'BTC-USDT',   label: 'BTC/USDT',   symbol: 'BTC',   tag: 'SPOT', icon: '₿' },
  { id: 'SOL-USDC',   label: 'SOL/USDC',   symbol: 'SOL',   tag: 'SPOT', icon: '◎' },
  { id: 'SOL-USDT',   label: 'SOL/USDT',   symbol: 'SOL',   tag: 'SPOT', icon: '◎' },
  { id: 'DOGE-USDC',  label: 'DOGE/USDC',  symbol: 'DOGE',  tag: 'SPOT', icon: 'Ð' },
  { id: 'cbBTC-USDC', label: 'cbBTC/USDC', symbol: 'cbBTC', tag: 'SPOT', icon: '₿' },
  { id: 'cbETH-USDC', label: 'cbETH/USDC', symbol: 'cbETH', tag: 'SPOT', icon: '⟠' },
  { id: 'AVAX-USDC',  label: 'AVAX/USDC',  symbol: 'AVAX',  tag: 'SPOT', icon: '▲' },
  { id: 'LINK-USDC',  label: 'LINK/USDC',  symbol: 'LINK',  tag: 'SPOT', icon: '⬡' },
  { id: 'AERO-USDC',  label: 'AERO/USDC',  symbol: 'AERO',  tag: 'SPOT', icon: '✦' },
];

export function TradeHeader() {
  const { selectedMarket, setMarket, prices } = useDEXStore();
  const [showMarkets, setShowMarkets] = useState(false);
  const [prevPrice, setPrevPrice]     = useState(0);
  const [flash, setFlash]             = useState<'up' | 'down' | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const chain     = CHAIN_LABEL[TARGET_CHAIN_ID] ?? { name: `Chain ${TARGET_CHAIN_ID}`, color: 'text-[#4a5068]' };
  const current   = MARKETS.find(m => m.id === selectedMarket) ?? MARKETS[0];
  const priceInfo = prices[current.symbol];
  const price     = priceInfo?.price   ?? 0;
  const change    = priceInfo?.change24h ?? 0;

  // Flash animation on price change — always update prevPrice after flash
  useEffect(() => {
    if (!price) return;
    if (prevPrice && price !== prevPrice) {
      setFlash(price > prevPrice ? 'up' : 'down');
      const t = setTimeout(() => setFlash(null), 600);
      setPrevPrice(price);
      return () => clearTimeout(t);
    }
    setPrevPrice(price);
  }, [price]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setShowMarkets(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const priceClass = flash === 'up' ? 'text-emerald-400 animate-tick-up' : flash === 'down' ? 'text-red-400 animate-tick-down' : 'text-white';

  return (
    <header className="h-[52px] bg-[#09091a] border-b border-[#1a1a35] flex items-center px-3 gap-3 z-50 relative shrink-0">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0 mr-1 group">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
          <span className="text-white font-black text-sm select-none">B</span>
        </div>
        <span className="text-white font-bold text-[15px] tracking-tight hidden sm:block group-hover:text-blue-400 transition-colors">
          BaseDEX
        </span>
      </Link>

      <div className="w-px h-5 bg-[#1a1a35] shrink-0" />

      {/* Market selector */}
      <div className="relative" ref={dropRef}>
        <button
          onClick={() => setShowMarkets(!showMarkets)}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#0d0d22] hover:bg-[#111128] border border-[#1a1a35] hover:border-[#2a2a55] rounded-lg transition-all text-sm font-semibold text-white"
        >
          <span className="text-base leading-none opacity-70">{current.icon}</span>
          <span>{current.label}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
            current.tag === 'PERP'
              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
          }`}>
            {current.tag}
          </span>
          <ChevronDown size={12} className={`text-[#4a5068] transition-transform duration-200 ${showMarkets ? 'rotate-180' : ''}`} />
        </button>

        {showMarkets && (
          <div className="absolute top-full left-0 mt-1.5 w-64 bg-[#0d0d22] border border-[#1a1a35] rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-50 animate-slide-up">
            {/* Chain badge */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-[#1a1a35] bg-[#09091a]">
              <Layers size={11} className={chain.color} />
              <span className={`text-[10px] font-bold uppercase tracking-widest ${chain.color}`}>{chain.name}</span>
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {(['PERP', 'SPOT'] as const).map(tag => (
              <div key={tag}>
                <div className="px-3 py-1.5 text-[9px] font-bold text-[#2a2e48] uppercase tracking-[0.15em] bg-[#09091a] border-b border-[#1a1a35]">
                  {tag === 'PERP' ? 'Perpetuals' : 'Spot Markets'}
                </div>
                {MARKETS.filter(m => m.tag === tag).map(m => {
                  const p  = prices[m.symbol]?.price    ?? 0;
                  const ch = prices[m.symbol]?.change24h ?? 0;
                  const active = selectedMarket === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => { setMarket(m.id); setShowMarkets(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 transition-all group ${
                        active ? 'bg-blue-500/10 border-l-2 border-blue-500' : 'border-l-2 border-transparent hover:bg-[#111128] hover:border-l-blue-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base leading-none opacity-60">{m.icon}</span>
                        <span className={`text-sm font-semibold ${active ? 'text-blue-400' : 'text-[#c8d0e0] group-hover:text-white'}`}>
                          {m.label}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-xs text-white font-medium">
                          {p > 0 ? `$${p.toLocaleString(undefined, { maximumFractionDigits: p < 1 ? 4 : 2 })}` : '—'}
                        </div>
                        {p > 0 && (
                          <div className={`text-[10px] font-medium ${ch >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {ch >= 0 ? '+' : ''}{ch.toFixed(2)}%
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}

            {/* ARB Coming soon */}
            <div className="px-3 py-2 border-t border-[#1a1a35] flex items-center gap-2">
              <span className="text-[9px] text-[#2a2e48] uppercase tracking-widest">Arbitrum</span>
              <span className="text-[9px] bg-amber-500/15 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-bold">Coming Q3 2026</span>
            </div>
          </div>
        )}
      </div>

      {/* Price ticker */}
      <div className="flex items-center gap-2 ml-1">
        <span className={`font-bold font-mono text-base transition-colors ${priceClass}`}>
          ${price.toLocaleString(undefined, { minimumFractionDigits: price < 1 ? 4 : 2, maximumFractionDigits: price < 1 ? 5 : 2 })}
        </span>
        <span className={`text-xs font-semibold flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${
          change >= 0
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </span>
      </div>

      {/* Nav */}
      <nav className="hidden lg:flex items-center gap-0.5 ml-2">
        {[
          { href: '/trade',     label: 'Trade' },
          { href: '/#features', label: 'Features' },
          { href: '/blog',      label: 'Blog' },
          { href: '/#faq',      label: 'FAQ' },
        ].map(n => (
          <Link
            key={n.href}
            href={n.href}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              n.href === '/trade'
                ? 'text-white bg-[#111128] border border-[#1a1a35]'
                : 'text-[#4a5068] hover:text-white hover:bg-[#0d0d22]'
            }`}
          >
            {n.label}
          </Link>
        ))}
      </nav>

      {/* Testnet badge */}
      {TARGET_CHAIN_ID !== 8453 && (
        <div className={`hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md border text-[9px] font-bold uppercase tracking-wider ${chain.color} border-current bg-current/5`}>
          <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
          Testnet
        </div>
      )}

      {/* Wallet */}
      <div className="ml-auto">
        <ConnectButton accountStatus="address" chainStatus="icon" showBalance={false} />
      </div>
    </header>
  );
}
