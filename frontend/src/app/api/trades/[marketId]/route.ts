import { NextRequest, NextResponse } from 'next/server';
import { refreshPrices, recentTrades, MARKET_LIST } from '@/lib/dex-state';

export const runtime = 'nodejs';

// Generate seed trades for display when no real trades exist
function seedTrades(marketId: string, price: number, count = 30) {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const side     = Math.random() > 0.5 ? 'buy' : 'sell';
    const p        = price * (1 + (Math.random() - 0.5) * 0.004);
    const sizeUnit = price > 1000 ? 0.001 : price > 100 ? 0.01 : 1;
    const s        = (Math.random() * 3 + 0.1) * sizeUnit;
    return {
      id:        `seed-${marketId}-${i}`,
      marketId,
      maker:     '0x0000000000000000000000000000000000000001',
      taker:     '0x0000000000000000000000000000000000000002',
      price:     String(Math.round(p * 1e6)),
      size:      String(Math.round(s * 1e18)),
      side,
      timestamp: now - (count - i) * 8_000,
    };
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ marketId: string }> },
) {
  const { marketId } = await params;
  const market = MARKET_LIST.find(m => m.id === marketId);
  if (!market) return NextResponse.json({ error: 'Market not found' }, { status: 404 });

  const limitRaw = Number(req.nextUrl.searchParams.get('limit') ?? '50');
  const limit = Math.min(Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : 50, 200);
  const prices = await refreshPrices();
  const price  = prices[market.base]?.price ?? 1;

  const fromStore = recentTrades.filter(t => t.marketId === marketId).slice(0, limit);
  const trades    = fromStore.length >= 10 ? fromStore : seedTrades(marketId, price, limit);

  return NextResponse.json(trades);
}
