import { EventEmitter } from 'events';
import { engine } from '../engine/matching.js';

// Base-native + major crypto assets
const COINGECKO_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,solana,arbitrum,coinbase-wrapped-btc,coinbase-staked-eth,aerodrome-finance,chainlink,dogecoin,avalanche-2,matic-network,tether&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true';

const CG_ID_TO_SYMBOL: Record<string, string> = {
  ethereum:                'ETH',
  bitcoin:                 'BTC',
  solana:                  'SOL',
  arbitrum:                'ARB',
  'coinbase-wrapped-btc':  'cbBTC',
  'coinbase-staked-eth':   'cbETH',
  'aerodrome-finance':     'AERO',
  chainlink:               'LINK',
  dogecoin:                'DOGE',
  'avalanche-2':           'AVAX',
  'matic-network':         'POL',
  tether:                  'USDT',
};

export const latestPrices: Record<string, number>    = {
  ETH:   2847,  BTC:   78700, SOL:  148,
  ARB:   0.42,  cbBTC: 78650, cbETH: 3020,
  AERO:  1.24,  LINK:  14.2,  DOGE: 0.162,
  AVAX:  28.5,  POL:   0.48,  USDT: 1.0,
};
export const priceChanges: Record<string, number>    = {};
export const highPrices24h: Record<string, number>   = {};
export const lowPrices24h: Record<string, number>    = {};

const seededMarkets = new Set<string>();

function seedIfNeeded(symbol: string, price: number) {
  const candidates = [`${symbol}-PERP`, `${symbol}-USDC`, `${symbol}-USDT`, `${symbol}-BASE`];
  for (const mkt of candidates) {
    if (!seededMarkets.has(mkt) && engine.getMarket(mkt)) {
      engine.seedOrderBook(mkt, price);
      seededMarkets.add(mkt);
    }
  }
}

export class PriceOracle extends EventEmitter {
  private timer: NodeJS.Timeout | null = null;

  start() {
    void this._poll();
    this.timer = setInterval(() => void this._poll(), 60_000);
  }

  stop() { if (this.timer) clearInterval(this.timer); }

  private async _poll() {
    try {
      const res  = await fetch(COINGECKO_URL, { signal: AbortSignal.timeout(8_000) });
      if (!res.ok) { console.warn('[oracle] CoinGecko non-200', res.status); return; }
      const data = await res.json() as Record<string, { usd: number; usd_24h_change?: number }>;

      for (const [cgId, symbol] of Object.entries(CG_ID_TO_SYMBOL)) {
        const entry = data[cgId];
        if (!entry?.usd || entry.usd <= 0) continue;
        const price  = entry.usd;
        const change = entry.usd_24h_change ?? 0;
        latestPrices[symbol] = price;
        priceChanges[symbol] = change;
        highPrices24h[symbol] = price * (1 + Math.abs(change) / 100 * 0.6);
        lowPrices24h[symbol]  = price * (1 - Math.abs(change) / 100 * 0.6);

        seedIfNeeded(symbol, price);

        const now = Date.now();
        const usdcMkt = `${symbol}-USDC`;
        const usdtMkt = `${symbol}-USDT`;
        const perpMkt = `${symbol}-PERP`;
        if (engine.getMarket(usdcMkt)) engine.ingestExternalTrade(usdcMkt, price, 0, now);
        if (engine.getMarket(usdtMkt)) engine.ingestExternalTrade(usdtMkt, price, 0, now);
        if (engine.getMarket(perpMkt)) engine.ingestExternalTrade(perpMkt, price, 0, now);
        this.emit('price', { symbol, price, change });
      }
    } catch (err) {
      console.warn('[oracle] fetch failed:', (err as Error).message);
    }
  }
}

export const oracle = new PriceOracle();
