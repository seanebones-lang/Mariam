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
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <div className="grid gap-10 md:grid-cols-2">
        <div
          className="aspect-square border border-bone/10 bg-cover bg-center"
          style={{ backgroundImage: `url(${piece.imageUrl})` }}
        />
        <div>
          <h1 className="font-display text-4xl text-bandage">{piece.title}</h1>
          {piece.description ? (
            <p className="mt-4 text-sm text-bone/80">{piece.description}</p>
          ) : null}
          <p className="mt-6 font-serif text-2xl text-blood">
            ${(piece.priceCents / 100).toFixed(0)}
            <span className="ml-2 text-sm font-sans font-normal text-muted">
              + studio deposit via Square
            </span>
          </p>
          <FlashClaim flashId={piece.id} title={piece.title} />
        </div>
      </div>
    </div>
  );
}
