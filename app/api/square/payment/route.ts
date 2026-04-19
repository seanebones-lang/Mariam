import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { getDb } from "@/db";
import { bookings, flashClaims, giftCardOrders } from "@/db/schema";
import { getServerEnv, squareConfigured } from "@/lib/env";
import { getSquareClient } from "@/lib/square";
import { limitApi } from "@/lib/rate-limit";
import { sendEmail, emailConfigured, giftCardEmail } from "@/lib/email";

const schema = z.object({
  kind: z.enum(["booking", "flash", "gift"]),
  referenceId: z.string().min(1),
  sourceId: z.string().min(1),
  amountCents: z.number().int().positive(),
});

function clientKey(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: Request) {
  const { success } = await limitApi(`square-pay:${clientKey(req)}`);
  if (!success) {
    return Response.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  if (!squareConfigured()) {
    return Response.json(
      { ok: false, error: "Payments are not configured yet." },
      { status: 503 }
    );
  }

  const client = getSquareClient();
  if (!client) {
    return Response.json(
      { ok: false, error: "Payments are not configured yet." },
      { status: 503 }
    );
  }

  const db = getDb();
  if (!db) {
    return Response.json(
      { ok: false, error: "Database unavailable." },
      { status: 503 }
    );
  }

  const { kind, referenceId, sourceId, amountCents } = parsed.data;
  const env = getServerEnv();

  try {
    const result = await client.payments.create({
      sourceId,
      idempotencyKey: `${kind}:${referenceId}:${nanoid(8)}`,
      amountMoney: {
        amount: BigInt(amountCents),
        currency: "USD",
      },
      locationId: env.SQUARE_LOCATION_ID,
      referenceId: `${kind}:${referenceId}`,
      note: `Mari Belle Bones ${kind} ${referenceId}`,
    });

    const payment = result.payment;
    const paymentId = payment?.id;
    const status = payment?.status;
    if (!paymentId) {
      return Response.json(
        { ok: false, error: "Payment did not return an id." },
        { status: 502 }
      );
    }

    const paid = status === "COMPLETED" || status === "APPROVED";

    if (kind === "booking") {
      await db
        .update(bookings)
        .set({
          squarePaymentId: paymentId,
          status: paid ? "paid" : "processing",
          updatedAt: new Date(),
        })
        .where(eq(bookings.id, referenceId));
    } else if (kind === "flash") {
      await db
        .update(flashClaims)
        .set({
          squarePaymentId: paymentId,
          status: paid ? "paid" : "hold",
        })
        .where(and(eq(flashClaims.id, referenceId), eq(flashClaims.status, "hold")));
    } else if (kind === "gift") {
      await db
        .update(giftCardOrders)
        .set({
          squarePaymentId: paymentId,
          status: paid ? "paid" : "processing",
        })
        .where(eq(giftCardOrders.id, referenceId));

      if (paid && emailConfigured()) {
        const [order] = await db
          .select()
          .from(giftCardOrders)
          .where(eq(giftCardOrders.id, referenceId))
          .limit(1);
        if (order) {
          const code = order.squareGiftCardId ?? `MBB-${order.id.slice(0, 8).toUpperCase()}`;
          const base =
            process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
            "http://localhost:3000";
          const tpl = giftCardEmail({
            amountCents: order.amountCents,
            code,
            redeemUrl: `${base}/book`,
          });
          await sendEmail({
            to: order.recipientEmail,
            subject: tpl.subject,
            html: tpl.html,
            text: tpl.text,
          }).catch(() => null);
        }
      }
    }

    return Response.json({
      ok: true,
      paymentId,
      status: status ?? "UNKNOWN",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Payment failed.";
    return Response.json({ ok: false, error: msg }, { status: 502 });
  }
}
