'use client';

import { useEffect, useRef, useState } from 'react';

const STATS = [
  {
    value:  11,
    decimals: 0,
    suffix: '',
    prefix: '',
    label:  'Perp Markets',
    sub:    'ETH, BTC, SOL, DOGE + more',
    color:  'from-blue-400 to-cyan-400',
    glow:   'rgba(59,130,246,0.2)',
    border: '#3b82f625',
    icon:   '📈',
  },
  {
    value:  20,
    decimals: 0,
    suffix: '×',
    prefix: '',
    label:  'Max Leverage',
    sub:    'On all perpetual markets',
    color:  'from-violet-400 to-purple-400',
    glow:   'rgba(139,92,246,0.2)',
    border: '#8b5cf625',
    icon:   '⚡',
  },
  {
    value:  0.05,
    decimals: 2,
    suffix: '%',
    prefix: '',
    label:  'Taker Fee',
    sub:    'Maker rebates available',
    color:  'from-emerald-400 to-teal-400',
    glow:   'rgba(16,185,129,0.2)',
    border: '#10b98125',
    icon:   '💎',
  },
  {
    value:  200,
    decimals: 0,
    suffix: 'ms',
    prefix: '<',
    label:  'Fill Speed',
    sub:    'Median order execution',
    color:  'from-amber-400 to-orange-400',
    glow:   'rgba(245,158,11,0.2)',
    border: '#f59e0b25',
    icon:   '🚀',
  },
];

function useCountUp(target: number, duration = 1600, decimals = 0) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>(0);

  function start() {
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out-cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
  }

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);
  return { count, start };
}

function StatCard({ s }: { s: typeof STATS[0] }) {
  const { count, start } = useCountUp(s.value, 1400, s.decimals);
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          start();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={ref}
      className="relative rounded-2xl p-7 text-center overflow-hidden group hover:-translate-y-1.5 transition-all duration-300 cursor-default"
      style={{
        background: '#09091a',
        border:     `1px solid ${s.border}`,
        boxShadow:  `0 0 40px ${s.glow}, inset 0 1px 0 rgba(255,255,255,.04)`,
      }}
    >
      {/* Inner glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${s.glow} 0%, transparent 65%)` }}
      />
      {/* Top shimmer line */}
      <div
        className="absolute inset-x-0 top-0 h-[1px]"
        style={{ background: `linear-gradient(90deg, transparent, ${s.glow.replace('0.2','0.6')}, transparent)` }}
      />

      <div className="relative">
        <div className="text-3xl mb-3 opacity-70">{s.icon}</div>
        <div className={`text-5xl sm:text-6xl font-black bg-gradient-to-r ${s.color} bg-clip-text text-transparent mb-2 tabular-nums`}>
          {s.prefix}{count.toFixed(s.decimals)}<span className="text-3xl sm:text-4xl">{s.suffix}</span>
        </div>
        <div className="text-sm font-black text-white mb-1.5">{s.label}</div>
        <div className="text-[12px] text-[#4a5068] leading-tight">{s.sub}</div>
      </div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#05050f] via-[#07071a] to-[#05050f]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2a2a55] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#2a2a55] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {STATS.map((s, i) => <StatCard key={i} s={s} />)}
        </div>
      </div>
    </section>
  );
}
