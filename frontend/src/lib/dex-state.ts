/**
 * Module-level singleton used by Next.js API route handlers.
 * In Netlify Functions (Lambda), the module is cached between warm invocations
 * on the same instance, so order state persists during a session.
 */

// ── Types ─────────────────────────────────────────────────────────────────

export interface PriceRow {
  price:    number;
  change24h: number;
  high24h:  number;
  low24h:   number;
}

export interface OrderEntry {
  id:            string;
  marketId:      string;
  trader:        string;
  side:          'buy' | 'sell';
  type:          'limit' | 'market';
  price:         string;   // micro-USD (1e6) as string
  size:          string;   // 1e18 as string
  remainingSize: string;
  status:        string;
  createdAt:     number;
  signature:     string;
}

export interface TradeEntry {
  id:        string;
  marketId:  string;
  maker:     string;
  taker:     string;
  price:     string;
  size:      string;
  side:      'buy' | 'sell';
  timestamp: number;
}

export interface Candle {
  time:   number;
  open:   number;
  high:   number;
  low:    number;
  close:  number;
  volume: number;
}

// ── Price cache ────────────────────────────────────────────────────────────

export let priceCache: Record<string, PriceRow> = {
  ETH:   { price: 3000,   change24h: 0, high24h: 3090,  low24h: 2910  },
  BTC:   { price: 97000,  change24h: 0, high24h: 99000, low24h: 95000 },
  SOL:   { price: 175,    change24h: 0, high24h: 180,   low24h: 168   },
  DOGE:  { price: 0.16,   change24h: 0, high24h: 0.17,  low24h: 0.15  },
  AVAX:  { price: 35,     change24h: 0, high24h: 36.5,  low24h: 33.5  },
  LINK:  { price: 14,     change24h: 0, high24h: 14.8,  low24h: 13.2  },
  cbBTC: { price: 97000,  change24h: 0, high24h: 99000, low24h: 95000 },
  cbETH: { price: 3200,   change24h: 0, high24h: 3290,  low24h: 3110  },
  AERO:  { price: 0.85,   change24h: 0, high24h: 0.92,  low24h: 0.78  },
  ARB:   { price: 0.62,   change24h: 0, high24h: 0.68,  low24h: 0.56  },
  POL:   { price: 0.38,   change24h: 0, high24h: 0.42,  low24h: 0.34  },
  USDT:  { price: 1.0,    change24h: 0, high24h: 1.001, low24h: 0.999 },
  USDC:  { price: 1.0,    change24h: 0, high24h: 1.001, low24h: 0.999 },
};
export let priceCacheTime = 0;

const CG_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,solana,arbitrum,coinbase-wrapped-btc,coinbase-staked-eth,aerodrome-finance,chainlink,dogecoin,avalanche-2,matic-network,tether&vs_currencies=usd&include_24hr_change=true';

const CG_MAP: Record<string, string> = {
  ethereum: 'ETH', bitcoin: 'BTC', solana: 'SOL', arbitrum: 'ARB',
  'coinbase-wrapped-btc': 'cbBTC', 'coinbase-staked-eth': 'cbETH',
  'aerodrome-finance': 'AERO', chainlink: 'LINK', dogecoin: 'DOGE',
  'avalanche-2': 'AVAX', 'matic-network': 'POL', tether: 'USDT',
};

export async function refreshPrices(): Promise<Record<string, PriceRow>> {
  const now = Date.now();
  if (now - priceCacheTime < 30_000) return priceCache; // 30s cache
  try {
    const res = await fetch(CG_URL, { signal: AbortSignal.timeout(6_000),
      next: { revalidate: 30 } as RequestInit['next'] });
    if (!res.ok) return priceCache;
    const data = await res.json() as Record<string, { usd: number; usd_24h_change?: number }>;
    for (const [cgId, sym] of Object.entries(CG_MAP)) {
      const e = data[cgId];
      if (!e?.usd || e.usd <= 0) continue;
      const ch = e.usd_24h_change ?? 0;
      priceCache[sym] = {
        price:    e.usd,
        change24h: ch,
        high24h:  e.usd * (1 + Math.abs(ch) / 200),
        low24h:   e.usd * (1 - Math.abs(ch) / 200),
      };
    }
    priceCacheTime = now;
  } catch { /* use stale cache */ }
  return priceCache;
}

// ── Order book generation ──────────────────────────────────────────────────

export function generateOrderBook(marketId: string, midPrice: number, levels = 20) {
  if (midPrice <= 0) midPrice = 1;
  const tickSize  = midPrice < 1 ? 0.0001 : midPrice < 10 ? 0.001 : midPrice < 100 ? 0.01 : midPrice < 1000 ? 0.1 : 1;
  const spread    = tickSize * 2;
  const priceToMicro = (p: number) => String(Math.round(p * 1e6));
  const sizeToWei    = (s: number) => String(Math.round(s * 1e18));

  const bids = Array.from({ length: levels }, (_, i) => {
    const p = midPrice - spread / 2 - tickSize * i;
    const s = (1 + Math.random() * 3) * (midPrice > 1000 ? 0.001 : midPrice > 100 ? 0.01 : 1);
    return { price: priceToMicro(p), size: sizeToWei(s), count: Math.ceil(Math.random() * 5 + 1) };
  });

  const asks = Array.from({ length: levels }, (_, i) => {
    const p = midPrice + spread / 2 + tickSize * i;
    const s = (1 + Math.random() * 3) * (midPrice > 1000 ? 0.001 : midPrice > 100 ? 0.01 : 1);
    return { price: priceToMicro(p), size: sizeToWei(s), count: Math.ceil(Math.random() * 5 + 1) };
  });

  return { marketId, bids, asks, ts: Date.now() };
}

// ── Candle generation ──────────────────────────────────────────────────────

const candleCache: Record<string, { candles: Candle[]; lastPrice: number }> = {};

export function generateCandles(marketId: string, currentPrice: number, interval: number, limit: number): Candle[] {
  const key   = `${marketId}-${interval}`;
  const now   = Math.floor(Date.now() / 1000);
  const start = now - interval * limit;

  // Return cached candles if price hasn't changed much
  if (candleCache[key] && Math.abs(candleCache[key].lastPrice - currentPrice) / currentPrice < 0.005) {
    return candleCache[key].candles;
  }

  const candles: Candle[] = [];
  let price = currentPrice * (1 + (Math.random() - 0.5) * 0.05); // start slightly offset

  for (let i = 0; i < limit; i++) {
    const t    = start + i * interval;
    const move = (Math.random() - 0.48) * currentPrice * 0.003;
    const open = price;
    price += move;
    const close  = Math.max(price, currentPrice * 0.7);
    const high   = Math.max(open, close) * (1 + Math.random() * 0.005);
    const low    = Math.min(open, close) * (1 - Math.random() * 0.005);
    const volume = (Math.random() * 2 + 0.5) * (currentPrice > 1000 ? 0.1 : currentPrice > 100 ? 1 : 100);
    candles.push({ time: t, open, high, low, close, volume });
  }
  // Make last candle match current price
  const last = candles[candles.length - 1];
  if (last) { last.close = currentPrice; last.high = Math.max(last.high, currentPrice); }

  candleCache[key] = { candles, lastPrice: currentPrice };
  return candles;
}

// ── Orders ─────────────────────────────────────────────────────────────────

export const openOrders  = new Map<string, OrderEntry>(); // orderId → order
export const recentTrades: TradeEntry[] = [];

export function placeOrder(order: Omit<OrderEntry, 'id' | 'status' | 'createdAt'>): OrderEntry {
  const id = `ord-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const entry: OrderEntry = { ...order, id, status: 'open', createdAt: Date.now() };
  openOrders.set(id, entry);

  // Simulate immediate market order fill
  if (order.type === 'market') {
    entry.status        = 'filled';
    entry.remainingSize = '0';
    const trade: TradeEntry = {
      id:        `fill-${id}`,
      marketId:  order.marketId,
      maker:     '0x0000000000000000000000000000000000000000',
      taker:     order.trader,
      price:     order.price,
      size:      order.size,
      side:      order.side,
      timestamp: Date.now(),
    };
    recentTrades.unshift(trade);
    if (recentTrades.length > 200) recentTrades.pop();
  }

  return entry;
}

export function cancelOrder(marketId: string, orderId: string): boolean {
  const order = openOrders.get(orderId);
  if (!order || order.marketId !== marketId) return false;
  openOrders.delete(orderId);
  return true;
}

// ── Markets list ───────────────────────────────────────────────────────────

export const MARKET_LIST = [
  // Perps
  { id: 'ETH-PERP',   base: 'ETH',   quote: 'USD', type: 'perp', maxLeverage: 20 },
  { id: 'BTC-PERP',   base: 'BTC',   quote: 'USD', type: 'perp', maxLeverage: 20 },
  { id: 'SOL-PERP',   base: 'SOL',   quote: 'USD', type: 'perp', maxLeverage: 20 },
  { id: 'DOGE-PERP',  base: 'DOGE',  quote: 'USD', type: 'perp', maxLeverage: 10 },
  { id: 'AVAX-PERP',  base: 'AVAX',  quote: 'USD', type: 'perp', maxLeverage: 10 },
  { id: 'LINK-PERP',  base: 'LINK',  quote: 'USD', type: 'perp', maxLeverage: 10 },
  { id: 'cbBTC-PERP', base: 'cbBTC', quote: 'USD', type: 'perp', maxLeverage: 20 },
  { id: 'cbETH-PERP', base: 'cbETH', quote: 'USD', type: 'perp', maxLeverage: 20 },
  { id: 'AERO-PERP',  base: 'AERO',  quote: 'USD', type: 'perp', maxLeverage: 10 },
  { id: 'ARB-PERP',   base: 'ARB',   quote: 'USD', type: 'perp', maxLeverage: 10 },
  { id: 'POL-PERP',   base: 'POL',   quote: 'USD', type: 'perp', maxLeverage: 10 },
  // Spot
  { id: 'ETH-USDC',   base: 'ETH',   quote: 'USDC', type: 'spot', maxLeverage: 1 },
  { id: 'BTC-USDC',   base: 'BTC',   quote: 'USDC', type: 'spot', maxLeverage: 1 },
  { id: 'ETH-USDT',   base: 'ETH',   quote: 'USDT', type: 'spot', maxLeverage: 1 },
  { id: 'BTC-USDT',   base: 'BTC',   quote: 'USDT', type: 'spot', maxLeverage: 1 },
  { id: 'SOL-USDC',   base: 'SOL',   quote: 'USDC', type: 'spot', maxLeverage: 1 },
  { id: 'SOL-USDT',   base: 'SOL',   quote: 'USDT', type: 'spot', maxLeverage: 1 },
  { id: 'DOGE-USDC',  base: 'DOGE',  quote: 'USDC', type: 'spot', maxLeverage: 1 },
  { id: 'cbBTC-USDC', base: 'cbBTC', quote: 'USDC', type: 'spot', maxLeverage: 1 },
  { id: 'cbETH-USDC', base: 'cbETH', quote: 'USDC', type: 'spot', maxLeverage: 1 },
  { id: 'AVAX-USDC',  base: 'AVAX',  quote: 'USDC', type: 'spot', maxLeverage: 1 },
  { id: 'LINK-USDC',  base: 'LINK',  quote: 'USDC', type: 'spot', maxLeverage: 1 },
  { id: 'AERO-USDC',  base: 'AERO',  quote: 'USDC', type: 'spot', maxLeverage: 1 },
];
