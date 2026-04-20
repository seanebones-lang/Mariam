import { nanoid } from "nanoid";
import { z } from "zod";
import { getDb } from "@/db";
import { flashClaims, flashPieces } from "@/db/schema";
import { eq } from "drizzle-orm";
import { limitApi } from "@/lib/rate-limit";
import { emailConfigured, flashHoldEmail, sendEmail } from "@/lib/email";
import { isSanityConfigured } from "@/lib/sanity/client";
import { fetchSanityFlashByKey } from "@/lib/sanity/site-cms";

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
    .select({ id: flashPieces.id, title: flashPieces.title })
    .from(flashPieces)
    .where(eq(flashPieces.id, parsed.data.flashId))
    .limit(1);

  let flashTitle: string;
  if (piece) {
    flashTitle = piece.title;
  } else if (isSanityConfigured()) {
    const s = await fetchSanityFlashByKey(parsed.data.flashId);
    if (!s) {
      return Response.json({ error: "Unknown flash piece." }, { status: 404 });
    }
    flashTitle = s.title;
  } else {
    return Response.json(
      { ok: false, error: "Flash piece not found." },
      { status: 404 }
    );
  }

  const holdUntil = new Date(Date.now() + 15 * 60 * 1000);
  const claimId = nanoid();
  await db.insert(flashClaims).values({
    id: claimId,
    flashPieceId: parsed.data.flashId,
    clientEmail: parsed.data.clientEmail,
    clientName: parsed.data.clientName,
    status: "hold",
    holdUntil,
  });

  if (emailConfigured()) {
    const base =
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
      "http://localhost:3000";
    const payUrl = `${base}/flash/pay/${claimId}`;
    const tpl = flashHoldEmail({
      clientName: parsed.data.clientName,
      flashTitle,
      holdMinutes: 15,
      payUrl,
    });
    await sendEmail({
      to: parsed.data.clientEmail,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
    }).catch(() => null);
  }

  return Response.json({
    ok: true,
    claimId,
    holdUntil: holdUntil.toISOString(),
  });
}
