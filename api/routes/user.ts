import { Hono } from "hono";
import ensureUser from "../middlewares/ensureUser";
import adminOnly from "../middlewares/adminOnly";
import { tryCatch } from "../../utils/tryCatch";
import { getPrivyUserFromContext } from "../lib/privy";
import db from "../lib/db";
import { users } from "../lib/db/schema/user";
import { eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { respond } from "../utils/respond";
import { userSessions, sessions } from "../lib/db/schema/session";

const app = new Hono()

  .get("/", ensureUser, async (ctx) => {
    const { user } = ctx.var;
    return respond.ok(ctx, { user }, "user", 200);
  })

  .get("/all", adminOnly, async (ctx) => {
    const allUsers = await tryCatch(
      db.select().from(users).where(isNull(users.deletedAt))
    );

    if (allUsers.error) {
      ctx.log(allUsers.error);
      return respond.err(ctx, "Failed to fetch users", 500);
    }

    return respond.ok(ctx, { users: allUsers.data }, "All users", 200);
  })

  .get(
    "/:id/sessions",
    adminOnly,
    zValidator(
      "param",
      z.object({
        id: z.string().transform((val) => Number(val)),
      })
    ),
    async (ctx) => {
      const { id } = ctx.req.valid("param");

      const userSessionsWithDetails = await tryCatch(
        db
          .select({
            userSession: userSessions,
            session: sessions,
          })
          .from(userSessions)
          .innerJoin(sessions, eq(userSessions.sessionId, sessions.id))
          .where(eq(userSessions.userId, id))
          .orderBy(userSessions.createdAt)
      );

      if (userSessionsWithDetails.error) {
        ctx.log(userSessionsWithDetails.error);
        return respond.err(ctx, "Failed to fetch user sessions", 500);
      }

      const formattedSessions = userSessionsWithDetails.data.map((item) => ({
        id: item.userSession.id,
        sessionId: item.userSession.sessionId,
        userId: item.userSession.userId,
        paymentId: item.userSession.paymentId,
        createdAt: item.userSession.createdAt,
        sessionDetails: {
          name: item.session.name,
          totalPrice: item.session.totalPrice,
          numberOfSessions: item.session.numberOfSessions,
          days: item.session.days,
        },
      }));

      return respond.ok(
        ctx,
        { sessions: formattedSessions },
        `Sessions for user ${id}`,
        200
      );
    }
  )

  .post(
    "/",
    zValidator(
      "json",
      z.object({
        name: z.string().min(3, "Name too short").max(32, "Name too long"),
      })
    ),
    async (ctx) => {
      const { name } = ctx.req.valid("json");

      const privyUser = await getPrivyUserFromContext(ctx);
      if (!privyUser) return respond.err(ctx, "Unauthorized", 401);

      const existingUserDbResponse = await tryCatch(
        db.select().from(users).where(eq(users.privyId, privyUser.id)).limit(1)
      );
      if (existingUserDbResponse.error) {
        ctx.log(existingUserDbResponse.error);
        return respond.err(ctx, "Failed to communicate with database", 500);
      }

      const [existingUser] = existingUserDbResponse.data;

      if (existingUser) return respond.err(ctx, "User already exists", 409);

      const email = privyUser.google?.email || privyUser.email?.address;

      if (!email)
        return respond.err(
          ctx,
          "Invalid email, please create another account",
          400
        );

      const [user] = await db
        .insert(users)
        .values({
          privyId: privyUser.id,
          name: name,
          email: email,
        })
        .returning();

      return respond.ok(ctx, { user }, "User created successfully", 201);
    }
  )

  .patch(
    "/",
    zValidator(
      "json",
      z.object({
        name: z.string().min(3, "Name too short").max(32, "Name too long"),
      })
    ),
    ensureUser,
    async (ctx) => {
      const { name } = ctx.req.valid("json");
      const { user } = ctx.var;

      const updateUserDbResponse = await tryCatch(
        db.update(users).set({ name }).where(eq(users.id, user.id)).returning()
      );

      if (updateUserDbResponse.error) {
        ctx.log(updateUserDbResponse.error);
        return respond.err(ctx, "Failed to update user", 500);
      }

      const [updatedUser] = updateUserDbResponse.data;

      return respond.ok(ctx, { user: updatedUser }, "User updated", 200);
    }
  )

  .delete(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.number().int().positive(),
      })
    ),
    adminOnly,
    async (ctx) => {
      const { id } = ctx.req.valid("param");

      const deleteUserDbResponse = await tryCatch(
        db
          .update(users)
          .set({ deletedAt: new Date() })
          .where(eq(users.id, Number(id)))
      );

      if (deleteUserDbResponse.error) {
        ctx.log(deleteUserDbResponse.error);
        return respond.err(ctx, "Failed to delete user", 500);
      }

      return respond.ok(ctx, {}, "User deleted", 200);
    }
  );

export default app;
