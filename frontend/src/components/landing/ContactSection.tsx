'use client';

import { Mail, Send, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const CHANNELS = [
  {
    icon:    <Mail size={22} />,
    label:   'Email',
    value:   'hello@basedex.fi',
    href:    'mailto:hello@basedex.fi',
    desc:    'Business, partnerships & institutional inquiries',
    color:   { icon: '#60a5fa', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)', hoverBorder: 'rgba(59,130,246,0.4)' },
  },
  {
    icon:    <ExternalLink size={22} />,
    label:   'Twitter / X',
    value:   '@BaseDEX',
    href:    'https://twitter.com/BaseDEX',
    desc:    'Announcements, market commentary & updates',
    color:   { icon: '#a78bfa', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)', hoverBorder: 'rgba(139,92,246,0.4)' },
  },
  {
    icon:    <Send size={22} />,
    label:   'Telegram',
    value:   't.me/BaseDEXOfficial',
    href:    'https://t.me/BaseDEXOfficial',
    desc:    'Community chat, support & trading discussion',
    color:   { icon: '#34d399', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', hoverBorder: 'rgba(16,185,129,0.4)' },
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="py-24 relative overflow-hidden" style={{ background: '#09091a' }}>
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(42,42,85,0.8), transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-emerald-400 text-xs font-bold mb-6 uppercase tracking-wider"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
          >
            Get In Touch
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
            Contact & Community
          </h2>
          <p className="max-w-xl mx-auto text-base" style={{ color: '#8890a8' }}>
            Questions, feedback, or want to become a market maker? We&apos;re active on all channels.
          </p>
        </div>

        {/* Channel cards */}
        <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto mb-12">
          {CHANNELS.map((c, i) => (
            <Link
              key={i}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              style={{
                background:   '#0d0d22',
                border:       `1px solid ${c.color.border}`,
                borderRadius: '16px',
                padding:      '24px',
                display:      'block',
                textAlign:    'center',
                transition:   'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
              }}
              className="hover:-translate-y-1 group"
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = c.color.hoverBorder;
                (e.currentTarget as HTMLElement).style.boxShadow   = `0 8px 32px ${c.color.bg}`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = c.color.border;
                (e.currentTarget as HTMLElement).style.boxShadow   = 'none';
              }}
            >
              {/* Icon box */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                style={{ background: c.color.bg, border: `1px solid ${c.color.border}`, color: c.color.icon }}
              >
                {c.icon}
              </div>
              <div className="text-white font-bold mb-1 text-[15px]">{c.label}</div>
              <div className="text-sm font-semibold mb-2" style={{ color: c.color.icon }}>{c.value}</div>
              <div className="text-xs leading-relaxed" style={{ color: '#4a5068' }}>{c.desc}</div>
            </Link>
          ))}
        </div>

        {/* Newsletter */}
        <div className="max-w-lg mx-auto">
          <div
            style={{
              background:   '#0d0d22',
              border:       '1px solid rgba(26,26,53,1)',
              borderRadius: '16px',
              padding:      '32px',
              textAlign:    'center',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
            >
              <Mail size={18} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">Stay Updated</h3>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: '#8890a8' }}>
              Weekly market insights, platform updates, and DeFi alpha. No spam, unsubscribe anytime.
            </p>
            <form onSubmit={e => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                style={{
                  flex:         '1',
                  background:   '#09091a',
                  border:       '1px solid rgba(26,26,53,1)',
                  borderRadius: '12px',
                  padding:      '12px 16px',
                  color:        'white',
                  fontSize:     '14px',
                  outline:      'none',
                }}
                className="focus:border-blue-500/40 placeholder-[#2a2e48] transition-colors"
              />
              <button
                type="submit"
                style={{
                  padding:      '12px 20px',
                  background:   'linear-gradient(135deg, #2563eb, #7c3aed)',
                  color:        'white',
                  fontSize:     '14px',
                  fontWeight:   '700',
                  borderRadius: '12px',
                  border:       'none',
                  cursor:       'pointer',
                  whiteSpace:   'nowrap',
                  transition:   'opacity 0.2s',
                }}
                className="hover:opacity-90 active:scale-[0.98]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
