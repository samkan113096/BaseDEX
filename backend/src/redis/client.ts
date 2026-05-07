import { Redis } from 'ioredis';

const url = process.env.REDIS_URL ?? 'redis://localhost:6379';

export const redis = new Redis(url, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  enableOfflineQueue: false,
});

// Separate pub/sub client — cannot share one connection for both
export const redisSub = new Redis(url, {
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

// ── Helpers ───────────────────────────────────────────────────────────────────

export async function setPrice(symbol: string, price: number, change24h = 0): Promise<void> {
  await redis.hset('prices', symbol, JSON.stringify({ price, change24h, ts: Date.now() }));
}

export async function getPrices(): Promise<Record<string, { price: number; change24h: number }>> {
  const raw = await redis.hgetall('prices');
  const out: Record<string, { price: number; change24h: number }> = {};
  for (const [sym, val] of Object.entries(raw)) {
    try { out[sym] = JSON.parse(val as string); } catch { /* skip */ }
  }
  return out;
}

export async function publish(channel: string, data: object): Promise<void> {
  await redis.publish(channel, JSON.stringify(data));
}
