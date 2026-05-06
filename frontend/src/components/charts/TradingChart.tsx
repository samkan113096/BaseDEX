'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { useDEXStore, type Timeframe, TIMEFRAME_INTERVALS } from '@/store/dex';
import { apiPath } from '@/lib/api';

const TIMEFRAMES: Timeframe[] = ['1m', '5m', '15m', '1h', '4h', '1d'];

/** Generate deterministic seed candles so the chart is never blank on load */
function seedCandles(price: number, interval: number, count = 200) {
  const now   = Math.floor(Date.now() / 1000);
  const start = now - interval * count;
  const out   = [];
  // Seeded pseudo-random walk (deterministic)
  const primes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47];
  let p = price * 0.97;
  for (let i = 0; i < count; i++) {
    const seed  = (primes[i % primes.length] * (i + 1)) % 100;
    const move  = (seed - 50) / 50 * price * 0.004;
    const open  = p;
    p = Math.max(p + move, price * 0.7);
    const close = p;
    const hi    = Math.max(open, close) * (1 + (primes[(i+3) % primes.length] % 10) / 2000);
    const lo    = Math.min(open, close) * (1 - (primes[(i+5) % primes.length] % 10) / 2000);
    const vol   = (0.5 + (primes[(i+7) % primes.length] % 20) / 10) * (price > 1000 ? 0.05 : price > 100 ? 0.5 : 50);
    out.push({ time: start + i * interval, open, high: hi, low: lo, close, volume: vol });
  }
  // Pin last candle to current price
  const last = out[out.length - 1];
  if (last) { last.close = price; last.high = Math.max(last.high, price); }
  return out;
}

export function TradingChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef     = useRef<IChartApi | null>(null);
  const candleRef    = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeRef    = useRef<ISeriesApi<'Histogram'> | null>(null);
  const seededRef    = useRef(false);

  const candles           = useDEXStore(s => s.candles);
  const setCandles        = useDEXStore(s => s.setCandles);
  const selectedMarket    = useDEXStore(s => s.selectedMarket);
  const selectedTimeframe = useDEXStore(s => s.selectedTimeframe);
  const setTimeframe      = useDEXStore(s => s.setTimeframe);
  const prices            = useDEXStore(s => s.prices);
  const [base]            = selectedMarket.split('-');

  // ── Create chart after layout paint so clientHeight is non-zero ─────────
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    // Wait one animation frame to ensure layout has been calculated
    const raf = requestAnimationFrame(() => {
      if (!containerRef.current) return;

      const w = containerRef.current.clientWidth  || 600;
      const h = containerRef.current.clientHeight || 400;

      const chart = createChart(containerRef.current, {
        layout: {
          background:  { type: ColorType.Solid, color: '#07071a' },
          textColor:   '#4a5068',
          fontSize:    11,
        },
        grid: {
          vertLines: { color: '#0d0d22' },
          horzLines: { color: '#0d0d22' },
        },
        crosshair: {
          mode: 1,
          vertLine: { color: '#2a2a4a', width: 1, style: 2, labelBackgroundColor: '#1a1a3a' },
          horzLine: { color: '#2a2a4a', width: 1, style: 2, labelBackgroundColor: '#1a1a3a' },
        },
        rightPriceScale: {
          borderColor: '#1a1a35',
          textColor:   '#4a5068',
          scaleMargins: { top: 0.08, bottom: 0.22 },
        },
        timeScale: {
          borderColor:    '#1a1a35',
          timeVisible:    true,
          secondsVisible: false,
          rightOffset:    5,
        },
        width:  w,
        height: h,
      });

      const candleSeries = chart.addSeries(CandlestickSeries, {
        upColor:         '#10b981',
        downColor:       '#ef4444',
        borderUpColor:   '#10b981',
        borderDownColor: '#ef4444',
        wickUpColor:     '#10b981',
        wickDownColor:   '#ef4444',
      });

      const volumeSeries = chart.addSeries(HistogramSeries, {
        priceFormat:  { type: 'volume' },
        priceScaleId: 'volume',
      });
      chart.priceScale('volume').applyOptions({
        scaleMargins: { top: 0.82, bottom: 0 },
      });

      chartRef.current  = chart;
      candleRef.current = candleSeries;
      volumeRef.current = volumeSeries;

      // Seed immediately with client-side generated candles so it's never blank
      const markPrice = prices[base]?.price ?? 2847;
      const interval  = TIMEFRAME_INTERVALS[selectedTimeframe];
      const seed      = seedCandles(markPrice, interval, 200);
      candleSeries.setData(seed.map(c => ({ time: c.time as Time, open: c.open, high: c.high, low: c.low, close: c.close })));
      volumeSeries.setData(seed.map(c => ({ time: c.time as Time, value: c.volume, color: c.close >= c.open ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)' })));
      chart.timeScale().fitContent();
      seededRef.current = true;

      // Resize observer
      const ro = new ResizeObserver(() => {
        if (containerRef.current) {
          chart.resize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        }
      });
      ro.observe(containerRef.current);

      // Cleanup
      return () => { ro.disconnect(); };
    });

    return () => {
      cancelAnimationFrame(raf);
      chartRef.current?.remove();
      chartRef.current  = null;
      candleRef.current = null;
      volumeRef.current = null;
      seededRef.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only on mount

  // ── Fetch + apply real candle data from API ──────────────────────────────
  useEffect(() => {
    const interval = TIMEFRAME_INTERVALS[selectedTimeframe];
    fetch(apiPath(`/api/candles/${selectedMarket}?timeframe=${selectedTimeframe}&interval=${interval}&limit=300`))
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => { if (Array.isArray(data) && data.length > 0) setCandles(data); })
      .catch(() => {/* keep seeded candles */});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMarket, selectedTimeframe]);

  // ── Apply candles to chart when store updates ────────────────────────────
  useEffect(() => {
    if (!candleRef.current || !volumeRef.current) return;
    const data = candles.length > 0 ? candles : [];
    if (data.length === 0) return;

    const candleData = data.map(c => ({ time: c.time as Time, open: c.open, high: c.high, low: c.low, close: c.close }));
    const volumeData = data.map(c => ({ time: c.time as Time, value: c.volume, color: c.close >= c.open ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)' }));
    candleRef.current.setData(candleData);
    volumeRef.current.setData(volumeData);
    chartRef.current?.timeScale().fitContent();
  }, [candles]);

  // ── Re-seed when market/timeframe changes (before API response arrives) ──
  useEffect(() => {
    if (!candleRef.current || !volumeRef.current || !seededRef.current) return;
    const markPrice = prices[base]?.price ?? 2847;
    const interval  = TIMEFRAME_INTERVALS[selectedTimeframe];
    const seed      = seedCandles(markPrice, interval, 200);
    candleRef.current.setData(seed.map(c => ({ time: c.time as Time, open: c.open, high: c.high, low: c.low, close: c.close })));
    volumeRef.current.setData(seed.map(c => ({ time: c.time as Time, value: c.volume, color: c.close >= c.open ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)' })));
    chartRef.current?.timeScale().fitContent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMarket, selectedTimeframe]);

  const markPrice = prices[base]?.price ?? 0;
  const change    = prices[base]?.change24h ?? 0;

  return (
    <div className="flex flex-col h-full bg-[#07071a]">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 h-10 border-b border-[#1a1a35] shrink-0 bg-[#0d0d22]">
        {/* Timeframe buttons */}
        <div className="flex items-center gap-0.5 bg-[#07071a] rounded-lg p-0.5 border border-[#1a1a35]">
          {TIMEFRAMES.map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                selectedTimeframe === tf
                  ? 'bg-[#1a1a3a] text-blue-400 border border-blue-500/20'
                  : 'text-[#4a5068] hover:text-[#8890a8]'
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="w-px h-4 bg-[#1a1a35]" />
        <span className="text-[11px] text-[#4a5068] font-mono font-medium">{selectedMarket}</span>
        {markPrice > 0 && (
          <span className={`text-[11px] font-mono font-bold ml-auto ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {change >= 0 ? '+' : ''}{change.toFixed(2)}%
          </span>
        )}
      </div>

      {/* Chart container */}
      <div ref={containerRef} className="flex-1 min-h-0 w-full" />
    </div>
  );
}
