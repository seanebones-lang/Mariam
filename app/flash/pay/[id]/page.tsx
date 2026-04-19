import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { flashClaims, flashPieces } from "@/db/schema";
import { DepositForm } from "@/components/checkout/deposit-form";
import { getClientEnv } from "@/lib/env";

export const metadata = { title: "Pay flash deposit" };

function isExpired(until: Date): boolean {
  return new Date(until).getTime() < Date.now();
}

type Props = { params: Promise<{ id: string }> };

export default async function FlashPayPage({ params }: Props) {
  const { id } = await params;
  const db = getDb();
  if (!db) notFound();
  const [claim] = await db
    .select()
    .from(flashClaims)
    .where(eq(flashClaims.id, id))
    .limit(1);
  if (!claim) notFound();

  const [piece] = await db
    .select()
    .from(flashPieces)
    .where(eq(flashPieces.id, claim.flashPieceId))
    .limit(1);
  if (!piece) notFound();

  const env = getClientEnv();
  const appId = env.NEXT_PUBLIC_SQUARE_APPLICATION_ID;
  const locId = env.NEXT_PUBLIC_SQUARE_LOCATION_ID;

  const expired = isExpired(claim.holdUntil);
  const paid = claim.status === "paid" || Boolean(claim.squarePaymentId);

  return (
    <div className="mx-auto max-w-xl px-5 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
        Flash deposit
      </p>
      <h1 className="mt-3 font-serif text-3xl leading-tight text-bandage sm:text-4xl">
        {piece.title}
      </h1>

      <div className="mt-6">
        {paid ? (
          <StateBox tone="good" label="Paid" body="Deposit received. See you soon." />
        ) : expired ? (
          <StateBox
            tone="warn"
            label="Expired"
            body="Your hold lapsed. Claim the piece again to get a fresh 15-minute window."
          />
        ) : appId && locId ? (
          <DepositForm
            applicationId={appId}
            locationId={locId}
            kind="flash"
            referenceId={claim.id}
            amountCents={piece.priceCents}
            redirectOnSuccess={`/flash/pay/${encodeURIComponent(claim.id)}`}
          />
        ) : (
          <StateBox
            tone="warn"
            label="Offline"
            body="The secure payment flow is temporarily unavailable. Please try again later."
          />
        )}
      </div>
    </div>
  );
}

function StateBox({
  tone,
  label,
  body,
}: {
  tone: "good" | "warn";
  label: string;
  body: string;
}) {
  return (
    <div
      className={
        tone === "good"
          ? "border border-blood/40 bg-blood/10 p-5"
          : "border border-bone/15 bg-char p-5"
      }
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood">
        {label}
      </p>
      <p className="mt-2 text-sm text-bone/85">{body}</p>
    </div>
  );
}
