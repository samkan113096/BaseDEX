import { NextResponse } from 'next/server';
import { refreshPrices } from '@/lib/dex-state';

export const runtime = 'nodejs';
export const revalidate = 30;

export async function GET() {
  const prices = await refreshPrices();
  return NextResponse.json(prices, {
    headers: { 'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30' },
  });
}
