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

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-5 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-title"
      style={{
        paddingTop: "max(1.25rem, env(safe-area-inset-top))",
        paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="w-full max-w-md border border-blood/40 bg-char p-6 text-center shadow-[0_0_60px_rgba(163,18,31,0.15)] sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
          Age verification
        </p>
        <p
          id="age-title"
          className="mt-3 font-serif text-4xl leading-none tracking-tight text-bandage sm:text-5xl"
        >
          18+
        </p>
        <p className="mt-5 text-sm leading-relaxed text-bone/80">
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
            className="w-full sm:w-auto"
          >
            I am 18 or older
          </Button>
          <a
            href="https://www.google.com"
            className={cn(
              buttonVariants({ variant: "ghost", size: "default" }),
              "w-full sm:w-auto"
            )}
          >
            Leave
          </a>
        </div>
      </div>
    </div>
  );
}
