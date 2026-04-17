import { getInstagramFeed } from "@/lib/instagram";
import { portfolioTiles } from "@/lib/portfolio-tiles";

export const metadata = { title: "Portfolio" };

export default async function PortfolioPage() {
  const ig = await getInstagramFeed();
  const tiles = portfolioTiles(ig);
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
        Portfolio
      </p>
      <h1 className="mt-3 font-serif text-3xl leading-tight text-bandage sm:text-4xl md:text-5xl">
        Recent work
      </h1>
      <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-bone/70 sm:text-sm">
        Live grid from Instagram Graph API when{" "}
        <code className="text-blood">INSTAGRAM_ACCESS_TOKEN</code> and{" "}
        <code className="text-blood">INSTAGRAM_USER_ID</code> are set. Otherwise
        seeded stills.
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
              alt=""
              className="h-full w-full object-cover transition hover:scale-105"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
