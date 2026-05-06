import { NextRequest, NextResponse } from 'next/server';
import { cancelOrder } from '@/lib/dex-state';

export const runtime = 'nodejs';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ marketId: string; orderId: string }> },
) {
  const { marketId, orderId } = await params;
  const ok = cancelOrder(marketId, orderId);
  if (!ok) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
