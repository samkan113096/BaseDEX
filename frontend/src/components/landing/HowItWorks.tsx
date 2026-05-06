import Link from 'next/link';
import { Wallet, ArrowDownToLine, BarChart2, TrendingUp, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    num:   '01',
    icon:  <Wallet className="w-6 h-6" />,
    color: 'blue',
    title: 'Connect Your Wallet',
    desc:  'Connect MetaMask, Coinbase Wallet, or any WalletConnect-compatible wallet. Switch to Base network — gas is near zero.',
  },
  {
    num:   '02',
    icon:  <ArrowDownToLine className="w-6 h-6" />,
    color: 'violet',
    title: 'Deposit Collateral',
    desc:  'Deposit USDC into the non-custodial vault. Funds are secured by smart contracts on Base — no counterparty risk.',
  },
  {
    num:   '03',
    icon:  <BarChart2 className="w-6 h-6" />,
    color: 'emerald',
    title: 'Select a Market',
    desc:  'Choose from 11 perpetual and spot markets — ETH, BTC, SOL, DOGE, AVAX, LINK, ARB and more with deep order books.',
  },
  {
    num:   '04',
    icon:  <TrendingUp className="w-6 h-6" />,
    color: 'amber',
    title: 'Place Your Trade',
    desc:  'Set leverage (up to 20×), enter price and size, sign with your wallet. Orders fill in < 200ms. No gas for orders.',
    cta:   { label: 'Start Trading', href: '/trade' },
  },
];

const COLOR = {
  blue:    { bg: 'bg-blue-500/12',    border: 'border-blue-500/30',    text: 'text-blue-400',    num: 'from-blue-400 to-cyan-400',    glow: 'shadow-blue-500/15'    },
  violet:  { bg: 'bg-violet-500/12',  border: 'border-violet-500/30',  text: 'text-violet-400',  num: 'from-violet-400 to-purple-400', glow: 'shadow-violet-500/15'  },
  emerald: { bg: 'bg-emerald-500/12', border: 'border-emerald-500/30', text: 'text-emerald-400', num: 'from-emerald-400 to-teal-400',  glow: 'shadow-emerald-500/15' },
  amber:   { bg: 'bg-amber-500/12',   border: 'border-amber-500/30',   text: 'text-amber-400',   num: 'from-amber-400 to-orange-400', glow: 'shadow-amber-500/15'   },
};

export function HowItWorks() {
  return (
    <section id="how" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#07071a]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2a2a55] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#2a2a55] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-wider mb-6">
            Getting Started
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 tracking-tight">
            Trade in{' '}
            <span className="text-gradient">4 Simple Steps</span>
          </h2>
          <p className="text-[#8890a8] max-w-xl mx-auto text-lg">
            From wallet connection to your first trade in under 2 minutes.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-blue-500/30 via-violet-500/30 via-emerald-500/30 to-amber-500/30" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((s, i) => {
              const c = COLOR[s.color as keyof typeof COLOR];
              return (
                <div
                  key={i}
                  className={`relative bg-[#0d0d22] border border-[#1a1a35] hover:${c.border} rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 shadow-xl ${c.glow} group`}
                >
                  {/* Arrow connector (between cards on desktop) */}
                  {i < STEPS.length - 1 && (
                    <div className="hidden lg:flex absolute -right-3 top-11 z-20 items-center justify-center w-6 h-6 rounded-full bg-[#0d0d22] border border-[#1a1a35]">
                      <ArrowRight size={10} className="text-[#3a3e58]" />
                    </div>
                  )}

                  {/* Step number + icon */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-12 h-12 ${c.bg} ${c.border} border rounded-2xl flex items-center justify-center ${c.text} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {s.icon}
                    </div>
                    <div className={`text-3xl font-black bg-gradient-to-r ${c.num} bg-clip-text text-transparent opacity-70`}>
                      {s.num}
                    </div>
                  </div>

                  <h3 className="text-white font-black text-lg mb-3 leading-tight">{s.title}</h3>
                  <p className="text-[#7a8098] text-sm leading-relaxed">{s.desc}</p>

                  {s.cta && (
                    <Link
                      href={s.cta.href}
                      className="inline-flex items-center gap-1.5 mt-5 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors group/link"
                    >
                      {s.cta.label}
                      <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-[#0d0d22] border border-[#1a1a35] rounded-3xl p-6 sm:p-8">
            <div className="text-left">
              <div className="text-white font-black text-lg">Ready to trade?</div>
              <div className="text-[#6a7090] text-sm">Connect your wallet and start in 60 seconds.</div>
            </div>
            <Link
              href="/trade"
              className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-xl shadow-blue-600/20 hover:-translate-y-0.5 transition-all"
            >
              Launch App <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
