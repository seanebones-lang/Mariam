import Link from "next/link";
import { getAllFlash } from "@/lib/site-data";

export const metadata = {
  title: "Flash",
};

export default async function FlashPage() {
  const items = await getAllFlash();
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
        Shop
      </p>
      <h1 className="mt-3 font-serif text-3xl leading-tight text-bandage sm:text-4xl md:text-5xl">
        Flash
      </h1>
      <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-bone/70 sm:text-sm">
        Available designs — claim with deposit. Hold expires in fifteen minutes
        until Square confirms payment.
      </p>
      <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {items.map((f) => (
          <Link
            key={f.id}
            href={`/flash/${f.id}`}
            className="group border border-bone/10 bg-char transition hover:border-blood/40 active:border-blood/40"
          >
            <div
              className="aspect-square bg-cover bg-center"
              style={{ backgroundImage: `url(${f.imageUrl})` }}
            />
            <div className="p-4 sm:p-5">
              <h2 className="font-serif text-xl text-bandage group-hover:text-blood sm:text-2xl">
                {f.title}
              </h2>
              {f.description ? (
                <p className="mt-2 text-sm text-muted">{f.description}</p>
              ) : null}
              <p className="mt-4 text-sm text-bone">
                From ${(f.priceCents / 100).toFixed(0)} + deposit
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
