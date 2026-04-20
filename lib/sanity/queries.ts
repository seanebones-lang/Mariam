/** Published portfolio pieces with image asset, ordered for the grid. */
export const portfolioPiecesQuery = `*[_type == "portfolioPiece" && defined(image.asset)] | order(sortOrder asc, _createdAt desc) {
  _id,
  alt,
  linkUrl,
  image
}`;
