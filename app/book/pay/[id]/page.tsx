import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { bookings } from "@/db/schema";
import { DepositForm } from "@/components/checkout/deposit-form";
import { getClientEnv } from "@/lib/env";

export const metadata = { title: "Pay deposit" };

type Props = { params: Promise<{ id: string }> };

export default async function PayDepositPage({ params }: Props) {
  const { id } = await params;
  const db = getDb();
  if (!db) {
    return (
      <Shell>
        <p className="mt-4 text-sm text-bone/80">
          The deposit flow is temporarily offline. Please contact the studio.
        </p>
      </Shell>
    );
  }
  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, id))
    .limit(1);
  if (!booking) notFound();

  const env = getClientEnv();
  const appId = env.NEXT_PUBLIC_SQUARE_APPLICATION_ID;
  const locId = env.NEXT_PUBLIC_SQUARE_LOCATION_ID;

  if (booking.status === "paid" || booking.squarePaymentId) {
    return (
      <Shell>
        <div className="mt-6 border border-blood/40 bg-blood/10 p-5 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood">
            Paid
          </p>
          <p className="mt-2 font-serif text-xl text-bandage">
            Deposit already received.
          </p>
          <p className="mt-2 text-sm text-bone/75">
            Reference{" "}
            <span className="rounded-sm border border-bone/15 bg-ink/60 px-2 py-0.5 font-mono text-blood">
              {booking.id}
            </span>
          </p>
        </div>
        <div className="mt-6 flex justify-center">
          <Link
            href="/aftercare"
            className="inline-flex items-center border border-bone/20 px-4 py-2 text-sm text-bone/85 hover:text-blood"
          >
            Read aftercare →
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mt-2 text-sm text-bone/75">
        Booking{" "}
        <span className="rounded-sm border border-bone/15 bg-ink/60 px-2 py-0.5 font-mono text-blood">
          {booking.id}
        </span>{" "}
        · {booking.kind === "consultation" ? "Consultation" : "Tattoo session"}
      </div>
      <div className="mt-6">
        {appId && locId ? (
          <DepositForm
            applicationId={appId}
            locationId={locId}
            kind="booking"
            referenceId={booking.id}
            amountCents={booking.depositCents}
            redirectOnSuccess={`/book/success?ref=${encodeURIComponent(booking.id)}`}
          />
        ) : (
          <div className="border border-bone/15 bg-char p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood">
              Offline
            </p>
            <p className="mt-2 text-sm text-bone/80">
              The secure deposit flow is temporarily unavailable. The studio
              will reach out with an alternate payment link.
            </p>
          </div>
        )}
      </div>
      <p className="mt-6 text-xs text-bone/55">
        Deposits are non-refundable and apply to your final session total.
      </p>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-xl px-5 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
        Deposit
      </p>
      <h1 className="mt-3 font-serif text-3xl leading-tight text-bandage sm:text-4xl">
        Lock your slot
      </h1>
      {children}
    </div>
  );
}
