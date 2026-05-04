'use client';

import { useEffect, useRef } from 'react';
import { useDEXStore, TIMEFRAME_INTERVALS } from '@/store/dex';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:3001/ws';
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export function useMarketDataSocket() {
  const ws  = useRef<WebSocket | null>(null);
  const store = useDEXStore();

  // Load candles via REST when market/timeframe changes
  useEffect(() => {
    const interval = TIMEFRAME_INTERVALS[store.selectedTimeframe];
    fetch(`${API_URL}/api/candles/${store.selectedMarket}?interval=${interval}&limit=300`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) store.setCandles(data); })
      .catch(() => {});

    fetch(`${API_URL}/api/trades/${store.selectedMarket}?limit=50`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) store.setRecentTrades(data); })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.selectedMarket, store.selectedTimeframe]);

  // Fetch prices from REST (initial)
  useEffect(() => {
    fetch(`${API_URL}/api/prices`)
      .then(r => r.json())
      .then((data: Record<string, { price: number; change24h: number; high24h: number; low24h: number }>) => {
        for (const [sym, info] of Object.entries(data)) {
          store.setPrice(sym, info);
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // WebSocket for real-time
  useEffect(() => {
    let alive = true;
    let reconnectTimer: NodeJS.Timeout;

    function connect() {
      const socket = new WebSocket(WS_URL);
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
              const d = msg.data as { symbol: string; price: number; change?: number };
              store.setPrice(d.symbol, { price: d.price, change24h: d.change });
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
