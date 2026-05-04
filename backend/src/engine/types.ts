// Core order book types shared across the backend

export type Side = 'buy' | 'sell';
export type OrderType = 'limit' | 'market';
export type OrderStatus = 'open' | 'filled' | 'partial' | 'cancelled' | 'expired';
export type TradingMode = 'spot' | 'perp';

export interface Order {
  id: string;
  marketId: string;          // e.g. "ETH-USDC" or "ETH-PERP"
  mode: TradingMode;
  trader: string;            // wallet address
  side: Side;
  type: OrderType;
  price: bigint;             // 1e6 for spot (USDC), 1e8 for perp
  size: bigint;              // base token 1e18
  remainingSize: bigint;
  status: OrderStatus;
  leverage?: number;         // perp only
  isLong?: boolean;          // perp only
  nonce: bigint;
  expiry: number;            // unix timestamp
  signature: string;
  createdAt: number;
}

export interface Fill {
  id: string;
  marketId: string;
  maker: string;
  taker: string;
  price: bigint;
  size: bigint;
  side: Side;                // taker's side
  mode: TradingMode;
  makerOrderId: string;
  takerOrderId: string;
  timestamp: number;
}

export interface OrderBookLevel {
  price: bigint;
  size: bigint;
  count: number;
}

export interface OrderBookSnapshot {
  marketId: string;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  timestamp: number;
}

export interface MarketConfig {
  id: string;
  symbol: string;
  baseSymbol: string;
  quoteSymbol: string;
  mode: TradingMode;
  tickSize: bigint;
  stepSize: bigint;
  minOrderSize: bigint;
  maxLeverage?: number;
  contractId?: number;       // on-chain market ID
}

export interface Candle {
  time: number;              // unix seconds, aligned to interval
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
