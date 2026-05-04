import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | BaseDEX',
  description: 'BaseDEX Privacy Policy. How we handle your data on our decentralized exchange.',
  robots: { index: false },
};

export default function PrivacyPage() {
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
            <Link href="/legal/risk" className="hover:text-white transition-colors">Risk</Link>
            <Link href="/audit" className="hover:text-white transition-colors">Audit</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-20">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/8 border border-violet-500/20 text-violet-400 text-xs font-bold mb-5">
            <Shield size={12} />
            Privacy
          </div>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Privacy Policy</h1>
          <p className="text-[#4a5068] text-sm">Last updated: April 15, 2026</p>
        </div>

        <div className="space-y-8 text-[#8890a8] leading-relaxed text-sm">

          <section>
            <h2 className="text-white font-bold text-lg mb-3">1. Overview</h2>
            <p>BaseDEX Labs (&ldquo;we,&rdquo; &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains what data we collect, how we use it, and your rights with respect to that data. Because BaseDEX is a non-custodial decentralized exchange, we do not collect or store private keys, seed phrases, or personal identity documents.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">2. Data We Collect</h2>
            <p className="mb-2"><strong className="text-white">2.1 On-Chain Data (Public)</strong></p>
            <p>All transactions, wallet addresses, order placements, and trade settlements are permanently recorded on the Base blockchain. This data is public and immutable. We do not control this data.</p>

            <p className="mt-3 mb-2"><strong className="text-white">2.2 Front-End Usage Data</strong></p>
            <p>When you use our web interface, we may collect:</p>
            <ul className="list-disc ml-5 mt-1 space-y-1">
              <li>Browser type and version, operating system</li>
              <li>Pages visited, time spent on pages, referring URLs</li>
              <li>Anonymous usage analytics (no personally identifiable information)</li>
              <li>IP address (hashed and not stored in identifiable form)</li>
            </ul>

            <p className="mt-3 mb-2"><strong className="text-white">2.3 Data We Do Not Collect</strong></p>
            <ul className="list-disc ml-5 mt-1 space-y-1">
              <li>Name, email address, or other personal identifiers (unless voluntarily provided via contact forms)</li>
              <li>Government-issued ID or KYC documents</li>
              <li>Private keys or wallet seed phrases</li>
              <li>Financial account details</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">3. How We Use Data</h2>
            <p>We use collected data to:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Provide, operate, and improve the Protocol interface</li>
              <li>Monitor for fraud, abuse, and security threats</li>
              <li>Comply with legal obligations including OFAC sanctions screening</li>
              <li>Generate anonymized analytics to improve user experience</li>
              <li>Send service announcements if you opt into communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">4. Cookies and Tracking</h2>
            <p>We use minimal, essential cookies to provide core functionality (wallet connection state, user preferences). We do not use third-party advertising or tracking cookies. You may disable cookies in your browser settings, though some features may not function correctly.</p>
            <p className="mt-2">We use privacy-respecting analytics (Plausible Analytics) that does not use cookies, fingerprinting, or cross-site tracking.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">5. Third-Party Services</h2>
            <p>The Protocol integrates with the following third-party services:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li><strong className="text-white">CoinGecko API:</strong> Market price data (no user data shared)</li>
              <li><strong className="text-white">WalletConnect / RainbowKit:</strong> Wallet connectivity (subject to their privacy policies)</li>
              <li><strong className="text-white">Base blockchain:</strong> Transaction processing (public blockchain)</li>
              <li><strong className="text-white">Pyth / Chainlink:</strong> Oracle price feeds (no user data shared)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">6. Data Retention</h2>
            <p>We retain anonymized analytics data for up to 12 months. Server logs are purged after 30 days. On-chain data is permanently public on the Base blockchain and cannot be deleted.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">7. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have rights to:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Request correction or deletion of your personal data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Data portability</li>
            </ul>
            <p className="mt-2">To exercise these rights, contact <a href="mailto:privacy@basedex.fi" className="text-blue-400 hover:underline">privacy@basedex.fi</a>.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">8. Security</h2>
            <p>We implement industry-standard security measures to protect data in our systems. However, no transmission over the internet is 100% secure. As a non-custodial protocol, we strongly recommend that users never share private keys or seed phrases with anyone.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">9. Children</h2>
            <p>The Protocol is not directed at children under 18. We do not knowingly collect data from minors. If you believe we have inadvertently collected such data, please contact us immediately.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated &ldquo;Last updated&rdquo; date. Material changes will be announced via our official channels.</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">11. Contact</h2>
            <p>Privacy inquiries: <a href="mailto:privacy@basedex.fi" className="text-blue-400 hover:underline">privacy@basedex.fi</a></p>
          </section>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/legal/terms" className="px-4 py-2 bg-[#09091a] border border-[#1a1a35] hover:border-[#2a2a55] rounded-lg text-sm text-[#8890a8] hover:text-white transition-all">Terms of Service →</Link>
          <Link href="/legal/risk" className="px-4 py-2 bg-[#09091a] border border-[#1a1a35] hover:border-[#2a2a55] rounded-lg text-sm text-[#8890a8] hover:text-white transition-all">Risk Disclosure →</Link>
        </div>
      </div>
    </div>
  );
}
