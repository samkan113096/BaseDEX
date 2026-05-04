import type { Metadata } from 'next';
import { LandingNav }    from '@/components/landing/LandingNav';
import { HeroSection }   from '@/components/landing/HeroSection';
import { StatsSection }  from '@/components/landing/StatsSection';
import { MarketsSection }from '@/components/landing/MarketsSection';
import { FeaturesSection}from '@/components/landing/FeaturesSection';
import { HowItWorks }    from '@/components/landing/HowItWorks';
import { AboutSection }  from '@/components/landing/AboutSection';
import { BlogPreview }   from '@/components/landing/BlogPreview';
import { FAQSection }    from '@/components/landing/FAQSection';
import { ContactSection }from '@/components/landing/ContactSection';
import { Footer }        from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'BaseDEX — The Leading Perpetual & Spot DEX on Base Network',
  description: 'Trade cbBTC, ETH, SOL perpetual futures and spot with up to 20× leverage on Base network. No KYC, self-custody, sub-200ms execution. The pro DEX built for the Coinbase ecosystem.',
  alternates: { canonical: 'https://basedex.fi' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://basedex.fi/#website',
      url: 'https://basedex.fi',
      name: 'BaseDEX',
      description: 'Perpetual futures and spot DEX on Base network',
      potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: 'https://basedex.fi/blog?q={search_term_string}' }, 'query-input': 'required name=search_term_string' },
    },
    {
      '@type': 'Organization',
      '@id': 'https://basedex.fi/#organization',
      name: 'BaseDEX',
      url: 'https://basedex.fi',
      logo: { '@type': 'ImageObject', url: 'https://basedex.fi/og.svg' },
      sameAs: ['https://twitter.com/BaseDEX', 'https://t.me/BaseDEXOfficial'],
      contactPoint: { '@type': 'ContactPoint', email: 'hello@basedex.fi', contactType: 'customer service' },
    },
    {
      '@type': 'FinancialService',
      '@id': 'https://basedex.fi/#service',
      name: 'BaseDEX',
      description: 'Decentralized perpetual futures and spot exchange on Base network with up to 20× leverage',
      url: 'https://basedex.fi',
      areaServed: 'Worldwide',
      category: 'Decentralized Exchange (DEX)',
      keywords: 'perpetual futures, spot trading, DeFi, Base network, cbBTC, ETH, leverage trading',
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://basedex.fi/#faq',
      mainEntity: [
        { '@type': 'Question', name: 'What is BaseDEX?', acceptedAnswer: { '@type': 'Answer', text: 'BaseDEX is a decentralized perpetual futures and spot exchange built on Base network (Coinbase\'s L2). It combines off-chain order matching with on-chain settlement for CEX-level performance with full self-custody.' } },
        { '@type': 'Question', name: 'What is the maximum leverage on BaseDEX?', acceptedAnswer: { '@type': 'Answer', text: 'BaseDEX offers up to 20× leverage on all perpetual futures markets.' } },
        { '@type': 'Question', name: 'Does BaseDEX require KYC?', acceptedAnswer: { '@type': 'Answer', text: 'No. BaseDEX is permissionless — just connect your wallet and trade. No account creation or identity verification required.' } },
        { '@type': 'Question', name: 'What coins can I trade on BaseDEX?', acceptedAnswer: { '@type': 'Answer', text: 'BaseDEX supports ETH, cbBTC, cbETH, SOL, AERO, ARB, LINK, and DOGE perpetuals, plus ETH, cbBTC, SOL, and cbETH spot markets. All settled in USDC on Base.' } },
      ],
    },
  ],
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#05050f] text-white">
        <LandingNav />
        <HeroSection />
        <StatsSection />
        <MarketsSection />
        <FeaturesSection />
        <HowItWorks />
        <AboutSection />
        <BlogPreview />
        <FAQSection />
        <ContactSection />
        <Footer />
      </div>
    </>
  );
}
