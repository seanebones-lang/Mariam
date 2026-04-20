import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const root = base.replace(/\/$/, "");
  const paths = [
    "",
    "/flash",
    "/portfolio",
    "/aftercare",
    "/gift-cards",
    "/tour",
    "/about",
    "/faq",
    "/privacy",
    "/terms",
  ];
  const now = new Date();
  return paths.map((p) => ({
    url: `${root}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
}
