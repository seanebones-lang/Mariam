"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { FieldError } from "@/components/ui/field-error";
import { useToast } from "@/components/ui/toast";

type Errors = { name?: string; email?: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function FlashClaim({
  flashId,
  title,
}: {
  flashId: string;
  title: string;
}) {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [holdUntil, setHoldUntil] = useState<Date | null>(null);
  const [claimId, setClaimId] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    if (!holdUntil) return;
    const tick = () => {
      const ms = Math.max(0, holdUntil.getTime() - Date.now());
      setRemaining(Math.ceil(ms / 1000));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [holdUntil]);

  function validate(): boolean {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = "Please enter your full name.";
    if (!EMAIL.test(email)) e.email = "Enter a valid email address.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function claim() {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/flash/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flashId, clientEmail: email, clientName: name }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        holdUntil?: string;
        claimId?: string;
      };
      if (!res.ok || !data.ok) {
        toast.error(data.error ?? "Could not place hold. Please try again.");
        return;
      }
      const until = data.holdUntil
        ? new Date(data.holdUntil)
        : new Date(Date.now() + 15 * 60 * 1000);
      setHoldUntil(until);
      if (data.claimId) setClaimId(data.claimId);
      toast.success(
        "Hold placed. Watch your email for the deposit link.",
        "15-min hold"
      );
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (holdUntil) {
    const mm = Math.floor(remaining / 60).toString().padStart(2, "0");
    const ss = (remaining % 60).toString().padStart(2, "0");
    const expired = remaining <= 0;
    return (
      <div className="mt-8 border border-blood/30 bg-char p-5 sm:mt-10 sm:p-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-blood" aria-hidden />
          <p className="font-serif text-xl text-bandage sm:text-2xl">
            {expired ? "Hold expired" : `${title} is yours for now`}
          </p>
        </div>
        {!expired ? (
          <>
            <div className="mt-4 flex items-center gap-2 text-sm text-bone/85">
              <Clock className="h-4 w-4 text-blood" aria-hidden />
              <span>
                Reserved for{" "}
                <span className="font-mono text-blood">
                  {mm}:{ss}
                </span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-bone/80">
              We sent the deposit link to{" "}
              <span className="text-bone">{email}</span>. Confirm payment
              before the timer ends to lock the design in.
            </p>
          </>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-bone/80">
            Your fifteen minutes ran out. The piece is back in the pool — try
            again or reach out for help.
          </p>
        )}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          {!expired && claimId ? (
            <Link
              href={`/flash/pay/${encodeURIComponent(claimId)}`}
              className="inline-flex items-center justify-center border border-blood bg-blood px-4 py-2 text-sm font-semibold text-bandage hover:bg-blood/80"
            >
              Pay deposit now
            </Link>
          ) : null}
          <Link
            href="/flash"
            className="inline-flex items-center justify-center border border-bone/25 px-4 py-2 text-sm text-bone hover:border-blood/60 hover:text-bandage"
          >
            Browse more flash
          </Link>
          {expired ? (
            <button
              type="button"
              onClick={() => setHoldUntil(null)}
              className="inline-flex items-center justify-center border border-blood bg-blood/10 px-4 py-2 text-sm text-bandage hover:bg-blood"
            >
              Try again
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4 border border-bone/10 bg-ink/40 p-5 sm:mt-10 sm:p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood sm:text-xs">
        Claim — {title}
      </p>
      <p className="text-sm leading-relaxed text-bone/80">
        Place a fifteen-minute hold. We&apos;ll email a secure deposit link.
        If you don&apos;t pay before the timer expires, the piece is freed.
      </p>
      <div>
        <Label htmlFor="nm">Name</Label>
        <Input
          id="nm"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "err-nm" : undefined}
          className="mt-2"
        />
        <FieldError id="err-nm" message={errors.name} />
      </div>
      <div>
        <Label htmlFor="em">Email</Label>
        <Input
          id="em"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "err-em" : undefined}
          className="mt-2"
        />
        <FieldError id="err-em" message={errors.email} />
      </div>
      <Button
        type="button"
        disabled={loading}
        aria-busy={loading}
        onClick={() => void claim()}
        className="w-full sm:w-auto"
      >
        {loading ? (
          <>
            <Spinner className="text-bandage" />
            Sealing…
          </>
        ) : (
          "Place 15-min hold"
        )}
      </Button>
    </div>
  );
}
