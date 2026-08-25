import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Local dev middleware for Vercel Serverless Functions in /api
function apiDevPlugin() {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) return next();

        try {
          const parsedUrl = new URL(req.url, `http://${req.headers.host || '127.0.0.1:5500'}`);
          const pathname = parsedUrl.pathname;

          let handlerPath = null;
          if (pathname === '/api/news') handlerPath = './api/news.js';
          else if (pathname === '/api/earthquake') handlerPath = './api/earthquake.js';
          else if (pathname === '/api/reports') handlerPath = './api/reports.js';
          else if (pathname === '/api/auth/face-login') handlerPath = './api/auth/face-login.js';
          else if (pathname === '/api/auth/face-register') handlerPath = './api/auth/face-register.js';
          else if (pathname === '/api/operator/reports') handlerPath = './api/operator/reports.js';
          else if (pathname === '/api/donate/create-checkout') handlerPath = './api/donate/create-checkout.js';
          else if (pathname === '/api/donate/history') handlerPath = './api/donate/history.js';
          else if (pathname === '/api/donate/verify') handlerPath = './api/donate/verify.js';

          if (!handlerPath) return next();

          // Load handler module dynamically via Vite SSR
          const mod = await server.ssrLoadModule(handlerPath);
          const handler = mod.default;

          // Parse query params
          const query = Object.fromEntries(parsedUrl.searchParams.entries());
          req.query = query;

          // Helper response methods for compatibility with Vercel function signature
          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          };

          // Parse request body for POST/PATCH/PUT
          if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'PUT') {
            let body = '';
            req.on('data', (chunk) => { body += chunk; });
            req.on('end', async () => {
              try { req.body = JSON.parse(body || '{}'); } catch { req.body = {}; }
              await handler(req, res);
            });
          } else {
            await handler(req, res);
          }
        } catch (err) {
          console.error('API Dev Server Middleware Error:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiDevPlugin()],
  server: {
    host: '127.0.0.1',
    port: 5500,
    open: false
  },
  preview: {
    host: '127.0.0.1',
    port: 5500
  }
})
