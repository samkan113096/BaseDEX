/**
 * PM2 Ecosystem Config — BaseDEX Backend
 * Usage on Hostinger VPS:
 *   pm2 start ecosystem.config.cjs --env production
 *   pm2 save
 *   pm2 startup
 */
module.exports = {
  apps: [
    {
      name: 'basedex-api',
      script: './dist/index.js',
      cwd: '/var/www/basedex/backend',

      // Instances: 'max' uses all CPU cores; set to 1 for small VPS
      instances: 1,
      exec_mode: 'fork',

      // Auto-restart on crash
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',

      // Logging
      out_file: '/var/log/basedex/out.log',
      error_file: '/var/log/basedex/err.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Environment — these override .env for each mode
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
        HOST: '0.0.0.0',
        LOG_LEVEL: 'debug',
        CORS_ORIGIN: 'http://localhost:3000',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
        HOST: '127.0.0.1',       // Nginx proxies from 80/443 → 3001
        LOG_LEVEL: 'info',
        CORS_ORIGIN: 'https://basedex.fi,https://www.basedex.fi',
        // All secrets should be set via a .env file in the deploy directory
        // or via `pm2 set` / systemd environment. Never hardcode here.
      },
    },
  ],
};
