import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { giftCardOrders } from "@/db/schema";
import { DepositForm } from "@/components/checkout/deposit-form";
import { getClientEnv } from "@/lib/env";

export const metadata = { title: "Pay for gift card" };

type Props = { params: Promise<{ id: string }> };

export default async function GiftPayPage({ params }: Props) {
  const { id } = await params;
  const db = getDb();
  if (!db) notFound();
  const [order] = await db
    .select()
    .from(giftCardOrders)
    .where(eq(giftCardOrders.id, id))
    .limit(1);
  if (!order) notFound();

  const env = getClientEnv();
  const appId = env.NEXT_PUBLIC_SQUARE_APPLICATION_ID;
  const locId = env.NEXT_PUBLIC_SQUARE_LOCATION_ID;

  const paid = order.status === "paid" || Boolean(order.squarePaymentId);

  return (
    <div className="mx-auto max-w-xl px-5 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
        Gift card
      </p>
      <h1 className="mt-3 font-serif text-3xl leading-tight text-bandage sm:text-4xl">
        Finish the gift
      </h1>
      <p className="mt-2 text-sm text-bone/75">
        For{" "}
        <span className="rounded-sm border border-bone/15 bg-ink/60 px-2 py-0.5 font-mono text-blood">
          {order.recipientEmail}
        </span>
      </p>
      <div className="mt-6">
        {paid ? (
          <div className="border border-blood/40 bg-blood/10 p-5 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood">
              Sent
            </p>
            <p className="mt-2 font-serif text-xl text-bandage">
              The recipient will receive the code by email.
            </p>
          </div>
        ) : appId && locId ? (
          <DepositForm
            applicationId={appId}
            locationId={locId}
            kind="gift"
            referenceId={order.id}
            amountCents={order.amountCents}
            redirectOnSuccess={`/gift-cards/pay/${encodeURIComponent(order.id)}`}
          />
        ) : (
          <div className="border border-bone/15 bg-char p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood">
              Offline
            </p>
            <p className="mt-2 text-sm text-bone/80">
              The secure payment flow is temporarily unavailable. Please try
              again later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
