"use server";

import { nanoid } from "nanoid";
import { z } from "zod";
import { getDb } from "@/db";
import { aftercareSubscribers } from "@/db/schema";

const schema = z.object({
  email: z.string().email(),
  tattooDate: z.string().min(1),
});

export async function subscribeAftercare(raw: unknown) {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid input" };
  }
  const db = getDb();
  if (!db) {
    return { ok: false as const, error: "Database not configured" };
  }
  const token = nanoid(32);
  const id = nanoid();
  await db.insert(aftercareSubscribers).values({
    id,
    email: parsed.data.email,
    tattooDate: new Date(parsed.data.tattooDate),
    token,
    lastSentDay: -1,
  });
  return { ok: true as const, token };
}
