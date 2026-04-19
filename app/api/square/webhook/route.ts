import { WebhooksHelper } from "square";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { bookings, flashClaims, giftCardOrders } from "@/db/schema";
import { getServerEnv } from "@/lib/env";
import { limitApi } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const { success } = await limitApi(`square-webhook:${req.headers.get("x-forwarded-for") ?? "x"}`);
  if (!success) return new Response("rate limited", { status: 429 });

  const raw = await req.text();
  const sig = req.headers.get("x-square-hmacsha256-signature") ?? "";
  const env = getServerEnv();
  const key = env.SQUARE_WEBHOOK_SIGNATURE_KEY;

  if (!key || key === "placeholder") {
    return new Response("ok", { status: 200 });
  }

  const base =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const notificationUrl = `${base.replace(/\/$/, "")}/api/square/webhook`;

  const ok = await WebhooksHelper.verifySignature({
    requestBody: raw,
    signatureHeader: sig,
    signatureKey: key,
    notificationUrl,
  });

  if (!ok) {
    return new Response("invalid signature", { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  const event = payload as {
    type?: string;
    data?: {
      object?: {
        payment?: {
          id?: string;
          status?: string;
          reference_id?: string;
        };
      };
    };
  };

  if (event.type !== "payment.updated" && event.type !== "payment.created") {
    return new Response("ignored", { status: 200 });
  }

  const payment = event.data?.object?.payment;
  const paymentId = payment?.id;
  const status = payment?.status;
  const referenceId = payment?.reference_id ?? "";
  if (!paymentId || !referenceId) {
    return new Response("missing fields", { status: 200 });
  }

  const [kind, id] = referenceId.split(":");
  if (!kind || !id) {
    return new Response("bad reference", { status: 200 });
  }

  const db = getDb();
  if (!db) {
    return new Response("no db", { status: 200 });
  }

  const paid = status === "COMPLETED" || status === "APPROVED";
  const failed = status === "FAILED" || status === "CANCELED";

  try {
    if (kind === "booking") {
      await db
        .update(bookings)
        .set({
          squarePaymentId: paymentId,
          status: paid ? "paid" : failed ? "payment_failed" : "processing",
          updatedAt: new Date(),
        })
        .where(eq(bookings.id, id));
    } else if (kind === "flash") {
      await db
        .update(flashClaims)
        .set({
          squarePaymentId: paymentId,
          status: paid ? "paid" : failed ? "released" : "hold",
        })
        .where(eq(flashClaims.id, id));
    } else if (kind === "gift") {
      await db
        .update(giftCardOrders)
        .set({
          squarePaymentId: paymentId,
          status: paid ? "paid" : failed ? "failed" : "processing",
        })
        .where(eq(giftCardOrders.id, id));
    }
  } catch {
    return new Response("db error", { status: 500 });
  }

  return new Response("ok", { status: 200 });
}
