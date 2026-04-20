import { createClient, type SanityClient } from "next-sanity";

const apiVersion = "2024-01-01";

export function isSanityConfigured(): boolean {
  const id = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
  return Boolean(id && id.length > 0);
}

export function getSanityReadClient(): SanityClient {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
  if (!projectId) {
    throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set");
  }
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    perspective: "published",
    token: process.env.SANITY_API_READ_TOKEN?.trim() || undefined,
  });
}
