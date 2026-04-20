"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 py-16 text-center sm:px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-blood sm:text-xs">
        Error
      </p>
      <h1 className="mt-4 font-serif text-3xl leading-tight text-bandage sm:text-4xl">
        We hit a snag
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-bone/80">
        The page failed to load. Please try again — if it keeps happening,
        message the studio on Instagram and we&apos;ll sort it.
      </p>
      <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Button
          type="button"
          onClick={reset}
          className="w-full sm:w-auto sm:min-w-[160px]"
        >
          Try again
        </Button>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "w-full sm:w-auto sm:min-w-[160px]"
          )}
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
