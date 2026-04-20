import { asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { getDb } from "@/db";
import { flashPieces, tourDates } from "@/db/schema";
import type { FlashPreview } from "@/lib/flash-types";
import { isSanityConfigured } from "@/lib/sanity/client";
import {
  fetchSanityFlashByKey,
  fetchSanityFlashPieces,
  fetchSanityTourStops,
} from "@/lib/sanity/site-cms";

export type { FlashPreview } from "@/lib/flash-types";

const getSanityFlashCached = unstable_cache(
  fetchSanityFlashPieces,
  ["sanity-flash-pieces-v1"],
  { revalidate: 180, tags: ["flash"] }
);

const getSanityTourCached = unstable_cache(
  fetchSanityTourStops,
  ["sanity-tour-stops-v1"],
  { revalidate: 180, tags: ["tour"] }
);

const FALLBACK_FLASH: FlashPreview[] = [
  {
    id: "seed-moth",
    title: "Moth study",
    priceCents: 22000,
    imageUrl:
      "https://images.unsplash.com/photo-1611501275019-9b360cda3208?w=800&q=80",
    description: "Blackwork moth with ornamental geometry.",
  },
  {
    id: "seed-serpent",
    title: "Serpent coil",
    priceCents: 28000,
    imageUrl:
      "https://images.unsplash.com/photo-1590246814883-57c511a8e326?w=800&q=80",
    description: "Coiled serpent flash — placement flexible.",
  },
  {
    id: "seed-rose",
    title: "Rose study",
    priceCents: 18000,
    imageUrl:
      "https://images.unsplash.com/photo-1568515387636-8de82a5e8dbc?w=800&q=80",
    description: "Illustrative rose; accent tones per ink palette at session.",
  },
];

export async function getFlashPreview(): Promise<FlashPreview[]> {
  if (isSanityConfigured()) {
    try {
      const all = await getSanityFlashCached();
      if (all.length > 0) return all.slice(0, 6);
    } catch {
      /* fall through to DB / demo */
    }
  }
  const db = getDb();
  if (!db) return FALLBACK_FLASH;
  try {
    const rows = await db
      .select()
      .from(flashPieces)
      .where(eq(flashPieces.available, true))
      .orderBy(asc(flashPieces.sortOrder))
      .limit(6);
    if (!rows.length) return FALLBACK_FLASH;
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      priceCents: r.priceCents,
      imageUrl: r.imageUrl,
      description: r.description,
    }));
  } catch {
    return FALLBACK_FLASH;
  }
}

export async function getFlashById(id: string): Promise<FlashPreview | null> {
  if (isSanityConfigured()) {
    try {
      const fromSanity = await fetchSanityFlashByKey(id);
      if (fromSanity) return fromSanity;
    } catch {
      /* fall through */
    }
  }
  const db = getDb();
  if (!db) {
    return FALLBACK_FLASH.find((f) => f.id === id) ?? null;
  }
  try {
    const [row] = await db
      .select()
      .from(flashPieces)
      .where(eq(flashPieces.id, id))
      .limit(1);
    if (!row) return FALLBACK_FLASH.find((f) => f.id === id) ?? null;
    return {
      id: row.id,
      title: row.title,
      priceCents: row.priceCents,
      imageUrl: row.imageUrl,
      description: row.description,
    };
  } catch {
    return FALLBACK_FLASH.find((f) => f.id === id) ?? null;
  }
}

export async function getAllFlash(): Promise<FlashPreview[]> {
  if (isSanityConfigured()) {
    try {
      const all = await getSanityFlashCached();
      if (all.length > 0) return all;
    } catch {
      /* fall through */
    }
  }
  const db = getDb();
  if (!db) return FALLBACK_FLASH;
  try {
    const rows = await db
      .select()
      .from(flashPieces)
      .where(eq(flashPieces.available, true))
      .orderBy(asc(flashPieces.sortOrder));
    if (!rows.length) return FALLBACK_FLASH;
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      priceCents: r.priceCents,
      imageUrl: r.imageUrl,
      description: r.description,
    }));
  } catch {
    return FALLBACK_FLASH;
  }
}

export async function getTourPreview() {
  if (isSanityConfigured()) {
    try {
      const rows = await getSanityTourCached();
      if (rows.length > 0) {
        return rows.map((r) => ({
          id: r._id,
          city: r.city,
          venue: r.venue,
          startsOn: r.startsOn,
          endsOn: r.endsOn,
          bookingUrl: r.bookingUrl,
          notes: r.notes,
          sortOrder: r.sortOrder,
        }));
      }
    } catch {
      /* fall through */
    }
  }
  const db = getDb();
  if (!db) return [];
  try {
    return await db
      .select()
      .from(tourDates)
      .orderBy(asc(tourDates.startsOn))
      .limit(20);
  } catch {
    return [];
  }
}
