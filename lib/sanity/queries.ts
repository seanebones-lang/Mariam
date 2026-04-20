/** Published portfolio pieces with image asset, ordered for the grid. */
export const portfolioPiecesQuery = `*[_type == "portfolioPiece" && defined(image.asset)] | order(sortOrder asc, _createdAt desc) {
  _id,
  alt,
  linkUrl,
  image
}`;

/** Shop flash — URL uses `slug.current` as /flash/[id]. */
export const flashPiecesListQuery = `*[_type == "flashPiece" && defined(slug.current) && defined(image.asset) && available == true] | order(sortOrder asc, _createdAt desc) {
  _id,
  "slug": slug.current,
  title,
  description,
  priceCents,
  image
}`;

export const flashPieceByKeyQuery = `*[_type == "flashPiece" && (slug.current == $key || _id == $key) && defined(image.asset)][0]{
  _id,
  "slug": slug.current,
  title,
  description,
  priceCents,
  image,
  available
}`;

export const tourStopsQuery = `*[_type == "tourStop"] | order(sortOrder asc, startsOn asc) {
  _id,
  city,
  venue,
  startsOn,
  endsOn,
  bookingUrl,
  notes,
  sortOrder
}`;

/** Newest edited aftercare document wins (keep a single published doc in Studio). */
export const aftercarePageQuery = `*[_type == "aftercarePage"] | order(_updatedAt desc) [0] {
  kicker,
  headline,
  intro,
  bullets,
  emailSectionTitle,
  emailSectionIntro,
  disclaimer,
  policiesLinkLabel,
  policiesHref
}`;
