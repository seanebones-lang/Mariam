import type { IgMedia } from "@/lib/instagram";

export type Tile = {
  id: string;
  url: string;
  href: string;
  alt: string;
};

const FALLBACK: Tile[] = [
  { id: "1", url: "https://images.unsplash.com/photo-1598371835526-4c06a5f7cde3?w=600&q=80", href: "/portfolio", alt: "Dark blackwork tattoo on forearm" },
  { id: "2", url: "https://images.unsplash.com/photo-1565058379802-bb39b142aede?w=600&q=80", href: "/portfolio", alt: "Fine-line dark art tattoo" },
  { id: "3", url: "https://images.unsplash.com/photo-1611501275019-9b360cda3208?w=600&q=80", href: "/portfolio", alt: "Black ornamental tattoo" },
  { id: "4", url: "https://images.unsplash.com/photo-1590246814883-57c511a8e326?w=600&q=80", href: "/portfolio", alt: "Dark illustrative tattoo" },
  { id: "5", url: "https://images.unsplash.com/photo-1568515387636-8de82a5e8dbc?w=600&q=80", href: "/portfolio", alt: "Blackwork arm piece" },
  { id: "6", url: "https://images.unsplash.com/photo-1618172193762-c511deb4e414?w=600&q=80", href: "/portfolio", alt: "Moody portrait tattoo" },
  { id: "7", url: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&q=80", href: "/portfolio", alt: "Fine-line dark tattoo" },
  { id: "8", url: "https://images.unsplash.com/photo-1618172193622-afc2d1d7f4aa?w=600&q=80", href: "/portfolio", alt: "Dark art blackwork tattoo" },
];

function firstSentence(caption: string | undefined, fallback: string): string {
  if (!caption) return fallback;
  const clean = caption
    .replace(/#[^\s#]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!clean) return fallback;
  const cut = clean.slice(0, 120);
  const stop = cut.search(/[.!?]/);
  return stop > 20 ? cut.slice(0, stop + 1) : cut;
}

export function portfolioTiles(ig: IgMedia[]): Tile[] {
  if (!ig.length) return FALLBACK;
  return ig.slice(0, 8).map((m) => ({
    id: m.id,
    url: m.media_url ?? m.thumbnail_url ?? "",
    href: m.permalink,
    alt: firstSentence(m.caption, "Mari Belle Bones tattoo work"),
  }));
}
