"use server";

import { nanoid } from "nanoid";
import { z } from "zod";
import { getDb } from "@/db";
import { giftCardOrders } from "@/db/schema";

const schema = z.object({
  amountCents: z.number().int().min(2500).max(500000),
  recipientEmail: z.string().email(),
  recipientName: z.string().optional(),
  senderName: z.string().optional(),
  message: z.string().max(280).optional(),
});

export async function createGiftCardOrder(raw: unknown) {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid form" };
  }

  const db = getDb();
  if (!db) {
    return { ok: false as const, error: "Database not configured" };
  }

  const id = nanoid();
  await db.insert(giftCardOrders).values({
    id,
    recipientEmail: parsed.data.recipientEmail,
    amountCents: parsed.data.amountCents,
    status: "pending",
  });

  return { ok: true as const, orderId: id };
}
