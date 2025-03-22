import { Hono } from "hono";
import db from "../lib/db";
import { userSessions } from "../lib/db/schema/userSessions";
import ensureUser from "../middlewares/ensureUser";

const app = new Hono();

app.post("/create", ensureUser  ,async (ctx) => {
  try {
    const { name, email, sessionIds , paymentStatus } = await ctx.req.json();
    const { user } = ctx.var;

    await db.insert(userSessions).values({
        name: name,
        email: email,
        userId: user.id,
      sessionIds: sessionIds,
      paymentStatus: paymentStatus,
    });
    return ctx.json({ success: true });
  } catch (error) {
    ctx.log(error)
    return ctx.text("The server cried", 500);
  }
});

export default app;
