import type { SanityImageSource } from "@sanity/image-url";
import { getSanityReadClient, isSanityConfigured } from "@/lib/sanity/client";
import {
  aftercarePageQuery,
  flashPieceByKeyQuery,
  flashPiecesListQuery,
  tourStopsQuery,
} from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import type { FlashPreview } from "@/lib/flash-types";

type SanityFlashRow = {
  _id: string;
  slug: string;
  title: string;
  description: string | null;
  priceCents: number;
  image: SanityImageSource;
};

function mapFlashRow(row: SanityFlashRow): FlashPreview {
  return {
    id: row.slug,
    title: row.title,
    priceCents: row.priceCents,
    imageUrl: urlFor(row.image)
      .width(1200)
      .height(1200)
      .fit("crop")
      .auto("format")
      .url(),
    description: row.description,
  };
}

export async function fetchSanityFlashPieces(): Promise<FlashPreview[]> {
  if (!isSanityConfigured()) return [];
  const client = getSanityReadClient();
  const rows = await client.fetch<SanityFlashRow[] | null>(
    flashPiecesListQuery
  );
  if (!rows?.length) return [];
  return rows.map(mapFlashRow);
}

export async function fetchSanityFlashByKey(
  key: string
): Promise<FlashPreview | null> {
  if (!isSanityConfigured()) return null;
  const client = getSanityReadClient();
  const row = await client.fetch<SanityFlashRow & { available?: boolean }>(
    flashPieceByKeyQuery,
    { key }
  );
  if (!row?.slug || row.available === false) return null;
  return mapFlashRow(row as SanityFlashRow);
}

export type TourStopSanityRow = {
  _id: string;
  city: string;
  venue: string | null;
  startsOn: string;
  endsOn: string | null;
  bookingUrl: string | null;
  notes: string | null;
  sortOrder: number;
};

export async function fetchSanityTourStops(): Promise<TourStopSanityRow[]> {
  if (!isSanityConfigured()) return [];
  const client = getSanityReadClient();
  const rows = await client.fetch<TourStopSanityRow[] | null>(tourStopsQuery);
  return rows ?? [];
}

export type AftercareSanityDoc = {
  kicker: string | null;
  headline: string | null;
  intro: string | null;
  bullets: string[] | null;
  emailSectionTitle: string | null;
  emailSectionIntro: string | null;
  disclaimer: string | null;
  policiesLinkLabel: string | null;
  policiesHref: string | null;
};

export async function fetchSanityAftercarePage(): Promise<AftercareSanityDoc | null> {
  if (!isSanityConfigured()) return null;
  const client = getSanityReadClient();
  return client.fetch<AftercareSanityDoc | null>(aftercarePageQuery);
}
