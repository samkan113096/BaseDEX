'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  { q: 'What is BaseDEX?', a: 'BaseDEX is a decentralized perpetual futures and spot exchange built on Base network. It uses an off-chain matching engine for fast order execution and on-chain smart contracts for trustless settlement — no KYC, self-custody of funds.' },
  { q: 'Is BaseDEX safe? Are my funds secure?', a: 'Your USDC collateral is held in an audited, non-custodial smart contract on Base. BaseDEX never has access to your funds. Even if our servers went offline, you could withdraw directly from the smart contract. We use EIP-712 signed orders so only your wallet can authorize trades.' },
  { q: 'Do I need to complete KYC?', a: 'No. BaseDEX is permissionless — just connect your wallet and trade. No account creation, no identity verification, no restrictions based on geography (subject to applicable laws in your jurisdiction).' },
  { q: 'What is the maximum leverage available?', a: 'BaseDEX offers up to 20× leverage on all perpetual futures markets. We recommend starting with 2×–5× leverage until you understand the mechanics of liquidation and funding rates.' },
  { q: 'How are my orders matched?', a: 'Orders are matched off-chain by our high-performance matching engine using price-time priority (FIFO). When two orders match, the engine submits a settlement transaction on-chain. This gives CEX-level speed (~200ms fills) while ensuring on-chain settlement.' },
  { q: 'What tokens can I use as collateral?', a: 'Currently BaseDEX uses USDC as the sole collateral. USDC is Circle\'s native stablecoin on Base — no bridge risk, fully backed by USD reserves. Future plans include cbBTC, cbETH, and other Base-native assets.' },
  { q: 'What are the trading fees?', a: 'Taker fee: 0.05% per trade. Maker rebate: -0.02% (you earn money by adding liquidity with limit orders). These are among the lowest fees in DeFi derivatives.' },
  { q: 'What is a funding rate?', a: 'Funding rates are periodic payments between longs and shorts that keep the perpetual price close to the spot price. If longs outnumber shorts, longs pay shorts (positive funding). Funding is charged every 8 hours on BaseDEX.' },
  { q: 'What happens if my position gets liquidated?', a: 'If your position\'s equity falls below the maintenance margin (5% of position size), your position is automatically closed at the mark price. Remaining margin (minus a 1% liquidation fee) is returned to your account.' },
  { q: 'How do I get USDC on Base?', a: 'Three options: (1) Withdraw USDC from Coinbase directly to Base — easiest and free. (2) Bridge from Ethereum via bridge.base.org. (3) Bridge from any chain via Across Protocol or Stargate Finance.' },
  { q: 'Does BaseDEX have a mobile app?', a: 'A mobile app is on our 2026 roadmap. Currently, BaseDEX works well on mobile browsers — connect your Coinbase Wallet or MetaMask mobile app and access the full trading interface.' },
  { q: 'Which wallets are supported?', a: 'BaseDEX supports any EVM-compatible wallet via WalletConnect: MetaMask, Coinbase Wallet, Rainbow Wallet, Rabby, Trust Wallet, and many more. Coinbase Wallet has the best native Base integration.' },
  { q: 'Is there a BaseDEX token?', a: 'The BaseDEX governance token is on the roadmap. When launched, it will be used for protocol governance, fee discounts, and potentially fee sharing. Current traders will be eligible for a retroactive airdrop.' },
  { q: 'Are BaseDEX contracts open source?', a: 'Yes! All smart contracts (Vault, SpotEngine, PerpEngine) are open source on GitHub and verified on Basescan. Anyone can audit the code and verify the deployed contracts match.' },
  { q: 'What is cross-chain trading, and when is it coming?', a: 'Cross-chain trading allows you to deposit USDC on Arbitrum and trade against BaseDEX\'s Base order book. We\'re expanding to Arbitrum in Q3 2026, with other chains following. This means traders on both chains share the same liquidity.' },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 relative overflow-hidden" style={{ background: '#07071a' }}>
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(42,42,85,0.8), transparent)' }} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-violet-400 text-xs font-bold mb-6 uppercase tracking-wider"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
          >
            <HelpCircle size={12} />
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[#6a7090] text-base">
            Everything you need to know. Can&apos;t find your answer? Join us on{' '}
            <a href="https://t.me/BaseDEXOfficial" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 transition-colors font-semibold">
              Telegram
            </a>.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-2">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                style={{
                  background:   isOpen ? '#0f0f25' : '#0a0a1e',
                  border:       `1px solid ${isOpen ? 'rgba(96,165,250,0.3)' : 'rgba(26,26,53,1)'}`,
                  borderRadius: '14px',
                  overflow:     'hidden',
                  transition:   'border-color 0.2s, background 0.2s',
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span
                    className="font-semibold text-sm pr-4 leading-snug"
                    style={{ color: isOpen ? '#93c5fd' : '#e8eaf0' }}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className="shrink-0 transition-transform duration-200"
                    style={{
                      color:     isOpen ? '#60a5fa' : '#4a5068',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>
                {isOpen && (
                  <div
                    className="px-5 pb-5 text-sm leading-relaxed"
                    style={{
                      color:      '#8890a8',
                      borderTop:  '1px solid rgba(26,26,53,1)',
                      paddingTop: '1rem',
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
