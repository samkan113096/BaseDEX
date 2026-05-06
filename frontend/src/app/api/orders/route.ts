import { NextRequest, NextResponse } from 'next/server';
import { placeOrder, openOrders } from '@/lib/dex-state';
import { z } from 'zod';

export const runtime = 'nodejs';

const PlaceOrderBody = z.object({
  marketId:  z.string(),
  trader:    z.string(),
  side:      z.enum(['buy', 'sell']),
  type:      z.enum(['limit', 'market']),
  price:     z.string(),
  size:      z.string(),
  signature: z.string().default('0x'),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = PlaceOrderBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const order = placeOrder({
    ...parsed.data,
    remainingSize: parsed.data.size,
  });

  return NextResponse.json(order, { status: 201 });
}

export async function GET(req: NextRequest) {
  const trader   = req.nextUrl.searchParams.get('trader');
  const marketId = req.nextUrl.searchParams.get('marketId');

  let orders = Array.from(openOrders.values());
  if (trader)   orders = orders.filter(o => o.trader.toLowerCase() === trader.toLowerCase());
  if (marketId) orders = orders.filter(o => o.marketId === marketId);

  return NextResponse.json(orders);
}
