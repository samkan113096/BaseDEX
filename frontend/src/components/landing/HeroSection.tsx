'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Shield, TrendingUp, Layers } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">

      {/* ── Background atmosphere ───────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large ambient orbs */}
        <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20"
             style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
        <div className="absolute top-[20%] right-[8%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-15"
             style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
        <div className="absolute bottom-[15%] left-[35%] w-[300px] h-[300px] rounded-full blur-[80px] opacity-10"
             style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }} />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '52px 52px',
          }}
        />

        {/* Top gradient vignette */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#05050f] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#05050f] to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="max-w-4xl mx-auto text-center">

          {/* ── Live badge ──────────────────────────────────────── */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/8 border border-blue-500/20 text-blue-400 text-xs font-bold mb-8 shadow-lg shadow-blue-500/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
            </span>
            Built on Base Network · Live on Mainnet
            <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full text-[9px] font-black">LIVE</span>
          </div>

          {/* ── Headline ────────────────────────────────────────── */}
          <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-black tracking-[-0.02em] text-white mb-6 leading-[1.03]">
            The Pro DEX Built{' '}
            <br className="hidden sm:block" />
            for{' '}
            <span className="text-gradient">Base Network</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#8890a8] max-w-2xl mx-auto mb-10 leading-relaxed">
            Trade ETH, cbBTC, SOL and more perpetual futures with up to{' '}
            <strong className="text-white font-bold">20× leverage</strong> — deep liquidity,
            sub-200ms execution, and full self-custody. No KYC. Ever.
          </p>

          {/* ── CTAs ────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/trade"
              className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-2xl shadow-blue-600/25 transition-all active:scale-[0.98] hover:shadow-blue-600/40 hover:-translate-y-0.5"
            >
              Start Trading
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#how"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base border border-[#1a1a35] text-[#8890a8] hover:text-white hover:border-[#2a2a55] hover:bg-white/3 transition-all active:scale-[0.98]"
            >
              How It Works
            </Link>
          </div>

          {/* ── Trust badges ────────────────────────────────────── */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-[#4a5068]">
            {[
              { icon: <Shield size={14} />,     text: 'Non-custodial',     color: 'text-blue-400'    },
              { icon: <Zap size={14} />,        text: '< 200ms fills',     color: 'text-emerald-400' },
              { icon: <TrendingUp size={14} />, text: 'Up to 20× leverage', color: 'text-violet-400'  },
              { icon: <Layers size={14} />,     text: 'Base + ARB soon',   color: 'text-amber-400'   },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-white/[0.02] border border-white/5 rounded-full px-3 py-1.5">
                <span className={b.color}>{b.icon}</span>
                <span className="text-[#8890a8] text-xs font-medium">{b.text}</span>
              </div>
            ))}
          </div>

          {/* ── Audit security banner ─────────────────────────── */}
          <div className="mt-8 inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 text-sm">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Shield size={15} />
              <span className="font-bold">Audited</span>
            </div>
            <div className="w-px h-4 bg-emerald-500/20" />
            <span className="text-[#6a7090] text-xs">
              Smart contracts &amp; backend reviewed — 17 findings, all resolved
            </span>
            <Link href="/audit" className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition-colors shrink-0">
              View Report →
            </Link>
          </div>
        </div>

        {/* ── UI Preview card ─────────────────────────────────── */}
        <div className="mt-20 relative max-w-5xl mx-auto">
          {/* Fade bottom */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#05050f] via-[#05050f]/60 to-transparent pointer-events-none z-10" />
          {/* Outer glow */}
          <div className="absolute inset-0 rounded-2xl blur-xl bg-gradient-to-b from-blue-500/10 via-transparent to-violet-500/5 -z-10 scale-105" />

          <div className="rounded-2xl overflow-hidden border border-[#1a1a35] shadow-2xl shadow-black/60 bg-[#09091a]">
            {/* Fake top bar */}
            <div className="h-10 bg-[#0d0d22] border-b border-[#1a1a35] flex items-center px-4 gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
              </div>
              <div className="flex items-center gap-2 ml-2">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                  <span className="text-white font-black text-[10px]">B</span>
                </div>
                <span className="text-[11px] text-white font-semibold">BaseDEX</span>
                <span className="text-[#2a2e48] text-[10px]">· ETH-PERP</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-emerald-400 font-mono text-[11px] font-bold">$2,847.50</span>
                <span className="text-emerald-400 text-[9px] bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">+3.21%</span>
              </div>
            </div>

            <div className="flex h-72">
              {/* Order book */}
              <div className="w-44 border-r border-[#1a1a35] p-3 space-y-px hidden sm:flex flex-col">
                <div className="text-[9px] text-[#2a2e48] uppercase font-bold tracking-widest mb-1.5">Order Book</div>
                {[2854,2852,2850,2848,2846,2844,2842,2840].map((p, i) => (
                  <div key={i} className="relative flex justify-between text-[10px] py-[2px]">
                    <div className="absolute right-0 top-0 h-full bg-red-500/[0.07] rounded-l" style={{ width: `${70 - i * 6}%` }} />
                    <span className="text-red-400 font-mono z-10">{p.toFixed(2)}</span>
                    <span className="text-[#4a5068] font-mono z-10">{(1.4 - i * 0.12).toFixed(3)}</span>
                  </div>
                ))}
                <div className="text-center text-emerald-400 font-bold text-[11px] py-1.5 border-y border-[#1a1a35] my-0.5">$2,847.50</div>
                {[2845,2843,2841,2839,2837,2835,2833,2831].map((p, i) => (
                  <div key={i} className="relative flex justify-between text-[10px] py-[2px]">
                    <div className="absolute right-0 top-0 h-full bg-emerald-500/[0.07] rounded-l" style={{ width: `${25 + i * 7}%` }} />
                    <span className="text-emerald-400 font-mono z-10">{p.toFixed(2)}</span>
                    <span className="text-[#4a5068] font-mono z-10">{(0.7 + i * 0.1).toFixed(3)}</span>
                  </div>
                ))}
              </div>

              {/* Chart area */}
              <div className="flex-1 p-4 flex flex-col bg-[#09091a]">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] text-[#4a5068] bg-[#0d0d22] border border-[#1a1a35] px-2 py-0.5 rounded font-bold">1m</span>
                  <span className="text-[10px] text-white bg-[#111128] border border-[#2a2a55] px-2 py-0.5 rounded font-bold">5m</span>
                  <span className="text-[10px] text-[#4a5068] px-2 py-0.5">15m</span>
                  <span className="text-[10px] text-[#4a5068] px-2 py-0.5">1h</span>
                </div>
                {/* Fake candle chart */}
                <div className="flex-1 flex items-end gap-[2px] pb-2">
                  {[62,68,65,72,70,78,74,80,76,82,79,86,82,90,85,92,88,95,90,98,93,96,100,94,97,92,99,95,98,100].map((h, i) => {
                    const isGreen = i % 3 !== 1;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end gap-[1px]">
                        <div className="w-px rounded" style={{ height: `${Math.random() * 15 + 3}%`, background: isGreen ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)' }} />
                        <div className="w-full rounded-sm" style={{ height: `${h * 0.35}%`, background: isGreen ? 'rgba(16,185,129,0.65)' : 'rgba(239,68,68,0.65)' }} />
                        <div className="w-px rounded" style={{ height: `${Math.random() * 8 + 2}%`, background: isGreen ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)' }} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order form */}
              <div className="w-52 border-l border-[#1a1a35] p-4 hidden md:flex flex-col gap-3 bg-[#09091a]">
                <div className="grid grid-cols-2 gap-1">
                  <div className="py-2.5 bg-emerald-500 rounded-xl text-[11px] font-bold text-white text-center shadow-lg shadow-emerald-500/20">Long</div>
                  <div className="py-2.5 bg-[#0d0d22] border border-[#1a1a35] rounded-xl text-[11px] text-[#4a5068] text-center">Short</div>
                </div>
                {[['Price (USDC)', '$2,847.50'], ['Amount (ETH)', '0.500'], ['Leverage', '5×']].map(([l, v]) => (
                  <div key={l} className="bg-[#0d0d22] border border-[#1a1a35] rounded-xl px-3 py-2.5">
                    <div className="text-[9px] text-[#2a2e48] font-bold uppercase tracking-wide">{l}</div>
                    <div className="text-[11px] text-white font-mono font-medium">{v}</div>
                  </div>
                ))}
                <div className="mt-auto space-y-1.5 text-[10px]">
                  <div className="flex justify-between text-[#4a5068]">
                    <span>Margin</span><span className="text-white font-mono">$284.75</span>
                  </div>
                  <div className="flex justify-between text-[#4a5068]">
                    <span>Liq. Price</span><span className="text-amber-400 font-mono">$2,302.40</span>
                  </div>
                </div>
                <div className="bg-emerald-500 rounded-xl py-2.5 text-[11px] font-bold text-white text-center shadow-lg shadow-emerald-500/20">
                  Buy / Long ETH
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
