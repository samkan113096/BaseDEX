import Image from 'next/image';
import { Zap, Shield, BarChart3, Globe, Cpu, Lock } from 'lucide-react';

const FEATURES = [
  {
    icon:      <Zap className="w-7 h-7" />,
    color:     'blue',
    title:     'Sub-Second Execution',
    desc:      'Off-chain matching engine fills orders in under 200ms — as fast as Binance, with full DeFi self-custody.',
    stat:      '< 200ms',
    statLabel: 'median fill',
    gradient:  'from-blue-600/20 to-cyan-600/10',
    border:    'hover:border-blue-500/40',
  },
  {
    icon:      <Shield className="w-7 h-7" />,
    color:     'emerald',
    title:     'Self-Custody Always',
    desc:      'Your USDC stays in audited smart contracts on Base. BaseDEX never holds your funds — not even for a second.',
    stat:      '100%',
    statLabel: 'non-custodial',
    gradient:  'from-emerald-600/20 to-teal-600/10',
    border:    'hover:border-emerald-500/40',
  },
  {
    icon:      <BarChart3 className="w-7 h-7" />,
    color:     'violet',
    title:     'Deep Liquidity',
    desc:      'Professional market makers provide tight spreads across all markets, 24/7, with deep order books.',
    stat:      '0.02%',
    statLabel: 'typical spread',
    gradient:  'from-violet-600/20 to-purple-600/10',
    border:    'hover:border-violet-500/40',
  },
  {
    icon:      <Globe className="w-7 h-7" />,
    color:     'amber',
    title:     'Cross-Chain Ready',
    desc:      'Live on Base today. Expanding to Arbitrum in Q3 2026 with unified liquidity and shared positions.',
    stat:      '2 chains',
    statLabel: 'by Q3 2026',
    gradient:  'from-amber-600/20 to-orange-600/10',
    border:    'hover:border-amber-500/40',
  },
  {
    icon:      <Cpu className="w-7 h-7" />,
    color:     'cyan',
    title:     'Real-Time Oracle Feeds',
    desc:      'Manipulation-resistant prices from 30+ premium data sources, updated every 400ms.',
    stat:      '400ms',
    statLabel: 'oracle update',
    gradient:  'from-cyan-600/20 to-sky-600/10',
    border:    'hover:border-cyan-500/40',
  },
  {
    icon:      <Lock className="w-7 h-7" />,
    color:     'rose',
    title:     'Audited Contracts',
    desc:      'Vault, SpotEngine, and PerpEngine are fully open-source, verified on Basescan, and audited.',
    stat:      'Open',
    statLabel: 'source code',
    gradient:  'from-rose-600/20 to-pink-600/10',
    border:    'hover:border-rose-500/40',
  },
];

const COLOR = {
  blue:    { bg: 'bg-blue-500/12',    border: 'border-blue-500/25',    text: 'text-blue-400',    val: 'text-blue-300'    },
  emerald: { bg: 'bg-emerald-500/12', border: 'border-emerald-500/25', text: 'text-emerald-400', val: 'text-emerald-300' },
  violet:  { bg: 'bg-violet-500/12',  border: 'border-violet-500/25',  text: 'text-violet-400',  val: 'text-violet-300'  },
  amber:   { bg: 'bg-amber-500/12',   border: 'border-amber-500/25',   text: 'text-amber-400',   val: 'text-amber-300'   },
  cyan:    { bg: 'bg-cyan-500/12',    border: 'border-cyan-500/25',    text: 'text-cyan-400',    val: 'text-cyan-300'    },
  rose:    { bg: 'bg-rose-500/12',    border: 'border-rose-500/25',    text: 'text-rose-400',    val: 'text-rose-300'    },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#07071a]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2a2a55] to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[200px] opacity-10"
           style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-black mb-6 uppercase tracking-wider">
            Why BaseDEX
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 tracking-tight">
            Everything You Need to{' '}
            <span className="text-gradient">Trade Pro</span>
          </h2>
          <p className="text-[#8890a8] max-w-2xl mx-auto text-lg leading-relaxed">
            We combined the performance of a CEX with the security of DeFi — built on Base for near-zero fees.
          </p>
        </div>

        {/* Feature icons banner */}
        <div className="relative mb-16 rounded-2xl overflow-hidden border border-[#1a1a35] shadow-2xl shadow-black/40">
          <div className="absolute inset-0 bg-gradient-to-r from-[#07071a]/80 via-transparent to-[#07071a]/80 z-10 pointer-events-none" />
          <div className="absolute inset-y-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent z-20" />
          <Image
            src="/images/feature-icons.png"
            alt="BaseDEX features: sub-second execution, self-custody, deep liquidity, cross-chain, oracle feeds, audited contracts"
            width={1200}
            height={500}
            className="w-full object-cover"
          />
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => {
            const c = COLOR[f.color as keyof typeof COLOR];
            return (
              <div
                key={i}
                className={`relative bg-[#0d0d22] border border-[#1a1a35] ${f.border} rounded-2xl p-7 transition-all duration-300 group hover:-translate-y-1 shadow-xl overflow-hidden cursor-default`}
              >
                {/* Card gradient background */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                {/* Top accent line */}
                <div className={`absolute inset-x-0 top-0 h-[2px] rounded-t-2xl ${c.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="relative">
                  {/* Icon + stat */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 ${c.bg} ${c.border} border rounded-2xl flex items-center justify-center ${c.text} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {f.icon}
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
