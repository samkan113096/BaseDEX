import pg from 'pg';

const { Pool } = pg;

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('railway.internal')
    ? false  // internal Railway network — no SSL needed
    : { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

db.on('error', (err) => {
  console.error('[db] unexpected error', err.message);
});

export async function initSchema(): Promise<void> {
  await db.query(`
    CREATE TABLE IF NOT EXISTS trades (
      id           TEXT        PRIMARY KEY,
      market_id    TEXT        NOT NULL,
      maker        TEXT        NOT NULL,
      taker        TEXT        NOT NULL,
      price        BIGINT      NOT NULL,
      size         BIGINT      NOT NULL,
      side         TEXT        NOT NULL,
      ts           BIGINT      NOT NULL,
      created_at   TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS trades_market_ts ON trades (market_id, ts DESC);

    CREATE TABLE IF NOT EXISTS orders (
      id             TEXT    PRIMARY KEY,
      market_id      TEXT    NOT NULL,
      trader         TEXT    NOT NULL,
      side           TEXT    NOT NULL,
      type           TEXT    NOT NULL,
      price          BIGINT  NOT NULL,
      size           BIGINT  NOT NULL,
      remaining_size BIGINT  NOT NULL,
      status         TEXT    NOT NULL,
      created_at     BIGINT  NOT NULL
    );
    CREATE INDEX IF NOT EXISTS orders_trader ON orders (trader, status);
    CREATE INDEX IF NOT EXISTS orders_market ON orders (market_id, status);

    CREATE TABLE IF NOT EXISTS candles (
      market_id     TEXT             NOT NULL,
      interval_secs INT              NOT NULL,
      time          BIGINT           NOT NULL,
      open          DOUBLE PRECISION NOT NULL,
      high          DOUBLE PRECISION NOT NULL,
      low           DOUBLE PRECISION NOT NULL,
      close         DOUBLE PRECISION NOT NULL,
      volume        DOUBLE PRECISION NOT NULL,
      PRIMARY KEY (market_id, interval_secs, time)
    );
  `);
  console.log('[db] schema ready');
}

// Upsert a candle row from a new trade fill
export async function upsertCandle(
  marketId: string,
  intervalSecs: number,
  candleTime: number,
  price: number,
  volume: number,
): Promise<void> {
  await db.query(
    `INSERT INTO candles (market_id, interval_secs, time, open, high, low, close, volume)
     VALUES ($1, $2, $3, $4, $4, $4, $4, $5)
     ON CONFLICT (market_id, interval_secs, time) DO UPDATE SET
       high   = GREATEST(candles.high,  $4),
       low    = LEAST(candles.low,   $4),
       close  = $4,
       volume = candles.volume + $5`,
    [marketId, intervalSecs, candleTime, price, volume],
  );
}

export async function insertTrade(
  id: string, marketId: string, maker: string, taker: string,
  price: bigint, size: bigint, side: string, ts: number,
): Promise<void> {
  await db.query(
    `INSERT INTO trades (id, market_id, maker, taker, price, size, side, ts)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT DO NOTHING`,
    [id, marketId, maker, taker, price.toString(), size.toString(), side, ts],
  );
}

export async function upsertOrder(
  id: string, marketId: string, trader: string, side: string,
  type: string, price: bigint, size: bigint, remainingSize: bigint,
  status: string, createdAt: number,
): Promise<void> {
  await db.query(
    `INSERT INTO orders (id, market_id, trader, side, type, price, size, remaining_size, status, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     ON CONFLICT (id) DO UPDATE SET remaining_size=$8, status=$9`,
    [id, marketId, trader, side, type,
     price.toString(), size.toString(), remainingSize.toString(), status, createdAt],
  );
}
