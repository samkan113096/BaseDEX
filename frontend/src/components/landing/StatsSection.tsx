'use client';

const STATS = [
  {
    value:   '11',
    suffix:  '',
    label:   'Perp Markets',
    sub:     'ETH, BTC, SOL, DOGE + more',
    color:   'from-blue-400 to-cyan-400',
    glow:    'rgba(59,130,246,0.15)',
    border:  '#3b82f620',
  },
  {
    value:   '20',
    suffix:  '×',
    label:   'Max Leverage',
    sub:     'On all perpetual markets',
    color:   'from-violet-400 to-purple-400',
    glow:    'rgba(139,92,246,0.15)',
    border:  '#8b5cf620',
  },
  {
    value:   '0.05',
    suffix:  '%',
    label:   'Taker Fee',
    sub:     'Competitive maker rebates',
    color:   'from-emerald-400 to-teal-400',
    glow:    'rgba(16,185,129,0.15)',
    border:  '#10b98120',
  },
  {
    value:   '200',
    suffix:  'ms',
    label:   'Fill Speed',
    sub:     'Median order execution',
    color:   'from-amber-400 to-orange-400',
    glow:    'rgba(245,158,11,0.15)',
    border:  '#f59e0b20',
  },
];

export function StatsSection() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#05050f] via-[#07071a] to-[#05050f]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2a2a55] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#2a2a55] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="relative rounded-2xl p-6 text-center overflow-hidden group hover:-translate-y-1 transition-all duration-300"
              style={{
                background: '#09091a',
                border: `1px solid ${s.border}`,
                boxShadow: `0 0 40px ${s.glow}`,
              }}
            >
              {/* Inner glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${s.glow} 0%, transparent 70%)` }}
              />
              <div className={`relative text-4xl sm:text-5xl font-black bg-gradient-to-r ${s.color} bg-clip-text text-transparent mb-1`}>
                {s.value}<span className="text-2xl sm:text-3xl">{s.suffix}</span>
              </div>
              <div className="relative text-sm font-black text-white mb-1">{s.label}</div>
              <div className="relative text-[11px] text-[#4a5068]">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
