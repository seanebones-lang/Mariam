import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getDb } from "@/db";
import { aftercareEvents, aftercareSubscribers } from "@/db/schema";

const DAYS = [0, 1, 3, 7, 14, 30];

function auth(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const authz = req.headers.get("authorization");
  return authz === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!auth(req)) {
    return new Response("unauthorized", { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return Response.json({ ok: false, error: "no database" });
  }

  const rows = await db.select().from(aftercareSubscribers);
  const now = new Date();
  let events = 0;

  for (const sub of rows) {
    const start = new Date(sub.tattooDate);
    const diff = Math.floor(
      (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    let maxDay = sub.lastSentDay;
    for (const day of DAYS) {
      if (diff < day) continue;
      const [existing] = await db
        .select({ id: aftercareEvents.id })
        .from(aftercareEvents)
        .where(
          and(
            eq(aftercareEvents.subscriberId, sub.id),
            eq(aftercareEvents.dayKey, day)
          )
        )
        .limit(1);
      if (existing) continue;

      await db.insert(aftercareEvents).values({
        id: nanoid(),
        subscriberId: sub.id,
        dayKey: day,
      });
      events += 1;
      maxDay = Math.max(maxDay, day);
    }
    if (maxDay !== sub.lastSentDay) {
      await db
        .update(aftercareSubscribers)
        .set({ lastSentDay: maxDay })
        .where(eq(aftercareSubscribers.id, sub.id));
    }
  }

  return Response.json({ ok: true, subscribers: rows.length, newEvents: events });
}
