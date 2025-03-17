import { Hono } from "hono";
const app = new Hono();

app.get("/list", async (ctx) => {
    const sessions = [
        { name: "Salsa Session", unitPrice: 500, billedPer: "hour" },
        { name: "Rock Session", unitPrice: 750, billedPer: "day" },
        { name: "Jazz Session", unitPrice: 1000, billedPer: "session" },
    ];

    return ctx.json({ sessions }, 200);
});

export default app;
