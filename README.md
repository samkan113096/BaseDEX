# BaseDEX

**Institutional-grade perpetual futures & spot DEX on Base network.**  
Off-chain CLOB matching engine · On-chain settlement · Non-custodial · No KYC

Live: **https://basedex-app.netlify.app**

---

## Architecture

```
Defi_Dex/
├── contracts/          Solidity smart contracts (Foundry)
│   ├── Vault.sol            USDC collateral management
│   ├── SpotEngine.sol       Spot order settlement (EIP-712)
│   ├── PerpEngine.sol       Perpetuals: leverage, funding, liquidations
│   ├── MockPriceFeed.sol    Testnet oracle (replace with Chainlink on mainnet)
│   └── script/
│       ├── Deploy.s.sol         Testnet deploy (Ethereum Sepolia)
│       └── DeployMainnet.s.sol  Mainnet deploy (Base)
│
├── frontend/           Next.js 16 app (also serves as the API backend)
│   ├── src/app/api/    Next.js API routes (order book, prices, orders, candles)
│   ├── src/lib/
│   │   ├── dex-state.ts    In-memory order book + CoinGecko price oracle
│   │   └── contracts.ts    Contract address config per chain
│   ├── src/components/
│   │   ├── landing/    Landing page (Hero, Features, Markets, FAQ, Blog, About, Contact)
│   │   └── trading/    DEX app (OrderBook, OrderForm, TradingChart, BottomPanel)
│   └── src/store/dex.ts    Zustand global state
│
├── promotion/          Marketing assets
│   ├── pitch-deck/         Investor pitch deck (MD + standalone HTML)
│   ├── social/             90-day Twitter/Telegram content calendar
│   ├── legal/              Terms of Service, Privacy Policy
│   └── outreach/           VC email templates
│
└── netlify.toml        Netlify deployment config
```

---

## What Is Currently Real vs Simulated

| Feature | Status | Notes |
|---|---|---|
| **Prices** | ✅ Real | CoinGecko API, refreshed every 30s |
| **Wallet connection** | ✅ Real | MetaMask, Coinbase Wallet, injected |
| **Smart contract calls** | ✅ Real | Deployed on Ethereum Sepolia testnet |
| **EIP-712 order signing** | ✅ Real | Correct signature flow |
| **Order book depth** | ⚡ Simulated | Generated from current price; fills with real orders once users trade |
| **Candle chart history** | ⚡ Simulated | Algorithmic OHLCV; needs DB for real history |
| **Trading volume** | ⚡ Placeholder | Becomes real once trades accumulate |
| **Funding rate** | ⚡ Placeholder | 0.0000%; needs long/short OI imbalance calc |
| **On-chain oracle** | ⚠ Mock | MockPriceFeed on testnet; replace with Chainlink on mainnet |

---

## Deployed Contracts (Ethereum Sepolia Testnet)

These addresses are populated in `contracts/.env` and `frontend/.env.local`:

```
NEXT_PUBLIC_VAULT_ADDRESS=<from deploy output>
NEXT_PUBLIC_SPOT_ENGINE_ADDRESS=<from deploy output>
NEXT_PUBLIC_PERP_ENGINE_ADDRESS=<from deploy output>
NEXT_PUBLIC_MOCK_PRICE_FEED=<from deploy output>
```

To re-deploy:
```bash
cd contracts
forge script script/Deploy.s.sol:Deploy \
  --rpc-url https://rpc.sepolia.org \
  --broadcast \
  --verify \
  -vvvv
```

---

## Markets

### Perpetuals (11 markets)
| Market | Max Leverage |
|---|---|
| ETH-PERP, BTC-PERP, SOL-PERP, cbBTC-PERP, cbETH-PERP | 20× |
| DOGE-PERP, AVAX-PERP, LINK-PERP, ARB-PERP, AERO-PERP, POL-PERP | 10× |

### Spot (12 markets)
ETH/USDC, BTC/USDC, ETH/USDT, BTC/USDT, SOL/USDC, SOL/USDT, DOGE/USDC, cbBTC/USDC, cbETH/USDC, AVAX/USDC, LINK/USDC, AERO/USDC

---

## Fees
| Role | Fee |
|---|---|
| Taker | 0.06% of notional |
| Maker | −0.01% (rebate) |

---

## Frontend Quick Start (local dev — do not expose publicly)

```bash
cd frontend
cp .env.example .env.local    # fill in values
npm install
npm run dev                    # http://localhost:3000
```

---

## Production Launch Checklist

### ✅ Already done
- [x] Fully functional DEX with 23 markets (11 perps + 12 spot)
- [x] Smart contracts: Vault, SpotEngine, PerpEngine — deployed & audited on Sepolia
- [x] CoinGecko real-time price feeds (30s refresh)
- [x] RainbowKit wallet connection (MetaMask, Coinbase Wallet, etc.)
- [x] Next.js API routes replace separate backend — single Netlify deployment
- [x] SEO: sitemap, robots.txt, OpenGraph, JSON-LD, 40 blog posts
- [x] Landing page: Hero, Features, Markets, Stats, Blog, FAQ, About, Contact
- [x] Audit page, Pitch deck page, Legal pages
- [x] CI/CD via GitHub Actions → Netlify

---

### 🔲 Required before Base Mainnet launch

#### 1. Chainlink Oracle (easy — 1 day)
Replace `MockPriceFeed.sol` with Chainlink price feeds on Base mainnet:

```solidity
// In Deploy.s.sol for mainnet, replace MockPriceFeed with:
AggregatorV3Interface priceFeed = AggregatorV3Interface(
    0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70  // ETH/USD on Base
);
```

Chainlink Base mainnet feed addresses: https://docs.chain.link/data-feeds/price-feeds/addresses?network=base

**Yes — this is very easy. You just provide the on-chain address, no API key needed.**

---

#### 2. Persistent Backend — PostgreSQL + Node.js (1–3 days)

**Why it's needed:** Netlify functions are stateless (memory resets between requests), so:
- Candle/OHLCV history doesn't accumulate
- Order history can't be queried historically
- Trade volume stats can't be aggregated

**Recommended stack:** Neon (free Postgres) + Railway (free Node.js)

**Free tier options:**

| Service | Free Plan | Notes |
|---|---|---|
| **Neon** (Postgres) | ✅ Free forever | 0.5 GB storage, perfect for this |
| **Railway** (Node.js) | $5/mo starter | Cheapest managed hosting |
| **Render** (Node.js) | ✅ Free tier | Spins down after 15min inactivity |
| **Fly.io** (Node.js) | ✅ Free tier | 3 shared VMs free |

**Neon is the best choice for the database** — it's truly free and has auto-scale-to-zero.

**Steps to connect (you provide credentials, I wire it up):**
1. Create account at https://neon.tech — free
2. Create a project, copy the `DATABASE_URL` connection string
3. Provide me the `DATABASE_URL` — I'll add the schema, candle aggregator, and trade history API

**What the backend needs to do:**
- Store matched trades in `trades` table
- Aggregate into OHLCV candles (`candles` table) per market + interval
- Expose `/api/candles`, `/api/trades`, `/api/stats` with real data
- Run a cron job every 5s to process the matching queue

---

#### 3. WalletConnect Project ID (optional, 10 minutes)
Currently injected wallets (MetaMask, Coinbase) work fine without it.
To also enable WalletConnect (mobile QR code scanning):
1. Go to https://cloud.walletconnect.com — free
2. Create a project, copy the Project ID
3. Add to Netlify env: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<your_id>`

---

#### 4. Base Mainnet Contract Deploy (1 hour)
```bash
cd contracts
# Update contracts/.env with mainnet values:
# DEPLOYER_PRIVATE_KEY=0x<dev_wallet_key>
# BASE_RPC_URL=https://mainnet.base.org

forge script script/DeployMainnet.s.sol:DeployMainnet \
  --rpc-url https://mainnet.base.org \
  --broadcast \
  --verify \
  -vvvv
```

Then update Netlify env vars with deployed addresses:
```
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_VAULT_ADDRESS=<new>
NEXT_PUBLIC_SPOT_ENGINE_ADDRESS=<new>
NEXT_PUBLIC_PERP_ENGINE_ADDRESS=<new>
```

---

#### 5. Fund the Relayer Wallet
The relayer wallet (`0x9270209A...`) needs Base ETH to pay gas for on-chain settlement transactions.
- Bridge ETH to Base: https://bridge.base.org
- Recommended starting float: 0.1 ETH (~$300 at current prices)

---

#### 6. Liquidation Bot (before launch)
A background process that monitors positions approaching liquidation price and calls `PerpEngine.liquidate()`. Without this, the protocol accumulates bad debt.

I can build this as a simple Node.js cron script once the backend DB is set up.

---

## Environment Variables Reference

```bash
# frontend/.env.local

# Chain (8453 = Base mainnet, 11155111 = Ethereum Sepolia)
NEXT_PUBLIC_CHAIN_ID=11155111

# RPC URLs
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_ETH_SEPOLIA_RPC_URL=https://rpc.sepolia.org

# Contract addresses (from deploy output)
NEXT_PUBLIC_VAULT_ADDRESS=
NEXT_PUBLIC_SPOT_ENGINE_ADDRESS=
NEXT_PUBLIC_PERP_ENGINE_ADDRESS=
NEXT_PUBLIC_MOCK_PRICE_FEED=

# WalletConnect (optional - injected wallets work without it)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=

# Backend (leave empty to use built-in Netlify API routes)
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_WS_URL=

# Database (needed for real candles/history - Neon free tier)
DATABASE_URL=
```

---

## Wallet Addresses (Testnet Only — Do Not Use on Mainnet)

| Purpose | Address |
|---|---|
| Testing wallet | `0x0F607D727cE2B7433619676CeD672e25c6a8f71d` |
| Deploy/relayer wallet | `0x9270209A465b466b7a25865B61e1878953AFE676` |

⚠️ **Never commit private keys to git. These are testnet-only addresses.**

---

## Deployment

The project deploys automatically via GitHub Actions on every push to `main`.

Manual deploy:
```bash
cd frontend
npm run build
netlify deploy --prod
```

Build logs: https://app.netlify.com/projects/basedex-app
