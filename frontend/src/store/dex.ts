import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface PriceInfo {
  price:    number;
  change24h: number;
  high24h:  number;
  low24h:   number;
}

export interface OrderBookLevel {
  price: string;
  size:  string;
  count: number;
}

export interface Fill {
  id:        string;
  marketId:  string;
  maker:     string;
  taker:     string;
  price:     string;
  size:      string;
  side:      'buy' | 'sell';
  timestamp: number;
}

export interface Position {
  marketId:   string;
  size:       string;
  margin:     string;
  entryPrice: string;
  leverage:   number;
}

export interface OpenOrder {
  id:            string;
  marketId:      string;
  side:          'buy' | 'sell';
  type:          'limit' | 'market';
  price:         string;
  size:          string;
  remainingSize: string;
  status:        string;
  createdAt:     number;
}

export interface Candle {
  time:   number;
  open:   number;
  high:   number;
  low:    number;
  close:  number;
  volume: number;
}

export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';

const TIMEFRAME_INTERVALS: Record<Timeframe, number> = {
  '1m': 60, '5m': 300, '15m': 900, '1h': 3600, '4h': 14400, '1d': 86400,
};

interface DEXState {
  selectedMarket:    string;
  selectedMode:      'spot' | 'perp';
  selectedTimeframe: Timeframe;

  prices:       Record<string, PriceInfo>;
  bids:         OrderBookLevel[];
  asks:         OrderBookLevel[];
  recentTrades: Fill[];
  candles:      Candle[];

  positions:    Position[];
  openOrders:   OpenOrder[];
  tradeHistory: Fill[];

  setMarket:        (m: string)             => void;
  setMode:          (m: 'spot' | 'perp')    => void;
  setTimeframe:     (tf: Timeframe)         => void;
  setPrice:         (sym: string, info: Partial<PriceInfo>) => void;
  setOrderBook:     (bids: OrderBookLevel[], asks: OrderBookLevel[]) => void;
  addTrade:         (f: Fill)               => void;
  setRecentTrades:  (t: Fill[])             => void;
  setCandles:       (c: Candle[])           => void;
  updateCandle:     (c: Candle)             => void;
  setPositions:     (p: Position[])         => void;
  setOpenOrders:    (o: OpenOrder[])        => void;
  addOpenOrder:     (o: OpenOrder)          => void;
  removeOpenOrder:  (id: string)            => void;
  addTradeHistory:  (f: Fill)               => void;
}

export const useDEXStore = create<DEXState>()(
  subscribeWithSelector((set) => ({
    selectedMarket:    'ETH-PERP',
    selectedMode:      'perp',
    selectedTimeframe: '1m',

    prices: {
      ETH:   { price: 2847,   change24h: 0, high24h: 2920,  low24h: 2760  },
      BTC:   { price: 78700,  change24h: 0, high24h: 80200, low24h: 77400 },
      SOL:   { price: 148,    change24h: 0, high24h: 155,   low24h: 142   },
      DOGE:  { price: 0.162,  change24h: 0, high24h: 0.175, low24h: 0.152 },
      AVAX:  { price: 28.5,   change24h: 0, high24h: 30.2,  low24h: 27.1  },
      cbBTC: { price: 78650,  change24h: 0, high24h: 80100, low24h: 77300 },
      cbETH: { price: 3020,   change24h: 0, high24h: 3100,  low24h: 2940  },
      AERO:  { price: 1.24,   change24h: 0, high24h: 1.32,  low24h: 1.18  },
      ARB:   { price: 0.42,   change24h: 0, high24h: 0.45,  low24h: 0.39  },
      LINK:  { price: 14.2,   change24h: 0, high24h: 15.0,  low24h: 13.6  },
      POL:   { price: 0.48,   change24h: 0, high24h: 0.52,  low24h: 0.44  },
      USDT:  { price: 1.0,    change24h: 0, high24h: 1.001, low24h: 0.999 },
      USDC:  { price: 1.0,    change24h: 0, high24h: 1.001, low24h: 0.999 },
    },
    bids: [], asks: [], recentTrades: [], candles: [],
    positions: [], openOrders: [], tradeHistory: [],

    setMarket: (selectedMarket) => set({ selectedMarket, bids: [], asks: [], recentTrades: [], candles: [], positions: [], openOrders: [], tradeHistory: [] }),
    setMode:   (selectedMode)   => set({ selectedMode }),
    setTimeframe: (selectedTimeframe) => set({ selectedTimeframe }),

    setPrice: (sym, info) =>
      set(s => {
        const prev = s.prices[sym] ?? { price: 0, change24h: 0, high24h: 0, low24h: 0 };
        // Never overwrite existing fields with undefined — only merge defined values
        const merged: PriceInfo = {
          price:     info.price     !== undefined ? info.price     : prev.price,
          change24h: info.change24h !== undefined ? info.change24h : prev.change24h,
          high24h:   info.high24h   !== undefined ? info.high24h   : prev.high24h,
          low24h:    info.low24h    !== undefined ? info.low24h    : prev.low24h,
        };
        return { prices: { ...s.prices, [sym]: merged } };
      }),

    setOrderBook: (bids, asks) => set({ bids, asks }),

    addTrade: (f) => set(s => ({ recentTrades: [f, ...s.recentTrades].slice(0, 100) })),
    setRecentTrades: (recentTrades) => set({ recentTrades }),

    setCandles: (candles)  => set({ candles }),
    updateCandle: (candle) =>
      set(s => {
        const arr  = [...s.candles];
        const last = arr[arr.length - 1];
        if (last?.time === candle.time) arr[arr.length - 1] = candle;
        else arr.push(candle);
        // Cap at 500 candles to avoid unbounded growth
        return { candles: arr.length > 500 ? arr.slice(-500) : arr };
      }),

    setPositions:   (positions)  => set({ positions }),
    setOpenOrders:  (openOrders) => set({ openOrders }),
    addOpenOrder:   (order)      => set(s => ({ openOrders: [order, ...s.openOrders] })),
    removeOpenOrder: (id)        => set(s => ({ openOrders: s.openOrders.filter(o => o.id !== id) })),
    addTradeHistory: (fill)      => set(s => ({ tradeHistory: [fill, ...s.tradeHistory].slice(0, 500) })),
  }))
);

export { TIMEFRAME_INTERVALS };
