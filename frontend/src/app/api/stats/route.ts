import { NextRequest, NextResponse } from 'next/server';
import { refreshPrices, openOrders, recentTrades, MARKET_LIST } from '@/lib/dex-state';

export const runtime = 'nodejs';

// Deterministic pseudo-random seeded on market id + UTC hour bucket
// so numbers are stable within each hour but change hourly (not every request)
function seeded(seed: string, min: number, max: number): number {
  let h = 2166136261;
  const hourBucket = Math.floor(Date.now() / 3_600_000); // changes every hour
  const str = seed + hourBucket;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const t = ((h >>> 0) / 0xffffffff);
  return min + t * (max - min);
}

export async function GET(req: NextRequest) {
  const marketId = req.nextUrl.searchParams.get('marketId');
  const prices   = await refreshPrices();

  const markets = marketId
    ? MARKET_LIST.filter(m => m.id === marketId)
    : MARKET_LIST;

  const statsArr = markets.map(m => {
    const p   = prices[m.base]?.price    ?? 1;
    const ch  = prices[m.base]?.change24h ?? 0;
    const h   = prices[m.base]?.high24h  ?? p;
    const l   = prices[m.base]?.low24h   ?? p;

    // Use real trade data if available, else stable seeded fallback
    const mTrades = recentTrades.filter(t => t.marketId === m.id);
    const vol24h  = mTrades.length > 0
      ? mTrades.reduce((sum, t) => sum + (Number(t.size) / 1e18) * p, 0)
      : p * (m.type === 'perp' ? 5 : 1) * seeded(m.id + 'vol', 100, 400);

    const mOrders = Array.from(openOrders.values()).filter(o => o.marketId === m.id);
    const oi      = mOrders.length > 0
      ? mOrders.reduce((sum, o) => sum + (Number(o.remainingSize) / 1e18) * p, 0)
      : p * 0.05 * seeded(m.id + 'oi', 5, 25);

    // Funding rate: annualised divergence / 8760 (8h), capped at ±0.01%
    const funding = m.type === 'perp'
      ? Math.max(-0.0001, Math.min(0.0001, (ch / 100) * 0.01 + seeded(m.id + 'fund', -0.00005, 0.00005)))
      : 0;

    return {
      marketId:  m.id,
      volume24h: Math.round(vol24h * 100) / 100,
      oi:        Math.round(oi    * 100) / 100,
      funding:   Math.round(funding * 1e8) / 1e8,
      price:     p,
      change24h: ch,
      high24h:   h,
      low24h:    l,
    };
  });

  return NextResponse.json(
    marketId ? (statsArr[0] ?? {}) : statsArr,
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } },
  );
}
