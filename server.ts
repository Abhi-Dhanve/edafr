import { Hono } from "hono";
import { logger } from "hono/logger";
import api from "./api";
import path from "path";
import { ensureEnv } from "./env";
import staticRequestsHandler from "./api/middlewares/staticRequestsHandler";
import { fileURLToPath } from "url";
import { BaseMime } from "hono/utils/mime";
import { ResponseHeader } from "hono/utils/headers";

const isProd =
  process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlFile = Bun.file(
  path.join(__dirname, isProd ? "dist" : "", "template.html")
);
const html = await htmlFile.text();

const app = new Hono();

const log = (...data: any[]) => console.log(...data);

app.use(logger(log));
app.use((ctx, next) => {
  ctx.log = log;
  return next();
});

app.route("api", api);

app.get("/health", (ctx) => ctx.json({ status: "ok" }));

if (isProd) {
  log("Production mode detected, serving static files.");

  app.use("/*", staticRequestsHandler(path.join(__dirname, "dist")));

  let envEnsured = false;
  app.use((ctx, next) => {
    if (!envEnsured) {
      ensureEnv();
      envEnsured = true;
      log("Environment variables ensured.");
    }
    return next();
  });
} else {
  log("Development mode detected.");
  ensureEnv();
}

app.get("*", (ctx) => ctx.html(html));

export default {
  ...app,
  maxRequestBodySize: 4 * 1024 * 1024, // 4 MB
};

declare module "hono" {
  interface Context {
    log(...data: any[]): void;
  }
}
