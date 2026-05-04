'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '#features',   label: 'Features' },
  { href: '#markets',    label: 'Markets' },
  { href: '#about',      label: 'About' },
  { href: '/blog',       label: 'Blog' },
  { href: '#faq',        label: 'FAQ' },
  { href: '/audit',       label: 'Audit' },
  { href: '/legal/terms', label: 'Legal' },
  { href: '/pitch-deck',  label: 'Investors' },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/40">
              <span className="text-white font-black text-base">B</span>
            </div>
            <span className="text-white font-extrabold text-xl tracking-tight">BaseDEX</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 rounded-lg text-sm text-[#8888aa] hover:text-white hover:bg-white/5 transition-all font-medium"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/trade"
              className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
              Launch App
            </Link>
          </div>

          {/* Mobile burger */}
          <button onClick={() => setOpen(!open)} className="md:hidden text-[#888] hover:text-white">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0a0a1a] border-b border-[#1e1e3a] px-4 py-4 space-y-1">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-lg text-[#8888aa] hover:text-white hover:bg-white/5 text-sm font-medium">
              {l.label}
            </Link>
          ))}
          <Link href="/trade" className="block mt-3 px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-white text-center">
            Launch App
          </Link>
        </div>
      )}
    </nav>
  );
}
