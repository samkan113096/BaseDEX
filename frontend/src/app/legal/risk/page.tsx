import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Risk Disclosure | BaseDEX',
  description: 'BaseDEX Risk Disclosure Statement. Understand the risks of trading leveraged perpetual futures and spot markets on a decentralized exchange.',
  robots: { index: false },
};

export default function RiskPage() {
  return (
    <div className="min-h-screen bg-[#05050f] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#09091a]/95 backdrop-blur border-b border-[#1a1a35]">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-black text-sm">B</span>
            </div>
            <span className="font-bold text-white">BaseDEX</span>
          </Link>
          <div className="flex gap-4 text-sm text-[#4a5068]">
            <Link href="/legal/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/audit" className="hover:text-white transition-colors">Audit</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-20">
        {/* Warning banner */}
        <div className="mb-8 bg-red-500/8 border border-red-500/25 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-red-400 font-bold text-sm mb-1">High Risk — Read Before Trading</div>
              <div className="text-[#8890a8] text-sm leading-relaxed">
                Trading leveraged perpetual futures and cryptocurrencies is highly speculative and involves substantial risk of loss. You could lose all funds you deposit. Only trade with money you can afford to lose entirely.
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/8 border border-red-500/20 text-red-400 text-xs font-bold mb-5">
            <AlertTriangle size={12} />
            Risk Disclosure
          </div>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Risk Disclosure Statement</h1>
          <p className="text-[#4a5068] text-sm">Last updated: April 15, 2026 · Please read carefully</p>
        </div>

        <div className="space-y-8 text-[#8890a8] leading-relaxed text-sm">

          <section>
            <h2 className="text-white font-bold text-lg mb-3">1. General Risk Warning</h2>
            <p>Trading digital assets, including perpetual futures contracts and spot markets on BaseDEX, involves significant financial risk. Market prices are highly volatile and can move against your position rapidly. You should only participate if you fully understand the nature of the products, your exposure, and the extent of your potential losses.</p>
            <p className="mt-2">Past performance is not indicative of future results. Returns are not guaranteed. You may lose substantially more than your initial deposit when using leverage.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">2. Leveraged Trading Risk</h2>
            <p>BaseDEX offers leveraged perpetual futures contracts with leverage up to 20×. Leverage amplifies both potential gains and potential losses.</p>
            <div className="bg-[#0d0d22] border border-[#1a1a35] rounded-xl p-4 mt-3">
              <div className="text-white font-semibold text-sm mb-2">Example: 20× Leverage</div>
              <div className="space-y-1 text-xs text-[#4a5068]">
                <div>Position size: $10,000 notional</div>
                <div>Your margin (collateral): $500</div>
                <div>A 5% adverse price move = 100% loss of margin</div>
                <div className="text-red-400 font-semibold mt-1">You can lose your entire $500 deposit in a 5% market move</div>
              </div>
            </div>
            <p className="mt-3">Maintenance margin requirements and liquidation mechanisms are designed to prevent accounts from going below zero, but rapid market movements, oracle delays, or network congestion may result in losses exceeding your deposited margin.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">3. Liquidation Risk</h2>
            <p>When your account equity falls below the maintenance margin threshold, your position will be automatically liquidated. Liquidations are executed at the current mark price minus liquidation fees. In volatile market conditions or during periods of low liquidity, liquidation prices may be worse than expected.</p>
            <p className="mt-2">We strongly recommend setting stop-loss orders and monitoring your positions actively. You are solely responsible for managing your margin levels.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">4. Smart Contract Risk</h2>
            <p>BaseDEX operates through smart contracts deployed on the Base blockchain. While our contracts have been audited (see <Link href="/audit" className="text-blue-400 hover:underline">Audit Report</Link>), no audit can guarantee the complete absence of vulnerabilities. Risks include:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Undiscovered smart contract bugs or exploits</li>
              <li>Vulnerabilities introduced by future upgrades or dependencies</li>
              <li>Economic attacks that are technically valid but exploitative</li>
              <li>Bugs in third-party contracts or libraries</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">5. Oracle and Price Feed Risk</h2>
            <p>BaseDEX relies on decentralized oracle networks (Pyth, Chainlink) for price data. Oracle risks include:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Oracle failure or prolonged unavailability causing trading halts</li>
              <li>Oracle price manipulation or flash loan attacks</li>
              <li>Latency between actual market prices and oracle-reported prices</li>
              <li>Stale prices during periods of network congestion</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">6. Funding Rate Risk</h2>
            <p>Perpetual futures positions are subject to periodic funding rate payments between long and short position holders. Funding rates can be significantly positive or negative depending on market conditions. High funding rates can erode the profitability of positions held for extended periods. Funding is charged/credited every 8 hours.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">7. Blockchain and Network Risk</h2>
            <p>Using BaseDEX involves interacting with the Base blockchain and Ethereum ecosystem. Associated risks include:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Network congestion causing transaction delays or failures</li>
              <li>Gas price spikes making transactions prohibitively expensive</li>
              <li>Base network outages or reorgs</li>
              <li>Hard fork risks that could affect contract behavior</li>
              <li>Wallet software bugs or vulnerabilities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">8. Counterparty and Liquidity Risk</h2>
            <p>While BaseDEX operates as a decentralized protocol with no single counterparty, liquidity risk is real. In low-liquidity markets:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Large orders may experience significant slippage</li>
              <li>Orders may not fill at expected prices</li>
              <li>Exiting large positions may be difficult or costly</li>
              <li>Spreads between bid and ask prices may widen significantly</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">9. Regulatory Risk</h2>
            <p>The regulatory environment for decentralized finance is evolving rapidly. Regulatory actions or changes in laws in your jurisdiction could affect your ability to use the Protocol, access your funds, or maintain open positions. You are solely responsible for compliance with applicable laws and regulations in your jurisdiction.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">10. Cybersecurity Risk</h2>
            <p>Users are responsible for securing their own wallets and private keys. Risks include phishing attacks, malware, SIM swapping, and social engineering attacks targeting crypto users. BaseDEX will never ask for your private key or seed phrase. Always verify you are on the official BaseDEX domain.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">11. No Insurance</h2>
            <p>Funds deposited on BaseDEX are not covered by any government-backed deposit insurance scheme (such as FDIC or SIPC). Funds are not insured by BaseDEX Labs. In the event of a security breach, funds may be partially or fully unrecoverable.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">12. Acknowledgement</h2>
            <p>By using BaseDEX, you acknowledge that you have read and understood this Risk Disclosure Statement, that you accept all risks described herein, and that you are solely responsible for any losses you may incur. If you do not understand or accept these risks, do not use the Protocol.</p>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/legal/terms" className="px-4 py-2 bg-[#09091a] border border-[#1a1a35] hover:border-[#2a2a55] rounded-lg text-sm text-[#8890a8] hover:text-white transition-all">Terms of Service →</Link>
          <Link href="/legal/privacy" className="px-4 py-2 bg-[#09091a] border border-[#1a1a35] hover:border-[#2a2a55] rounded-lg text-sm text-[#8890a8] hover:text-white transition-all">Privacy Policy →</Link>
          <Link href="/audit" className="px-4 py-2 bg-[#09091a] border border-[#1a1a35] hover:border-[#2a2a55] rounded-lg text-sm text-[#8890a8] hover:text-white transition-all">Security Audit →</Link>
        </div>
      </div>
    </div>
  );
}
