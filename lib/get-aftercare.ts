import { unstable_cache } from "next/cache";
import { isSanityConfigured } from "@/lib/sanity/client";
import { fetchSanityAftercarePage } from "@/lib/sanity/site-cms";

export type AftercarePageContent = {
  kicker: string;
  headline: string;
  intro: string;
  bullets: string[];
  emailSectionTitle: string;
  emailSectionIntro: string;
  disclaimer: string;
  policiesLinkLabel: string;
  policiesHref: string;
};

export const DEFAULT_AFTERCARE: AftercarePageContent = {
  kicker: "Healing",
  headline: "Saniderm aftercare",
  intro:
    "Saniderm (or similar transparent film) keeps a fresh tattoo sealed from friction and airborne grit while still allowing oxygen exchange. Follow your artist's specific instructions first — this page is a general guide only.",
  bullets: [
    "Wash hands before touching the film or tattoo.",
    "If fluid builds excessively under the film, or edges peel and expose the tattoo, remove per artist timing.",
    "After removal: gentle wash, pat dry, thin balm if advised.",
    "No sun, no soaking, no picking.",
  ],
  emailSectionTitle: "Email timeline",
  emailSectionIntro:
    "Get gentle check-ins on day 0, 1, 3, 7, 14, and 30 — quick reminders of what your skin should be doing, and what to watch for.",
  disclaimer:
    "Not medical advice. Redness spreading with fever — seek urgent care.",
  policiesLinkLabel: "Studio policies",
  policiesHref: "/faq",
};

async function loadAftercareUncached(): Promise<AftercarePageContent> {
  if (!isSanityConfigured()) return DEFAULT_AFTERCARE;
  const doc = await fetchSanityAftercarePage();
  if (
    !doc?.headline?.trim() ||
    !doc.intro?.trim() ||
    !doc.bullets?.filter(Boolean).length
  ) {
    return DEFAULT_AFTERCARE;
  }
  return {
    kicker: doc.kicker?.trim() || DEFAULT_AFTERCARE.kicker,
    headline: doc.headline.trim(),
    intro: doc.intro.trim(),
    bullets: doc.bullets.filter((b) => b.trim().length > 0),
    emailSectionTitle:
      doc.emailSectionTitle?.trim() || DEFAULT_AFTERCARE.emailSectionTitle,
    emailSectionIntro:
      doc.emailSectionIntro?.trim() || DEFAULT_AFTERCARE.emailSectionIntro,
    disclaimer: doc.disclaimer?.trim() || DEFAULT_AFTERCARE.disclaimer,
    policiesLinkLabel:
      doc.policiesLinkLabel?.trim() || DEFAULT_AFTERCARE.policiesLinkLabel,
    policiesHref: doc.policiesHref?.trim() || DEFAULT_AFTERCARE.policiesHref,
  };
}

export const getAftercarePageContent = unstable_cache(
  loadAftercareUncached,
  ["sanity-aftercare-page-v1"],
  { revalidate: 180, tags: ["aftercare"] }
);
