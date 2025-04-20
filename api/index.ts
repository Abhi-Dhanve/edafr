import { Hono } from "hono";
import { cors } from "hono/cors";
import env from "../env";
import user from "./routes/user";
import sessions from "./routes/sessions";
import payments from "./routes/payments";
import { respond } from "./utils/respond";

const app = new Hono()
  .use(
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
      allowMethods: ["POST", "GET", "PUT", "PATCH", "OPTIONS", "DELETE"],
      allowHeaders: ["Content-Type", "Authorization"],
    })
  )
  .route("user", user)
  .route("sessions", sessions)
  .route("payment", payments)
  .get("/stats", async (ctx) => {
    servedSessions++;

    const privyAppId = env.PRIVY_APP_ID;

    return respond.ok(
      ctx,
      {
        servedSessions,
        privyAppId,
      },
      "Server stats",
      200
    );
  });
let servedSessions = 0;

export default app;
export type API = typeof app;
