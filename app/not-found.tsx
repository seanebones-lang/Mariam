import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 py-16 text-center sm:px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-blood sm:text-xs">
        Lost
      </p>
      <h1 className="mt-4 font-serif text-5xl leading-none text-bandage sm:text-6xl">
        404
      </h1>
      <p className="mt-6 text-sm leading-relaxed text-bone/80">
        That page is past the veil. The link may have moved, or it never was.
      </p>
      <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Link
          href="/"
          className={cn(buttonVariants(), "w-full sm:w-auto sm:min-w-[180px]")}
        >
          Back to home
        </Link>
        <Link
          href="/portfolio"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "w-full sm:w-auto sm:min-w-[180px]"
          )}
        >
          See portfolio
        </Link>
      </div>
    </div>
  );
}
