'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

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
    <section id="faq" className="py-24 bg-[#08081a]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold mb-4">
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[#6a6a8a]">
            Everything you need to know about BaseDEX. Can't find your answer? Join us on Telegram.
          </p>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`panel overflow-hidden transition-all ${open === i ? 'border-blue-500/30' : ''}`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className={`font-semibold text-sm transition-colors ${open === i ? 'text-blue-400' : 'text-white'}`}>
                  {faq.q}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-[#4a4a6a] shrink-0 ml-4 transition-transform duration-200 ${open === i ? 'rotate-180 text-blue-400' : ''}`}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-[#6a6a8a] text-sm leading-relaxed border-t border-[#1e1e3a] pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
