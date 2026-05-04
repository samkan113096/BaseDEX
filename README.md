# BaseDEX

A full-stack decentralized perpetual & spot trading platform on **Base** (Coinbase L2).  
Inspired by Hyperliquid — off-chain order matching with on-chain settlement.

---

## Architecture

```
base-dex/
├── contracts/     Solidity smart contracts (Foundry)
│   ├── Vault.sol          USDC collateral management
│   ├── SpotEngine.sol     Spot order settlement (EIP-712 signatures)
│   ├── PerpEngine.sol     Perpetual futures (leverage, funding, liquidations)
│   └── MockPriceFeed.sol  Testnet oracle
│
├── backend/       Node.js off-chain matching engine
│   ├── engine/    Price-time priority order book per market
│   ├── api/       REST API (Fastify)
│   ├── ws/        WebSocket real-time feeds
│   └── services/  Binance oracle price streaming
│
└── frontend/      Next.js 14 trading interface
    ├── components/
    │   ├── layout/   Header, market stats bar
    │   ├── charts/   TradingView Lightweight Charts candlesticks
    │   └── trading/  OrderBook, OrderForm (leverage slider), BottomPanel, RecentTrades
    ├── hooks/     WebSocket market data hook
    └── store/     Zustand global state
```

## Quick Start

### 1. Backend
```bash
cd backend
cp .env.example .env   # fill in values
npm install
npm run dev            # starts on :3001
```

### 2. Frontend
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev            # starts on :3000
```

### 3. Contracts (deploy to Base Sepolia testnet)
```bash
cd contracts
cp .env.example .env   # add DEPLOYER_PRIVATE_KEY + BASE_SEPOLIA_RPC_URL
forge script script/Deploy.s.sol --rpc-url base_sepolia --broadcast --verify
```

---

## Markets

| Market    | Type        | Max Leverage |
|-----------|-------------|-------------|
| ETH-PERP  | Perpetual   | 20×         |
| BTC-PERP  | Perpetual   | 20×         |
| SOL-PERP  | Perpetual   | 20×         |
| ETH/USDC  | Spot        | —           |
| BTC/USDC  | Spot        | —           |

## How It Works

1. **User deposits USDC** into `Vault.sol` on Base
2. **Frontend** submits signed orders (EIP-712) to the backend API
3. **Matching engine** matches buy/sell orders price-time priority
4. **Relayer** calls `SpotEngine.settleMatch()` or `PerpEngine.executeOrder()` on-chain
5. Smart contracts verify signatures, update balances in `Vault`
6. **Real-time prices** stream from Binance WebSocket, feeding charts and oracle

## Fees

| Role  | Spot | Perp |
|-------|------|------|
| Taker | 0.05% | 0.05% |
| Maker | 0.02% | 0.02% |

## Production Checklist

- [ ] Replace `MockPriceFeed` with Pyth Network oracle
- [ ] Add WalletConnect project ID
- [ ] Configure Neon PostgreSQL `DATABASE_URL` for order history persistence
- [ ] Fund relayer wallet for on-chain settlement gas
- [ ] Add KYC/geo-blocking if required by jurisdiction
- [ ] Smart contract audit before mainnet
- [ ] Set up liquidation bot to monitor under-margined positions
