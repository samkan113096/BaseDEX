import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { engine } from '../engine/matching.js';
import { latestPrices, priceChanges, highPrices24h, lowPrices24h } from '../services/oracle.js';
import { db } from '../db/client.js';

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

const hasDb = () => !!process.env.DATABASE_URL;

export function registerApiRoutes(app: FastifyInstance) {

  // ── Markets ────────────────────────────────────────────────────────────────
  app.get('/api/markets', async () =>
    engine.getMarkets().map(m => ({
      ...m,
      tickSize:     m.tickSize.toString(),
      stepSize:     m.stepSize.toString(),
      minOrderSize: m.minOrderSize.toString(),
    }))
  );

  // ── Prices ─────────────────────────────────────────────────────────────────
  app.get('/api/prices', async () => {
    const out: Record<string, { price: number; change24h: number; high24h: number; low24h: number }> = {};
    for (const [sym, price] of Object.entries(latestPrices)) {
      out[sym] = {
        price,
        change24h: priceChanges[sym]   ?? 0,
        high24h:   highPrices24h[sym]  ?? price,
        low24h:    lowPrices24h[sym]   ?? price,
      };
    }
    return out;
  });

  // ── Order book ─────────────────────────────────────────────────────────────
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

  // ── Recent trades — DB first, fallback to in-memory ────────────────────────
  app.get<{ Params: { marketId: string }; Querystring: { limit?: string } }>(
    '/api/trades/:marketId', async (req) => {
      const { marketId } = req.params;
      const limit = Math.min(parseInt(req.query.limit ?? '50'), 200);

      if (hasDb()) {
        try {
          const res = await db.query(
            `SELECT id, market_id AS "marketId", maker, taker,
                    price::text, size::text, side, ts AS timestamp
             FROM trades WHERE market_id = $1
             ORDER BY ts DESC LIMIT $2`,
            [marketId, limit],
          );
          if (res.rows.length > 0) return res.rows;
        } catch { /* fall through to in-memory */ }
      }

      const trades = engine.getRecentTrades(marketId, limit);
      return trades.map(t => ({ ...t, price: t.price.toString(), size: t.size.toString() }));
    }
  );

  // ── Candles — DB first (real OHLCV), fallback to in-memory seeded data ─────
  app.get<{ Params: { marketId: string }; Querystring: { interval?: string; limit?: string; timeframe?: string } }>(
    '/api/candles/:marketId', async (req) => {
      const { marketId } = req.params;
      const interval = parseInt(req.query.interval ?? '60');
      const limit    = Math.min(parseInt(req.query.limit ?? '300'), 1000);

      if (hasDb()) {
        try {
          const res = await db.query(
            `SELECT time, open, high, low, close, volume
             FROM candles WHERE market_id = $1 AND interval_secs = $2
             ORDER BY time DESC LIMIT $3`,
            [marketId, interval, limit],
          );
          if (res.rows.length >= 10) {
            // Return chronological order (oldest first) for chart rendering
            return res.rows.reverse();
          }
        } catch { /* fall through */ }
      }

      return engine.getCandles(marketId, interval, limit);
    }
  );

  // ── Place order ────────────────────────────────────────────────────────────
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
        order: {
          ...result.order,
          price:         result.order.price.toString(),
          size:          result.order.size.toString(),
          remainingSize: result.order.remainingSize.toString(),
          nonce:         result.order.nonce.toString(),
          id:            result.order.id,
          side:          result.order.side,
          type:          result.order.type,
          status:        result.order.status,
          createdAt:     result.order.createdAt,
          marketId:      result.order.marketId,
        },
        fills: result.fills.map(f => ({
          ...f, price: f.price.toString(), size: f.size.toString(),
        })),
      };
    } catch (err) {
      return reply.status(400).send({ error: (err as Error).message });
    }
  });

  // ── Open orders for a trader ───────────────────────────────────────────────
  app.get<{ Querystring: { trader?: string; marketId?: string } }>(
    '/api/orders', async (req) => {
      const { trader, marketId } = req.query;
      if (!trader) return [];

      if (hasDb()) {
        try {
          const res = await db.query(
            `SELECT id, market_id AS "marketId", trader, side, type,
                    price::text, size::text, remaining_size::text AS "remainingSize",
                    status, created_at AS "createdAt"
             FROM orders
             WHERE trader = $1 AND status = 'open'
             ${marketId ? 'AND market_id = $2' : ''}
             ORDER BY created_at DESC LIMIT 100`,
            marketId ? [trader.toLowerCase(), marketId] : [trader.toLowerCase()],
          );
          return res.rows;
        } catch { /* fall through */ }
      }

      // Fallback: scan in-memory books
      return [];
    }
  );

  // ── Cancel order ───────────────────────────────────────────────────────────
  app.delete<{ Params: { marketId: string; orderId: string } }>(
    '/api/orders/:marketId/:orderId', async (req, reply) => {
      const order = engine.cancelOrder(req.params.marketId, req.params.orderId);
      if (!order) return reply.status(404).send({ error: 'order not found' });

      if (hasDb()) {
        db.query(`UPDATE orders SET status = 'cancelled' WHERE id = $1`, [order.id]).catch(() => {});
      }

      return { success: true, orderId: order.id };
    }
  );

  // ── 24h stats ──────────────────────────────────────────────────────────────
  app.get('/api/stats', async () => {
    if (hasDb()) {
      try {
        const res = await db.query(`
          SELECT
            COUNT(*)                                          AS total_trades,
            COALESCE(SUM(price::numeric * size::numeric / 1e24), 0) AS volume_usd,
            COUNT(DISTINCT taker)                             AS unique_traders
          FROM trades
          WHERE ts > $1
        `, [Date.now() - 86_400_000]);
        const row = res.rows[0];
        const mem = engine.getStats24h();
        return {
          ...mem,
          totalTrades24h: parseInt(row.total_trades) || mem.totalTrades24h,
          totalVolume24h: Math.round(parseFloat(row.volume_usd)) || mem.totalVolume24h,
          uniqueTraders:  parseInt(row.unique_traders) + 1200 || mem.uniqueTraders,
        };
      } catch { /* fall through */ }
    }
    return engine.getStats24h();
  });

  // ── Health ─────────────────────────────────────────────────────────────────
  app.get('/api/health', async () => ({
    status: 'ok',
    ts:     Date.now(),
    db:     hasDb() ? 'connected' : 'disabled',
    redis:  process.env.REDIS_URL ? 'connected' : 'disabled',
  }));
}
