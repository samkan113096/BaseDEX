import { randomUUID } from 'crypto';
import type { Order, Fill, OrderBookLevel, OrderBookSnapshot, Side } from './types.js';

/**
 * Price-time priority order book for a single market.
 * Bids sorted descending (best bid first), asks ascending (best ask first).
 */
export class OrderBook {
  private bids: Map<string, Order> = new Map(); // orderId -> Order
  private asks: Map<string, Order> = new Map();

  // Sorted price levels  (price as string key for exact bigint comparison)
  private bidLevels: Map<bigint, Order[]> = new Map();
  private askLevels: Map<bigint, Order[]> = new Map();

  constructor(public readonly marketId: string) {}

  // ── Public API ─────────────────────────────────────────────────────────

  addOrder(order: Order): Fill[] {
    const fills: Fill[] = [];
    let remaining = order.remainingSize;

    if (order.type === 'market' || this._canMatch(order)) {
      const fills_ = this._match(order);
      fills.push(...fills_);
      remaining = order.remainingSize;
    }

    if (remaining > 0n && order.type === 'limit' && order.status !== 'cancelled') {
      this._insertResting(order);
    }

    return fills;
  }

  cancelOrder(orderId: string): Order | null {
    const order = this.bids.get(orderId) ?? this.asks.get(orderId);
    if (!order) return null;
    order.status = 'cancelled';
    this._removeFromLevel(order);
    (order.side === 'buy' ? this.bids : this.asks).delete(orderId);
    return order;
  }

  getSnapshot(depth = 50): OrderBookSnapshot {
    return {
      marketId: this.marketId,
      bids: this._levels(this.bidLevels, 'desc', depth),
      asks: this._levels(this.askLevels, 'asc', depth),
      timestamp: Date.now(),
    };
  }

  getBestBid(): bigint | null {
    const sorted = [...this.bidLevels.keys()].sort((a, b) => (a > b ? -1 : 1));
    return sorted[0] ?? null;
  }

  getBestAsk(): bigint | null {
    const sorted = [...this.askLevels.keys()].sort((a, b) => (a < b ? -1 : 1));
    return sorted[0] ?? null;
  }

  getMidPrice(): bigint | null {
    const bid = this.getBestBid();
    const ask = this.getBestAsk();
    if (bid === null || ask === null) return null;
    return (bid + ask) / 2n;
  }

  // ── Internals ──────────────────────────────────────────────────────────

  private _canMatch(order: Order): boolean {
    if (order.side === 'buy') {
      const bestAsk = this.getBestAsk();
      return bestAsk !== null && order.price >= bestAsk;
    } else {
      const bestBid = this.getBestBid();
      return bestBid !== null && order.price <= bestBid;
    }
  }

  private _match(aggressor: Order): Fill[] {
    const fills: Fill[] = [];
    const counterSide = aggressor.side === 'buy' ? this.askLevels : this.bidLevels;
    const sortedPrices = [...counterSide.keys()].sort((a, b) => {
      if (aggressor.side === 'buy') return a < b ? -1 : 1;   // ascending (cheapest ask first)
      return a > b ? -1 : 1;                                  // descending (highest bid first)
    });

    for (const levelPrice of sortedPrices) {
      if (aggressor.remainingSize === 0n) break;

      // Price check for limit orders
      if (aggressor.type === 'limit') {
        if (aggressor.side === 'buy' && aggressor.price < levelPrice) break;
        if (aggressor.side === 'sell' && aggressor.price > levelPrice) break;
      }

      const resting = counterSide.get(levelPrice)!;
      for (let i = 0; i < resting.length && aggressor.remainingSize > 0n; i++) {
        const maker = resting[i];
        if (maker.status === 'cancelled' || maker.remainingSize === 0n) continue;

        const fillSize = aggressor.remainingSize < maker.remainingSize
          ? aggressor.remainingSize
          : maker.remainingSize;

        aggressor.remainingSize -= fillSize;
        maker.remainingSize     -= fillSize;

        aggressor.status = aggressor.remainingSize === 0n ? 'filled' : 'partial';
        maker.status     = maker.remainingSize === 0n ? 'filled' : 'partial';

        if (maker.remainingSize === 0n) {
          (maker.side === 'buy' ? this.bids : this.asks).delete(maker.id);
        }

        fills.push({
          id:           randomUUID(),
          marketId:     this.marketId,
          maker:        maker.trader,
          taker:        aggressor.trader,
          price:        levelPrice,              // execute at maker price
          size:         fillSize,
          side:         aggressor.side,
          mode:         aggressor.mode,
          makerOrderId: maker.id,
          takerOrderId: aggressor.id,
          timestamp:    Date.now(),
        });
      }

      // Clean up empty level
      const remaining = resting.filter(o => o.remainingSize > 0n && o.status !== 'cancelled');
      if (remaining.length === 0) counterSide.delete(levelPrice);
      else counterSide.set(levelPrice, remaining);
    }

    return fills;
  }

  private _insertResting(order: Order): void {
    const map = order.side === 'buy' ? this.bids : this.asks;
    const levels = order.side === 'buy' ? this.bidLevels : this.askLevels;
    map.set(order.id, order);
    if (!levels.has(order.price)) levels.set(order.price, []);
    levels.get(order.price)!.push(order);
  }

  private _removeFromLevel(order: Order): void {
    const levels = order.side === 'buy' ? this.bidLevels : this.askLevels;
    const level = levels.get(order.price);
    if (!level) return;
    const idx = level.findIndex(o => o.id === order.id);
    if (idx !== -1) level.splice(idx, 1);
    if (level.length === 0) levels.delete(order.price);
  }

  private _levels(
    levelMap: Map<bigint, Order[]>,
    dir: 'asc' | 'desc',
    depth: number,
  ): OrderBookLevel[] {
    const sorted = [...levelMap.keys()].sort((a, b) => {
      if (dir === 'asc') return a < b ? -1 : 1;
      return a > b ? -1 : 1;
    }).slice(0, depth);

    return sorted.map(price => {
      const orders = levelMap.get(price)!.filter(o => o.remainingSize > 0n);
      const size   = orders.reduce((acc, o) => acc + o.remainingSize, 0n);
      return { price, size, count: orders.length };
    });
  }
}
