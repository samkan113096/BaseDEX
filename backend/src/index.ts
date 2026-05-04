import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import websocketPlugin from '@fastify/websocket';
import { registerApiRoutes } from './api/routes.js';
import { registerWsRoutes }  from './ws/handler.js';
import { oracle }            from './services/oracle.js';

async function main() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? 'info',
    },
  });

  const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
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

  // Start the price oracle
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
