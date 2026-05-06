import { NextRequest, NextResponse } from 'next/server';
import { refreshPrices, generateCandles, MARKET_LIST } from '@/lib/dex-state';

export const runtime = 'nodejs';

const INTERVAL_MAP: Record<string, number> = {
  '1m':  60,   '5m':  300,   '15m': 900,
  '1h':  3600, '4h':  14400, '1d':  86400,
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ marketId: string }> },
) {
  const { marketId } = await params;
  const market = MARKET_LIST.find(m => m.id === marketId);
  if (!market) return NextResponse.json({ error: 'Market not found' }, { status: 404 });

  const tf       = req.nextUrl.searchParams.get('timeframe') ?? '1h';
  const limit    = Math.min(Number(req.nextUrl.searchParams.get('limit') ?? '200'), 500);
  const interval = INTERVAL_MAP[tf] ?? 3600;

  const prices  = await refreshPrices();
  const price   = prices[market.base]?.price ?? 1;
  const candles = generateCandles(marketId, price, interval, limit);

  return NextResponse.json(candles);
}
