"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/components/ui/field-error";
import { useToast } from "@/components/ui/toast";
import { createGiftCardOrder } from "@/app/actions/gift-cards";

const PRESETS = [10000, 20000, 40000];

export function GiftForm() {
  const toast = useToast();
  const router = useRouter();
  const [amountCents, setAmount] = useState<number>(20000);
  const [custom, setCustom] = useState("");
  const [email, setEmail] = useState("");
  const [recipientName, setName] = useState("");
  const [senderName, setSender] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function chooseAmount(v: number) {
    setAmount(v);
    setCustom("");
  }

  function applyCustom(v: string) {
    setCustom(v);
    const n = Number.parseInt(v, 10);
    if (Number.isFinite(n) && n > 0) setAmount(n * 100);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!email.includes("@")) next.email = "A valid email is required";
    if (amountCents < 2500) next.amount = "Minimum is $25";
    if (amountCents > 500000) next.amount = "Maximum is $5,000";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      const r = await createGiftCardOrder({
        amountCents,
        recipientEmail: email,
        recipientName: recipientName || undefined,
        senderName: senderName || undefined,
        message: message || undefined,
      });
      if (!r.ok) {
        toast.error(r.error ?? "Could not create gift card.");
        return;
      }
      toast.success("Gift card queued. Pay to send.", "Ready");
      router.push(`/gift-cards/pay/${encodeURIComponent(r.orderId)}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-5">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
          Amount
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {PRESETS.map((cents) => {
            const active = !custom && amountCents === cents;
            return (
              <button
                key={cents}
                type="button"
                onClick={() => chooseAmount(cents)}
                className={`border p-5 text-left transition ${
                  active
                    ? "border-blood bg-blood/10 text-bandage"
                    : "border-bone/15 bg-char text-bone/80 hover:border-blood/50"
                }`}
              >
                <p className="font-serif text-3xl">${cents / 100}</p>
                <p className="mt-1 text-xs text-bone/55">
                  {cents === 10000
                    ? "Small piece"
                    : cents === 20000
                      ? "Flash / half-day"
                      : "Full session"}
                </p>
              </button>
            );
          })}
        </div>
        <div className="mt-3">
          <label className="text-xs uppercase tracking-[0.2em] text-bone/60">
            Custom amount (USD)
          </label>
          <Input
            type="number"
            min={25}
            max={5000}
            value={custom}
            onChange={(e) => applyCustom(e.target.value)}
            placeholder="e.g. 150"
            className="mt-2"
          />
          <FieldError message={errors.amount} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-bone/60">
            Recipient email*
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="them@example.com"
            className="mt-2"
            required
          />
          <FieldError message={errors.email} />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-bone/60">
            Recipient name
          </label>
          <Input
            value={recipientName}
            onChange={(e) => setName(e.target.value)}
            placeholder="Optional"
            className="mt-2"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-bone/60">
            From
          </label>
          <Input
            value={senderName}
            onChange={(e) => setSender(e.target.value)}
            placeholder="Your name"
            className="mt-2"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs uppercase tracking-[0.2em] text-bone/60">
            Note (optional)
          </label>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="A short message to include in the email"
            className="mt-2"
            maxLength={280}
          />
        </div>
      </div>

      <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "Creating…" : `Continue · $${(amountCents / 100).toFixed(0)}`}
      </Button>
    </form>
  );
}
