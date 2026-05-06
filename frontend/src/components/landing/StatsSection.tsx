'use client';

import { useEffect, useRef, useState } from 'react';

const STATS = [
  { value: 11,   decimals: 0, suffix: '',    prefix: '',  label: 'Perp Markets',  sub: 'ETH, BTC, SOL, DOGE + more', color: '#60a5fa', glow: 'rgba(59,130,246,0.18)',   border: 'rgba(59,130,246,0.18)',  icon: '📈' },
  { value: 20,   decimals: 0, suffix: '×',   prefix: '',  label: 'Max Leverage',  sub: 'On all perpetual markets',    color: '#a78bfa', glow: 'rgba(139,92,246,0.18)',   border: 'rgba(139,92,246,0.18)', icon: '⚡' },
  { value: 0.05, decimals: 2, suffix: '%',   prefix: '',  label: 'Taker Fee',     sub: 'Maker rebates available',     color: '#34d399', glow: 'rgba(16,185,129,0.18)',   border: 'rgba(16,185,129,0.18)', icon: '💎' },
  { value: 200,  decimals: 0, suffix: 'ms',  prefix: '<', label: 'Fill Speed',    sub: 'Median order execution',      color: '#fbbf24', glow: 'rgba(245,158,11,0.18)',   border: 'rgba(245,158,11,0.18)', icon: '🚀' },
];

function useCountUp(target: number, duration = 1400, decimals = 0) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  function start() {
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(parseFloat((eased * target).toFixed(decimals)));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
      else setCount(target);
    };
    rafRef.current = requestAnimationFrame(step);
  }
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);
  return { count, start };
}

function StatCard({ s }: { s: typeof STATS[0] }) {
  const { count, start } = useCountUp(s.value, 1400, s.decimals);
  const ref   = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !fired.current) { fired.current = true; start(); } },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={ref}
      className="relative rounded-2xl p-7 text-center overflow-hidden group hover:-translate-y-1.5 transition-all duration-300 cursor-default"
      style={{
        background: '#0a0a1e',
        border:     `1px solid ${s.border}`,
        boxShadow:  `0 0 32px ${s.glow}, inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      {/* Top shimmer line */}
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${s.color}80, transparent)` }} />
      {/* Inner hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${s.glow} 0%, transparent 65%)` }}
      />

      <div className="relative">
        <div className="text-3xl mb-3">{s.icon}</div>
        {/* Number — plain inline style color so it's always visible */}
        <div className="text-5xl sm:text-[56px] font-black mb-2 tabular-nums leading-none" style={{ color: s.color }}>
          {s.prefix}{count.toFixed(s.decimals)}<span className="text-3xl sm:text-4xl">{s.suffix}</span>
        </div>
        <div className="text-sm font-black text-white mb-1.5">{s.label}</div>
        <div className="text-[12px]" style={{ color: 'rgba(100,110,140,1)' }}>{s.sub}</div>
      </div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #05050f 0%, #07071a 50%, #05050f 100%)' }} />
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(42,42,85,0.8), transparent)' }} />
      <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(42,42,85,0.8), transparent)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {STATS.map((s, i) => <StatCard key={i} s={s} />)}
        </div>
      </div>
    </section>
  );
}
