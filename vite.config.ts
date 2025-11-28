import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'http';

// Helper to parse body
const parseBody = async (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
};

const vercelApiMiddleware = () => {
  return {
    name: 'vercel-api-middleware',
    configureServer(server: any) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse & { status?: any, json?: any }, next: any) => {
        if (req.url?.startsWith('/api/')) {
          const url = new URL(req.url, `http://${req.headers.host}`);
          const filePath = `./api${url.pathname.replace('/api', '')}.ts`;

          try {
            const module = await server.ssrLoadModule(filePath);
            if (module.default) {
              // Polyfill Vercel/Express helpers
              (req as any).query = Object.fromEntries(url.searchParams);
              (req as any).body = await parseBody(req);

              res.status = (code: number) => {
                res.statusCode = code;
                return res;
              };
              res.json = (data: any) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                return res;
              };

              await module.default(req, res);
              return;
            }
          } catch (e) {
            console.error(`Failed to load API function at ${filePath}:`, e);
            // Fallthrough to next middleware (maybe 404 or handled by Vite)
          }
        }
        next();
      });
    }
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 5173,
      host: '0.0.0.0',
    },
    plugins: [react(), vercelApiMiddleware()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
