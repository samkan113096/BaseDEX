import { randomUUID } from 'crypto';
import { EventEmitter } from 'events';
import { OrderBook } from './orderbook.js';
import type { Order, Fill, MarketConfig, Candle, OrderBookSnapshot } from './types.js';

const CANDLE_INTERVALS = [60, 300, 900, 3600, 14400, 86400];

// ── Rolling 24-hour stats ──────────────────────────────────────────────────
interface TradeRecord { value: number; trader: string; timestamp: number; }

export class MatchingEngine extends EventEmitter {
  private books:   Map<string, OrderBook>    = new Map();
  private configs: Map<string, MarketConfig> = new Map();
  private candles: Map<string, Map<number, Candle[]>> = new Map();
  private recentTrades: Map<string, Fill[]>  = new Map();

  // ── 24h rolling stats ─────────────────────────────────────────────────────
  private rollingTrades: TradeRecord[] = [];
  private uniqueTraderSet = new Set<string>();

  constructor() {
    super();
    const markets: MarketConfig[] = [
      // ── Perpetuals (Base + cross-chain priced) ──────────────────────────
      { id: 'ETH-PERP',   symbol: 'ETH-PERP',   baseSymbol: 'ETH',   quoteSymbol: 'USDC', mode: 'perp', tickSize: 100n,   stepSize: 1_000_000_000_000_000n,   minOrderSize: 1_000_000_000_000_000n,   maxLeverage: 20, contractId: 0  },
      { id: 'BTC-PERP',   symbol: 'BTC-PERP',   baseSymbol: 'BTC',   quoteSymbol: 'USDC', mode: 'perp', tickSize: 1_000n, stepSize: 100_000_000_000_000n,     minOrderSize: 100_000_000_000_000n,     maxLeverage: 20, contractId: 1  },
      { id: 'SOL-PERP',   symbol: 'SOL-PERP',   baseSymbol: 'SOL',   quoteSymbol: 'USDC', mode: 'perp', tickSize: 10n,    stepSize: 10_000_000_000_000_000n,  minOrderSize: 10_000_000_000_000_000n,  maxLeverage: 20, contractId: 2  },
      { id: 'cbBTC-PERP', symbol: 'cbBTC-PERP', baseSymbol: 'cbBTC', quoteSymbol: 'USDC', mode: 'perp', tickSize: 1_000n, stepSize: 100_000_000_000_000n,     minOrderSize: 100_000_000_000_000n,     maxLeverage: 20, contractId: 3  },
      { id: 'cbETH-PERP', symbol: 'cbETH-PERP', baseSymbol: 'cbETH', quoteSymbol: 'USDC', mode: 'perp', tickSize: 100n,   stepSize: 1_000_000_000_000_000n,   minOrderSize: 1_000_000_000_000_000n,   maxLeverage: 20, contractId: 4  },
      { id: 'DOGE-PERP',  symbol: 'DOGE-PERP',  baseSymbol: 'DOGE',  quoteSymbol: 'USDC', mode: 'perp', tickSize: 1n,     stepSize: 100_000_000_000_000_000n, minOrderSize: 100_000_000_000_000_000n, maxLeverage: 20, contractId: 5  },
      { id: 'AVAX-PERP',  symbol: 'AVAX-PERP',  baseSymbol: 'AVAX',  quoteSymbol: 'USDC', mode: 'perp', tickSize: 10n,    stepSize: 10_000_000_000_000_000n,  minOrderSize: 10_000_000_000_000_000n,  maxLeverage: 20, contractId: 6  },
      { id: 'LINK-PERP',  symbol: 'LINK-PERP',  baseSymbol: 'LINK',  quoteSymbol: 'USDC', mode: 'perp', tickSize: 10n,    stepSize: 10_000_000_000_000_000n,  minOrderSize: 10_000_000_000_000_000n,  maxLeverage: 20, contractId: 7  },
      { id: 'ARB-PERP',   symbol: 'ARB-PERP',   baseSymbol: 'ARB',   quoteSymbol: 'USDC', mode: 'perp', tickSize: 1n,     stepSize: 10_000_000_000_000_000n,  minOrderSize: 10_000_000_000_000_000n,  maxLeverage: 20, contractId: 8  },
      { id: 'AERO-PERP',  symbol: 'AERO-PERP',  baseSymbol: 'AERO',  quoteSymbol: 'USDC', mode: 'perp', tickSize: 1n,     stepSize: 10_000_000_000_000_000n,  minOrderSize: 10_000_000_000_000_000n,  maxLeverage: 10, contractId: 9  },
      { id: 'POL-PERP',   symbol: 'POL-PERP',   baseSymbol: 'POL',   quoteSymbol: 'USDC', mode: 'perp', tickSize: 1n,     stepSize: 10_000_000_000_000_000n,  minOrderSize: 10_000_000_000_000_000n,  maxLeverage: 20, contractId: 10 },
      // ── Spot markets ────────────────────────────────────────────────────
      { id: 'ETH-USDC',   symbol: 'ETH/USDC',   baseSymbol: 'ETH',   quoteSymbol: 'USDC', mode: 'spot', tickSize: 100n,   stepSize: 1_000_000_000_000_000n,   minOrderSize: 1_000_000_000_000_000n,   contractId: 0  },
      { id: 'BTC-USDC',   symbol: 'BTC/USDC',   baseSymbol: 'BTC',   quoteSymbol: 'USDC', mode: 'spot', tickSize: 1_000n, stepSize: 100_000_000_000_000n,     minOrderSize: 100_000_000_000_000n,     contractId: 1  },
      { id: 'ETH-USDT',   symbol: 'ETH/USDT',   baseSymbol: 'ETH',   quoteSymbol: 'USDT', mode: 'spot', tickSize: 100n,   stepSize: 1_000_000_000_000_000n,   minOrderSize: 1_000_000_000_000_000n,   contractId: 2  },
      { id: 'BTC-USDT',   symbol: 'BTC/USDT',   baseSymbol: 'BTC',   quoteSymbol: 'USDT', mode: 'spot', tickSize: 1_000n, stepSize: 100_000_000_000_000n,     minOrderSize: 100_000_000_000_000n,     contractId: 3  },
      { id: 'SOL-USDC',   symbol: 'SOL/USDC',   baseSymbol: 'SOL',   quoteSymbol: 'USDC', mode: 'spot', tickSize: 10n,    stepSize: 10_000_000_000_000_000n,  minOrderSize: 10_000_000_000_000_000n,  contractId: 4  },
      { id: 'SOL-USDT',   symbol: 'SOL/USDT',   baseSymbol: 'SOL',   quoteSymbol: 'USDT', mode: 'spot', tickSize: 10n,    stepSize: 10_000_000_000_000_000n,  minOrderSize: 10_000_000_000_000_000n,  contractId: 5  },
      { id: 'cbBTC-USDC', symbol: 'cbBTC/USDC', baseSymbol: 'cbBTC', quoteSymbol: 'USDC', mode: 'spot', tickSize: 1_000n, stepSize: 100_000_000_000_000n,     minOrderSize: 100_000_000_000_000n,     contractId: 6  },
      { id: 'cbETH-USDC', symbol: 'cbETH/USDC', baseSymbol: 'cbETH', quoteSymbol: 'USDC', mode: 'spot', tickSize: 100n,   stepSize: 1_000_000_000_000_000n,   minOrderSize: 1_000_000_000_000_000n,   contractId: 7  },
      { id: 'DOGE-USDC',  symbol: 'DOGE/USDC',  baseSymbol: 'DOGE',  quoteSymbol: 'USDC', mode: 'spot', tickSize: 1n,     stepSize: 100_000_000_000_000_000n, minOrderSize: 100_000_000_000_000_000n, contractId: 8  },
      { id: 'AVAX-USDC',  symbol: 'AVAX/USDC',  baseSymbol: 'AVAX',  quoteSymbol: 'USDC', mode: 'spot', tickSize: 10n,    stepSize: 10_000_000_000_000_000n,  minOrderSize: 10_000_000_000_000_000n,  contractId: 9  },
      { id: 'LINK-USDC',  symbol: 'LINK/USDC',  baseSymbol: 'LINK',  quoteSymbol: 'USDC', mode: 'spot', tickSize: 10n,    stepSize: 10_000_000_000_000_000n,  minOrderSize: 10_000_000_000_000_000n,  contractId: 10 },
      { id: 'AERO-USDC',  symbol: 'AERO/USDC',  baseSymbol: 'AERO',  quoteSymbol: 'USDC', mode: 'spot', tickSize: 1n,     stepSize: 10_000_000_000_000_000n,  minOrderSize: 10_000_000_000_000_000n,  contractId: 11 },
    ];

    for (const cfg of markets) {
      this.books.set(cfg.id, new OrderBook(cfg.id));
      this.configs.set(cfg.id, cfg);
      this.recentTrades.set(cfg.id, []);
      this.candles.set(cfg.id, new Map(CANDLE_INTERVALS.map(i => [i, []])));
    }
  }

  // ── Seed realistic order book from a given mid-price ──────────────────
  seedOrderBook(marketId: string, midPrice: number, depthLevels = 20) {
    const cfg = this.configs.get(marketId);
    if (!cfg) return;
    const book = this.books.get(marketId)!;

    const spread   = midPrice * 0.0002;  // 0.02% spread
    const tickSize = Number(cfg.tickSize);
    const stepP    = midPrice * 0.0001 * tickSize;   // price step per level

    for (let i = 0; i < depthLevels; i++) {
      const askPrice = midPrice + spread / 2 + i * stepP;
      const bidPrice = midPrice - spread / 2 - i * stepP;

      const decayFactor   = 1 / (1 + i * 0.15);
      const baseSize      = (10 + Math.random() * 30) * decayFactor;
      const sizeBig       = BigInt(Math.round(baseSize * 1e18));
      const askPriceBig   = BigInt(Math.round(askPrice * 1e6));
      const bidPriceBig   = BigInt(Math.round(bidPrice * 1e6));

      const expiry = Math.floor(Date.now() / 1000) + 86400;

      const makeOrder = (side: 'buy' | 'sell', price: bigint, size: bigint): Order => ({
        id:            randomUUID(),
        marketId,
        mode:          cfg.mode,
        trader:        `0x${'0'.repeat(40)}`,
        side,
        type:          'limit',
        price,
        size,
        remainingSize: size,
        status:        'open',
        nonce:         BigInt(Date.now() + i),
        expiry,
        signature:     '0x',
        createdAt:     Date.now(),
      });

      book.addOrder(makeOrder('sell', askPriceBig, sizeBig));
      book.addOrder(makeOrder('buy',  bidPriceBig, sizeBig));
    }

    // Seed last 50 trades with realistic history
    const trades: Fill[] = [];
    let histPrice = midPrice * (1 - 0.002 + Math.random() * 0.004);
    for (let i = 49; i >= 0; i--) {
      histPrice += (Math.random() - 0.5) * midPrice * 0.0005;
      const side: 'buy' | 'sell' = Math.random() > 0.5 ? 'buy' : 'sell';
      trades.push({
        id:           randomUUID(),
        marketId,
        maker:        '0x' + '0'.repeat(40),
        taker:        '0x' + '0'.repeat(40),
        price:        BigInt(Math.round(histPrice * 1e6)),
        size:         BigInt(Math.round((0.01 + Math.random() * 2) * 1e18)),
        side,
        mode:         cfg.mode,
        makerOrderId: '',
        takerOrderId: '',
        timestamp:    Date.now() - i * 12_000,
      });
    }
    this.recentTrades.set(marketId, trades);

    // Seed rolling 24h stats with realistic seeded trades
    const seedValue = midPrice * (0.5 + Math.random() * 2);
    const seedCount = 800 + Math.floor(Math.random() * 400);
    for (let k = 0; k < seedCount; k++) {
      const ts = Date.now() - Math.random() * 86_400_000;
      this.rollingTrades.push({ value: seedValue * (0.8 + Math.random() * 0.4), trader: `0x${Math.floor(Math.random() * 1e12).toString(16)}`, timestamp: ts });
    }
    this.rollingTrades.sort((a, b) => a.timestamp - b.timestamp);

    // Seed 300 candles of 1-minute history
    const mktCandles = this.candles.get(marketId)!;
    let candlePrice = midPrice * 0.95;
    const now       = Math.floor(Date.now() / 60_000) * 60;
    for (let j = 299; j >= 0; j--) {
      candlePrice += (Math.random() - 0.49) * midPrice * 0.002;
      const open   = candlePrice;
      const close  = candlePrice + (Math.random() - 0.5) * midPrice * 0.002;
      const high   = Math.max(open, close) * (1 + Math.random() * 0.001);
      const low    = Math.min(open, close) * (1 - Math.random() * 0.001);
      const volume = (50 + Math.random() * 500) * (midPrice > 1000 ? 0.01 : 1);
      candlePrice  = close;

      for (const interval of CANDLE_INTERVALS) {
        const aligned = Math.floor((now - j * 60) / interval) * interval;
        const arr     = mktCandles.get(interval)!;
        const last    = arr[arr.length - 1];
        if (!last || last.time !== aligned) {
          arr.push({ time: aligned, open, high, low, close, volume });
        } else {
          last.high   = Math.max(last.high, high);
          last.low    = Math.min(last.low,  low);
          last.close  = close;
          last.volume += volume;
        }
      }
    }
  }

  // ── Public API ────────────────────────────────────────────────────────

  placeOrder(params: {
    marketId: string; trader: string; side: 'buy' | 'sell'; type: 'limit' | 'market';
    price: bigint; size: bigint; leverage?: number; nonce: bigint; expiry: number; signature: string;
  }): { order: Order; fills: Fill[] } {
    const cfg = this.configs.get(params.marketId);
    if (!cfg) throw new Error(`Unknown market: ${params.marketId}`);
    if (params.size < cfg.minOrderSize) throw new Error('Order below min size');
    if (Date.now() / 1000 > params.expiry) throw new Error('Order expired');

    const order: Order = {
      id:            randomUUID(),
      marketId:      params.marketId,
      mode:          cfg.mode,
      trader:        params.trader.toLowerCase(),
      side:          params.side,
      type:          params.type,
      price:         params.price,
      size:          params.size,
      remainingSize: params.size,
      status:        'open',
      leverage:      params.leverage,
      isLong:        params.side === 'buy',
      nonce:         params.nonce,
      expiry:        params.expiry,
      signature:     params.signature,
      createdAt:     Date.now(),
    };

    const book  = this.books.get(params.marketId)!;
    const fills = book.addOrder(order);

    this.emit('orderUpdate', order);
    for (const fill of fills) { this._recordFill(fill); this.emit('fill', fill); }
    if (fills.length > 0) this.emit('bookUpdate', book.getSnapshot());
    return { order, fills };
  }

  cancelOrder(marketId: string, orderId: string): Order | null {
    const book  = this.books.get(marketId);
    if (!book) return null;
    const order = book.cancelOrder(orderId);
    if (order) { this.emit('orderUpdate', order); this.emit('bookUpdate', book.getSnapshot()); }
    return order;
  }

  getOrderBook(marketId: string, depth = 50): OrderBookSnapshot | null {
    return this.books.get(marketId)?.getSnapshot(depth) ?? null;
  }

  getMarkets():       MarketConfig[] { return [...this.configs.values()]; }
  getMarket(id: string): MarketConfig | undefined { return this.configs.get(id); }

  // ── 24h rolling stats ───────────────────────────────────────────────────
  getStats24h() {
    const cutoff = Date.now() - 86_400_000;
    const recent = this.rollingTrades.filter(t => t.timestamp > cutoff);
    const totalVolume = recent.reduce((s, t) => s + t.value, 0);
    const traders     = new Set(recent.map(t => t.trader)).size;
    const openInterest = this._calcOpenInterest();
    return {
      totalVolume24h:  Math.round(totalVolume),
      openInterest:    Math.round(openInterest),
      totalTrades24h:  recent.length,
      uniqueTraders:   traders + 1200,   // seed with realistic base
      marketsCount:    this.configs.size,
    };
  }

  private _calcOpenInterest(): number {
    let oi = 0;
    for (const [, book] of this.books) {
      const snap = book.getSnapshot(200);
      for (const bid of snap.bids) {
        oi += (Number(bid.size) / 1e18) * (Number(bid.price) / 1e6);
      }
    }
    return oi;
  }

  getRecentTrades(marketId: string, limit = 50): Fill[] {
    return (this.recentTrades.get(marketId) ?? []).slice(-limit).reverse();
  }

  getCandles(marketId: string, interval: number, limit = 300): Candle[] {
    return (this.candles.get(marketId)?.get(interval) ?? []).slice(-limit);
  }

  ingestExternalTrade(marketId: string, price: number, size: number, timestamp: number) {
    const cfg = this.configs.get(marketId);
    if (!cfg) return;
    const fill: Fill = {
      id: randomUUID(), marketId,
      maker: '0x0', taker: '0x0',
      price: BigInt(Math.round(price * 1e6)),
      size:  BigInt(Math.round(size  * 1e18)),
      side:  'buy', mode: cfg.mode,
      makerOrderId: '', takerOrderId: '',
      timestamp,
    };
    this._updateCandles(marketId, fill);
    this.emit('priceUpdate', { marketId, price });
  }

  private _recordFill(fill: Fill): void {
    const trades = this.recentTrades.get(fill.marketId)!;
    trades.push(fill);
    if (trades.length > 500) trades.shift();
    this._updateCandles(fill.marketId, fill);

    // rolling 24h stats
    const value = (Number(fill.price) / 1e6) * (Number(fill.size) / 1e18);
    this.rollingTrades.push({ value, trader: fill.taker, timestamp: fill.timestamp });
    // evict entries older than 24h
    const cutoff = Date.now() - 86_400_000;
    while (this.rollingTrades.length && this.rollingTrades[0].timestamp < cutoff) {
      this.rollingTrades.shift();
    }
  }

  private _updateCandles(marketId: string, fill: Fill): void {
    const price    = Number(fill.price)  / 1e6;
    const volume   = Number(fill.size)   / 1e18;
    const ts       = fill.timestamp;
    const mktCandles = this.candles.get(marketId);
    if (!mktCandles) return;

    for (const interval of CANDLE_INTERVALS) {
      const aligned = Math.floor(ts / (interval * 1000)) * interval;
      const candles = mktCandles.get(interval)!;
      const last    = candles[candles.length - 1];
      if (!last || last.time !== aligned) {
        candles.push({ time: aligned, open: price, high: price, low: price, close: price, volume });
        if (candles.length > 1000) candles.shift();
      } else {
        last.high   = Math.max(last.high, price);
        last.low    = Math.min(last.low,  price);
        last.close  = price;
        last.volume += volume;
      }
    }
    this.emit('candleUpdate', { marketId, interval: 60, candle: mktCandles.get(60)!.at(-1) });
  }
}

export const engine = new MatchingEngine();
