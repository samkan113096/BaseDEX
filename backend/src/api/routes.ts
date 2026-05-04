import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { engine } from '../engine/matching.js';
import { latestPrices, priceChanges, highPrices24h, lowPrices24h } from '../services/oracle.js';

const PlaceOrderSchema = z.object({
  marketId:  z.string(),
  trader:    z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  side:      z.enum(['buy', 'sell']),
  type:      z.enum(['limit', 'market']),
  price:     z.string().transform(BigInt).optional(),
  size:      z.string().transform(BigInt),
  leverage:  z.number().min(1).max(20).optional(),
  nonce:     z.string().transform(BigInt),
  expiry:    z.number(),
  signature: z.string(),
});

export function registerApiRoutes(app: FastifyInstance) {
  app.get('/api/markets', async () =>
    engine.getMarkets().map(m => ({
      ...m,
      tickSize:    m.tickSize.toString(),
      stepSize:    m.stepSize.toString(),
      minOrderSize: m.minOrderSize.toString(),
    }))
  );

  app.get('/api/prices', async () => {
    const out: Record<string, { price: number; change24h: number; high24h: number; low24h: number }> = {};
    for (const [sym, price] of Object.entries(latestPrices)) {
      out[sym] = {
        price,
        change24h: priceChanges[sym] ?? 0,
        high24h:   highPrices24h[sym] ?? price,
        low24h:    lowPrices24h[sym]  ?? price,
      };
    }
    return out;
  });

  app.get<{ Params: { marketId: string }; Querystring: { depth?: string } }>(
    '/api/orderbook/:marketId', async (req, reply) => {
      const snap = engine.getOrderBook(req.params.marketId, parseInt(req.query.depth ?? '50'));
      if (!snap) return reply.status(404).send({ error: 'market not found' });
      return {
        ...snap,
        bids: snap.bids.map(l => ({ price: l.price.toString(), size: l.size.toString(), count: l.count })),
        asks: snap.asks.map(l => ({ price: l.price.toString(), size: l.size.toString(), count: l.count })),
      };
    }
  );

  app.get<{ Params: { marketId: string }; Querystring: { limit?: string } }>(
    '/api/trades/:marketId', async (req) => {
      const trades = engine.getRecentTrades(req.params.marketId, parseInt(req.query.limit ?? '50'));
      return trades.map(t => ({ ...t, price: t.price.toString(), size: t.size.toString() }));
    }
  );

  app.get<{ Params: { marketId: string }; Querystring: { interval?: string; limit?: string } }>(
    '/api/candles/:marketId', async (req) =>
      engine.getCandles(req.params.marketId, parseInt(req.query.interval ?? '60'), parseInt(req.query.limit ?? '300'))
  );

  app.post('/api/orders', async (req, reply) => {
    const parsed = PlaceOrderSchema.safeParse(req.body);
    if (!parsed.success) return reply.status(400).send({ error: parsed.error.flatten() });
    const body = parsed.data;
    try {
      const result = engine.placeOrder({
        marketId: body.marketId, trader: body.trader, side: body.side, type: body.type,
        price: body.price ?? 0n, size: body.size, leverage: body.leverage,
        nonce: body.nonce, expiry: body.expiry, signature: body.signature,
      });
      return {
        order: { ...result.order, price: result.order.price.toString(), size: result.order.size.toString(), remainingSize: result.order.remainingSize.toString(), nonce: result.order.nonce.toString() },
        fills: result.fills.map(f => ({ ...f, price: f.price.toString(), size: f.size.toString() })),
      };
    } catch (err) { return reply.status(400).send({ error: (err as Error).message }); }
  });

  app.delete<{ Params: { marketId: string; orderId: string } }>(
    '/api/orders/:marketId/:orderId', async (req, reply) => {
      const order = engine.cancelOrder(req.params.marketId, req.params.orderId);
      if (!order) return reply.status(404).send({ error: 'order not found' });
      return { success: true, orderId: order.id };
    }
  );

  app.get('/api/stats', async () => engine.getStats24h());

  app.get('/api/health', async () => ({ status: 'ok', ts: Date.now() }));
}
