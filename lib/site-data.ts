import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { flashPieces, tourDates } from "@/db/schema";

export type FlashPreview = {
  id: string;
  title: string;
  priceCents: number;
  imageUrl: string;
  description: string | null;
};

const FALLBACK_FLASH: FlashPreview[] = [
  {
    id: "seed-moth",
    title: "Moth sigil",
    priceCents: 22000,
    imageUrl:
      "https://images.unsplash.com/photo-1611501275019-9b360cda3208?w=800&q=80",
    description: "Blackwork moth with ritual geometry.",
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
    title: "Bleeding rose",
    priceCents: 18000,
    imageUrl:
      "https://images.unsplash.com/photo-1568515387636-8de82a5e8dbc?w=800&q=80",
    description: "Neo-occult rose, crimson accent allowed in tattoo ink only.",
  },
];

export async function getFlashPreview(): Promise<FlashPreview[]> {
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
  const list = await getFlashPreview();
  return list;
}

export async function getTourPreview() {
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
