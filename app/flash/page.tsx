import Link from "next/link";
import { getAllFlash } from "@/lib/site-data";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
        Available designs — claim with a fifteen-minute hold while you finish
        the deposit. Each flash is one-of-one.
      </p>

      {items.length === 0 ? (
        <div className="mt-12 border border-dashed border-bone/15 bg-char/40 px-6 py-16 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
            Sold out
          </p>
          <p className="mt-3 text-sm leading-relaxed text-bone/80">
            Every current piece has been claimed. New flash drops monthly —
            request a slot for custom work in the meantime.
          </p>
          <Link
            href="/book"
            className={cn(
              buttonVariants(),
              "mt-6 inline-flex w-full sm:w-auto sm:min-w-[200px]"
            )}
          >
            Request custom
          </Link>
        </div>
      ) : (
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
                role="img"
                aria-label={f.title}
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
      )}
    </div>
  );
}
