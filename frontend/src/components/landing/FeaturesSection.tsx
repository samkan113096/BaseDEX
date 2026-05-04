import { Zap, Shield, BarChart3, Globe, Cpu, Lock } from 'lucide-react';

const FEATURES = [
  {
    icon:  <Zap className="w-6 h-6" />,
    color: 'blue',
    title: 'Sub-Second Execution',
    desc:  'Off-chain matching engine executes orders in under 200ms — as fast as Binance, with full DeFi self-custody.',
    stat:  '< 200ms',
    statLabel: 'median fill',
  },
  {
    icon:  <Shield className="w-6 h-6" />,
    color: 'emerald',
    title: 'Self-Custody Always',
    desc:  'Your USDC stays in audited smart contracts on Base. BaseDEX never holds your funds — not even for a second.',
    stat:  '100%',
    statLabel: 'non-custodial',
  },
  {
    icon:  <BarChart3 className="w-6 h-6" />,
    color: 'violet',
    title: 'Deep Liquidity',
    desc:  'Professional market makers provide tight spreads and deep order books across all markets, 24/7.',
    stat:  '0.02%',
    statLabel: 'typical spread',
  },
  {
    icon:  <Globe className="w-6 h-6" />,
    color: 'amber',
    title: 'Cross-Chain Ready',
    desc:  'Live on Base today. Expanding to Arbitrum in Q3 2026 with unified liquidity and shared positions.',
    stat:  '2 chains',
    statLabel: 'by Q3 2026',
  },
  {
    icon:  <Cpu className="w-6 h-6" />,
    color: 'cyan',
    title: 'Real-Time Oracle Feeds',
    desc:  'Pyth Network integration delivers manipulation-resistant prices from 30+ premium data sources, updated every 400ms.',
    stat:  '400ms',
    statLabel: 'oracle update',
  },
  {
    icon:  <Lock className="w-6 h-6" />,
    color: 'rose',
    title: 'Audited Contracts',
    desc:  'Vault, SpotEngine, and PerpEngine contracts are fully open-source on GitHub and verified on Basescan.',
    stat:  'Open',
    statLabel: 'source code',
  },
];

const COLOR_MAP = {
  blue:    { bg: 'bg-blue-500/8',    border: 'border-blue-500/15',    text: 'text-blue-400',    glow: 'group-hover:shadow-blue-500/10'    },
  emerald: { bg: 'bg-emerald-500/8', border: 'border-emerald-500/15', text: 'text-emerald-400', glow: 'group-hover:shadow-emerald-500/10' },
  violet:  { bg: 'bg-violet-500/8',  border: 'border-violet-500/15',  text: 'text-violet-400',  glow: 'group-hover:shadow-violet-500/10'  },
  amber:   { bg: 'bg-amber-500/8',   border: 'border-amber-500/15',   text: 'text-amber-400',   glow: 'group-hover:shadow-amber-500/10'   },
  cyan:    { bg: 'bg-cyan-500/8',    border: 'border-cyan-500/15',    text: 'text-cyan-400',    glow: 'group-hover:shadow-cyan-500/10'    },
  rose:    { bg: 'bg-rose-500/8',    border: 'border-rose-500/15',    text: 'text-rose-400',    glow: 'group-hover:shadow-rose-500/10'    },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-[#09091a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/8 border border-violet-500/15 text-violet-400 text-xs font-bold mb-4">
            Why BaseDEX
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
            Everything You Need to Trade Pro
          </h2>
          <p className="text-[#8890a8] max-w-xl mx-auto text-base leading-relaxed">
            We combined the performance of a CEX with the security of DeFi — and built it on Base for near-zero fees.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => {
            const c = COLOR_MAP[f.color as keyof typeof COLOR_MAP];
            return (
              <div
                key={i}
                className={`relative bg-[#0d0d22] border border-[#1a1a35] rounded-2xl p-6 transition-all duration-300 group hover:-translate-y-1 hover:border-[#2a2a45] shadow-xl ${c.glow} overflow-hidden`}
              >
                {/* Subtle hover gradient */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                     style={{ background: 'radial-gradient(ellipse at 30% 0%, rgba(59,130,246,0.04) 0%, transparent 70%)' }} />

                <div className="relative">
                  {/* Icon + stat */}
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-12 h-12 ${c.bg} ${c.border} border rounded-xl flex items-center justify-center ${c.text} group-hover:scale-110 transition-transform duration-300`}>
                      {f.icon}
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-black ${c.text}`}>{f.stat}</div>
                      <div className="text-[10px] text-[#2a2e48] font-semibold uppercase tracking-wide">{f.statLabel}</div>
                    </div>
                  </div>

                  <h3 className="text-white font-bold text-[17px] mb-2 leading-tight">{f.title}</h3>
                  <p className="text-[#8890a8] text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
