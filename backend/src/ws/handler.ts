import type { FastifyInstance } from 'fastify';
import type { WebSocket } from '@fastify/websocket';
import { engine } from '../engine/matching.js';
import { oracle } from '../services/oracle.js';
import { toJSON } from '../lib/json.js';

type Subscription = {
  markets:   Set<string>;
  channels:  Set<string>;  // 'orderbook', 'trades', 'candles', 'prices', 'positions'
  trader?:   string;
};

const clients = new Map<WebSocket, Subscription>();

function broadcast(channel: string, marketId: string, payload: unknown) {
  const msg = toJSON({ type: channel, marketId, data: payload });
  for (const [ws, sub] of clients) {
    if (ws.readyState !== 1) continue;
    if (sub.channels.has(channel) && (sub.markets.has(marketId) || sub.markets.has('*'))) {
      ws.send(msg);
    }
  }
}

function broadcastAll(type: string, payload: unknown) {
  const msg = toJSON({ type, data: payload });
  for (const [ws] of clients) {
    if (ws.readyState === 1) ws.send(msg);
  }
}

export function registerWsRoutes(app: FastifyInstance) {
  // Engine events → broadcast
  engine.on('bookUpdate', (snap) => broadcast('orderbook', snap.marketId, snap));
  engine.on('fill',       (fill) => broadcast('trades',    fill.marketId, fill));
  engine.on('orderUpdate',(order) => {
    // Only send to the owning trader
    for (const [ws, sub] of clients) {
      if (ws.readyState !== 1) continue;
      if (sub.trader?.toLowerCase() === order.trader) {
        ws.send(toJSON({ type: 'orderUpdate', data: order }));
      }
    }
  });
  engine.on('candleUpdate', ({ marketId, candle }) =>
    broadcast('candles', marketId, candle)
  );

  oracle.on('price', ({ symbol, price }) => {
    broadcastAll('price', { symbol, price });
  });

  // WebSocket endpoint
  app.get('/ws', { websocket: true }, (socket) => {
    const sub: Subscription = { markets: new Set(), channels: new Set() };
    clients.set(socket, sub);

    socket.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString()) as {
          action: string;
          markets?: string[];
          channels?: string[];
          trader?: string;
        };

        switch (msg.action) {
          case 'subscribe':
            (msg.markets  ?? []).forEach(m => sub.markets.add(m));
            (msg.channels ?? []).forEach(c => sub.channels.add(c));
            if (msg.trader) sub.trader = msg.trader.toLowerCase();
            // Send current snapshots immediately
            for (const mkt of sub.markets) {
              if (sub.channels.has('orderbook')) {
                const snap = engine.getOrderBook(mkt);
                if (snap) socket.send(toJSON({ type: 'orderbook', marketId: mkt, data: snap }));
              }
              if (sub.channels.has('trades')) {
                const trades = engine.getRecentTrades(mkt, 50);
                socket.send(toJSON({ type: 'recentTrades', marketId: mkt, data: trades }));
              }
            }
            break;

          case 'unsubscribe':
            (msg.markets  ?? []).forEach(m => sub.markets.delete(m));
            (msg.channels ?? []).forEach(c => sub.channels.delete(c));
            break;

          case 'ping':
            socket.send(toJSON({ type: 'pong' }));
            break;
        }
      } catch { /* ignore */ }
    });

    socket.on('close', () => clients.delete(socket));
    socket.on('error', () => clients.delete(socket));

    socket.send(toJSON({
      type: 'connected',
      data: { markets: engine.getMarkets() },
    }));
  });
}
