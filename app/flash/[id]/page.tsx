import { notFound } from "next/navigation";
import { getFlashById } from "@/lib/site-data";
import { FlashClaim } from "./ui";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const f = await getFlashById(id);
  return { title: f?.title ?? "Flash" };
}

export default async function FlashDetailPage({ params }: Props) {
  const { id } = await params;
  const piece = await getFlashById(id);
  if (!piece) notFound();
  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-16">
      <div className="grid gap-8 md:grid-cols-2 md:gap-10">
        <div
          role="img"
          aria-label={piece.title}
          className="aspect-square border border-bone/10 bg-cover bg-center"
          style={{ backgroundImage: `url(${piece.imageUrl})` }}
        />
        <div>
          <h1 className="font-serif text-3xl leading-tight text-bandage sm:text-4xl md:text-5xl">
            {piece.title}
          </h1>
          {piece.description ? (
            <p className="mt-4 text-sm leading-relaxed text-bone/80">
              {piece.description}
            </p>
          ) : null}
          <p className="mt-6 font-serif text-2xl text-blood sm:text-3xl">
            ${(piece.priceCents / 100).toFixed(0)}
            <span className="ml-2 text-xs font-sans font-normal text-muted sm:text-sm">
              + studio deposit
            </span>
          </p>
          <FlashClaim flashId={piece.id} title={piece.title} />
        </div>
      </div>
    </div>
  );
}
