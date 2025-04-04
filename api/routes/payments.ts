import { Hono } from "hono";
import db from "../lib/db";
import { userSessions } from "../lib/db/schema/userSessions";
import ensureUser from "../middlewares/ensureUser";
import { eq } from "drizzle-orm";

const app = new Hono();

app.get("/list", ensureUser, async (ctx) => {
  try {
    const { user } = ctx.var;
    const resp = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.userId, user.id))
      .execute();

    if (resp.length === 0) return ctx.text("No sessions found", 404);

    return ctx.json({sessions:resp},200);

  } catch (error) {
    // ctx.text(error);
    return ctx.text("The server cried", 500);
  }
});

app.post("/create", ensureUser, async (ctx) => {
  try {
    const { name, email, sessionIds, paymentStatus } = await ctx.req.json();
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
    // ctx.log(error);
    return ctx.text("The server cried", 500);
  }
});

export default app;
