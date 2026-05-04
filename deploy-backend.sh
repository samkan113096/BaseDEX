#!/usr/bin/env bash
# ============================================================
# BaseDEX Backend — Hostinger VPS Deploy Script
# ============================================================
# Prerequisites on the VPS (run once as root):
#   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
#   apt-get install -y nodejs nginx certbot python3-certbot-nginx
#   npm install -g pm2
#   mkdir -p /var/www/basedex /var/log/basedex
#   chown -R $USER:$USER /var/www/basedex /var/log/basedex
#
# Usage (from your local machine):
#   chmod +x deploy-backend.sh
#   ./deploy-backend.sh
# Or on the VPS after cloning the repo:
#   bash deploy-backend.sh --local
# ============================================================

set -euo pipefail

REPO_URL="https://github.com/YOUR_ORG/basedex.git"   # <-- update this
DEPLOY_DIR="/var/www/basedex"
BACKEND_DIR="$DEPLOY_DIR/backend"
BRANCH="main"
VPS_USER="root"                   # <-- your Hostinger VPS user
VPS_HOST="YOUR_VPS_IP"            # <-- your Hostinger VPS IP or hostname
SSH_KEY="~/.ssh/id_rsa"           # <-- path to your SSH key

# ── Colours ─────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'

log()  { echo -e "${GREEN}[deploy]${NC} $1"; }
warn() { echo -e "${YELLOW}[warn]${NC} $1"; }
err()  { echo -e "${RED}[error]${NC} $1"; exit 1; }

# ── Remote deploy function ───────────────────────────────────
remote_deploy() {
  ssh -i "$SSH_KEY" "$VPS_USER@$VPS_HOST" bash <<'REMOTE'
    set -euo pipefail
    DEPLOY_DIR="/var/www/basedex"
    BACKEND_DIR="$DEPLOY_DIR/backend"

    echo "==> Pulling latest code..."
    if [ -d "$DEPLOY_DIR/.git" ]; then
      cd "$DEPLOY_DIR" && git fetch origin && git reset --hard origin/main
    else
      git clone "$REPO_URL" "$DEPLOY_DIR"
      cd "$DEPLOY_DIR"
    fi

    echo "==> Installing backend dependencies..."
    cd "$BACKEND_DIR"
    npm ci --omit=dev

    echo "==> Building TypeScript..."
    npm run build

    echo "==> Loading .env..."
    # .env must already exist on the VPS at $BACKEND_DIR/.env
    [ -f .env ] || { echo "ERROR: .env file missing at $BACKEND_DIR/.env"; exit 1; }

    echo "==> Restarting PM2..."
    if pm2 describe basedex-api > /dev/null 2>&1; then
      pm2 reload ecosystem.config.cjs --env production
    else
      pm2 start ecosystem.config.cjs --env production
    fi
    pm2 save

    echo "==> Deploy complete!"
    pm2 list
REMOTE
}

# ── Local deploy (run directly on VPS) ──────────────────────
local_deploy() {
  DEPLOY_DIR="/var/www/basedex"
  BACKEND_DIR="$DEPLOY_DIR/backend"

  log "Pulling latest code..."
  cd "$DEPLOY_DIR" && git fetch origin && git reset --hard origin/main

  log "Installing backend dependencies..."
  cd "$BACKEND_DIR"
  npm ci --omit=dev

  log "Building TypeScript..."
  npm run build

  [ -f .env ] || err ".env file missing at $BACKEND_DIR/.env — copy .env.example and fill in values"

  log "Restarting PM2..."
  if pm2 describe basedex-api > /dev/null 2>&1; then
    pm2 reload ecosystem.config.cjs --env production
  else
    pm2 start ecosystem.config.cjs --env production
  fi
  pm2 save
  log "Deploy complete!"
  pm2 list
}

# ── Entry ────────────────────────────────────────────────────
if [[ "${1:-}" == "--local" ]]; then
  local_deploy
else
  log "Deploying to $VPS_USER@$VPS_HOST..."
  remote_deploy
fi
