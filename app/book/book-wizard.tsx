"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBooking } from "@/app/actions/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { FieldError } from "@/components/ui/field-error";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const schema = z
  .object({
    kind: z.enum(["consultation", "tattoo"]),
    clientName: z.string().min(2, "Please enter your full name."),
    clientEmail: z.string().email("Enter a valid email address."),
    clientPhone: z.string().optional(),
    scheduledAt: z.string().optional(),
    notes: z.string().optional(),
    consentName: z.string().min(2, "Sign your full legal name to continue."),
    consentAck: z.boolean(),
  })
  .refine((v) => v.consentAck, {
    path: ["consentAck"],
    message: "You must agree to the consent terms.",
  });

type Form = z.infer<typeof schema>;

const STEPS = ["Contact", "Details", "Consent", "Review"] as const;

const STEP_FIELDS: Array<Array<keyof Form>> = [
  ["kind", "clientName", "clientEmail", "clientPhone"],
  ["scheduledAt", "notes"],
  ["consentName", "consentAck"],
  [],
];

export function BookWizard() {
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      kind: "tattoo",
      consentAck: false,
    },
  });

  const errors = form.formState.errors;

  async function next() {
    const fields = STEP_FIELDS[step];
    const ok = await form.trigger(fields);
    if (!ok) {
      toast.error("Fix the highlighted fields before continuing.");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function onSubmit(values: Form) {
    const r = await createBooking(values);
    if (r.ok) {
      toast.success("Booking marked. Pay your deposit to lock the slot.", "Reserved");
      router.push(`/book/pay/${encodeURIComponent(r.bookingId)}`);
    } else {
      toast.error(r.error ?? "Could not save booking. Please try again.");
    }
  }

  const kind = form.watch("kind");
  const values = form.watch();

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="border border-bone/10 bg-char"
      noValidate
    >
      <ol className="flex border-b border-bone/10">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={cn(
              "flex-1 border-r border-bone/10 px-2 py-3 text-center text-[10px] uppercase tracking-[0.2em] last:border-r-0 sm:px-3 sm:text-[11px] sm:tracking-[0.3em]",
              i === step
                ? "bg-ink/60 text-blood"
                : i < step
                  ? "text-bone/75"
                  : "text-bone/35"
            )}
            aria-current={i === step ? "step" : undefined}
          >
            <span className="mr-1 font-mono">{String(i + 1).padStart(2, "0")}</span>
            <span className="hidden xs:inline sm:inline">{label}</span>
          </li>
        ))}
      </ol>

      <div className="p-5 sm:p-8">
        {step === 0 ? (
          <div className="space-y-6 mbb-fade-in">
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
                aria-invalid={!!errors.clientName}
                aria-describedby={errors.clientName ? "err-clientName" : undefined}
                {...form.register("clientName")}
              />
              <FieldError id="err-clientName" message={errors.clientName?.message} />
            </div>
            <div>
              <Label htmlFor="clientEmail">Email</Label>
              <Input
                id="clientEmail"
                type="email"
                inputMode="email"
                autoComplete="email"
                className="mt-2"
                aria-invalid={!!errors.clientEmail}
                aria-describedby={errors.clientEmail ? "err-clientEmail" : undefined}
                {...form.register("clientEmail")}
              />
              <FieldError id="err-clientEmail" message={errors.clientEmail?.message} />
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
          <div className="space-y-6 mbb-fade-in">
            <div>
              <Label htmlFor="scheduledAt">Preferred date / time</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                min={new Date().toISOString().slice(0, 16)}
                className="mt-2"
                {...form.register("scheduledAt")}
              />
              <p className="mt-2 text-xs text-muted">
                Approximate — we&apos;ll confirm an exact time by email.
              </p>
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
          <div className="space-y-6 mbb-fade-in">
            <p className="text-sm leading-relaxed text-bone/80">
              Digital consent: confirm you are eighteen or older and accept the
              studio policies linked from the FAQ.
            </p>
            <div>
              <Label htmlFor="consentName">Sign full legal name</Label>
              <Input
                id="consentName"
                autoComplete="name"
                className="mt-2"
                aria-invalid={!!errors.consentName}
                aria-describedby={errors.consentName ? "err-consentName" : undefined}
                {...form.register("consentName")}
              />
              <FieldError id="err-consentName" message={errors.consentName?.message} />
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
                I agree to the consent terms and understand that the deposit is
                non-refundable per studio policy.
              </span>
            </label>
            <FieldError message={errors.consentAck?.message} />
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-5 mbb-fade-in">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
              Review
            </p>
            <p className="text-sm leading-relaxed text-bone/80">
              Take a last look. Submit to reserve your spot — you&apos;ll receive
              a confirmation email with the deposit link shortly.
            </p>
            <dl className="divide-y divide-bone/10 border border-bone/10">
              <ReviewRow label="Type" value={values.kind} />
              <ReviewRow label="Name" value={values.clientName} />
              <ReviewRow label="Email" value={values.clientEmail} />
              {values.clientPhone ? (
                <ReviewRow label="Phone" value={values.clientPhone} />
              ) : null}
              {values.scheduledAt ? (
                <ReviewRow
                  label="Preferred"
                  value={new Date(values.scheduledAt).toLocaleString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                />
              ) : null}
              {values.notes ? (
                <ReviewRow label="Notes" value={values.notes} />
              ) : null}
              <ReviewRow label="Signed" value={values.consentName} />
            </dl>
            <p className="text-xs leading-relaxed text-muted">
              Deposit:{" "}
              <span className="text-bone">
                ${values.kind === "consultation" ? "50" : "100"}
              </span>{" "}
              — charged via secure Square checkout once you confirm by email.
            </p>
          </div>
        ) : null}
      </div>

      <div className="sticky bottom-0 z-10 border-t border-bone/10 bg-char/95 p-4 backdrop-blur sm:static sm:bg-char sm:backdrop-blur-0 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          {step > 0 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="w-full sm:w-auto"
            >
              Back
            </Button>
          ) : (
            <span className="hidden sm:block" />
          )}
          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={() => void next()}
              className="w-full sm:w-auto sm:min-w-[180px]"
            >
              Continue
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full sm:w-auto sm:min-w-[180px]"
              disabled={form.formState.isSubmitting}
              aria-busy={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Spinner className="text-bandage" />
                  Reserving…
                </>
              ) : (
                "Confirm booking"
              )}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 px-4 py-3 text-sm sm:px-5">
      <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
        {label}
      </dt>
      <dd className="break-words text-bone/90">{value}</dd>
    </div>
  );
}
