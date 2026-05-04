import Link from 'next/link';

const STEPS = [
  {
    num:   '01',
    title: 'Connect Your Wallet',
    desc:  'Connect MetaMask, Coinbase Wallet, or any WalletConnect-compatible wallet. Switch to Base network — gas fees are near zero.',
    cta:   null,
  },
  {
    num:   '02',
    title: 'Deposit Collateral',
    desc:  'Deposit USDC into the non-custodial vault. Your funds are secured by smart contracts on Base — no counterparty risk.',
    cta:   null,
  },
  {
    num:   '03',
    title: 'Select a Market',
    desc:  'Choose from 7+ perpetual and spot markets. ETH, BTC, SOL, ARB, DOGE, AVAX, and LINK with deep order books.',
    cta:   null,
  },
  {
    num:   '04',
    title: 'Place Your Trade',
    desc:  'Set your leverage (up to 20×), enter price and size, sign the EIP-712 order with your wallet. Done. No gas needed for orders.',
    cta:   { label: 'Start Trading', href: '/trade' },
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
            Getting Started
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Trade in 4 Simple Steps
          </h2>
          <p className="text-[#6a6a8a] max-w-xl mx-auto">
            From wallet connection to your first trade in under 2 minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <div key={i} className="relative panel p-6">
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-10 -right-3 w-6 h-px bg-[#1e1e3a] z-10" />
              )}
              <div className="text-5xl font-black text-gradient-gold opacity-60 mb-4">{s.num}</div>
              <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-[#6a6a8a] text-sm leading-relaxed mb-4">{s.desc}</p>
              {s.cta && (
                <Link
                  href={s.cta.href}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {s.cta.label} →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
