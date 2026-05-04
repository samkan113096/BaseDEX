export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-[#08081a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
              Our Mission
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 leading-tight">
              Bringing CEX Performance to DeFi
            </h2>
            <p className="text-[#6a6a8a] leading-relaxed mb-4">
              BaseDEX was founded on the belief that traders shouldn't have to choose between performance and decentralization. Centralized exchanges offer speed and liquidity, but require you to surrender custody of your assets and expose yourself to counterparty risk.
            </p>
            <p className="text-[#6a6a8a] leading-relaxed mb-4">
              We built BaseDEX on Base — Coinbase's Ethereum L2 — to deliver sub-200ms order fills, institutional-grade liquidity, and a professional trading interface, all while keeping your funds fully in your control at all times.
            </p>
            <p className="text-[#6a6a8a] leading-relaxed mb-6">
              Our off-chain matching engine handles order routing at the speed of light, while on-chain smart contracts handle settlement, collateral, and liquidations. This hybrid approach gives you the best of both worlds.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '2024', label: 'Founded' },
                { value: 'Base', label: 'Chain' },
                { value: 'Open Source', label: 'Contracts' },
                { value: 'Multi-Chain', label: 'Roadmap' },
              ].map((i, idx) => (
                <div key={idx} className="panel p-4">
                  <div className="text-white font-black text-xl">{i.value}</div>
                  <div className="text-[#4a4a6a] text-xs mt-0.5">{i.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {[
              { title: 'Vision', text: 'To become the most liquid decentralized derivatives exchange across all EVM chains, enabling anyone with an internet connection to access professional-grade trading tools.' },
              { title: 'Technology', text: 'Built with a Rust-inspired off-chain matching engine, Solidity smart contracts, real-time WebSocket infrastructure, and Next.js for a seamless trading experience.' },
              { title: 'Security', text: 'Smart contracts audited by leading DeFi security firms. All code is open-source. Bug bounty program active with up to $100K in rewards.' },
              { title: 'Roadmap', text: 'Base → Arbitrum cross-chain trading, native token launch, governance DAO, mobile app, and institutional API access all on the horizon.' },
            ].map((item, i) => (
              <div key={i} className="panel p-5 hover:border-[#2a2a4a] transition-colors">
                <h3 className="text-white font-bold mb-1.5">{item.title}</h3>
                <p className="text-[#6a6a8a] text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
