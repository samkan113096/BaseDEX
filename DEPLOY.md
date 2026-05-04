# BaseDEX — Production Deployment Guide

## Overview

| Component | Hosting | Status |
|-----------|---------|--------|
| Frontend (Next.js) | Netlify | Deploy from GitHub |
| Backend API (Fastify) | Hostinger VPS | Deploy via PM2 |
| Smart Contracts | Base Mainnet | Deploy via Foundry |
| Domain | Hostinger | Point to Netlify + VPS |

---

## Prerequisites

- [ ] GitHub repo created and code pushed
- [ ] Netlify account (already logged in via Google)
- [ ] Hostinger VPS (Ubuntu 22.04 recommended, min 2GB RAM)
- [ ] Domain purchased (basedex.fi or similar)
- [ ] WalletConnect Cloud project ID — https://cloud.walletconnect.com
- [ ] Basescan API key — https://basescan.org/myapikey
- [ ] Funded deployer wallet with ~0.05 ETH on Base mainnet

---

## Step 1 — Deploy Frontend to Netlify

### Option A — Netlify UI (Easiest — you're already logged in)

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site" → "Import an existing project"**
3. Connect GitHub and select your `basedex` repository
4. Set these build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `.next`
5. Click **"Add environment variables"** and add:

```
NEXT_PUBLIC_ENV                      = production
NEXT_PUBLIC_API_URL                  = https://api.basedex.fi
NEXT_PUBLIC_WS_URL                   = wss://api.basedex.fi/ws
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID = <your WalletConnect project ID>
NEXT_PUBLIC_BASE_RPC_URL             = https://mainnet.base.org
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL     = https://sepolia.base.org
NEXT_PUBLIC_VAULT_ADDRESS            = <from contract deployment>
NEXT_PUBLIC_SPOT_ENGINE_ADDRESS      = <from contract deployment>
NEXT_PUBLIC_PERP_ENGINE_ADDRESS      = <from contract deployment>
NEXT_PUBLIC_SITE_URL                 = https://basedex.fi
```

6. Click **"Deploy site"**
7. After deploy, go to **Domain settings** → Add custom domain `basedex.fi`
8. Point your Hostinger domain DNS to Netlify (Netlify will show you the nameservers)

---

## Step 2 — Set Up Hostinger VPS (Backend)

### 2.1 — Initial VPS Setup (run once as root)

SSH into your Hostinger VPS:
```bash
ssh root@YOUR_VPS_IP
```

Install Node.js 20, Nginx, PM2, Certbot:
```bash
# Update system
apt-get update && apt-get upgrade -y

# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Build tools
apt-get install -y build-essential git

# Nginx + Certbot
apt-get install -y nginx certbot python3-certbot-nginx

# PM2 (process manager)
npm install -g pm2

# Create app directory
mkdir -p /var/www/basedex /var/log/basedex

# Verify
node --version   # should be v20.x
npm --version    # should be 10.x
pm2 --version
```

### 2.2 — Deploy the Backend

```bash
# Clone your repo
git clone https://github.com/YOUR_ORG/basedex.git /var/www/basedex

# Set up backend .env
cd /var/www/basedex/backend
cp .env.example .env
nano .env  # Fill in all values
```

Fill in `.env`:
```
PORT=3001
HOST=127.0.0.1
LOG_LEVEL=info
CORS_ORIGIN=https://basedex.fi,https://www.basedex.fi
BASE_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_key_here
VAULT_ADDRESS=0x...
SPOT_ENGINE_ADDRESS=0x...
PERP_ENGINE_ADDRESS=0x...
```

```bash
# Install and build
cd /var/www/basedex/backend
npm ci --omit=dev
npm run build

# Start with PM2
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup  # Follow the printed command to enable auto-start on reboot
```

### 2.3 — Configure Nginx

```bash
# Copy nginx config
cp /var/www/basedex/nginx.conf /etc/nginx/sites-available/basedex
ln -s /etc/nginx/sites-available/basedex /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default  # Remove default site

# Test config
nginx -t

# Set up SSL (replace with your actual domain)
certbot --nginx -d api.basedex.fi

# Reload nginx
systemctl reload nginx
```

### 2.4 — Verify Backend is Running

```bash
curl https://api.basedex.fi/health
# Should return: {"status":"ok","uptime":...}

pm2 list
pm2 logs basedex-api
```

---

## Step 3 — Deploy Smart Contracts

### 3.1 — Testnet First (Always test before mainnet)

```bash
cd contracts
cp .env.example .env
# Fill in DEPLOYER_PRIVATE_KEY, BASE_SEPOLIA_RPC_URL, BASESCAN_API_KEY

# Fund your deployer wallet with Base Sepolia ETH:
# https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

# Deploy to testnet
forge script script/Deploy.s.sol \
  --rpc-url base_sepolia \
  --broadcast \
  --verify \
  -vvvv
```

Test the deployment in the UI for at least 48 hours.

### 3.2 — Mainnet Deployment

```bash
# IMPORTANT: Before mainnet deployment:
# 1. Deploy a real oracle adapter (see contracts/src/interfaces/)
# 2. Set PRICE_FEED_ADDRESS in DeployMainnet.s.sol
# 3. Create a 3/5 Gnosis Safe at https://app.safe.global (Base network)
# 4. Set MULTISIG_ADDRESS in .env

# Deploy to mainnet
source .env
forge script script/DeployMainnet.s.sol \
  --rpc-url base \
  --broadcast \
  --verify \
  -vvvv

# Note the deployed addresses from console output, then:
# 1. Update frontend/.env (Netlify env vars) with new addresses
# 2. Update backend/.env on VPS with new addresses
# 3. Redeploy both
```

---

## Step 4 — DNS Configuration (Hostinger)

In your Hostinger domain control panel:

| Type | Host | Value |
|------|------|-------|
| A | api | YOUR_VPS_IP |
| CNAME | www | your-netlify-site.netlify.app |
| CNAME | @ | your-netlify-site.netlify.app |

Or set Netlify's nameservers as your domain's nameservers for automatic management.

---

## Step 5 — Post-Deployment Checklist

```
[ ] basedex.fi loads correctly
[ ] basedex.fi/trade shows trading UI
[ ] Wallet connect works (MetaMask, Coinbase Wallet)
[ ] Order book shows data
[ ] Price feed updates in real time
[ ] api.basedex.fi/health returns 200
[ ] wss://api.basedex.fi/ws connects (check browser console)
[ ] SSL certificates valid (green padlock)
[ ] basedex.fi/audit loads
[ ] basedex.fi/legal/terms loads
[ ] basedex.fi/legal/privacy loads
[ ] basedex.fi/legal/risk loads
[ ] basedex.fi/blog loads with articles
[ ] Google Search Console: submit sitemap.xml
[ ] Contract ownership transferred to multi-sig
[ ] PM2 status: all processes online
[ ] Set up monitoring (UptimeRobot for free uptime alerts)
```

---

## Ongoing Maintenance

### Update Backend
```bash
# On VPS:
cd /var/www/basedex
git pull origin main
cd backend && npm ci --omit=dev && npm run build
pm2 reload basedex-api --env production
```

### Update Frontend
Push to `main` branch → Netlify auto-deploys

### Renew SSL
```bash
# Auto-renewal is set up by Certbot. Verify with:
certbot renew --dry-run
```

### Monitor Logs
```bash
pm2 logs basedex-api
pm2 monit
tail -f /var/log/basedex/err.log
```

---

## GitHub Actions Secrets (for CI/CD)

Add these in your GitHub repo → Settings → Secrets → Actions:

| Secret | Value |
|--------|-------|
| `VPS_SSH_KEY` | Contents of your `~/.ssh/id_rsa` private key |
| `VPS_HOST` | Your Hostinger VPS IP |
| `VPS_USER` | `root` or your VPS username |
| `NEXT_PUBLIC_API_URL` | `https://api.basedex.fi` |
| `NEXT_PUBLIC_WS_URL` | `wss://api.basedex.fi/ws` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Your WalletConnect project ID |
