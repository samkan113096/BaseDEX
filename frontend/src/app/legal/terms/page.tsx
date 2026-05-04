import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | BaseDEX',
  description: 'BaseDEX Terms of Service. Read our terms before using the decentralized exchange protocol.',
  robots: { index: false },
};

const LAST_UPDATED = 'April 15, 2026';
const EFFECTIVE   = 'April 15, 2026';

export default function TermsPage() {
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
            <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/legal/risk" className="hover:text-white transition-colors">Risk Disclosure</Link>
            <Link href="/audit" className="hover:text-white transition-colors">Audit</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-20">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/8 border border-blue-500/20 text-blue-400 text-xs font-bold mb-5">
            <FileText size={12} />
            Legal Document
          </div>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Terms of Service</h1>
          <p className="text-[#4a5068] text-sm">Last updated: {LAST_UPDATED} · Effective: {EFFECTIVE}</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-[#8890a8] leading-relaxed text-sm">

          <section>
            <h2 className="text-white font-bold text-lg mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using the BaseDEX protocol, interface, or any associated services (collectively, the &ldquo;Protocol&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, do not use the Protocol.</p>
            <p className="mt-2">These Terms constitute a legally binding agreement between you and BaseDEX Labs (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). These Terms may be modified at any time, and your continued use of the Protocol after any modification constitutes your acceptance of the updated Terms.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">2. Protocol Description</h2>
            <p>BaseDEX is a decentralized exchange protocol deployed on the Base blockchain network. The Protocol enables users to:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Trade digital assets on a non-custodial, peer-to-peer basis</li>
              <li>Trade perpetual futures contracts with leverage up to 20×</li>
              <li>Provide liquidity to spot and perpetual markets</li>
              <li>Access real-time price feeds and order book data</li>
            </ul>
            <p className="mt-2">We provide a front-end interface to the Protocol, but the Protocol itself consists of immutable smart contracts deployed on the Base blockchain. We do not custody any user funds.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">3. Eligibility and Prohibited Jurisdictions</h2>
            <p>You represent and warrant that:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>You are at least 18 years of age or the legal age of majority in your jurisdiction, whichever is greater</li>
              <li>You are not located in, or a citizen or resident of, any country subject to OFAC sanctions, including but not limited to Cuba, Iran, North Korea, Syria, and Russia</li>
              <li>You are not a Restricted Person as defined by applicable laws and regulations</li>
              <li>Your access to and use of the Protocol is legal in your jurisdiction</li>
              <li>You are not using the Protocol in connection with any illegal activity</li>
            </ul>
            <p className="mt-2">The Protocol is not available to residents of the United States of America and its territories.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">4. No Financial Advice</h2>
            <p>Nothing on the Protocol constitutes financial, investment, legal, or tax advice. All information provided is for informational purposes only. Trading digital assets involves substantial risk of loss. You should conduct your own research and consult with qualified professionals before making any financial decisions.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">5. Self-Custody and User Responsibility</h2>
            <p>BaseDEX is a non-custodial protocol. We do not hold, control, or have access to your private keys or digital assets. You are solely responsible for:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Maintaining the security of your wallet private keys</li>
              <li>All transactions you authorize</li>
              <li>Understanding the risks of smart contract interaction</li>
              <li>Complying with applicable laws and tax obligations</li>
              <li>Any losses resulting from your use of the Protocol</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">6. Protocol Fees</h2>
            <p>The Protocol charges trading fees as follows:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li><strong className="text-white">Taker fee:</strong> 0.06% of notional trade value</li>
              <li><strong className="text-white">Maker rebate:</strong> 0.01% of notional trade value</li>
              <li><strong className="text-white">Perpetual funding:</strong> Hourly funding rate paid between long and short positions, determined by market conditions</li>
              <li><strong className="text-white">Liquidation fee:</strong> 0.5% of notional position value, distributed to liquidators</li>
            </ul>
            <p className="mt-2">Fees are subject to change. Updates will be announced via our official channels with reasonable notice.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">7. Risks of Protocol Use</h2>
            <p>You acknowledge that use of the Protocol involves significant risks, including but not limited to:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Smart contract vulnerabilities or exploits</li>
              <li>Oracle price manipulation or failure</li>
              <li>Liquidation of leveraged positions</li>
              <li>Network congestion and failed transactions</li>
              <li>Regulatory changes affecting digital assets</li>
              <li>Total loss of deposited funds</li>
            </ul>
            <p className="mt-2">Please review our full <Link href="/legal/risk" className="text-blue-400 hover:underline">Risk Disclosure</Link> and <Link href="/audit" className="text-blue-400 hover:underline">Security Audit</Link> before using the Protocol.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">8. Intellectual Property</h2>
            <p>The Protocol&apos;s front-end interface, design, and non-smart-contract components are the intellectual property of BaseDEX Labs. The smart contracts are open-source and available under the MIT License. Our trademarks, logos, and brand assets may not be used without express written permission.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">9. Disclaimer of Warranties</h2>
            <p>THE PROTOCOL IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES INCLUDING, WITHOUT LIMITATION, WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE PROTOCOL WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">10. Limitation of Liability</h2>
            <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL BASEDEX LABS, ITS AFFILIATES, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR DIGITAL ASSETS, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE PROTOCOL.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">11. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the British Virgin Islands, without regard to its conflict of law provisions. Any dispute arising from these Terms shall be resolved through binding arbitration administered by the International Chamber of Commerce.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">12. Contact</h2>
            <p>For questions about these Terms, contact us at <a href="mailto:legal@basedex.fi" className="text-blue-400 hover:underline">legal@basedex.fi</a>.</p>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/legal/privacy" className="px-4 py-2 bg-[#09091a] border border-[#1a1a35] hover:border-[#2a2a55] rounded-lg text-sm text-[#8890a8] hover:text-white transition-all">Privacy Policy →</Link>
          <Link href="/legal/risk" className="px-4 py-2 bg-[#09091a] border border-[#1a1a35] hover:border-[#2a2a55] rounded-lg text-sm text-[#8890a8] hover:text-white transition-all">Risk Disclosure →</Link>
          <Link href="/audit" className="px-4 py-2 bg-[#09091a] border border-[#1a1a35] hover:border-[#2a2a55] rounded-lg text-sm text-[#8890a8] hover:text-white transition-all">Security Audit →</Link>
        </div>
      </div>
    </div>
  );
}
