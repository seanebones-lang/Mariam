import { getPortfolioSection } from "@/lib/get-portfolio";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BOOKING_URL } from "@/lib/booking-url";

export const metadata = { title: "Portfolio" };

export default async function PortfolioPage() {
  const { tiles, uiNote } = await getPortfolioSection();

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
        Portfolio
      </p>
      <h1 className="mt-3 font-serif text-3xl leading-tight text-bandage sm:text-4xl md:text-5xl">
        Recent work
      </h1>
      <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-bone/70 sm:text-sm">
        {uiNote === null ? (
          <>
            Mari curates this grid in{" "}
            <a
              href="https://www.sanity.io/manage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blood hover:underline"
            >
              Sanity Studio
            </a>{" "}
            (hosted) — changes go live within a few minutes after you set up a
            webhook, or on the next deploy. Day-to-day process on{" "}
            <a
              href="https://www.instagram.com/maribellebones/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blood hover:underline"
            >
              @maribellebones
            </a>
            .
          </>
        ) : uiNote === "sanity_unconfigured" ? (
          <>
            Sanity is not configured for this deployment — showing archive
            highlights. Add{" "}
            <code className="text-blood">NEXT_PUBLIC_SANITY_PROJECT_ID</code>{" "}
            and run{" "}
            <code className="text-blood">npm run sanity:schemas</code> (see
            README), then invite Mari at{" "}
            <a
              href="https://www.sanity.io/manage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blood hover:underline"
            >
              sanity.io/manage
            </a>
            .
          </>
        ) : (
          <>
            No published{" "}
            <strong className="text-bone">Portfolio piece</strong> documents
            yet — placeholders below. Open your Sanity project and publish at
            least one piece with an image and alt text.
          </>
        )}
      </p>
      <div className="mt-10 grid grid-cols-2 gap-1.5 sm:mt-12 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-4">
        {tiles.map((t) => (
          <a
            key={t.id}
            href={t.href}
            target={t.href.startsWith("http") ? "_blank" : undefined}
            rel={t.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="aspect-square overflow-hidden border border-bone/10 bg-char"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={t.url}
              alt={t.alt}
              loading="lazy"
              className="h-full w-full object-cover transition hover:scale-105"
            />
          </a>
        ))}
      </div>
      <div className="mt-10">
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Book a session
        </a>
      </div>
    </div>
  );
}
