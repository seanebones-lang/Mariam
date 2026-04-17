import Link from "next/link";
import { HeroSection } from "@/components/hero/hero-section";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getInstagramFeed } from "@/lib/instagram";
import { portfolioTiles } from "@/lib/portfolio-tiles";
import { getTourPreview, getFlashPreview } from "@/lib/site-data";

export default async function HomePage() {
  const [ig, tours, flash] = await Promise.all([
    getInstagramFeed(),
    getTourPreview(),
    getFlashPreview(),
  ]);
  const tiles = portfolioTiles(ig);

  return (
    <>
      <HeroSection />
      <section className="border-t border-bone/10 bg-char py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <p className="font-serif text-xs uppercase tracking-[0.3em] text-blood">
            Flash
          </p>
          <h2 className="mt-3 font-serif text-3xl text-bandage md:text-4xl">
            Claim the mark
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {flash.map((f) => (
              <Link
                key={f.id}
                href={`/flash/${f.id}`}
                className="group border border-bone/10 bg-ink/40 transition hover:border-blood/40"
              >
                <div
                  className="aspect-square bg-cover bg-center"
                  style={{ backgroundImage: `url(${f.imageUrl})` }}
                />
                <div className="p-4">
                  <p className="font-display text-xl text-bandage group-hover:text-blood">
                    {f.title}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    From ${(f.priceCents / 100).toFixed(0)} + deposit
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/flash" className={cn(buttonVariants({ variant: "ghost" }))}>
              All flash
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-bone/10 bg-ink py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <p className="font-serif text-xs uppercase tracking-[0.3em] text-blood">
            Portfolio
          </p>
          <h2 className="mt-3 font-serif text-3xl text-bandage md:text-4xl">
            From the veil
          </h2>
          <p className="mt-4 max-w-xl text-sm text-bone/75">
            Pulled from @maribellebones when Instagram Graph API keys are set;
            otherwise seeded previews.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
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
                    alt=""
                    className="h-full w-full object-cover transition hover:scale-105"
                  />
                ) : null}
              </a>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/portfolio"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Full portfolio
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-bone/10 bg-char py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <p className="font-serif text-xs uppercase tracking-[0.3em] text-blood">
            Tour
          </p>
          <h2 className="mt-3 font-serif text-3xl text-bandage md:text-4xl">
            Guest rites
          </h2>
          <ul className="mt-8 space-y-4">
            {tours.length === 0 ? (
              <li className="text-sm text-muted">
                Tour dates appear here once added in admin or database.
              </li>
            ) : (
              tours.map((t) => (
                <li
                  key={t.id}
                  className="flex flex-col border border-bone/10 bg-ink/30 px-4 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-serif text-lg text-bandage">{t.city}</p>
                    {t.venue ? (
                      <p className="text-sm text-muted">{t.venue}</p>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-bone/80 md:mt-0">
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
          <div className="mt-10">
            <Link href="/tour" className={cn(buttonVariants())}>
              Tour + booking links
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-bone/10 bg-ink py-20">
        <div className="mx-auto max-w-6xl px-4 text-center md:px-6">
          <h2 className="font-serif text-3xl text-bandage md:text-4xl">
            Ready when you are
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-bone/75">
            Consultation or full session — intake, references, digital consent,
            and Square deposit in one flow.
          </p>
          <Link
            href="/book"
            className={cn(buttonVariants({ size: "lg" }), "mt-10 inline-flex")}
          >
            Begin booking
          </Link>
        </div>
      </section>
    </>
  );
}
