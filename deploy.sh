#!/usr/bin/env bash
# Fast deploy to Netlify — builds once locally then uploads.
# Usage: ./deploy.sh
set -euo pipefail

echo "🔨 Building Next.js frontend..."
cd "$(dirname "$0")/frontend"
npm run build

echo "🚀 Deploying to Netlify (uploading pre-built artifacts)..."
# NETLIFY_NEXT_PLUGIN_SKIP=true tells the Netlify Build plugin we already built
NETLIFY_NEXT_PLUGIN_SKIP=true netlify deploy --prod

echo "✅ Done!"
