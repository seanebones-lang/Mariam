"use server";

import { nanoid } from "nanoid";
import { z } from "zod";
import { getDb } from "@/db";
import { bookings, consents } from "@/db/schema";
import { hashIp } from "@/lib/hash";
import { headers } from "next/headers";
import {
  bookingConfirmationEmail,
  emailConfigured,
  sendEmail,
} from "@/lib/email";

const schema = z
  .object({
    kind: z.enum(["consultation", "tattoo"]),
    clientName: z.string().min(1),
    clientEmail: z.string().email(),
    clientPhone: z.string().optional(),
    scheduledAt: z.string().optional(),
    notes: z.string().optional(),
    consentName: z.string().min(1),
    consentAck: z.boolean(),
  })
  .refine((v) => v.consentAck, { message: "Consent required" });

export async function createBooking(raw: unknown) {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid form" };
  }
  const db = getDb();
  if (!db) {
    return { ok: false as const, error: "Database not configured (DATABASE_URL)" };
  }
  const id = nanoid();
  const h = await headers();
  const ip = h.get("x-forwarded-for") ?? h.get("x-real-ip");
  await db.insert(bookings).values({
    id,
    kind: parsed.data.kind,
    status: "pending_deposit",
    clientName: parsed.data.clientName,
    clientEmail: parsed.data.clientEmail,
    clientPhone: parsed.data.clientPhone ?? null,
    scheduledAt: parsed.data.scheduledAt
      ? new Date(parsed.data.scheduledAt)
      : null,
    intake: { notes: parsed.data.notes ?? "" },
    referenceUrls: [],
    depositCents: parsed.data.kind === "consultation" ? 5000 : 10000,
  });
  await db.insert(consents).values({
    id: nanoid(),
    bookingId: id,
    signerName: parsed.data.consentName,
    signerEmail: parsed.data.clientEmail,
    ipHash: hashIp(ip),
  });

  const depositCents = parsed.data.kind === "consultation" ? 5000 : 10000;
  if (emailConfigured()) {
    const tpl = bookingConfirmationEmail({
      clientName: parsed.data.clientName,
      bookingId: id,
      kind: parsed.data.kind,
      scheduledAt: parsed.data.scheduledAt ?? null,
      depositCents,
    });
    await sendEmail({
      to: parsed.data.clientEmail,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
    }).catch(() => null);
  }

  return { ok: true as const, bookingId: id };
}
