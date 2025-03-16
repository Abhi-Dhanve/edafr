import { Hono } from "hono";
import { cors } from "hono/cors";
import env from "../env";

const app = new Hono();

app.use(
  cors({
    origin: (origin, ctx) => {
      const selfUrl = new URL(ctx.req.url);
      const selfOrigin = selfUrl.origin;
      if (!origin || origin === selfOrigin) {
        return origin;
      }
      return "";
    },
    credentials: true,
    allowMethods: ["POST", "GET", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

// app.route("dummy", dummy);

let servedSessions = 0;
app.get("/stats", async (ctx) => {
  servedSessions++;
  return ctx.json({
    servedSessions,
    clerkPublishableKey: env.CLERK_PUBLISHABLE_KEY,
  });
});

export default app;
