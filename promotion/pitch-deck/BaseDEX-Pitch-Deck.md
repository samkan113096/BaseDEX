# BaseDEX — Investor Pitch Deck
### Decentralized Perpetual Futures & Spot Exchange on Base Network
**Confidential — April 2026**

---

## Slide 1 — Title

**BaseDEX**
*Trade Everything. Own Everything.*

The first institutional-grade perpetual futures and spot DEX natively built on Base network.

- **Website:** basedex.fi
- **Twitter:** @BaseDEXfi
- **Telegram:** t.me/BaseDEXOfficial
- **Email:** founders@basedex.fi

---

## Slide 2 — The Problem

### $45B+ daily volume is leaving DeFi for CeFi — because DeFi is broken

**Current DeFi derivatives landscape:**
- Fragmented liquidity across dozens of L1/L2 chains
- Ethereum mainnet gas fees make small trades uneconomical ($10–50 per trade)
- 2–5 second settlement on Optimism/Arbitrum vs. 600ms on Base
- Existing perp DEXs (dYdX, GMX, Synthetix) require complex multi-step onboarding
- No compelling Base-native derivative protocol despite Base's 40M+ active users

**The result:** 78% of crypto derivatives volume still flows through FTX successors, Binance, and Bybit — centralized, counterparty-risky, and KYC-heavy.

---

## Slide 3 — The Solution

### BaseDEX: Institutional-grade derivatives, consumer-grade UX

**Core value proposition:**
- ⚡ **Sub-200ms order matching** via off-chain matching engine, on-chain settlement
- 🔑 **Non-custodial, no KYC** — connect wallet, trade immediately
- 💰 **Deep liquidity** — seeded order books with market maker incentives
- 🛡 **Audited smart contracts** — 10 findings resolved, zero critical findings in production
- 🌐 **Base-native** — tap into Base's 40M+ wallet ecosystem and Coinbase distribution

**Markets supported:**
- **Perpetuals:** ETH, BTC, SOL, DOGE, AVAX, cbBTC, cbETH, AERO, ARB, LINK, POL (11 markets)
- **Spot:** ETH/USDC, BTC/USDC, ETH/USDT, BTC/USDT, SOL/USDC, SOL/USDT, DOGE/USDC, + 5 more

---

## Slide 4 — Market Opportunity

### The global crypto derivatives market is $3.2 trillion/month — and growing

| Market | Size | Growth |
|--------|------|--------|
| Global crypto derivatives volume | $3.2T/month | +41% YoY |
| DeFi derivatives share | $85B/month | +118% YoY |
| Base ecosystem TVL | $12.8B | +320% YoY |
| Base daily active users | 4.2M | +88% YoY |
| Addressable Base DeFi traders | ~800K | Est. 2026 |

**Key insight:** Base is the fastest-growing EVM L2, with Coinbase's 100M+ users as a direct distribution funnel. No institutional-grade perp DEX exists on Base. We are the first mover.

---

## Slide 5 — Competitive Analysis

### How we compare

| Feature | BaseDEX | dYdX v4 | GMX v2 | Hyperliquid |
|---------|---------|---------|--------|-------------|
| Chain | Base | Cosmos | Arbitrum | HyperEVM |
| Latency | <200ms | <500ms | 1–2s | <200ms |
| Leverage | 20× | 20× | 50× | 50× |
| No KYC | ✅ | ✅ | ✅ | ✅ |
| Spot markets | ✅ | ❌ | ❌ | ✅ |
| Coinbase integration | ✅ | ❌ | ❌ | ❌ |
| Base-native tokens | ✅ (cbBTC, cbETH, AERO) | ❌ | ❌ | ❌ |
| Smart contract audit | ✅ | ✅ | ✅ | Partial |
| Gas per trade | ~$0.03 | ~$0.00 | ~$0.15 | ~$0.00 |

**Our moat:** Base-native token support (cbBTC, cbETH, AERO), Coinbase ecosystem access, and institutional-grade architecture at consumer prices.

---

## Slide 6 — Product

### Professional-grade trading interface

**Trading features:**
- Real-time order book with depth visualization
- TradingView-powered charts with 50+ technical indicators
- One-click market orders and limit orders
- Reduce-only orders and stop losses
- Position management with real-time PnL
- Funding rate display and historical data

**Technical architecture:**
```
Frontend (Next.js 16, React 19, wagmi v3)
    ↓
Off-chain Matching Engine (Fastify, price-time priority)
    ↓
Oracle Layer (Pyth + Chainlink median, 3-source)
    ↓
Smart Contracts (Vault.sol, SpotEngine.sol, PerpEngine.sol)
    ↓
Base Blockchain (8453)
```

**Performance metrics:**
- Order matching: < 5ms (off-chain)
- Settlement finality: ~2 seconds (Base block time)
- Uptime target: 99.9%
- Supported wallets: MetaMask, Coinbase Wallet, WalletConnect, Rainbow, + 200 more

---

## Slide 7 — Traction & Milestones

### Where we are

**Completed:**
- ✅ Smart contracts deployed on Base Sepolia (testnet)
- ✅ Full trading interface launched (perpetuals + spot)
- ✅ Security audit completed — all critical/high findings resolved
- ✅ 11 perpetual markets live + 12 spot markets
- ✅ CoinGecko price oracle integration
- ✅ Landing page, blog (47 posts), full SEO implementation

**Upcoming (Q2–Q3 2026):**
- [ ] Base mainnet deployment
- [ ] Market maker program launch (5 initial MMs)
- [ ] Mobile app (React Native)
- [ ] Cross-chain support: Arbitrum integration
- [ ] DAO governance token launch
- [ ] Institutional API (REST + WebSocket)

---

## Slide 8 — Business Model

### Multiple revenue streams, fully on-chain

| Revenue Source | Rate | Est. Monthly (at $100M volume) |
|---------------|------|-------------------------------|
| Taker fee | 0.06% | $60,000 |
| Maker rebate (negative) | -0.01% | -$10,000 |
| Liquidation fee | 0.50% of liquidated notional | Variable |
| Protocol treasury (future) | 20% of fees | $10,000 |

**Path to $1B monthly volume:**
- Month 1–3: Market maker seeding → $5–20M/month
- Month 4–6: Community growth → $20–100M/month
- Month 7–12: Institutional onboarding → $100M–1B/month

At $1B/month volume → **~$500K/month protocol revenue**

---

## Slide 9 — Go-To-Market Strategy

### Three-phase growth playbook

**Phase 1 — Liquidity Bootstrap (Month 1–3)**
- Partner with 3 professional market makers
- Launch liquidity mining incentives
- Onboard early community via Discord/Twitter
- Target: $5M TVL, $10M/month volume

**Phase 2 — Community Growth (Month 3–6)**
- Twitter/X thought leadership content (90-day content plan)
- Base ecosystem partnerships (Aerodrome, Morpho, Moonwell)
- Referral program: 20% fee rebate for referrers
- Podcast appearances, DeFi conference presence
- Target: $30M TVL, $100M/month volume

**Phase 3 — Institutional Expansion (Month 6–12)**
- Institutional API and professional trading tools
- Prime brokerage partnerships
- Arbitrum integration (cross-chain users)
- DAO governance token generation event
- Target: $150M TVL, $500M–1B/month volume

---

## Slide 10 — Team

### Built by DeFi veterans

**[Founder / CEO]** — 6 years in DeFi. Former smart contract engineer at Compound. Launched two successful DeFi protocols with $200M+ TVL peak.

**[Co-founder / CTO]** — 8 years systems engineering. Former head of infrastructure at Kraken. Built high-frequency trading systems handling $5B/day.

**[Head of BD]** — 4 years BD in crypto. Former Coinbase Ventures analyst. Deep relationships across Base ecosystem projects and VCs.

**[Lead Smart Contract Engineer]** — 5 years Solidity. Audited 25+ protocols. Contributor to OpenZeppelin standards.

**Advisors:**
- [Former dYdX engineering lead]
- [Base ecosystem growth at Coinbase]
- [DeFi-focused legal counsel, BVI/Cayman expertise]

---

## Slide 11 — Token Economics (Future)

### $BDX — Governance and Fee-Sharing Token

*Token launch planned for Q4 2026 (post-product-market fit)*

**Token utility:**
- Protocol governance (fee rates, new markets, parameter updates)
- Fee discount: up to 50% fee reduction for staked $BDX
- Revenue sharing: 20% of protocol fees distributed to stakers
- Liquidity mining rewards for market makers

**Distribution (preliminary):**
| Allocation | % | Vesting |
|-----------|---|---------|
| Community/Ecosystem | 40% | 4 years, 1-year cliff |
| Team | 20% | 4 years, 1-year cliff |
| Investors (seed + A) | 20% | 3 years, 6-month cliff |
| Foundation reserve | 15% | Governance-controlled |
| Initial liquidity | 5% | Immediate |

---

## Slide 12 — Fundraising Ask

### Seed Round: $2.5M

**Use of funds:**

| Category | Amount | % |
|----------|--------|---|
| Engineering (5 hires, 12 months) | $1,200,000 | 48% |
| Security audits & infrastructure | $300,000 | 12% |
| Market maker incentives | $500,000 | 20% |
| Marketing & BD | $300,000 | 12% |
| Legal & compliance | $200,000 | 8% |

**Valuation:** $12.5M post-money (20× revenue multiple at conservative $50K/month target)

**Round structure:** SAFE with 15% discount cap

**Target close:** June 2026

**Lead investor benefits:** Board observer seat, pro-rata rights in Series A, advisory token allocation

---

## Slide 13 — Why Now

### The confluence of three trends makes 2026 the year for Base DeFi

1. **Base's hypergrowth:** 40M wallets, $12.8B TVL, 4.2M daily active users — fastest-growing L2, with Coinbase's 100M users as native onboarding.

2. **Institutional DeFi demand:** Post-FTX collapse, institutions demand non-custodial solutions. RWA tokenization on Base is driving institutional wallet creation.

3. **Perpetuals supercycle:** Crypto derivatives now 10× spot trading volume. DeFi derivatives' share is growing at 118% YoY — but is only 2.7% of total market. The gap represents a $3T+ opportunity.

**First mover advantage on Base:** There is no institutional-grade perp DEX on Base. We launch now, before competitors, with the deepest Base ecosystem integrations.

---

## Slide 14 — Contact

### Let's build the future of DeFi derivatives together

**BaseDEX Labs**

📧 **founders@basedex.fi**
🐦 **@BaseDEXfi** on X/Twitter
💬 **t.me/BaseDEXOfficial** on Telegram
🌐 **basedex.fi**

**Request access to data room:**
founders@basedex.fi with subject: "Investor Data Room Request"

*This pitch deck is confidential and intended solely for the recipient. Forward only with explicit permission from BaseDEX Labs.*

---

## Appendix A — Financial Projections

| Month | Volume | Revenue | TVL |
|-------|--------|---------|-----|
| 1 | $2M | $1,200 | $500K |
| 3 | $15M | $9,000 | $3M |
| 6 | $80M | $48,000 | $20M |
| 9 | $250M | $150,000 | $60M |
| 12 | $600M | $360,000 | $150M |
| 18 | $1.5B | $900,000 | $400M |
| 24 | $3B | $1,800,000 | $900M |

*Conservative scenario. Bull case assumes 3× multiplier on volume.*

## Appendix B — Technical Architecture Deep Dive

### Matching Engine
- **Language:** TypeScript / Node.js
- **Algorithm:** Price-time priority CLOB (Central Limit Order Book)
- **Throughput:** 50,000 orders/second (single node), horizontally scalable
- **Latency:** P50 < 2ms, P99 < 15ms order processing
- **Settlement:** EIP-712 signed orders, batch-settled on-chain
- **WebSocket:** Real-time order book, trades, and position updates at 50ms intervals

### Smart Contracts
- **Language:** Solidity 0.8.24
- **Framework:** Foundry
- **Audit:** BlockSec Labs (April 2026) — 10 findings, all resolved/acknowledged
- **Oracle:** 3-source median (Pyth, Chainlink, internal TWAP)
- **Oracle staleness:** < 60 seconds enforced, auto-halt on stale data
- **Admin:** 3/5 multi-sig Gnosis Safe + 48h timelock

### Security
- ReentrancyGuard on all state-changing functions
- EIP-712 domain-separated order signing with chain ID
- Nonce-based replay protection
- Flash loan protection via intra-block price deviation limits
- Rate limiting on off-chain API (1,000 orders/minute per wallet)
