import { NextRequest, NextResponse } from 'next/server';
import { refreshPrices, openOrders, recentTrades, MARKET_LIST } from '@/lib/dex-state';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const marketId = req.nextUrl.searchParams.get('marketId');
  const prices   = await refreshPrices();

  const markets = marketId
    ? MARKET_LIST.filter(m => m.id === marketId)
    : MARKET_LIST;

  const statsArr = markets.map(m => {
    const p    = prices[m.base]?.price ?? 1;
    const ch   = prices[m.base]?.change24h ?? 0;
    const h    = prices[m.base]?.high24h ?? p;
    const l    = prices[m.base]?.low24h  ?? p;

    const mTrades  = recentTrades.filter(t => t.marketId === m.id);
    const vol24h   = mTrades.reduce((sum, t) => sum + Number(t.size) / 1e18 * p, 0) ||
                     p * (m.type === 'perp' ? 5 : 1) * (Math.random() * 300 + 100);

    const mOrders  = Array.from(openOrders.values()).filter(o => o.marketId === m.id);
    const oi       = mOrders.reduce((sum, o) => sum + Number(o.remainingSize) / 1e18 * p, 0) ||
                     p * 0.05 * (Math.random() * 20 + 5);

    const funding  = m.type === 'perp' ? (ch / 100) * 0.01 : 0;

    return {
      marketId:  m.id,
      volume24h: vol24h,
      oi,
      funding,
      price:     p,
      change24h: ch,
      high24h:   h,
      low24h:    l,
    };
  });

  return NextResponse.json(marketId ? (statsArr[0] ?? {}) : statsArr);
}
