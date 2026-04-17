import type { IgMedia } from "@/lib/instagram";

export type Tile = { id: string; url: string; href: string };

const FALLBACK: Tile[] = [
  { id: "1", url: "https://images.unsplash.com/photo-1598371835526-4c06a5f7cde3?w=600&q=80", href: "/portfolio" },
  { id: "2", url: "https://images.unsplash.com/photo-1565058379802-bb39b142aede?w=600&q=80", href: "/portfolio" },
  { id: "3", url: "https://images.unsplash.com/photo-1611501275019-9b360cda3208?w=600&q=80", href: "/portfolio" },
  { id: "4", url: "https://images.unsplash.com/photo-1590246814883-57c511a8e326?w=600&q=80", href: "/portfolio" },
  { id: "5", url: "https://images.unsplash.com/photo-1568515387636-8de82a5e8dbc?w=600&q=80", href: "/portfolio" },
  { id: "6", url: "https://images.unsplash.com/photo-1618172193762-c511deb4e414?w=600&q=80", href: "/portfolio" },
  { id: "7", url: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&q=80", href: "/portfolio" },
  { id: "8", url: "https://images.unsplash.com/photo-1618172193622-afc2d1d7f4aa?w=600&q=80", href: "/portfolio" },
];

export function portfolioTiles(ig: IgMedia[]): Tile[] {
  if (!ig.length) return FALLBACK;
  return ig.slice(0, 8).map((m) => ({
    id: m.id,
    url: m.media_url ?? m.thumbnail_url ?? "",
    href: m.permalink,
  }));
}
