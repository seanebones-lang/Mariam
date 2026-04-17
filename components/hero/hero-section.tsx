"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { MBBMonogram } from "./mbb-monogram";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HeroScene = dynamic(
  () => import("./hero-scene").then((m) => m.HeroScene),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-ink" /> }
);

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-ink">
      <div className="absolute inset-0 opacity-90">
        <HeroScene />
      </div>
      <div className="scanlines" />
      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-4 pb-24 pt-32 md:px-6 md:pb-32">
        <div className="max-w-2xl">
          <MBBMonogram className="mb-6" />
          <p className="font-serif text-xs uppercase tracking-[0.35em] text-blood">
            Mari Belle Bones
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-bandage md:text-6xl">
            Dark art. Ritual ink.
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-bone/75 md:text-base">
            Consultations and appointments with deposit via Square. Saniderm
            aftercare guidance. Traveling guest spots — see tour dates.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/book" className={cn(buttonVariants())}>
              Book + deposit
            </Link>
            <Link
              href="/portfolio"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              View work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
