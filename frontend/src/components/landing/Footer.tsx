import Link from 'next/link';
import { Send, ExternalLink } from 'lucide-react';

const FOOTER_LINKS = {
  Platform: [
    { label: 'Trade Spot',       href: '/trade' },
    { label: 'Trade Perpetuals', href: '/trade' },
    { label: 'Markets',          href: '/#markets' },
    { label: 'Docs',             href: '#' },
    { label: 'API',              href: '#' },
  ],
  Company: [
    { label: 'About',      href: '/#about' },
    { label: 'Blog',       href: '/blog' },
    { label: 'Investors',  href: '/pitch-deck' },
    { label: 'Contact',    href: '/#contact' },
    { label: 'Careers',    href: '#' },
  ],
  Resources: [
    { label: 'Trading Guide',   href: '/blog/complete-basedex-trading-guide' },
    { label: 'FAQ',             href: '/#faq' },
    { label: 'Security Audit',  href: '/audit' },
    { label: 'Smart Contracts', href: 'https://basescan.org' },
    { label: 'Bug Bounty',      href: '#' },
  ],
  Legal: [
    { label: 'Terms of Service', href: '/legal/terms' },
    { label: 'Privacy Policy',   href: '/legal/privacy' },
    { label: 'Risk Disclosure',  href: '/legal/risk' },
    { label: 'Audit Report',     href: '/audit' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#08081a] border-t border-[#1e1e3a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-base">B</span>
              </div>
              <span className="text-white font-extrabold text-xl">BaseDEX</span>
            </Link>
            <p className="text-[#4a4a6a] text-sm leading-relaxed mb-4">
              The leading decentralized perpetual futures and spot exchange on Base network. Non-custodial, no KYC, deep liquidity.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: <ExternalLink size={16} />, href: 'https://twitter.com/BaseDEX' },
                { icon: <Send size={16} />,    href: 'https://t.me/BaseDEXOfficial' },
                { icon: <ExternalLink size={16} />, href: 'https://github.com/basedex' },
              ].map((s, i) => (
                <Link
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#0f0f22] border border-[#1e1e3a] flex items-center justify-center text-[#4a4a6a] hover:text-white hover:border-[#2a2a4a] transition-all"
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white text-sm font-bold mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((l, i) => (
                  <li key={i}>
                    <Link
                      href={l.href}
                      className="text-[#4a4a6a] hover:text-white text-sm transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-[#1e1e3a] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#3a3a5a] text-sm">
            © {new Date().getFullYear()} BaseDEX. All rights reserved. Built on Base.
          </p>
          <div className="flex items-center gap-4 text-[#3a3a5a] text-xs">
            <span>Chain: Base (8453)</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>

      {/* Risk disclaimer */}
      <div className="border-t border-[#1e1e3a] bg-[#070710] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#2a2a4a] text-xs text-center leading-relaxed">
            Trading cryptocurrency derivatives involves substantial risk of loss. Leverage amplifies both gains and losses. You may lose your entire investment.
            BaseDEX is a non-custodial protocol — you are solely responsible for the security of your wallet and assets.
            This is not financial advice. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </footer>
  );
}
