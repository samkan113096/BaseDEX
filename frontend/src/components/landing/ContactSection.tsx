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
    color:   'blue' as const,
  },
  {
    icon:    <ExternalLink size={22} />,
    label:   'Twitter / X',
    value:   '@BaseDEX',
    href:    'https://twitter.com/BaseDEX',
    desc:    'Announcements, market commentary & updates',
    color:   'violet' as const,
  },
  {
    icon:    <Send size={22} />,
    label:   'Telegram',
    value:   't.me/BaseDEXOfficial',
    href:    'https://t.me/BaseDEXOfficial',
    desc:    'Community chat, support & trading discussion',
    color:   'emerald' as const,
  },
];

const COLOR = {
  blue:    { bg: 'bg-blue-500/8',    border: 'border-blue-500/15',    text: 'text-blue-400',    hoverBorder: 'hover:border-blue-500/30'    },
  violet:  { bg: 'bg-violet-500/8',  border: 'border-violet-500/15',  text: 'text-violet-400',  hoverBorder: 'hover:border-violet-500/30'  },
  emerald: { bg: 'bg-emerald-500/8', border: 'border-emerald-500/15', text: 'text-emerald-400', hoverBorder: 'hover:border-emerald-500/30' },
};

export function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-[#09091a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/8 border border-emerald-500/15 text-emerald-400 text-xs font-bold mb-4">
            Get In Touch
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
            Contact & Community
          </h2>
          <p className="text-[#8890a8] max-w-xl mx-auto text-base">
            Questions, feedback, or want to become a market maker? We&apos;re active on all channels.
          </p>
        </div>

        {/* Channel cards */}
        <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto mb-12">
          {CHANNELS.map((c, i) => {
            const col = COLOR[c.color];
            return (
              <Link
                key={i}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className={`bg-[#0d0d22] border ${col.border} ${col.hoverBorder} rounded-2xl p-6 transition-all group text-center hover:-translate-y-1 duration-300`}
              >
                <div className={`w-14 h-14 ${col.bg} ${col.border} border rounded-2xl flex items-center justify-center ${col.text} mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {c.icon}
                </div>
                <div className="text-white font-bold mb-1 text-[15px]">{c.label}</div>
                <div className={`text-sm font-semibold mb-2 ${col.text}`}>{c.value}</div>
                <div className="text-[#4a5068] text-xs leading-relaxed">{c.desc}</div>
              </Link>
            );
          })}
        </div>

        {/* Newsletter */}
        <div className="max-w-lg mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-violet-500/5 rounded-2xl" />
          <div className="relative bg-[#0d0d22] border border-[#1a1a35] rounded-2xl p-8 text-center">
            <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail size={18} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">Stay Updated</h3>
            <p className="text-[#8890a8] text-sm mb-6 leading-relaxed">
              Weekly market insights, platform updates, and DeFi alpha. No spam, unsubscribe anytime.
            </p>
            <form onSubmit={e => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-[#09091a] border border-[#1a1a35] focus:border-blue-500/40 rounded-xl px-4 py-3 text-white text-sm outline-none placeholder-[#2a2e48] transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/15 whitespace-nowrap active:scale-[0.98]"
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
