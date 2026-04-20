import Link from "next/link";
import { HeroSection } from "@/components/hero/hero-section";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPortfolioSection } from "@/lib/get-portfolio";
import { getTourPreview, getFlashPreview } from "@/lib/site-data";
import { BOOKING_URL } from "@/lib/booking-url";

export default async function HomePage() {
  const [portfolio, tours, flash] = await Promise.all([
    getPortfolioSection(),
    getTourPreview(),
    getFlashPreview(),
  ]);
  const { tiles, uiNote } = portfolio;

  return (
    <>
      <HeroSection />

      <section className="border-t border-bone/10 bg-char py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
            Flash
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-bandage sm:text-4xl md:text-5xl">
            Artist&apos;s Choice
          </h2>
          <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {flash.map((f) => (
              <Link
                key={f.id}
                href={`/flash/${f.id}`}
                className="group border border-bone/10 bg-ink/40 transition hover:border-blood/40 active:border-blood/40"
              >
                <div
                  role="img"
                  aria-label={f.title}
                  className="aspect-square bg-cover bg-center"
                  style={{ backgroundImage: `url(${f.imageUrl})` }}
                />
                <div className="p-4 sm:p-5">
                  <p className="font-serif text-xl text-bandage group-hover:text-blood sm:text-2xl">
                    {f.title}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    From ${(f.priceCents / 100).toFixed(0)} + deposit
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 sm:mt-10">
            <Link
              href="/flash"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full sm:w-auto"
              )}
            >
              All flash
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-bone/10 bg-ink py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
            Portfolio
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-bandage sm:text-4xl md:text-5xl">
            Recent work
          </h2>
          <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-bone/70 sm:text-sm">
            {uiNote === null ? (
              <>
                Curated in Sanity — Mari updates this grid anytime without a
                deploy. Still on{" "}
                <a
                  href="https://www.instagram.com/maribellebones/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blood hover:underline"
                >
                  @maribellebones
                </a>{" "}
                for day-to-day drops.
              </>
            ) : uiNote === "sanity_unconfigured" ? (
              <>
                Portfolio CMS is not connected yet — showing placeholder
                stills. Add{" "}
                <code className="text-blood">NEXT_PUBLIC_SANITY_PROJECT_ID</code>{" "}
                and deploy schema (see README).
              </>
            ) : (
              <>
                No published portfolio pieces in Sanity yet — placeholders
                below. Publish{" "}
                <strong className="text-bone">Portfolio piece</strong>{" "}
                documents in your Sanity dataset.
              </>
            )}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-1.5 sm:mt-10 sm:gap-2 md:grid-cols-4 md:gap-3">
            {tiles.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  item.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="aspect-square overflow-hidden border border-bone/10 bg-char"
              >
                {item.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt={item.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition hover:scale-105"
                  />
                ) : null}
              </a>
            ))}
          </div>
          <div className="mt-8 sm:mt-10">
            <Link
              href="/portfolio"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full sm:w-auto"
              )}
            >
              Full portfolio
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-bone/10 bg-char py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
            Tour
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-bandage sm:text-4xl md:text-5xl">
            Guest rites
          </h2>
          <ul className="mt-8 space-y-3 sm:space-y-4">
            {tours.length === 0 ? (
              <li className="text-sm text-muted">
                Tour dates appear here once added in admin or database.
              </li>
            ) : (
              tours.map((t) => (
                <li
                  key={t.id}
                  className="flex flex-col gap-2 border border-bone/10 bg-ink/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <div>
                    <p className="font-serif text-lg text-bandage sm:text-xl">
                      {t.city}
                    </p>
                    {t.venue ? (
                      <p className="text-sm text-muted">{t.venue}</p>
                    ) : null}
                  </div>
                  <p className="text-sm text-bone/80">
                    {new Date(t.startsOn).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {t.endsOn
                      ? ` — ${new Date(t.endsOn).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}`
                      : ""}
                  </p>
                </li>
              ))
            )}
          </ul>
          <div className="mt-8 sm:mt-10">
            <Link
              href="/tour"
              className={cn(buttonVariants(), "w-full sm:w-auto")}
            >
              Tour + booking links
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-bone/10 bg-ink py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 text-center sm:px-6">
          <h2 className="font-serif text-3xl leading-tight text-bandage sm:text-4xl md:text-5xl">
            Ready when you are
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[13px] leading-relaxed text-bone/70 sm:text-sm">
            Consultation or full session — intake, references, digital consent,
            and Square deposit in one flow.
          </p>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-8 inline-flex w-full sm:mt-10 sm:w-auto"
            )}
          >
            Begin booking
          </a>
        </div>
      </section>
    </>
  );
}
