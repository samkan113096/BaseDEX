'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { useDEXStore, type Timeframe } from '@/store/dex';

const TIMEFRAMES: Timeframe[] = ['1m', '5m', '15m', '1h', '4h', '1d'];

export function TradingChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef     = useRef<IChartApi | null>(null);
  const candleRef    = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeRef    = useRef<ISeriesApi<'Histogram'> | null>(null);

  const candles          = useDEXStore(s => s.candles);
  const selectedMarket   = useDEXStore(s => s.selectedMarket);
  const selectedTimeframe = useDEXStore(s => s.selectedTimeframe);
  const setTimeframe     = useDEXStore(s => s.setTimeframe);
  const [base] = selectedMarket.split('-');

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background:  { type: ColorType.Solid, color: '#08081a' },
        textColor:   '#4a4a6a',
        fontSize:    11,
      },
      grid: {
        vertLines: { color: '#0f0f22' },
        horzLines: { color: '#0f0f22' },
      },
      crosshair: {
        mode: 1,
        vertLine: { color: '#2a2a4a', width: 1, style: 2, labelBackgroundColor: '#1a1a3a' },
        horzLine: { color: '#2a2a4a', width: 1, style: 2, labelBackgroundColor: '#1a1a3a' },
      },
      rightPriceScale: {
        borderColor:      '#1e1e3a',
        textColor:        '#4a4a6a',
        scaleMargins:     { top: 0.1, bottom: 0.2 },
      },
      timeScale: {
        borderColor:    '#1e1e3a',
        timeVisible:    true,
        secondsVisible: false,
      },
      width:  containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
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
      priceFormat:    { type: 'volume' },
      priceScaleId:   'volume',
    });

    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    chartRef.current  = chart;
    candleRef.current = candleSeries;
    volumeRef.current = volumeSeries;

    const ro = new ResizeObserver(() => {
      if (containerRef.current) {
        chart.resize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      }
    });
    ro.observe(containerRef.current);

    return () => { ro.disconnect(); chart.remove(); };
  }, []);

  useEffect(() => {
    if (!candleRef.current || !volumeRef.current || candles.length === 0) return;
    const candleData = candles.map(c => ({
      time:  c.time as Time,
      open:  c.open,  high: c.high,
      low:   c.low,   close: c.close,
    }));
    const volumeData = candles.map(c => ({
      time:  c.time as Time,
      value: c.volume,
      color: c.close >= c.open ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
    }));
    candleRef.current.setData(candleData);
    volumeRef.current.setData(volumeData);
    chartRef.current?.timeScale().fitContent();
  }, [candles, selectedMarket, selectedTimeframe]);

  return (
    <div className="flex flex-col h-full bg-[#08081a]">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 h-9 border-b border-[#1e1e3a] shrink-0">
        <div className="flex items-center gap-0.5 bg-[#0f0f22] rounded-lg p-0.5">
          {TIMEFRAMES.map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                selectedTimeframe === tf
                  ? 'bg-[#1a1a3a] text-blue-400'
                  : 'text-[#4a4a6a] hover:text-[#888]'
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="w-px h-4 bg-[#1e1e3a]" />
        <span className="text-[11px] text-[#4a4a6a] font-medium">{selectedMarket}</span>
      </div>

      {/* Chart */}
      <div className="relative flex-1 min-h-0">
        <div ref={containerRef} className="w-full h-full" />
        {candles.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#08081a]">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-500/50 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-[#4a4a6a] text-sm">Loading {base} chart...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
