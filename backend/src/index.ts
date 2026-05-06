import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocketPlugin from '@fastify/websocket';
import { registerApiRoutes } from './api/routes.js';
import { registerWsRoutes }  from './ws/handler.js';
import { oracle }            from './services/oracle.js';
import { initSchema }        from './db/client.js';
import { connectRedis }      from './redis/client.js';

async function main() {
  // ── Connect to Postgres + Redis ──────────────────────────────────────────
  if (process.env.DATABASE_URL) {
    await initSchema();
  } else {
    console.warn('[startup] DATABASE_URL not set — running without Postgres persistence');
  }

  if (process.env.REDIS_URL) {
    await connectRedis();
  } else {
    console.warn('[startup] REDIS_URL not set — running without Redis pub/sub');
  }

  // ── Fastify server ────────────────────────────────────────────────────────
  const app = Fastify({
    logger: { level: process.env.LOG_LEVEL ?? 'info' },
  });

  const allowedOrigins = (process.env.CORS_ORIGIN ?? '*')
    .split(',').map(s => s.trim()).filter(Boolean);

  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
  });

  await app.register(websocketPlugin);

  registerApiRoutes(app);
  registerWsRoutes(app);

  oracle.start();

  const port = parseInt(process.env.PORT ?? '3001', 10);
  const host = process.env.HOST ?? '0.0.0.0';
  await app.listen({ port, host });
  console.log(`[server] listening on http://${host}:${port}`);
}

main().catch(err => {
  console.error('[startup error]', err);
  process.exit(1);
});
