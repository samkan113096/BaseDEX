export function StatsSection() {
  const stats = [
    {
      value:   '$2.4B+',
      label:   'Total Volume',
      sub:     'All-time across markets',
      color:   'from-blue-500 to-cyan-400',
      glow:    'shadow-blue-500/20',
    },
    {
      value:   '47,000+',
      label:   'Active Traders',
      sub:     'Monthly active wallets',
      color:   'from-violet-500 to-purple-400',
      glow:    'shadow-violet-500/20',
    },
    {
      value:   '$340M+',
      label:   'Open Interest',
      sub:     'Live perpetual positions',
      color:   'from-emerald-500 to-teal-400',
      glow:    'shadow-emerald-500/20',
    },
    {
      value:   '< 200ms',
      label:   'Order Fill Time',
      sub:     'Median execution latency',
      color:   'from-amber-500 to-orange-400',
      glow:    'shadow-amber-500/20',
    },
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#09091a] to-[#05050f] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2a2a55] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#2a2a55] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`relative bg-[#09091a] border border-[#1a1a35] rounded-2xl p-6 text-center shadow-xl ${s.glow} hover:-translate-y-0.5 transition-all group overflow-hidden`}
            >
              {/* Card glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   style={{ background: `radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.06) 0%, transparent 70%)` }} />

              <div className={`text-3xl sm:text-4xl font-black bg-gradient-to-r ${s.color} bg-clip-text text-transparent mb-1.5`}>
                {s.value}
              </div>
              <div className="text-sm font-bold text-white mb-0.5">{s.label}</div>
              <div className="text-[11px] text-[#4a5068]">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
