"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PaymentForm, CreditCard } from "react-square-web-payments-sdk";
import type { TokenResult } from "@square/web-sdk";
import { useToast } from "@/components/ui/toast";

type Kind = "booking" | "flash" | "gift";

type Props = {
  applicationId: string;
  locationId: string;
  kind: Kind;
  referenceId: string;
  amountCents: number;
  redirectOnSuccess?: string;
};

export function DepositForm({
  applicationId,
  locationId,
  kind,
  referenceId,
  amountCents,
  redirectOnSuccess,
}: Props) {
  const toast = useToast();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onTokenized(result: TokenResult) {
    if (result.status !== "OK" || !result.token) {
      const message =
        result.status === "Error" || result.status === "Invalid"
          ? (result.errors[0] as { message?: string })?.message
          : undefined;
      toast.error(message ?? "Card could not be tokenized. Try again.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/square/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          referenceId,
          sourceId: result.token,
          amountCents,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        toast.error(data.error ?? "Payment failed. Please try again.");
        return;
      }
      toast.success("Deposit received. The slot is yours.", "Paid");
      setDone(true);
      if (redirectOnSuccess) {
        router.push(redirectOnSuccess);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Network error.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="border border-blood/40 bg-blood/10 p-5 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood">
          Paid
        </p>
        <p className="mt-2 font-serif text-xl text-bandage">
          Deposit received.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-bone/15 bg-char p-5 sm:p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood">
        Deposit
      </p>
      <p className="mt-2 font-serif text-2xl text-bandage">
        ${(amountCents / 100).toFixed(0)}
      </p>
      <p className="mt-1 text-xs text-bone/60">
        Secure payment via Square. Non-refundable.
      </p>
      <div className="mt-5">
        <PaymentForm
          applicationId={applicationId}
          locationId={locationId}
          cardTokenizeResponseReceived={onTokenized}
        >
          <CreditCard
            buttonProps={{
              isLoading: submitting,
              css: {
                backgroundColor: "#a3121f",
                fontSize: "14px",
                color: "#ffffff",
                "&:hover": { backgroundColor: "#7c0e18" },
              },
            }}
          >
            {submitting ? "Processing…" : `Pay $${(amountCents / 100).toFixed(0)}`}
          </CreditCard>
        </PaymentForm>
      </div>
    </div>
  );
}
