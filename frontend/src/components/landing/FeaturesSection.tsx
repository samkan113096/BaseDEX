'use client';

import { Zap, Shield, BarChart3, Globe, Cpu, Lock } from 'lucide-react';

const FEATURES = [
  {
    Icon:      Zap,
    color:     'blue',
    title:     'Sub-Second Execution',
    desc:      'Off-chain matching engine fills orders in under 200ms — as fast as Binance, with full DeFi self-custody on Base.',
    stat:      '< 200ms',
    statLabel: 'median fill',
    gradient:  'from-blue-600/15 to-cyan-600/8',
    glow:      'rgba(59,130,246,0.15)',
  },
  {
    Icon:      Shield,
    color:     'emerald',
    title:     'Self-Custody Always',
    desc:      'Your USDC stays in audited smart contracts. BaseDEX never holds your funds — not even for a millisecond.',
    stat:      '100%',
    statLabel: 'non-custodial',
    gradient:  'from-emerald-600/15 to-teal-600/8',
    glow:      'rgba(16,185,129,0.15)',
  },
  {
    Icon:      BarChart3,
    color:     'violet',
    title:     'Deep Liquidity',
    desc:      'Professional market makers provide tight spreads across all markets, 24/7, with deep price-level order books.',
    stat:      '0.02%',
    statLabel: 'typical spread',
    gradient:  'from-violet-600/15 to-purple-600/8',
    glow:      'rgba(139,92,246,0.15)',
  },
  {
    Icon:      Globe,
    color:     'amber',
    title:     'Cross-Chain Ready',
    desc:      'Live on Base today. Expanding to Arbitrum in Q3 2026 with unified liquidity and shared margin positions.',
    stat:      'Q3 2026',
    statLabel: 'Arbitrum launch',
    gradient:  'from-amber-600/15 to-orange-600/8',
    glow:      'rgba(245,158,11,0.15)',
  },
  {
    Icon:      Cpu,
    color:     'cyan',
    title:     'Real-Time Oracle Feeds',
    desc:      'Manipulation-resistant prices from aggregated data sources, updated every 400ms via on-chain price contracts.',
    stat:      '400ms',
    statLabel: 'oracle update',
    gradient:  'from-cyan-600/15 to-sky-600/8',
    glow:      'rgba(6,182,212,0.15)',
  },
  {
    Icon:      Lock,
    color:     'rose',
    title:     'Audited Contracts',
    desc:      'Vault, SpotEngine, and PerpEngine are fully open-source, verified on Basescan, and independently audited.',
    stat:      'Open',
    statLabel: 'source + audited',
    gradient:  'from-rose-600/15 to-pink-600/8',
    glow:      'rgba(244,63,94,0.15)',
  },
];

const COLOR: Record<string, { bg: string; border: string; text: string; val: string; ring: string }> = {
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/25',    text: 'text-blue-400',    val: 'text-blue-300',    ring: '#3b82f6' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', text: 'text-emerald-400', val: 'text-emerald-300', ring: '#10b981' },
  violet:  { bg: 'bg-violet-500/10',  border: 'border-violet-500/25',  text: 'text-violet-400',  val: 'text-violet-300',  ring: '#8b5cf6' },
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/25',   text: 'text-amber-400',   val: 'text-amber-300',   ring: '#f59e0b' },
  cyan:    { bg: 'bg-cyan-500/10',    border: 'border-cyan-500/25',    text: 'text-cyan-400',    val: 'text-cyan-300',    ring: '#06b6d4' },
  rose:    { bg: 'bg-rose-500/10',    border: 'border-rose-500/25',    text: 'text-rose-400',    val: 'text-rose-300',    ring: '#f43f5e' },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#07071a]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2a2a55] to-transparent" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-[220px] opacity-8"
        style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-black uppercase tracking-wider mb-6">
            Why BaseDEX
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 tracking-tight">
            Everything You Need to{' '}
            <span className="text-gradient-static">Trade Pro</span>
          </h2>
          <p className="text-[#8890a8] max-w-2xl mx-auto text-lg leading-relaxed">
            CEX-level performance with DeFi security — built on Base for near-zero gas fees.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => {
            const c = COLOR[f.color];
            return (
              <div
                key={i}
                className="relative bg-[#0b0b1e] border border-[#1a1a35] hover:border-[#2a2a45] rounded-2xl p-7 transition-all duration-300 group hover:-translate-y-1.5 overflow-hidden cursor-default"
                style={{ boxShadow: `0 0 0 0 ${c.ring}00` }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 8px 40px ${f.glow}, 0 0 0 1px ${c.ring}20`)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 0 0 ${c.ring}00`)}
              >
                {/* Card gradient bg */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                {/* Top accent */}
                <div className={`absolute inset-x-0 top-0 h-[1px] ${c.bg} opacity-0 group-hover:opacity-100 transition-all duration-300`}
                     style={{ background: `linear-gradient(90deg, transparent, ${c.ring}60, transparent)` }}
                />
                {/* Corner number */}
                <div className="absolute top-4 right-4 text-[10px] font-black text-[#1e1e38] select-none">
                  0{i + 1}
                </div>

                <div className="relative">
                  {/* Icon + stat row */}
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`w-14 h-14 ${c.bg} ${c.border} border rounded-2xl flex items-center justify-center ${c.text} group-hover:scale-110 transition-transform duration-300`}
                      style={{ boxShadow: `0 0 20px ${f.glow}` }}
                    >
                      <f.Icon className="w-7 h-7" />
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-black ${c.val}`}>{f.stat}</div>
                      <div className="text-[10px] text-[#3a3e58] font-bold uppercase tracking-widest mt-0.5">{f.statLabel}</div>
                    </div>
                  </div>
                  <h3 className="text-white font-black text-lg mb-3 leading-tight">{f.title}</h3>
                  <p className="text-[#7a8098] text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
