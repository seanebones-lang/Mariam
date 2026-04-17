import { and, eq, lt } from "drizzle-orm";
import { getDb } from "@/db";
import { flashClaims } from "@/db/schema";

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
  if (!db) return Response.json({ ok: false, error: "no database" });

  const now = new Date();
  await db
    .update(flashClaims)
    .set({ status: "expired" })
    .where(
      and(eq(flashClaims.status, "hold"), lt(flashClaims.holdUntil, now))
    );

  return Response.json({ ok: true });
}
