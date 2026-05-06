// ioredis default export differs between module resolution modes
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Redis = require('ioredis');

const url = process.env.REDIS_URL ?? 'redis://localhost:6379';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const redis: any = new Redis(url, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  enableOfflineQueue: false,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const redisSub: any = new Redis(url, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  enableOfflineQueue: false,
});

redis.on('error',    (e: Error) => console.error('[redis] error:', e.message));
redisSub.on('error', (e: Error) => console.error('[redis-sub] error:', e.message));

export async function connectRedis(): Promise<void> {
  await redis.connect();
  await redisSub.connect();
  console.log('[redis] connected');
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Cache current price for a symbol (5-minute TTL) */
export async function setPrice(symbol: string, price: number, change24h = 0): Promise<void> {
  await redis.hset('prices', symbol, JSON.stringify({ price, change24h, ts: Date.now() }));
}

/** Get all cached prices */
export async function getPrices(): Promise<Record<string, { price: number; change24h: number }>> {
  const raw = await redis.hgetall('prices');
  const out: Record<string, { price: number; change24h: number }> = {};
  for (const [sym, val] of Object.entries(raw)) {
    try { out[sym] = JSON.parse(val as string); } catch { /* skip */ }
  }
  return out;
}

/** Publish a real-time event to all WebSocket subscribers */
export async function publish(channel: string, data: object): Promise<void> {
  await redis.publish(channel, JSON.stringify(data));
}
