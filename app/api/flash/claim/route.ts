import { nanoid } from "nanoid";
import { z } from "zod";
import { getDb } from "@/db";
import { flashClaims, flashPieces } from "@/db/schema";
import { eq } from "drizzle-orm";
import { limitApi } from "@/lib/rate-limit";

const bodySchema = z.object({
  flashId: z.string().min(1),
  clientEmail: z.string().email(),
  clientName: z.string().min(1),
});

function clientId(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: Request) {
  const id = clientId(req);
  const { success } = await limitApi(`flash:${id}`);
  if (!success) return Response.json({ error: "Too many requests" }, { status: 429 });

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const db = getDb();
  if (!db) {
    return Response.json(
      { ok: true, note: "No DATABASE_URL — hold not persisted." },
      { status: 200 }
    );
  }

  const [piece] = await db
    .select({ id: flashPieces.id })
    .from(flashPieces)
    .where(eq(flashPieces.id, parsed.data.flashId))
    .limit(1);
  if (!piece) {
    return Response.json(
      { ok: true, note: "Flash piece not in database — demo mode." },
      { status: 200 }
    );
  }

  const holdUntil = new Date(Date.now() + 15 * 60 * 1000);
  await db.insert(flashClaims).values({
    id: nanoid(),
    flashPieceId: parsed.data.flashId,
    clientEmail: parsed.data.clientEmail,
    clientName: parsed.data.clientName,
    status: "hold",
    holdUntil,
  });

  return Response.json({ ok: true, holdUntil: holdUntil.toISOString() });
}
