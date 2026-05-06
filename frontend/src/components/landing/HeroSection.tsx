'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, TrendingUp, Layers } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">

      {/* ── Hero background image ─────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-30"
          sizes="100vw"
        />
        {/* Dark overlay to keep text readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05050f]/70 via-[#05050f]/50 to-[#05050f]" />
        {/* Ambient orbs */}
        <div className="absolute top-[15%] left-[10%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-25"
             style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
        <div className="absolute top-[20%] right-[8%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20"
             style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
        <div className="absolute bottom-[10%] left-[35%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-15"
             style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }} />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#05050f] to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">

        {/* ── Two-column layout ──────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: text content */}
          <div>
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-bold mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
              </span>
              Built on Base Network · Live on Mainnet
              <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-1.5 py-0.5 rounded-full text-[9px] font-black tracking-wider">LIVE</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-[68px] font-black tracking-[-0.025em] text-white mb-6 leading-[1.05]">
              The Pro DEX
              <br />
              Built for{' '}
              <span className="text-gradient">Base Network</span>
            </h1>

            <p className="text-lg text-[#8890a8] mb-8 leading-relaxed max-w-lg">
              Trade ETH, cbBTC, SOL and more perpetual futures with up to{' '}
              <strong className="text-white font-bold">20× leverage</strong> — deep liquidity,
              sub-200ms execution, full self-custody. No KYC. Ever.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
              <Link
                href="/trade"
                className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-2xl shadow-blue-600/30 transition-all hover:shadow-blue-600/50 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Start Trading
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#how"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base border border-[#2a2a45] text-[#8890a8] hover:text-white hover:border-[#3a3a65] hover:bg-white/3 transition-all active:scale-[0.98]"
              >
                How It Works
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-3">
              {[
                { icon: <Shield size={13} />,     text: 'Non-custodial',     color: 'text-blue-400'    },
                { icon: <Zap size={13} />,        text: '< 200ms fills',     color: 'text-emerald-400' },
                { icon: <TrendingUp size={13} />, text: 'Up to 20× leverage', color: 'text-violet-400'  },
                { icon: <Layers size={13} />,     text: 'Base + ARB soon',   color: 'text-amber-400'   },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.07] rounded-full px-3 py-1.5 backdrop-blur-sm">
                  <span className={b.color}>{b.icon}</span>
                  <span className="text-[#8890a8] text-xs font-medium">{b.text}</span>
                </div>
              ))}
            </div>

            {/* Audit banner */}
            <div className="mt-8 inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-sm">
              <Shield size={15} className="text-emerald-400 shrink-0" />
              <span className="text-emerald-400 font-bold">Audited</span>
              <div className="w-px h-4 bg-emerald-500/25" />
              <span className="text-[#6a7090] text-xs">17 findings, all resolved</span>
              <Link href="/audit" className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition-colors shrink-0">
                View Report →
              </Link>
            </div>
          </div>

          {/* Right: trading UI mockup */}
          <div className="relative hidden lg:block">
            {/* Glow backdrop */}
            <div className="absolute inset-0 rounded-3xl blur-3xl bg-gradient-to-br from-blue-600/20 via-violet-600/15 to-emerald-600/10 scale-110" />

            <div className="relative rounded-2xl overflow-hidden border border-[#1a1a35] shadow-2xl shadow-black/80 bg-[#09091a]">
              {/* Top bar */}
              <div className="h-11 bg-[#0d0d22] border-b border-[#1a1a35] flex items-center px-4 gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                    <span className="text-white font-black text-[10px]">B</span>
                  </div>
                  <span className="text-[11px] text-white font-semibold">BaseDEX</span>
                  <span className="text-[#2a2e48] text-[10px] mx-1">·</span>
                  <span className="text-[11px] text-[#8890a8]">ETH-PERP</span>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-emerald-400 font-mono text-[12px] font-bold">$2,847.50</span>
                  <span className="text-emerald-400 text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">+3.21%</span>
                </div>
              </div>

              <div className="flex h-80">
                {/* Order book */}
                <div className="w-48 border-r border-[#1a1a35] p-3 flex flex-col">
                  <div className="text-[9px] text-[#2a2e48] uppercase font-bold tracking-widest mb-2">Order Book</div>
                  {[2854,2852,2850,2848,2846,2844,2842,2840].map((p, i) => (
                    <div key={i} className="relative flex justify-between text-[10px] py-[3px]">
                      <div className="absolute right-0 top-0 h-full bg-red-500/[0.08] rounded-l" style={{ width: `${72 - i * 7}%` }} />
                      <span className="text-red-400 font-mono z-10">{p.toFixed(2)}</span>
                      <span className="text-[#4a5068] font-mono z-10">{(1.4 - i * 0.12).toFixed(3)}</span>
                    </div>
                  ))}
                  <div className="text-center text-emerald-400 font-bold text-[12px] py-2 border-y border-[#1a1a35] my-1 bg-emerald-500/5">$2,847.50</div>
                  {[2845,2843,2841,2839,2837,2835,2833,2831].map((p, i) => (
                    <div key={i} className="relative flex justify-between text-[10px] py-[3px]">
                      <div className="absolute right-0 top-0 h-full bg-emerald-500/[0.08] rounded-l" style={{ width: `${25 + i * 8}%` }} />
                      <span className="text-emerald-400 font-mono z-10">{p.toFixed(2)}</span>
                      <span className="text-[#4a5068] font-mono z-10">{(0.7 + i * 0.1).toFixed(3)}</span>
                    </div>
                  ))}
                </div>

                {/* Chart area */}
                <div className="flex-1 p-4 flex flex-col bg-[#09091a]">
                  <div className="flex items-center gap-2 mb-3">
                    {['1m','5m','15m','1h','4h'].map((tf, i) => (
                      <span key={tf} className={`text-[10px] px-2 py-0.5 rounded font-bold ${i===1 ? 'text-white bg-[#111128] border border-[#2a2a55]' : 'text-[#4a5068]'}`}>{tf}</span>
                    ))}
                    <span className="ml-auto text-[10px] text-[#4a5068]">VOL 12,450 ETH</span>
                  </div>
                  <div className="flex-1 flex items-end gap-[2px] pb-2">
                    {[
                      [62,8,4,1],[68,6,3,1],[65,10,5,0],[72,7,3,1],[70,9,4,1],[78,5,3,1],[74,8,4,0],
                      [80,6,3,1],[76,9,4,1],[82,7,3,1],[79,8,4,0],[86,5,3,1],[82,9,4,1],[90,6,3,1],
                      [85,8,4,0],[92,7,3,1],[88,9,4,1],[95,5,3,1],[90,8,4,0],[98,6,3,1],[93,9,4,1],
                      [96,7,3,1],[100,5,3,1],[94,8,4,0],[97,6,3,1],[92,9,4,0],[99,5,3,1],[95,7,3,0],
                      [98,8,4,1],[100,6,3,1],
                    ].map(([h, wickTop, wickBot, green], i) => (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end gap-[1px]">
                        <div className="w-px rounded" style={{ height: `${wickTop}%`, background: green ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)' }} />
                        <div className="w-full rounded-sm" style={{ height: `${h * 0.38}%`, background: green ? 'rgba(16,185,129,0.7)' : 'rgba(239,68,68,0.7)' }} />
                        <div className="w-px rounded" style={{ height: `${wickBot}%`, background: green ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)' }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order form */}
                <div className="w-52 border-l border-[#1a1a35] p-4 flex flex-col gap-3 bg-[#09091a]">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="py-2.5 bg-emerald-500 rounded-xl text-[11px] font-black text-white text-center shadow-lg shadow-emerald-500/30">Long</div>
                    <div className="py-2.5 bg-[#0d0d22] border border-[#1a1a35] rounded-xl text-[11px] text-[#4a5068] text-center">Short</div>
                  </div>
                  {[['Price (USDC)', '$2,847.50'],['Amount (ETH)','0.500'],['Leverage','5×']].map(([l,v]) => (
                    <div key={l} className="bg-[#0d0d22] border border-[#1a1a35] rounded-xl px-3 py-2.5">
                      <div className="text-[9px] text-[#3a3e58] font-bold uppercase tracking-wide">{l}</div>
                      <div className="text-[12px] text-white font-mono font-semibold mt-0.5">{v}</div>
                    </div>
                  ))}
                  <div className="mt-auto space-y-1.5 text-[10px] bg-[#0d0d22] border border-[#1a1a35] rounded-xl p-2.5">
                    <div className="flex justify-between text-[#4a5068]">
                      <span>Margin</span><span className="text-white font-mono">$284.75</span>
                    </div>
                    <div className="flex justify-between text-[#4a5068]">
                      <span>Liq. Price</span><span className="text-amber-400 font-mono">$2,302.40</span>
                    </div>
                    <div className="flex justify-between text-[#4a5068]">
                      <span>Fee</span><span className="text-[#6a7090] font-mono">$0.85</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl py-3 text-[12px] font-black text-white text-center shadow-lg shadow-emerald-500/30">
                    Buy / Long ETH
                  </div>
                </div>
              </div>

              {/* Bottom status bar */}
              <div className="h-8 bg-[#0d0d22] border-t border-[#1a1a35] flex items-center px-4 gap-4 text-[9px] text-[#2a2e48]">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Connected to Base</span>
                <span>Gas: ~$0.001</span>
                <span className="ml-auto">Block: #27,451,982</span>
              </div>
            </div>

            {/* Floating stat chips */}
            <div className="absolute -top-4 -right-4 bg-[#0d0d22] border border-emerald-500/25 rounded-2xl px-4 py-2.5 shadow-xl shadow-emerald-500/10">
              <div className="text-emerald-400 font-black text-lg">+3.21%</div>
              <div className="text-[10px] text-[#4a5068]">24h change</div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-[#0d0d22] border border-blue-500/25 rounded-2xl px-4 py-2.5 shadow-xl shadow-blue-500/10">
              <div className="text-blue-400 font-black text-lg">$2,847</div>
              <div className="text-[10px] text-[#4a5068]">ETH price</div>
            </div>
          </div>
        </div>

        {/* ── Token showcase ───────────────────────────────────── */}
        <div className="mt-20 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2a2a55] to-transparent" />
          <p className="text-center text-xs text-[#2a2e48] font-bold uppercase tracking-widest mb-6 mt-8">Supported Assets</p>
          <div className="relative overflow-hidden rounded-2xl border border-[#1a1a35]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#05050f] via-transparent to-[#05050f] z-10 pointer-events-none" />
            <Image
              src="/images/tokens-showcase.png"
              alt="Supported trading assets: ETH, BTC, SOL, DOGE, AVAX, LINK, ARB, USDC"
              width={1200}
              height={300}
              className="w-full object-cover opacity-80"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
