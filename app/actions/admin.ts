"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { flashPieces, tourDates } from "@/db/schema";
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionValue,
} from "@/lib/admin-session";
import { getServerEnv } from "@/lib/env";

export async function adminLogin(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const env = getServerEnv();
  const expected =
    env.ADMIN_PASSWORD ?? env.ADMIN_SESSION_SECRET ?? "";
  if (!expected) {
    redirect("/admin/login?error=config");
  }
  if (password !== expected) {
    redirect("/admin/login?error=invalid");
  }
  const signingSecret = env.ADMIN_SESSION_SECRET ?? expected;
  const token = await createAdminSessionValue(signingSecret);
  const jar = await cookies();
  jar.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect((formData.get("next") as string) || "/admin");
}

export async function addTourDate(formData: FormData) {
  const db = getDb();
  if (!db) return;
  const city = String(formData.get("city") ?? "").trim();
  const venue = String(formData.get("venue") ?? "").trim();
  const starts = String(formData.get("startsOn") ?? "");
  if (!city || !starts) return;
  await db.insert(tourDates).values({
    id: nanoid(),
    city,
    venue: venue || null,
    startsOn: new Date(starts),
    endsOn: null,
    bookingUrl: null,
    notes: null,
    sortOrder: 0,
  });
  revalidatePath("/tour");
  revalidatePath("/");
}

export async function addFlashPiece(formData: FormData) {
  const db = getDb();
  if (!db) return;
  const title = String(formData.get("title") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const price = Number(formData.get("priceUsd") ?? 0);
  if (!title || !imageUrl || !price) return;
  await db.insert(flashPieces).values({
    id: nanoid(),
    title,
    description: null,
    priceCents: Math.round(price * 100),
    imageUrl,
    available: true,
    sortOrder: 0,
  });
  revalidatePath("/flash");
  revalidatePath("/");
}

export async function deleteTourDate(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const db = getDb();
  if (!db) return;
  await db.delete(tourDates).where(eq(tourDates.id, id));
  revalidatePath("/tour");
  revalidatePath("/");
}
