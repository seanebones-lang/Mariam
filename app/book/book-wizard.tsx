"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBooking } from "@/app/actions/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const schema = z
  .object({
    kind: z.enum(["consultation", "tattoo"]),
    clientName: z.string().min(2),
    clientEmail: z.string().email(),
    clientPhone: z.string().optional(),
    scheduledAt: z.string().optional(),
    notes: z.string().optional(),
    consentName: z.string().min(2),
    consentAck: z.boolean(),
  })
  .refine((v) => v.consentAck, {
    path: ["consentAck"],
    message: "Consent required",
  });

type Form = z.infer<typeof schema>;

const STEPS = ["Contact", "Details", "Consent"] as const;

export function BookWizard() {
  const [step, setStep] = useState(0);
  const [resultId, setResultId] = useState<string | null>(null);
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      kind: "tattoo",
      consentAck: false,
    },
  });

  async function onSubmit(values: Form) {
    const r = await createBooking(values);
    if (r.ok) setResultId(r.bookingId);
    else alert(r.error);
  }

  if (resultId) {
    return (
      <div className="border border-bone/10 bg-char p-6 text-center sm:p-8">
        <p className="font-serif text-2xl text-bandage sm:text-3xl">
          Marked in the book
        </p>
        <p className="mt-4 text-sm text-bone/80">
          Reference <span className="text-blood">{resultId}</span>. Square
          deposit step activates when sandbox keys are set — you will receive
          email from Resend once DNS is ready.
        </p>
      </div>
    );
  }

  const kind = form.watch("kind");

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="border border-bone/10 bg-char"
    >
      {/* Stepper */}
      <ol className="flex border-b border-bone/10">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={cn(
              "flex-1 border-r border-bone/10 px-3 py-3 text-center text-[10px] uppercase tracking-[0.25em] last:border-r-0 sm:text-[11px] sm:tracking-[0.3em]",
              i === step
                ? "bg-ink/60 text-blood"
                : i < step
                  ? "text-bone/75"
                  : "text-bone/35"
            )}
            aria-current={i === step ? "step" : undefined}
          >
            <span className="mr-1 font-mono">{String(i + 1).padStart(2, "0")}</span>
            {label}
          </li>
        ))}
      </ol>

      <div className="p-5 sm:p-8">
        {step === 0 ? (
          <div className="space-y-6">
            <div>
              <Label>Rite</Label>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(["consultation", "tattoo"] as const).map((k) => (
                  <label
                    key={k}
                    className={cn(
                      "flex cursor-pointer items-center justify-center border px-3 py-3 text-sm capitalize transition",
                      kind === k
                        ? "border-blood bg-blood/10 text-bandage"
                        : "border-bone/20 bg-ink/30 text-bone/75 hover:border-bone/50"
                    )}
                  >
                    <input
                      type="radio"
                      value={k}
                      className="sr-only"
                      {...form.register("kind")}
                    />
                    {k}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="clientName">Name</Label>
              <Input
                id="clientName"
                className="mt-2"
                autoComplete="name"
                {...form.register("clientName")}
              />
            </div>
            <div>
              <Label htmlFor="clientEmail">Email</Label>
              <Input
                id="clientEmail"
                type="email"
                inputMode="email"
                autoComplete="email"
                className="mt-2"
                {...form.register("clientEmail")}
              />
            </div>
            <div>
              <Label htmlFor="clientPhone">Phone (optional)</Label>
              <Input
                id="clientPhone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className="mt-2"
                {...form.register("clientPhone")}
              />
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-6">
            <div>
              <Label htmlFor="scheduledAt">Preferred date / time</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                className="mt-2"
                {...form.register("scheduledAt")}
              />
            </div>
            <div>
              <Label htmlFor="notes">Placement, size, references</Label>
              <textarea
                id="notes"
                rows={5}
                className="mt-2 w-full border border-bone/20 bg-char px-3 py-3 text-base text-bone placeholder:text-muted focus-visible:border-blood focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blood sm:text-sm"
                placeholder="Describe the idea, size in inches, placement, any reference notes."
                {...form.register("notes")}
              />
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-6">
            <p className="text-sm leading-relaxed text-bone/80">
              Digital consent: you confirm you are eighteen or older and accept
              studio policies linked from /faq.
            </p>
            <div>
              <Label htmlFor="consentName">Sign full legal name</Label>
              <Input
                id="consentName"
                autoComplete="name"
                className="mt-2"
                {...form.register("consentName")}
              />
            </div>
            <label className="flex items-start gap-3 text-sm leading-relaxed text-bone/85">
              <input
                type="checkbox"
                {...form.register("consentAck", {
                  setValueAs: (v) => v === true || v === "on",
                })}
                className="mt-1 h-5 w-5 accent-blood"
              />
              <span>
                I agree to the consent terms and understand deposit is
                non-refundable per policy.
              </span>
            </label>
            <div className="rounded-sm border border-blood/30 bg-ink/50 p-4 text-xs leading-relaxed text-muted">
              Square Web Payments SDK mounts here when{" "}
              <code className="text-bone">
                NEXT_PUBLIC_SQUARE_APPLICATION_ID
              </code>{" "}
              and server tokens are configured. Until then, submitting saves
              the booking row only.
            </div>
          </div>
        ) : null}
      </div>

      {/* Sticky action bar on mobile */}
      <div className="sticky bottom-0 z-10 border-t border-bone/10 bg-char/95 p-4 backdrop-blur sm:static sm:bg-char sm:backdrop-blur-0 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          {step > 0 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep(step - 1)}
              className="w-full sm:w-auto"
            >
              Back
            </Button>
          ) : (
            <span className="hidden sm:block" />
          )}
          {step < 2 ? (
            <Button
              type="button"
              onClick={() => setStep(step + 1)}
              className="w-full sm:w-auto sm:min-w-[180px]"
            >
              Continue
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full sm:w-auto sm:min-w-[180px]"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Submitting…" : "Submit booking"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
