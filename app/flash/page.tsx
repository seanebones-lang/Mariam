import Link from "next/link";
import { getAllFlash } from "@/lib/site-data";

export const metadata = {
  title: "Flash",
};

export default async function FlashPage() {
  const items = await getAllFlash();
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <h1 className="font-serif text-4xl text-bandage">Flash</h1>
      <p className="mt-4 max-w-2xl text-sm text-bone/75">
        Available designs — claim with deposit. Hold expires in fifteen minutes
        until Square confirms payment.
      </p>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f) => (
          <Link
            key={f.id}
            href={`/flash/${f.id}`}
            className="group border border-bone/10 bg-char transition hover:border-blood/40"
          >
            <div
              className="aspect-square bg-cover bg-center"
              style={{ backgroundImage: `url(${f.imageUrl})` }}
            />
            <div className="p-5">
              <h2 className="font-display text-2xl text-bandage group-hover:text-blood">
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
