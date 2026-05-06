import { NextResponse } from 'next/server';
import { MARKET_LIST } from '@/lib/dex-state';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(MARKET_LIST);
}
