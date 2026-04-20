"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BOOKING_URL } from "@/lib/booking-url";

const HeroScene = dynamic(
  () => import("./hero-scene").then((m) => m.HeroScene),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-ink" /> }
);

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <HeroScene />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent via-ink/70 to-ink" />

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-6xl grid-rows-[auto_1fr_auto] px-5 pt-20 pb-10 sm:px-6 sm:pt-24 md:pt-28 md:pb-16">
        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.35em] text-bone/55 sm:text-[10px] sm:tracking-[0.4em]">
          <span>Ruidoso, NM · Traveling</span>
          <span className="hidden md:inline">
            Private studio · By appointment
          </span>
          <span>Since 2004</span>
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:tracking-[0.5em]">
            Tattoo artist
          </p>

          <h1
            className="mt-3 whitespace-nowrap font-serif leading-[0.95] tracking-[-0.015em] text-bandage
                       text-[clamp(1.85rem,8.25vw,6.5rem)]"
          >
            Mari Belle Bones
          </h1>

          <div className="mt-6 h-px w-16 bg-bone/25 sm:w-24" />

          <p className="mt-6 font-serif text-base italic text-bone/70 sm:text-lg md:text-xl">
            Custom work, drawn by hand.
          </p>

          <p className="mt-5 max-w-sm px-2 text-[13px] leading-relaxed text-bone/65 sm:mt-7 sm:max-w-md sm:text-sm">
            Fine-line, blackwork, and flash—by appointment in a private studio.
            Deposits secured through Square. Aftercare guidance included.
          </p>

          <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:items-center sm:justify-center">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants(),
                "h-12 w-full sm:h-11 sm:w-auto sm:min-w-[180px]"
              )}
            >
              {"Book & deposit"}
            </a>
            <Link
              href="/portfolio"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-12 w-full sm:h-11 sm:w-auto sm:min-w-[180px]"
              )}
            >
              View work
            </Link>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.35em] text-bone/45 sm:text-[10px] sm:tracking-[0.4em]">
          <span>Scroll</span>
          <span className="hidden md:inline">
            One client, one focused session
          </span>
          <span>Est. 2004</span>
        </div>
      </div>
    </section>
  );
}
