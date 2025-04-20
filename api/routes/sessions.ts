import { Hono } from "hono";
import db from "../lib/db";
import { sessions, userSessions } from "../lib/db/schema/session";
import { eq, isNull } from "drizzle-orm";
import ensureUser from "../middlewares/ensureUser";
import { tryCatch } from "../../utils/tryCatch";
import adminOnly from "../middlewares/adminOnly";
import { zValidator } from "@hono/zod-validator";
import { createInsertSchema } from "drizzle-zod";
import { respond } from "../utils/respond";
import { z } from "zod";

const app = new Hono()

  .get("/", async (ctx) => {
    const allSessions = await tryCatch(
      db.select().from(sessions).where(isNull(sessions.deletedAt))
    );

    if (allSessions.error) {
      ctx.log(allSessions.error);
      return ctx.json({ error: "Failed to fetch sessions from DB" }, 500);
    }

    return ctx.json({ data: { sessions: allSessions.data } }, 200);
  })

  .post(
    "/",
    adminOnly,
    zValidator(
      "json",
      createInsertSchema(sessions).omit({ createdAt: true, deletedAt: true })
    ),
    async (ctx) => {
      const newSessionData = ctx.req.valid("json");

      const newSession = await tryCatch(
        db.insert(sessions).values(newSessionData).returning()
      );
      if (newSession.error) {
        ctx.log(newSession.error);
        return respond.err(
          ctx,
          "Failed to create new session " + newSession.error.message,
          500
        );
      }

      return respond.ok(
        ctx,
        { session: newSession.data },
        "Session created successfully",
        201
      );
    }
  )

  .post("/register", ensureUser, async (ctx) => {
    try {
      const { sessionId } = await ctx.req.json();
      const { user } = ctx.var;

      // fake Razorpay logic, fix latrer
      const paymentSuccess = true;

      if (!paymentSuccess) {
        return respond.err(ctx, "Payment failed", 402);
      }

      const registration = await tryCatch(
        db.insert(userSessions).values({
          userId: user.id,
          sessionId: sessionId,
          paymentId: "dummy_payment_id",
        })
      );

      if (registration.error) {
        ctx.log(registration.error);
        return respond.err(ctx, "Failed to register for session", 500);
      }

      return respond.ok(ctx, {}, "Session registration successful", 201);
    } catch (error) {
      ctx.log(error);
      return respond.err(ctx, "Server error", 500);
    }
  })

  .delete(
    "/delete/:id",
    adminOnly,
    zValidator(
      "param",
      z.object({
        id: z.number().int().positive(),
      })
    ),
    async (ctx) => {
      const { id } = ctx.req.valid("param");

      const deletedSessionDbResponse = await tryCatch(
        db
          .update(sessions)
          .set({ deletedAt: new Date() })
          .where(eq(sessions.id, id))
      );

      if (deletedSessionDbResponse.error) {
        ctx.log(deletedSessionDbResponse.error);
        return respond.err(
          ctx,
          "Failed to delete session " + deletedSessionDbResponse.error.message,
          500
        );
      }

      return respond.ok(ctx, {}, "Session deleted successfully", 200);
    }
  );

export default app;
