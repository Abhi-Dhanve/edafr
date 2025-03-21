import { Hono } from "hono";
import db from "../lib/db";
import { sessions } from "../lib/db/schema/session";
import { eq, isNull } from "drizzle-orm";

const app = new Hono();

app.get("/list", async (ctx) => {
   const resp = await db.select().from(sessions).where(isNull(sessions.deleted_at))
   if (resp.length === 0) return ctx.text("No sessions found", 404);

    return ctx.json({ sessions:resp }, 200);
});

app.post("/create", async (ctx) => {

    try {
        const { name, unitPrice, billedPer } = await ctx.req.json();
        if (typeof name != "string") return ctx.text("Name is required", 400);
        if (typeof unitPrice != "number") return ctx.text("Unit price must be an interger", 400);
        if (typeof billedPer != "string") return ctx.text("Billing per is required", 400);
        const newSession = await db.insert(sessions).values({
         name:name , unitPrice: unitPrice, billedPer : billedPer});
    
    return ctx.text("Success", 201);
    } catch (error) {
        console.error(error);
        return ctx.json({error: 'Error'}, 500);
    }``

});

app.delete("/delete/:id", async (ctx) => {
    try {
    const id = ctx.req.param("id");
    await db.update(sessions).set({ deleted_at: new Date() }).where(eq(sessions.id, parseInt(id)));
    return ctx.text("Success", 200);
        
    } catch (error) {
        console.error(error)
        return ctx.json({error: 'Error'}, 500);
    }

});

export default app;
