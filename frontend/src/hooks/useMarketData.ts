'use client';

import { useEffect, useRef } from 'react';
import { useDEXStore, TIMEFRAME_INTERVALS } from '@/store/dex';

/**
 * When NEXT_PUBLIC_API_URL is set, we call that separate backend.
 * When it is unset (Netlify deploy), we call the built-in Next.js API routes
 * via relative paths — no external server required.
 */
const RAW_API = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');
const API_URL = RAW_API;                           // '' → relative paths like /api/...
const WS_URL  = process.env.NEXT_PUBLIC_WS_URL;   // undefined → polling-only mode

function apiPath(path: string) {
  // path must start with /
  return API_URL ? `${API_URL}${path}` : path;
}

export function useMarketDataSocket() {
  const ws    = useRef<WebSocket | null>(null);
  const store = useDEXStore();

  // ── 1. Candles + Trades when market/timeframe changes ─────────────────
  useEffect(() => {
    const interval = TIMEFRAME_INTERVALS[store.selectedTimeframe];
    fetch(apiPath(`/api/candles/${store.selectedMarket}?timeframe=${store.selectedTimeframe}&interval=${interval}&limit=300`))
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => { if (Array.isArray(data)) store.setCandles(data); })
      .catch(() => {});

    fetch(apiPath(`/api/trades/${store.selectedMarket}?limit=50`))
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => { if (Array.isArray(data)) store.setRecentTrades(data); })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.selectedMarket, store.selectedTimeframe]);

  // ── 2. Prices — initial load + polling every 15 s ─────────────────────
  useEffect(() => {
    function loadPrices() {
      fetch(apiPath('/api/prices'))
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
        .then((data: Record<string, { price: number; change24h: number; high24h: number; low24h: number }>) => {
          for (const [sym, info] of Object.entries(data)) {
            store.setPrice(sym, info);
          }
        })
        .catch(() => {});
    }
    loadPrices();
    const id = setInterval(loadPrices, 15_000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 3. Order-book polling (every 2 s) — always active ─────────────────
  useEffect(() => {
    function loadBook() {
      fetch(apiPath(`/api/orderbook/${store.selectedMarket}`))
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
        .then((data: { bids: { price: string; size: string; count: number }[]; asks: typeof data.bids }) => {
          if (data?.bids && data?.asks) store.setOrderBook(data.bids, data.asks);
        })
        .catch(() => {});
    }
    loadBook();
    const id = setInterval(loadBook, 2_000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.selectedMarket]);

  // ── 4. Recent trades polling (every 5 s) ──────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      fetch(apiPath(`/api/trades/${store.selectedMarket}?limit=50`))
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
        .then(data => { if (Array.isArray(data)) store.setRecentTrades(data); })
        .catch(() => {});
    }, 5_000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.selectedMarket]);

  // ── 5. Optional WebSocket — only if WS_URL is explicitly configured ────
  useEffect(() => {
    if (!WS_URL) return; // no WS on Netlify, polling handles everything above
    let alive = true;
    let reconnectTimer: NodeJS.Timeout;

    function connect() {
      const socket = new WebSocket(WS_URL!);
      ws.current   = socket;

      socket.onopen = () => {
        socket.send(JSON.stringify({
          action:   'subscribe',
          markets:  [store.selectedMarket, '*'],
          channels: ['orderbook', 'trades', 'candles', 'prices'],
        }));
      };

      socket.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data as string) as { type: string; marketId?: string; data: unknown };
          switch (msg.type) {
            case 'orderbook': {
              const d = msg.data as { bids: { price: string; size: string; count: number }[]; asks: typeof d.bids };
              if (msg.marketId === store.selectedMarket) store.setOrderBook(d.bids, d.asks);
              break;
            }
            case 'trades':
              if (msg.marketId === store.selectedMarket) store.addTrade(msg.data as Parameters<typeof store.addTrade>[0]);
              break;
            case 'recentTrades':
              if (msg.marketId === store.selectedMarket) store.setRecentTrades(msg.data as Parameters<typeof store.setRecentTrades>[0]);
              break;
            case 'candles':
              if (msg.marketId === store.selectedMarket) store.updateCandle(msg.data as Parameters<typeof store.updateCandle>[0]);
              break;
            case 'price': {
              const d = msg.data as { symbol: string; price: number; change24h?: number; high24h?: number; low24h?: number };
              store.setPrice(d.symbol, {
                price:     d.price,
                ...(d.change24h !== undefined && { change24h: d.change24h }),
                ...(d.high24h   !== undefined && { high24h:   d.high24h   }),
                ...(d.low24h    !== undefined && { low24h:    d.low24h    }),
              });
              break;
            }
          }
        } catch { /* noop */ }
      };

      socket.onclose = () => {
        if (alive) reconnectTimer = setTimeout(connect, 3000);
      };
    }

    connect();
    return () => {
      alive = false;
      clearTimeout(reconnectTimer);
      ws.current?.close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.selectedMarket]);

  return ws;
}
