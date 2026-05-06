import { NextRequest, NextResponse } from 'next/server';
import { refreshPrices, generateOrderBook, MARKET_LIST } from '@/lib/dex-state';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ marketId: string }> },
) {
  const { marketId } = await params;
  const market = MARKET_LIST.find(m => m.id === marketId);
  if (!market) return NextResponse.json({ error: 'Market not found' }, { status: 404 });

  const prices = await refreshPrices();
  const mid    = prices[market.base]?.price ?? 1;
  const book   = generateOrderBook(marketId, mid);

  return NextResponse.json(book);
}
