import { getInstagramFeed } from "@/lib/instagram";
import { portfolioTiles } from "@/lib/portfolio-tiles";

export const metadata = { title: "Portfolio" };

export default async function PortfolioPage() {
  const ig = await getInstagramFeed();
  const tiles = portfolioTiles(ig);
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <h1 className="font-serif text-4xl text-bandage">Portfolio</h1>
      <p className="mt-4 max-w-2xl text-sm text-bone/75">
        Live grid from Instagram Graph API when{" "}
        <code className="text-blood">INSTAGRAM_ACCESS_TOKEN</code> and{" "}
        <code className="text-blood">INSTAGRAM_USER_ID</code> are set. Otherwise
        seeded stills.
      </p>
      <div className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {tiles.map((t) => (
          <a
            key={t.id}
            href={t.href}
            target={t.href.startsWith("http") ? "_blank" : undefined}
            rel={t.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="aspect-square overflow-hidden border border-bone/10 bg-char"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.url} alt="" className="h-full w-full object-cover" />
          </a>
        ))}
      </div>
    </div>
  );
}
