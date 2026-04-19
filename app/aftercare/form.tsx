"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Copy } from "lucide-react";
import { subscribeAftercare } from "@/app/actions/aftercare";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { FieldError } from "@/components/ui/field-error";
import { useToast } from "@/components/ui/toast";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AftercareForm() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [tattooDate, setTattooDate] = useState("");
  const [errors, setErrors] = useState<{ email?: string; tattooDate?: string }>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  function validate(): boolean {
    const e: typeof errors = {};
    if (!EMAIL.test(email)) e.email = "Enter a valid email address.";
    if (!tattooDate) e.tattooDate = "Pick the date of your tattoo.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const r = await subscribeAftercare({ email, tattooDate });
    setLoading(false);
    if (r.ok) {
      setToken(r.token);
      toast.success("Reminders are on. Save your private link.", "Subscribed");
    } else {
      toast.error(r.error ?? "Could not subscribe. Please try again.");
    }
  }

  if (token) {
    const path = `/aftercare/track/${token}`;
    const fullUrl =
      typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
    return (
      <div className="border border-blood/30 bg-char p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-blood" aria-hidden />
          <p className="font-serif text-xl text-bandage sm:text-2xl">
            You&apos;re subscribed
          </p>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-bone/80">
          Bookmark your private healing timeline below. We&apos;ll also email
          gentle reminders on day 0, 1, 3, 7, 14, and 30.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <code className="flex-1 break-all border border-bone/15 bg-ink/60 px-3 py-2 text-xs text-bone">
            {fullUrl}
          </code>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              void navigator.clipboard
                .writeText(fullUrl)
                .then(() => toast.success("Copied to clipboard."))
                .catch(() => toast.error("Could not copy."));
            }}
          >
            <Copy className="h-3.5 w-3.5" aria-hidden />
            Copy link
          </Button>
        </div>
        <Link
          href={path}
          className="mt-4 inline-block text-sm text-blood underline"
        >
          Open timeline →
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-4 border border-bone/10 bg-char p-5 sm:p-6"
    >
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
      <div>
        <Label htmlFor="td">Tattoo date</Label>
        <Input
          id="td"
          type="date"
          max={new Date().toISOString().slice(0, 10)}
          value={tattooDate}
          onChange={(e) => setTattooDate(e.target.value)}
          aria-invalid={!!errors.tattooDate}
          aria-describedby={errors.tattooDate ? "err-td" : undefined}
          className="mt-2"
        />
        <FieldError id="err-td" message={errors.tattooDate} />
      </div>
      <Button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="w-full sm:w-auto"
      >
        {loading ? (
          <>
            <Spinner className="text-bandage" />
            Saving…
          </>
        ) : (
          "Start reminders"
        )}
      </Button>
    </form>
  );
}
