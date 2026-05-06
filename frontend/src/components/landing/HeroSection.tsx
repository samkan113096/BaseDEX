'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, TrendingUp, Layers, CheckCircle } from 'lucide-react';

const TRUST_BADGES = [
  { icon: <Shield   size={13} />, text: 'Non-custodial',      iconColor: '#60a5fa', bg: 'rgba(59,130,246,0.10)',  border: 'rgba(59,130,246,0.25)'  },
  { icon: <Zap      size={13} />, text: '< 200ms fills',      iconColor: '#34d399', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.25)' },
  { icon: <TrendingUp size={13}/>, text: 'Up to 20× leverage', iconColor: '#a78bfa', bg: 'rgba(139,92,246,0.10)', border: 'rgba(139,92,246,0.25)' },
  { icon: <Layers   size={13} />, text: 'Base + ARB soon',    iconColor: '#fbbf24', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.25)'  },
  { icon: <CheckCircle size={13}/>, text: 'Audited contracts', iconColor: '#22d3ee', bg: 'rgba(6,182,212,0.10)',   border: 'rgba(6,182,212,0.25)'   },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-[100px] overflow-hidden">

      {/* ── Backgrounds ─────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Base image */}
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-25"
          sizes="100vw"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05050f]/80 via-[#05050f]/55 to-[#05050f]" />
        {/* Hero grid */}
        <div className="absolute inset-0 hero-grid opacity-80" />
        {/* Ambient orbs */}
        <div
          className="absolute top-[10%] left-[5%] w-[700px] h-[700px] rounded-full blur-[160px] opacity-20"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-[20%] right-[5%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-15"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[15%] left-[30%] w-[500px] h-[500px] rounded-full blur-[130px] opacity-12"
          style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }}
        />
        {/* Fade bottom */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#05050f] to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">

        {/* ── Two-column layout ───────────────────────────────── */}
        <div className="grid lg:grid-cols-[1fr_480px] gap-16 items-center">

          {/* ── Left: copy ─────────────────────────────────────── */}
          <div className="fade-in-up">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-bold mb-8 shadow-lg shadow-blue-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
              </span>
              Built on Base Network
              <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider">LIVE</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-black tracking-[-0.03em] text-white mb-6 leading-[1.02]">
              Trade Crypto{' '}
              <br className="hidden sm:block" />
              Like a{' '}
              <span className="text-gradient">Pro</span>
            </h1>

            <p className="text-lg text-[#8890a8] mb-10 leading-relaxed max-w-[480px]">
              Perpetual futures and spot markets on Base — up to{' '}
              <strong className="text-white font-bold">20× leverage</strong>, sub-200ms execution,
              full self-custody. No KYC. No intermediaries. Ever.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-10 fade-in-up fade-in-up-2">
              <Link
                href="/trade"
                className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-2xl shadow-blue-600/30 transition-all hover:shadow-blue-600/50 hover:-translate-y-0.5 active:scale-[0.98] overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                <Zap size={18} className="shrink-0" />
                Start Trading
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#how"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base border border-[#252545] text-[#8890a8] hover:text-white hover:border-[#3a3a65] hover:bg-white/[0.03] transition-all active:scale-[0.98]"
              >
                How It Works
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-2 fade-in-up fade-in-up-3">
              {TRUST_BADGES.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5"
                  style={{
                    background: b.bg,
                    border: `1px solid ${b.border}`,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <span style={{ color: b.iconColor }}>{b.icon}</span>
                  <span style={{ color: '#a0a8c0', fontSize: 12, fontWeight: 500 }}>{b.text}</span>
                </div>
              ))}
            </div>

            {/* Audit banner */}
            <div className="mt-8 inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/20 text-sm shadow-lg shadow-emerald-500/5 fade-in-up fade-in-up-4">
              <Shield size={15} className="text-emerald-400 shrink-0" />
              <span className="text-emerald-400 font-bold">Audited</span>
              <div className="w-px h-4 bg-emerald-500/25" />
              <span className="text-[#5a6080] text-xs">17 findings resolved</span>
              <Link href="/audit" className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition-colors shrink-0 ml-auto">
                View Report →
              </Link>
            </div>
          </div>

          {/* ── Right: trading UI mockup ─────────────────────── */}
          <div className="relative hidden lg:block fade-in-up fade-in-up-2">
            {/* Ambient glow behind the card */}
            <div className="absolute inset-0 rounded-3xl blur-3xl bg-gradient-to-br from-blue-600/20 via-violet-600/15 to-emerald-600/10 scale-110 animate-glow-pulse" />

            <div className="relative rounded-2xl overflow-hidden border border-[#1f1f40] shadow-[0_32px_80px_rgba(0,0,0,.8)] bg-[#09091a]">
              {/* Top bar */}
              <div className="h-12 bg-[#0d0d22] border-b border-[#1a1a35] flex items-center px-4 gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md shadow-blue-500/30">
                    <span className="text-white font-black text-[10px]">B</span>
                  </div>
                  <span className="text-[11px] text-white font-bold">BaseDEX</span>
                  <span className="text-[#2a2e48] mx-0.5">·</span>
                  <span className="text-[11px] text-[#6a7090]">ETH-PERP</span>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-emerald-400 font-mono text-[13px] font-bold">$2,847.50</span>
                  <span className="text-emerald-400 text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">+3.21%</span>
                </div>
              </div>

              <div className="flex h-[300px]">
                {/* Order book column */}
                <div className="w-44 border-r border-[#1a1a35] p-3 flex flex-col">
                  <div className="text-[9px] text-[#3a3e58] uppercase font-bold tracking-widest mb-2">Order Book</div>
                  {[2854,2852,2850,2848,2846].map((p, i) => (
                    <div key={i} className="relative flex justify-between text-[10px] py-[3.5px]">
                      <div className="absolute right-0 top-0 h-full bg-red-500/[0.10] rounded-l" style={{ width: `${75 - i * 10}%` }} />
                      <span className="text-red-400 font-mono z-10">{p.toFixed(2)}</span>
                      <span className="text-[#4a5068] font-mono z-10">{(1.4 - i * 0.18).toFixed(3)}</span>
                    </div>
                  ))}
                  <div className="text-center text-emerald-400 font-bold text-[12px] py-2 border-y border-[#1a1a35] my-1 bg-emerald-500/[0.04]">
                    $2,847.50
                  </div>
                  {[2845,2843,2841,2839,2837].map((p, i) => (
                    <div key={i} className="relative flex justify-between text-[10px] py-[3.5px]">
                      <div className="absolute right-0 top-0 h-full bg-emerald-500/[0.10] rounded-l" style={{ width: `${20 + i * 12}%` }} />
                      <span className="text-emerald-400 font-mono z-10">{p.toFixed(2)}</span>
                      <span className="text-[#4a5068] font-mono z-10">{(0.6 + i * 0.12).toFixed(3)}</span>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div className="flex-1 flex flex-col bg-[#07071a]">
                  <div className="flex items-center gap-1.5 px-3 pt-2.5 pb-1.5">
                    {['1m','5m','15m','1h','4h'].map((tf, i) => (
                      <span key={tf} className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        i === 1
                          ? 'text-blue-400 bg-[#111128] border border-blue-500/20'
                          : 'text-[#3a3e58] hover:text-[#6a6e88]'
                      }`}>{tf}</span>
                    ))}
                    <span className="ml-auto text-[9px] text-[#3a3e58] font-mono">VOL 12,450</span>
                  </div>
                  {/* Candles */}
                  <div className="flex-1 flex items-end gap-[2px] pb-2 px-3">
                    {[
                      [55,8,4,0],[60,6,3,1],[58,9,5,0],[65,7,3,1],[63,9,4,1],[70,5,3,1],[67,8,4,0],
                      [73,6,3,1],[69,9,4,1],[75,7,3,1],[72,8,4,0],[80,5,3,1],[76,9,4,1],[84,6,3,1],
                      [79,8,4,0],[87,7,3,1],[83,9,4,1],[91,5,3,1],[86,8,4,0],[94,6,3,1],[88,9,4,1],
                      [91,7,3,1],[96,5,3,1],[89,8,4,0],[93,6,3,1],[87,9,4,0],[95,5,3,1],[91,7,3,0],
                      [94,8,4,1],[97,6,3,1],
                    ].map(([h, wt, wb, green], i) => (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end gap-[1px]">
                        <div className="w-px" style={{ height: `${wt * 1.2}%`, background: green ? 'rgba(16,185,129,0.6)' : 'rgba(239,68,68,0.6)' }} />
                        <div className="w-full rounded-sm" style={{ height: `${h * 0.4}%`, background: green ? 'rgba(16,185,129,0.75)' : 'rgba(239,68,68,0.75)', minHeight: 2 }} />
                        <div className="w-px" style={{ height: `${wb * 1.2}%`, background: green ? 'rgba(16,185,129,0.6)' : 'rgba(239,68,68,0.6)' }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order form */}
                <div className="w-44 border-l border-[#1a1a35] p-3 flex flex-col gap-2.5 bg-[#09091a]">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="py-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-[11px] font-black text-white text-center shadow-md shadow-emerald-500/25">Long</div>
                    <div className="py-2 bg-[#0d0d22] border border-[#1a1a35] rounded-xl text-[11px] text-[#4a5068] text-center">Short</div>
                  </div>
                  {[['Price','$2,847.50'],['Amount','0.500 ETH'],['Leverage','5×']].map(([l,v]) => (
                    <div key={l} className="bg-[#0d0d22] border border-[#1a1a35] rounded-xl px-3 py-2">
                      <div className="text-[9px] text-[#3a3e58] font-bold uppercase tracking-wide">{l}</div>
                      <div className="text-[12px] text-white font-mono font-semibold">{v}</div>
                    </div>
                  ))}
                  <div className="mt-auto bg-[#0d0d22] border border-[#1a1a35] rounded-xl p-2 space-y-1.5 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-[#3a3e58]">Margin</span><span className="text-white font-mono">$284.75</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#3a3e58]">Liq. Price</span><span className="text-amber-400 font-mono">$2,302</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl py-2.5 text-[11px] font-black text-white text-center shadow-md shadow-emerald-500/25">
                    Buy / Long ETH
                  </div>
                </div>
              </div>

              {/* Status bar */}
              <div className="h-7 bg-[#0d0d22] border-t border-[#1a1a35] flex items-center px-4 gap-4 text-[9px] text-[#2a2e48]">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-semibold">Connected · Base Sepolia</span>
                </span>
                <span className="ml-auto font-mono">Gas: ~$0.001</span>
              </div>
            </div>

            {/* Floating chips */}
            <div className="absolute -top-5 -right-5 bg-[#0d0d22] border border-emerald-500/30 rounded-2xl px-4 py-3 shadow-2xl shadow-emerald-500/10 animate-float backdrop-blur-sm">
              <div className="text-emerald-400 font-black text-xl leading-none">+3.21%</div>
              <div className="text-[10px] text-[#4a5068] mt-0.5">24h return</div>
            </div>
            <div className="absolute -bottom-5 -left-5 bg-[#0d0d22] border border-blue-500/30 rounded-2xl px-4 py-3 shadow-2xl shadow-blue-500/10 animate-float-slow backdrop-blur-sm">
              <div className="text-blue-400 font-black text-xl leading-none">$2,847</div>
              <div className="text-[10px] text-[#4a5068] mt-0.5">ETH mark price</div>
            </div>
            <div className="absolute top-1/2 -right-8 -translate-y-1/2 bg-[#0d0d22] border border-violet-500/25 rounded-xl px-3 py-2 shadow-xl shadow-violet-500/5 backdrop-blur-sm">
              <div className="text-violet-400 font-black text-base leading-none">20×</div>
              <div className="text-[9px] text-[#4a5068] mt-0.5">leverage</div>
            </div>
          </div>
        </div>

        {/* ── Token showcase ──────────────────────────────────── */}
        <div className="mt-24 relative fade-in-up fade-in-up-5">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2a2a55] to-transparent" />
          <p className="text-center text-[10px] text-[#2a2e48] font-bold uppercase tracking-[0.2em] mb-6 mt-10">
            Supported Assets
          </p>
          <div className="relative overflow-hidden rounded-2xl border border-[#1a1a35]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#05050f] via-transparent to-[#05050f] z-10 pointer-events-none" />
            <Image
              src="/images/tokens-showcase.png"
              alt="Supported trading assets"
              width={1200}
              height={300}
              className="w-full object-cover opacity-75"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
