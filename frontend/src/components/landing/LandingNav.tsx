'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu, X, Zap } from 'lucide-react';
import { PriceTicker } from './PriceTicker';

const NAV_LINKS = [
  { href: '/#features',  label: 'Features'  },
  { href: '/#markets',   label: 'Markets'   },
  { href: '/#about',     label: 'About'     },
  { href: '/blog',       label: 'Blog'      },
  { href: '/#faq',       label: 'FAQ'       },
  { href: '/audit',      label: 'Audit'     },
  { href: '/pitch-deck', label: 'Investors' },
];

export function LandingNav() {
  const [open,      setOpen]      = useState(false);
  const [scrolled,  setScrolled]  = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {/* ── Price ticker strip ────────────────────────────────── */}
      <PriceTicker />

      {/* ── Main nav ──────────────────────────────────────────── */}
      <nav
        className={`transition-all duration-300 ${
          scrolled
            ? 'glass shadow-2xl shadow-black/40'
            : 'bg-transparent border-b border-white/[0.04]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo-icon.png" alt="BaseDEX logo" className="w-full h-full object-cover" />
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#05050f] animate-pulse" />
              </div>
              <span className="text-white font-extrabold text-xl tracking-tight group-hover:text-blue-400 transition-colors">BaseDEX</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-3.5 py-2 rounded-lg text-[13px] text-[#7888a8] hover:text-white hover:bg-white/[0.06] transition-all font-medium"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* CTA + Connect */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/trade"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/45 active:scale-[0.98]"
              >
                <Zap size={14} />
                Launch App
              </Link>
            </div>

            {/* Mobile burger */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[#888] hover:text-white hover:bg-white/5 transition-all"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden glass border-t border-white/[0.04] px-4 py-4 space-y-1 animate-slide-up">
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center px-4 py-3 rounded-xl text-[#8888aa] hover:text-white hover:bg-white/[0.06] text-sm font-medium transition-all"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/trade"
              className="flex items-center justify-center gap-2 mt-3 px-4 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-white"
            >
              <Zap size={14} />
              Launch App
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
