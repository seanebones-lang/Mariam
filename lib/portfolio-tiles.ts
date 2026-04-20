/**
 * Portfolio grid tile shape (used by home + /portfolio).
 * Primary content comes from Sanity via {@link getPortfolioTiles} in `lib/get-portfolio.ts`.
 * {@link getPortfolioFallbackTiles} is used when Sanity is unset or returns no pieces.
 */

export type Tile = {
  id: string;
  url: string;
  href: string;
  alt: string;
};

const FALLBACK: Tile[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1598371835526-4c06a5f7cde3?w=600&q=80",
    href: "/portfolio",
    alt: "Blackwork tattoo on forearm",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1565058379802-bb39b142aede?w=600&q=80",
    href: "/portfolio",
    alt: "Fine-line illustrative tattoo",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1611501275019-9b360cda3208?w=600&q=80",
    href: "/portfolio",
    alt: "Black ornamental tattoo",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1590246814883-57c511a8e326?w=600&q=80",
    href: "/portfolio",
    alt: "Illustrative black and grey tattoo",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1568515387636-8de82a5e8dbc?w=600&q=80",
    href: "/portfolio",
    alt: "Blackwork arm piece",
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1618172193762-c511deb4e414?w=600&q=80",
    href: "/portfolio",
    alt: "Portrait tattoo in black and grey",
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&q=80",
    href: "/portfolio",
    alt: "Fine-line botanical tattoo",
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1618172193622-afc2d1d7f4aa?w=600&q=80",
    href: "/portfolio",
    alt: "Blackwork sleeve detail",
  },
];

export function getPortfolioFallbackTiles(): Tile[] {
  return FALLBACK;
}
