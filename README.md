# BaseDEX — Decentralized Exchange

A production-grade DEX featuring a live order book, perpetual & spot markets, real-time price feeds, and a professional landing page. Currently live in demo mode (simulated matching engine) — one configuration change from going live on Base Mainnet.

---

## Live URLs

| Service | URL | Status |
|---------|-----|--------|
| Frontend (Netlify) | https://basedex-app.netlify.app | ✅ Live |
| Backend API (Railway) | https://basedex-production.up.railway.app | ✅ Live |
| Backend Health | https://basedex-production.up.railway.app/api/health | ✅ DB + Redis connected |

---

## What's Built

### Frontend (Next.js 16 · React 19 · TypeScript · Tailwind v4)
- **Landing page** — hero, features, live price ticker, markets table with real CoinGecko prices, 40 SEO blog posts, FAQ, About, Contact (email, Twitter, Telegram), legal & audit sections
- **Trading app** (`/trade`) — professional dark-theme interface with:
  - TradingView-style candlestick chart (lightweight-charts) — real OHLCV data, smooth candle seed
  - Live order book (20 bids × 20 asks), real-time trade feed
  - Order form (Limit / Market, Long / Short), position panel, trade history
  - 23 markets: BTC, ETH, SOL, AVAX, ARB, DOGE, LINK, UNI, MATIC, cbBTC, USDC, USDT + perpetuals
  - Wallet connect (RainbowKit / wagmi v3) for MetaMask, Coinbase Wallet, WalletConnect
  - TESTNET banner when connected to Sepolia
- **Additional pages** — `/audit`, `/legal`, `/pitch-deck`, `/blog`, `/blog/[slug]`
- **SEO** — `sitemap.ts`, `robots.ts`, OpenGraph images, Twitter cards, JSON-LD structured data

### Backend (Node.js · Fastify · PostgreSQL · Redis)
- Deployed on Railway at `basedex-production.up.railway.app`
- **Matching engine** — in-memory order book (price-time priority) for all 23 markets
- **Oracle** — CoinGecko API, polling every 15 seconds for real market prices
- **PostgreSQL** — persists all trades, orders, and OHLCV candles
- **Redis** — price caching and real-time pub/sub for WebSocket broadcasts
- **API routes** — `/api/prices`, `/api/markets`, `/api/orderbook/:id`, `/api/candles/:id`, `/api/trades/:id`, `/api/orders`, `/api/stats/:id`, `/api/health`
- **WebSocket** — `/ws` endpoint for live order book, trade, and candle updates

### Smart Contracts (Foundry · Solidity)
- `Vault.sol` — asset custody, deposit/withdraw with EIP-712 signatures
- `SpotEngine.sol` — spot trading settlement
- `PerpEngine.sol` — perpetual positions, funding rates, liquidations
- `MockPriceFeed.sol` — testnet price oracle (swap for Chainlink on mainnet)
- Test suite and deploy scripts in `contracts/script/`
- Audit report published at `/audit` on the frontend

### Promotion Assets (`/promotion`)
- Pitch deck (HTML + PDF) — `/pitch-deck` on the frontend
- 90 days of Twitter/Telegram post schedule — `promotion/social/`
- VC email outreach template — `promotion/outreach/`

---

## Architecture

```
User Browser
     │
     ├── Netlify CDN (Next.js SSR/SSG)
     │        frontend/
     │
     └── Railway (Node.js / Fastify)
              backend/
              ├── PostgreSQL  ← trades, orders, candles
              ├── Redis       ← price cache, pub/sub
              └── CoinGecko   ← live price oracle (15s)
```

---

## Repository Structure

```
Defi_Dex/
├── frontend/          Next.js app (Netlify)
├── backend/           Fastify API + matching engine (Railway)
├── contracts/         Solidity (Foundry)
├── promotion/         Pitch deck, social posts, outreach
├── Dockerfile         Root-level — builds backend for Railway
├── railway.json       Railway config (uses root Dockerfile)
├── netlify.toml       Netlify build config
└── deploy.sh          Fast local → Netlify deploy script
```

---

## Local Development

> **Do not run the full stack locally** on a low-powered machine — it will crash your computer.
> Use the live Railway backend and only run the frontend dev server if needed.

```bash
# Frontend only (uses the live Railway backend)
cd frontend
NEXT_PUBLIC_API_URL=https://basedex-production.up.railway.app npm run dev
```

---

## Deployment

### Frontend → Netlify (auto)
Every push to `main` on `samkan113096/BaseDEX` triggers a Netlify build automatically.

To deploy manually from your machine:
```bash
bash deploy.sh   # builds frontend/ then pushes artifacts to Netlify
```

### Backend → Railway (auto)
Every push to `main` on `samkan113096/BaseDEX` triggers a Railway build automatically.
The root `Dockerfile` builds only the `backend/` directory.

---

## Environment Variables

### Backend (set in Railway dashboard — already configured)
```
DATABASE_URL   postgresql://postgres:***@postgres.railway.internal:5432/railway
REDIS_URL      redis://default:***@redis.railway.internal:6379
PORT           3001
NODE_ENV       production
CORS_ORIGIN    https://basedex-app.netlify.app
```

### Frontend (set in Netlify — already configured)
```
NEXT_PUBLIC_API_URL       https://basedex-production.up.railway.app
NEXT_PUBLIC_WS_URL        wss://basedex-production.up.railway.app/ws
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID   (get from cloud.walletconnect.com)
NEXT_PUBLIC_ETH_SEPOLIA_RPC_URL        (from Alchemy/Infura)
```

---

## Wallet Addresses (Ethereum Sepolia Testnet)

| Role | Address |
|------|---------|
| Test wallet | `0x0F607D727cE2B7433619676CeD672e25c6a8f71d` |
| Dev / Deploy wallet | `0x9270209A465b466b7a25865B61e1878953AFE676` |

---

## Going Live on Base Mainnet — Checklist

When you are ready to take BaseDEX to production, here is the exact sequence:

### Step 1 — Smart Contract Deployment on Base Mainnet
```bash
cd contracts

# Fund your dev wallet with ETH on Base mainnet, then:
forge script script/Deploy.s.sol \
  --rpc-url https://mainnet.base.org \
  --private-key YOUR_DEV_PRIVATE_KEY \
  --broadcast --verify
```
Note down the deployed addresses for `Vault`, `SpotEngine`, `PerpEngine`.

### Step 2 — Replace Mock Price Feed with Chainlink
In `contracts/src/`, swap `MockPriceFeed.sol` for the real Chainlink aggregator addresses on Base:
- BTC/USD: `0x64c911996D3c6aC71f9b455B1E8E7266BcfBF15c`
- ETH/USD: `0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70`
(Full list at docs.chain.link/data-feeds/price-feeds/addresses?network=base)

### Step 3 — Upgrade Railway Plan
Go to [railway.app](https://railway.app) → your project → upgrade from Hobby ($5 credit) to the **Pro plan** ($20/mo). This gives:
- Always-on service (no sleep)
- More RAM for the matching engine under load
- Higher Postgres storage limits

### Step 4 — Point Domain
In Netlify → Domain settings → add your custom domain (e.g., `basedex.io`).
In Railway → BaseDEX service → Settings → Custom Domain → add `api.basedex.io`.

Update `CORS_ORIGIN` in Railway env vars to your real domain.
Update `NEXT_PUBLIC_API_URL` in Netlify env vars to `https://api.basedex.io`.

### Step 5 — Get a WalletConnect Project ID
1. Sign up at [cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Create a project → copy the Project ID
3. In Netlify → Environment Variables → set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
4. Redeploy frontend

### Step 6 — Replace CoinGecko with a Paid Oracle (optional but recommended)
CoinGecko's free tier has rate limits. For production:
- **Chainlink Data Streams** (on-chain, most reliable)
- **Pyth Network** (fast, sub-second updates)
- **CoinGecko Pro API** (just add `COINGECKO_API_KEY` to Railway env vars)

### Step 7 — Connect Frontend to Deployed Contracts
In `frontend/src/lib/contracts.ts` (or the env vars), set:
```
NEXT_PUBLIC_VAULT_ADDRESS=<deployed Vault address>
NEXT_PUBLIC_SPOT_ENGINE_ADDRESS=<deployed SpotEngine address>
NEXT_PUBLIC_PERP_ENGINE_ADDRESS=<deployed PerpEngine address>
NEXT_PUBLIC_CHAIN_ID=8453   # Base mainnet
```

### Step 8 — Final QA Before Launch
- [ ] Connect MetaMask to Base Mainnet, deposit USDC into Vault
- [ ] Place a test limit order and confirm it appears in the order book
- [ ] Place a matching order and confirm a fill is recorded
- [ ] Check `/api/health` shows `db: connected, redis: connected`
- [ ] Verify the candlestick chart is rendering real OHLCV data
- [ ] Check the landing page on mobile (responsive)
- [ ] Run `forge test` in `contracts/` — all tests green

---

## What Is Real vs Simulated Right Now

| Feature | Current State | Production State |
|---------|--------------|-----------------|
| Token prices | ✅ Real (CoinGecko, 15s) | ✅ Real (Chainlink on-chain) |
| Order book | Simulated (seeded, in-memory) | Real (user orders) |
| Candle charts | Real oracle prices, simulated volume | Real OHLCV from trades |
| Trade execution | Simulated fills | Real on-chain via Vault |
| Wallet connect | Works (Sepolia testnet) | Works (Base mainnet) |
| PostgreSQL | ✅ Live on Railway | Same, just more data |
| Redis | ✅ Live on Railway | Same |
| Smart contracts | Deployed on Sepolia | Redeploy on Base |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| State | Zustand |
| Charts | lightweight-charts (TradingView) |
| Web3 | wagmi v3, viem, RainbowKit |
| Animations | Framer Motion |
| Backend | Node.js, Fastify, TypeScript |
| Database | PostgreSQL (Railway) |
| Cache / Pub-Sub | Redis (Railway) |
| Oracle | CoinGecko → Chainlink (mainnet) |
| Contracts | Solidity, Foundry |
| Frontend hosting | Netlify |
| Backend hosting | Railway |
| CI/CD | GitHub Actions |

---

## Contact (in-app)
- Email: team@basedex.io
- Twitter: @BaseDEX_io
- Telegram: t.me/basedex
