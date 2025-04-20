import { Hono } from "hono";
import db from "../lib/db";
import ensureUser from "../middlewares/ensureUser";
import { eq } from "drizzle-orm";
import { userSessions, sessions } from "../lib/db/schema/session";
import { respond } from "../utils/respond";
import { tryCatch } from "../../utils/tryCatch";

const app = new Hono()
  .get("/list", ensureUser, async (ctx) => {
    try {
      const { user } = ctx.var;
      const resp = await db
        .select()
        .from(userSessions)
        .where(eq(userSessions.userId, user.id))
        .execute();

      if (resp.length === 0) return respond.err(ctx, "No sessions found", 404);

      return ctx.json({ sessions: resp }, 200);
    } catch (error) {
      return respond.err(ctx, "The server cried", 500);
    }
  })
  .get("/history", ensureUser, async (ctx) => {
    const { user } = ctx.var;

    const userSessionsResult = await tryCatch(
      db
        .select({
          userSession: userSessions,
          session: sessions,
        })
        .from(userSessions)
        .innerJoin(sessions, eq(userSessions.sessionId, sessions.id))
        .where(eq(userSessions.userId, user.id))
        .orderBy(userSessions.createdAt)
    );

    if (userSessionsResult.error) {
      ctx.log(userSessionsResult.error);
      return respond.err(ctx, "Failed to fetch payment history", 500);
    }

    const history = userSessionsResult.data.map((record) => ({
      id: record.userSession.id,
      sessionId: record.userSession.sessionId,
      userId: record.userSession.userId,
      paymentId: record.userSession.paymentId,
      createdAt: record.userSession.createdAt,
      session: record.session,
      amount: record.session.totalPrice,
      currency: "INR",
    }));

    return respond.ok(
      ctx,
      { history },
      "Payment history fetched successfully",
      200
    );
  })
  .post("/create", ensureUser, async (ctx) => {
    try {
      const { sessionId } = await ctx.req.json();
      const { user } = ctx.var;

      await db.insert(userSessions).values({
        userId: user.id,
        sessionId: sessionId,
        paymentId: "dummy_payment_id_" + Date.now(),
      });
      return ctx.json({ success: true });
    } catch (error) {
      return respond.err(ctx, "The server cried", 500);
    }
  });

export default app;
