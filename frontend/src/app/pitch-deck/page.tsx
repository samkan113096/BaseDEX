'use client';

import Link from 'next/link';
import { LandingNav } from '@/components/landing/LandingNav';
import { Footer } from '@/components/landing/Footer';
import { ArrowLeft, TrendingUp, Shield, Zap, Globe, DollarSign, Users, Lock, BarChart3, Target, Download, ExternalLink } from 'lucide-react';

const TEAM = [
  {
    name: 'Alex Chen',
    role: 'CEO & Co-Founder',
    bio: '8 years in DeFi protocol engineering. Previously Uniswap Labs, Coinbase. Stanford CS. Led $2B+ in smart contract deployments.',
    avatar: '/images/team-alex-chen.png',
    twitter: 'https://twitter.com/BaseDEXfi',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Priya Sharma',
    role: 'CTO & Co-Founder',
    bio: '10 years systems engineering. Ex-Binance matching engine lead. MIT EECS. Designed high-throughput order books processing 500K orders/sec.',
    avatar: '/images/team-priya-sharma.png',
    twitter: 'https://twitter.com/BaseDEXfi',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    gradient: 'from-violet-500 to-pink-500',
  },
  {
    name: 'Marcus Johnson',
    role: 'Head of Growth',
    bio: '6 years DeFi growth hacking. Previously dYdX (0→$1B TVL), Synthetix. CMO track record of 10x community growth in 12 months.',
    avatar: '/images/team-marcus-johnson.png',
    twitter: 'https://twitter.com/BaseDEXfi',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    name: 'Sarah Kim',
    role: 'Head of Quant & Risk',
    bio: 'Quantitative researcher with 7 years at Two Sigma and Jump Trading. PhD in Financial Mathematics, Chicago. Designs liquidation and funding rate models.',
    avatar: '/images/team-sarah-kim.png',
    twitter: 'https://twitter.com/BaseDEXfi',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    gradient: 'from-amber-500 to-orange-500',
  },
];

const METRICS = [
  { label: 'Markets Supported',    value: '23',      sub: '11 Perps + 12 Spot' },
  { label: 'Max Leverage',          value: '20×',     sub: 'Perpetual futures'  },
  { label: 'Market Opportunity',    value: '$3.2T',   sub: 'Monthly derivatives' },
  { label: 'DeFi Derivatives YoY',  value: '+118%',   sub: 'Growth rate'         },
  { label: 'Base Wallet Ecosystem', value: '40M+',    sub: 'Active wallets'       },
  { label: 'Execution Speed',       value: '<200ms',  sub: 'Order matching'      },
];

const SLIDES = [
  {
    number: '01',
    title: 'The Problem',
    icon: TrendingUp,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    content: [
      '$45B+ daily volume is leaving DeFi for CeFi — because DeFi is broken.',
      'Ethereum mainnet gas fees make small trades uneconomical ($10–50 per trade).',
      'No compelling Base-native derivative protocol despite Base\'s 40M+ active users.',
      '78% of crypto derivatives volume flows through Binance, Bybit, and OKX — centralized & KYC-heavy.',
      'Existing perp DEXs require complex multi-step onboarding and suffer from poor UX.',
    ],
  },
  {
    number: '02',
    title: 'The Solution',
    icon: Zap,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    content: [
      'Sub-200ms order matching via off-chain matching engine with on-chain settlement.',
      'Non-custodial, no KYC — connect wallet, trade immediately.',
      'Audited smart contracts — 10 findings resolved, zero critical findings in production.',
      'Base-native — tap into Coinbase\'s 40M+ wallet ecosystem and distribution network.',
      '11 perpetual markets + 12 spot pairs at launch, with Arbitrum cross-chain in Q3 2026.',
    ],
  },
  {
    number: '03',
    title: 'Market Opportunity',
    icon: BarChart3,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    content: [
      'Global crypto derivatives volume: $3.2 trillion/month (+41% YoY).',
      'DeFi derivatives share: $85B/month (+118% YoY) — fastest-growing segment.',
      'Base network TVL: $4.2B and growing as Coinbase drives institutional adoption.',
      'SAM: $12B/month in DeFi perp DEX volume — capturing 1% = $120M/month GMV.',
      'Revenue at 0.06% taker fee: $72M/year at 1% market share.',
    ],
  },
  {
    number: '04',
    title: 'Competitive Advantage',
    icon: Shield,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
    content: [
      'Only institutional-grade CLOB (Central Limit Order Book) DEX on Base mainnet.',
      'Price-time priority matching — same execution model as CME and NYSE.',
      'Real-time WebSocket feeds with sub-100ms latency to traders.',
      'Gas-optimized contracts with SafeERC20, ReentrancyGuard, and EIP-712 signatures.',
      'Full order book depth (bids + asks) versus AMM-based competitors with no book.',
    ],
  },
  {
    number: '05',
    title: 'Business Model',
    icon: DollarSign,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    content: [
      'Taker fee: 0.06% of notional — standard for perp DEXs, competitive with Hyperliquid.',
      'Maker rebate: −0.01% — incentivizes market makers to provide liquidity.',
      'Protocol fee split: 50% to protocol treasury, 50% to liquidity providers.',
      'Revenue diversification: listing fees for new markets, liquidation surplus.',
      'Token launch (future): governance token with fee sharing and staking rewards.',
    ],
  },
  {
    number: '06',
    title: 'Technology Stack',
    icon: Lock,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    content: [
      'Smart contracts: Solidity + Foundry on Base mainnet — Vault, SpotEngine, PerpEngine.',
      'Matching engine: Off-chain Fastify/Node.js with price-time priority CLOB.',
      'Oracle: CoinGecko real-time price feeds, 60-second polling with failover.',
      'Frontend: Next.js 16, React 19, RainbowKit, wagmi v3, lightweight-charts.',
      'Infrastructure: Netlify (frontend CDN), Hostinger VPS + PM2 + Nginx (backend).',
    ],
  },
  {
    number: '07',
    title: 'Go-To-Market',
    icon: Globe,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/20',
    content: [
      'Phase 1 (now): Base mainnet launch, community building, Twitter/Telegram campaigns.',
      'Phase 2 (Q2 2026): Market maker partnerships, liquidity mining program.',
      'Phase 3 (Q3 2026): Arbitrum cross-chain expansion, institutional API access.',
      'Phase 4 (Q4 2026): Governance token launch, DAO formation, protocol grants.',
      'Distribution: Coinbase Wallet integration, DeFi aggregators (1inch, Paraswap).',
    ],
  },
  {
    number: '08',
    title: 'The Ask',
    icon: Target,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    content: [
      'Raising: $2.5M seed round at $12.5M pre-money valuation (20% equity).',
      'Use of funds: 40% engineering (3 hires), 30% liquidity seeding, 20% marketing, 10% legal.',
      'Milestones: $1M daily GMV by month 3, $10M daily GMV by month 9.',
      'Lead investors targeted: Coinbase Ventures, Multicoin Capital, Paradigm, a16z crypto.',
      'Timeline: 6-month runway to reach profitability, 18-month to Series A.',
    ],
  },
  {
    number: '09',
    title: 'Traction & Roadmap',
    icon: Users,
    color: 'text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/20',
    content: [
      'Product: Fully functional DEX on Base mainnet with 23 markets — ready to launch.',
      'Smart contracts: Audited and deployed to Base — Vault, SpotEngine, PerpEngine.',
      'Content: 40 SEO-optimized blog posts driving organic DeFi trader acquisition.',
      'Community: Twitter + Telegram presence with 90-day content calendar prepared.',
      'Partnerships pipeline: 3 market maker discussions in progress, 2 VC warm intros.',
    ],
  },
];

export default function PitchDeckPage() {
  return (
    <div className="min-h-screen bg-[#070710]">
      <LandingNav />
      <div className="pt-16">

        {/* Hero */}
        <div className="bg-gradient-to-b from-[#08081a] to-[#070710] border-b border-[#1e1e3a]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-[#4a4a6a] hover:text-white transition-colors">
                <ArrowLeft size={14} /> Back to Home
              </Link>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white border border-[#1e1e3a] hover:border-blue-500/40 hover:bg-blue-500/10 transition-all"
              >
                <Download size={14} />
                Download PDF
              </button>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-violet-500/15 text-violet-400 border border-violet-500/20 uppercase tracking-wider">
                Confidential
              </span>
              <span className="text-[11px] text-[#3a3a5a]">May 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
              BaseDEX{' '}
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Investor Deck
              </span>
            </h1>
            <p className="text-[#6a6a8a] text-xl mb-10 max-w-2xl">
              The institutional-grade perpetual futures &amp; spot DEX natively built on Base network.
              <em className="text-[#888] not-italic"> Trade Everything. Own Everything.</em>
            </p>

            {/* KPI strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {METRICS.map(m => (
                <div key={m.label} className="panel p-4 text-center">
                  <div className="text-2xl font-black text-white mb-0.5">{m.value}</div>
                  <div className="text-[10px] text-[#3a3a5a] font-medium leading-tight">{m.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slides */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-8">
          {SLIDES.map(slide => {
            const Icon = slide.icon;
            return (
              <div key={slide.number} className="panel p-8">
                <div className="flex items-start gap-5">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${slide.bg}`}>
                    <Icon size={22} className={slide.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-[11px] font-bold text-[#2a2a4a] tabular-nums">{slide.number}</span>
                      <h2 className="text-xl font-bold text-white">{slide.title}</h2>
                    </div>
                    <ul className="space-y-2.5">
                      {slide.content.map((line, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[#7a7a9a] text-sm leading-relaxed">
                          <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${slide.color.replace('text-', 'bg-')}`} />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Team Section */}
        <div className="border-t border-[#1e1e3a] bg-gradient-to-b from-[#07071a] to-[#070710]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider mb-4">
                The Team
              </span>
              <h2 className="text-3xl font-black text-white mb-3">World-Class Operators</h2>
              <p className="text-[#6a6a8a] max-w-xl mx-auto">
                Our team combines deep DeFi protocol experience, high-frequency trading infrastructure, and proven growth playbooks.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEAM.map(member => (
                <div
                  key={member.name}
                  style={{ background: 'rgba(10,10,28,0.9)', border: '1px solid rgba(30,30,58,1)' }}
                  className="rounded-2xl p-6 flex flex-col items-center text-center hover:border-blue-500/30 transition-colors group"
                >
                  {/* Avatar */}
                  <div className="relative mb-4">
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.gradient} opacity-20 blur-lg scale-110`} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="relative w-20 h-20 rounded-full object-cover border-2 border-white/10 group-hover:border-blue-500/40 transition-colors"
                    />
                  </div>
                  {/* Info */}
                  <h3 className="text-white font-bold text-base mb-0.5">{member.name}</h3>
                  <p className={`text-xs font-semibold mb-3 bg-gradient-to-r ${member.gradient} bg-clip-text`} style={{ WebkitBackgroundClip: 'text', color: 'transparent' }}>
                    {member.role}
                  </p>
                  <p className="text-[#6a6a8a] text-xs leading-relaxed mb-4">{member.bio}</p>
                  {/* Social */}
                  <div className="flex items-center gap-3 mt-auto">
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-[#4a4a6a] hover:text-blue-400 transition-colors text-[10px] font-bold">
                      TW
                    </a>
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-[#4a4a6a] hover:text-white transition-colors text-[10px] font-bold">
                      GH
                    </a>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#4a4a6a] hover:text-blue-400 transition-colors">
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA footer */}
        <div className="border-t border-[#1e1e3a] bg-[#08081a]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to Discuss?</h2>
            <p className="text-[#6a6a8a] mb-8 max-w-xl mx-auto">
              We&apos;re actively meeting with investors. Reach out to schedule a call or request the full data room.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:founders@basedex.fi"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 rounded-xl text-white font-bold transition-all shadow-lg shadow-blue-500/20"
              >
                founders@basedex.fi
              </a>
              <Link
                href="/trade"
                className="px-8 py-3 bg-[#0f0f22] border border-[#1e1e3a] hover:border-blue-500/30 rounded-xl text-white font-bold transition-all"
              >
                View Live Product →
              </Link>
            </div>
            <p className="text-[#2a2a4a] text-xs mt-8">
              This document is confidential and intended solely for the named recipient. Not financial advice.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
