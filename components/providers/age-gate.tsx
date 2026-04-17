"use client";

import { startTransition, useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const KEY = "mbb_age_verified";

export function AgeGate() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY) === "1") return;
    } catch {
      return;
    }
    startTransition(() => setOpen(true));
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-title"
    >
      <div className="max-w-md border border-blood/40 bg-char p-8 text-center shadow-[0_0_60px_rgba(163,18,31,0.15)]">
        <p
          id="age-title"
          className="font-display text-3xl tracking-tight text-bandage md:text-4xl"
        >
          18+
        </p>
        <p className="mt-4 text-sm leading-relaxed text-bone/80">
          This site shows tattoo work. By entering you confirm you are at least
          eighteen years old.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            type="button"
            onClick={() => {
              try {
                sessionStorage.setItem(KEY, "1");
              } catch {
                /* ignore */
              }
              setOpen(false);
            }}
          >
            I am 18 or older
          </Button>
          <a
            href="https://www.google.com"
            className={cn(buttonVariants({ variant: "ghost", size: "default" }))}
          >
            Leave
          </a>
        </div>
      </div>
    </div>
  );
}
