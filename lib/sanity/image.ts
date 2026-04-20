import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

function builder() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
  if (!projectId) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set");
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
  return createImageUrlBuilder({ projectId, dataset });
}

export function urlFor(source: SanityImageSource) {
  return builder().image(source);
}
