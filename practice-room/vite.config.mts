import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";

// Runs the /api functions inside the Vite dev server, so local development matches Vercel.
// Keys come from .env.local (never committed).
function apiDevServer(): Plugin {
  return {
    name: "practice-room-api",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "";
        const match = /^\/api\/([a-z-]+)(\?.*)?$/.exec(url);
        if (!match) return next();
        try {
          const mod = await server.ssrLoadModule(`/api/${match[1]}.ts`);
          const handler = mod[req.method ?? "GET"] as ((r: Request) => Promise<Response>) | undefined;
          if (!handler) {
            res.statusCode = 405;
            return res.end();
          }
          const chunks: Buffer[] = [];
          for await (const c of req) chunks.push(c as Buffer);
          const abort = new AbortController();
          res.on("close", () => {
            if (!res.writableEnded) abort.abort();
          });
          const headers = new Headers();
          for (const [k, v] of Object.entries(req.headers)) if (typeof v === "string") headers.set(k, v);
          const request = new Request(`http://localhost${url}`, {
            method: req.method,
            headers,
            body: req.method === "GET" || req.method === "HEAD" ? undefined : Buffer.concat(chunks),
            signal: abort.signal,
          });
          const response = await handler(request);
          res.statusCode = response.status;
          response.headers.forEach((v, k) => res.setHeader(k, v));
          if (response.body) {
            const reader = response.body.getReader();
            for (;;) {
              const { done, value } = await reader.read();
              if (done) break;
              res.write(value);
            }
          }
          res.end();
        } catch (e) {
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("content-type", "application/json");
          }
          res.end(JSON.stringify({ error: (e as Error).message }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  for (const [k, v] of Object.entries(env)) if (process.env[k] === undefined) process.env[k] = v;
  return { plugins: [react(), apiDevServer()] };
});
