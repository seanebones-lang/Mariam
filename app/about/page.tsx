import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
        The artist
      </p>
      <h1 className="mt-3 font-serif text-3xl leading-tight text-bandage sm:text-4xl md:text-5xl">
        Mari Belle Bones
      </h1>
      <p className="mt-6 text-base leading-relaxed text-bone/85 sm:text-lg">
        Dark art and occult imagery, drawn by hand with surgical line weight
        and reverence for the body as canvas. Mari works by appointment only,
        prioritizing consent, clarity, and care above all else.
      </p>

      <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-3">
        <Stat label="Years tattooing" value="10+" />
        <Stat label="Cities visited" value="14" />
        <Stat label="Pieces healed" value="2k+" />
      </div>

      <h2 className="mt-14 font-serif text-2xl leading-tight text-blood sm:mt-16 sm:text-3xl">
        Approach
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-bone/85 sm:text-base">
        Every booking begins with a conversation. Whether you&apos;re bringing
        a fully-formed sigil or a single word, we&apos;ll talk through
        placement, scale, and how the piece will age on your skin. Custom
        designs are drawn for one body only.
      </p>

      <h2 className="mt-12 font-serif text-2xl leading-tight text-blood sm:mt-14 sm:text-3xl">
        Studio &amp; travel
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-bone/85 sm:text-base">
        The home studio is private and by appointment in NYC. Mari travels
        several times a year for guest residencies — see the{" "}
        <Link href="/tour" className="text-blood underline">
          tour calendar
        </Link>{" "}
        for upcoming dates and how to book at each stop.
      </p>

      <div className="mt-12 flex flex-col gap-3 sm:mt-14 sm:flex-row">
        <Link
          href="/book"
          className={cn(buttonVariants(), "w-full sm:w-auto sm:min-w-[180px]")}
        >
          Begin booking
        </Link>
        <Link
          href="/portfolio"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "w-full sm:w-auto sm:min-w-[180px]"
          )}
        >
          See recent work
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-bone/10 bg-char px-5 py-6 text-center">
      <p className="font-serif text-4xl text-bandage sm:text-5xl">{value}</p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
        {label}
      </p>
    </div>
  );
}
