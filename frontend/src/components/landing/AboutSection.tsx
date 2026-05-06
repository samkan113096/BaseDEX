'use client';

import { Shield, Zap, Globe, Code2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const CARDS = [
  {
    icon: <Shield className="w-5 h-5" />,
    color: 'blue',
    title: 'Vision',
    text: 'To become the most liquid decentralized derivatives exchange across all EVM chains, enabling anyone with an internet connection to access professional-grade trading tools.',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    color: 'violet',
    title: 'Technology',
    text: 'Built with a Rust-inspired off-chain matching engine, Solidity smart contracts, real-time WebSocket infrastructure, and Next.js for a seamless trading experience.',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    color: 'emerald',
    title: 'Security',
    text: 'Smart contracts audited by leading DeFi security firms. All code is open-source. Bug bounty program active with up to $100K in rewards.',
  },
  {
    icon: <Globe className="w-5 h-5" />,
    color: 'amber',
    title: 'Roadmap',
    text: 'Base → Arbitrum cross-chain trading, native token launch, governance DAO, mobile app, and institutional API access — all on the horizon.',
  },
];

const COLOR = {
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    text: 'text-blue-400'    },
  violet:  { bg: 'bg-violet-500/10',  border: 'border-violet-500/20',  text: 'text-violet-400'  },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   text: 'text-amber-400'   },
};

const STATS = [
  { value: '2024',        label: 'Founded'         },
  { value: 'Base',        label: 'Primary Chain'   },
  { value: 'Open Source', label: 'Smart Contracts' },
  { value: 'Multi-Chain', label: 'Roadmap'         },
];

export function AboutSection() {
  return (
    <section id="about" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#05050f]" />
      {/* Background accent */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[160px] opacity-10"
           style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }} />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] opacity-8"
           style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left column */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider mb-8">
              Our Mission
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-8 leading-tight">
              Bringing CEX Performance
              <br />
              <span className="text-gradient">to DeFi</span>
            </h2>

            <div className="space-y-4 mb-10">
              <p className="text-[#7a8098] leading-relaxed">
                BaseDEX was founded on the belief that traders shouldn&apos;t have to choose between performance and decentralization. CEXs offer speed and liquidity, but require you to surrender custody of your assets and expose yourself to counterparty risk.
              </p>
              <p className="text-[#7a8098] leading-relaxed">
                We built BaseDEX on Base — Coinbase&apos;s Ethereum L2 — to deliver sub-200ms order fills, institutional-grade liquidity, and a professional trading interface, all while keeping your funds fully in your control.
              </p>
              <p className="text-[#7a8098] leading-relaxed">
                Our hybrid architecture: off-chain matching for speed + on-chain settlement for security. The best of both worlds.
              </p>
            </div>

            {/* Stat grid */}
            <div className="grid grid-cols-2 gap-3 mb-10">
              {STATS.map((s, i) => (
                <div key={i} className="bg-[#0d0d22] border border-[#1a1a35] rounded-2xl p-5 hover:border-[#2a2a45] transition-colors group">
                  <div className="text-white font-black text-xl mb-1 group-hover:text-blue-400 transition-colors">{s.value}</div>
                  <div className="text-[#4a5068] text-xs font-semibold uppercase tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>

            <Link
              href="/trade"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-xl shadow-blue-600/20 hover:-translate-y-0.5 hover:shadow-blue-600/35 transition-all"
            >
              Start Trading <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right column — info cards */}
          <div className="space-y-4">
            {CARDS.map((card, i) => {
              const c = COLOR[card.color as keyof typeof COLOR];
              return (
                <div key={i} className="bg-[#0d0d22] border border-[#1a1a35] rounded-2xl p-6 hover:border-[#2a2a45] transition-all group hover:-translate-y-0.5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 ${c.bg} ${c.border} border rounded-xl flex items-center justify-center ${c.text} shrink-0`}>
                      {card.icon}
                    </div>
                    <h3 className="text-white font-black text-base">{card.title}</h3>
                  </div>
                  <p className="text-[#7a8098] text-sm leading-relaxed">{card.text}</p>
                </div>
              );
            })}

            {/* CEX vs DEX comparison */}
            <div className="bg-[#0d0d22] border border-[#1a1a35] rounded-2xl p-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full" />
              <h3 className="text-white font-black text-base mb-4 flex items-center gap-2">
                <Code2 size={16} className="text-blue-400" />
                BaseDEX vs CEX
              </h3>
              <div className="space-y-2">
                {[
                  ['Self-Custody',    true,  false],
                  ['No KYC',         true,  false],
                  ['Open Source',    true,  false],
                  ['< 200ms Fills',  true,  true ],
                  ['20× Leverage',   true,  true ],
                  ['No Counterparty Risk', true, false],
                ].map(([label, dex, cex], i) => (
                  <div key={i} className="grid grid-cols-3 text-sm">
                    <span className="text-[#6a7090] text-xs font-medium">{label as string}</span>
                    <span className={`text-center text-xs font-bold ${dex ? 'text-emerald-400' : 'text-red-400'}`}>{dex ? '✓ BaseDEX' : '✗'}</span>
                    <span className={`text-center text-xs font-bold ${cex ? 'text-emerald-400' : 'text-red-400'}`}>{cex ? '✓ CEX' : '✗ CEX'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
