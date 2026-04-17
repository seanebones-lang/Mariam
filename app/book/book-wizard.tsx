"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBooking } from "@/app/actions/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      <div className="border border-bone/10 bg-char p-8 text-center">
        <p className="font-display text-2xl text-bandage">Marked in the book</p>
        <p className="mt-4 text-sm text-bone/80">
          Reference <span className="text-blood">{resultId}</span>. Square deposit
          step activates when sandbox keys are set — you will receive email from
          Resend once DNS is ready.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-10 border border-bone/10 bg-char p-6 md:p-10"
    >
      {step === 0 ? (
        <div className="space-y-6">
          <div>
            <Label>Rite</Label>
            <div className="mt-2 flex gap-4">
              {(["consultation", "tattoo"] as const).map((k) => (
                <label key={k} className="flex items-center gap-2 text-sm">
                  <input type="radio" value={k} {...form.register("kind")} />
                  {k}
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="clientName">Name</Label>
            <Input id="clientName" className="mt-1" {...form.register("clientName")} />
          </div>
          <div>
            <Label htmlFor="clientEmail">Email</Label>
            <Input
              id="clientEmail"
              type="email"
              className="mt-1"
              {...form.register("clientEmail")}
            />
          </div>
          <div>
            <Label htmlFor="clientPhone">Phone (optional)</Label>
            <Input id="clientPhone" className="mt-1" {...form.register("clientPhone")} />
          </div>
          <Button type="button" onClick={() => setStep(1)}>
            Next
          </Button>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-6">
          <div>
            <Label htmlFor="scheduledAt">Preferred date / time</Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              className="mt-1"
              {...form.register("scheduledAt")}
            />
          </div>
          <div>
            <Label htmlFor="notes">Placement, size, references</Label>
            <textarea
              id="notes"
              rows={4}
              className="mt-1 w-full border border-bone/20 bg-char px-3 py-2 text-sm text-bone"
              {...form.register("notes")}
            />
          </div>
          <div className="flex gap-4">
            <Button type="button" variant="ghost" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button type="button" onClick={() => setStep(2)}>
              Next
            </Button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-6">
          <p className="text-sm text-bone/80">
            Digital consent: you confirm you are eighteen or older and accept
            studio policies linked from /faq.
          </p>
          <div>
            <Label htmlFor="consentName">Sign full legal name</Label>
            <Input id="consentName" className="mt-1" {...form.register("consentName")} />
          </div>
          <label className="flex items-start gap-2 text-sm text-bone/85">
            <input
              type="checkbox"
              {...form.register("consentAck", {
                setValueAs: (v) => v === true || v === "on",
              })}
              className="mt-1"
            />
            I agree to the consent terms and understand deposit is non-refundable
            per policy.
          </label>
          <div className="rounded-sm border border-blood/30 bg-ink/50 p-4 text-xs text-muted">
            Square Web Payments SDK mounts here when{" "}
            <code className="text-bone">NEXT_PUBLIC_SQUARE_APPLICATION_ID</code>{" "}
            and server tokens are configured. Until then, submitting saves the
            booking row only.
          </div>
          <div className="flex gap-4">
            <Button type="button" variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button type="submit">Submit booking</Button>
          </div>
        </div>
      ) : null}
    </form>
  );
}
