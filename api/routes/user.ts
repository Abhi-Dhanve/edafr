import { Hono } from "hono";
import ensureUser from "../middlewares/ensureUser";

const app = new Hono();

app.get("/auth-status", ensureUser, async (ctx) => {
    const { user } = ctx.var;

    return ctx.json({ user }, 200);
});

export default app;
