import { unstable_cache } from "next/cache";
import type { SanityImageSource } from "@sanity/image-url";
import type { Tile } from "@/lib/portfolio-tiles";
import { getPortfolioFallbackTiles } from "@/lib/portfolio-tiles";
import { getSanityReadClient, isSanityConfigured } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { portfolioPiecesQuery } from "@/lib/sanity/queries";

export type PortfolioUiNote = null | "sanity_unconfigured" | "sanity_empty";

export type PortfolioSection = {
  tiles: Tile[];
  uiNote: PortfolioUiNote;
};

type SanityPortfolioRow = {
  _id: string;
  alt: string;
  linkUrl?: string | null;
  image: SanityImageSource;
};

async function fetchPortfolioSectionUncached(): Promise<PortfolioSection> {
  if (!isSanityConfigured()) {
    return {
      tiles: getPortfolioFallbackTiles(),
      uiNote: "sanity_unconfigured",
    };
  }
  try {
    const client = getSanityReadClient();
    const rows = await client.fetch<SanityPortfolioRow[]>(
      portfolioPiecesQuery
    );
    if (!rows?.length) {
      return {
        tiles: getPortfolioFallbackTiles(),
        uiNote: "sanity_empty",
      };
    }
    const tiles: Tile[] = rows.map((row) => ({
      id: row._id,
      url: urlFor(row.image)
        .width(1200)
        .height(1200)
        .fit("crop")
        .auto("format")
        .url(),
      href: row.linkUrl?.trim() || "/portfolio",
      alt: row.alt,
    }));
    return { tiles, uiNote: null };
  } catch {
    return {
      tiles: getPortfolioFallbackTiles(),
      uiNote: "sanity_empty",
    };
  }
}

export const getPortfolioSection = unstable_cache(
  fetchPortfolioSectionUncached,
  ["sanity-portfolio-section-v1"],
  { revalidate: 180, tags: ["portfolio"] }
);
