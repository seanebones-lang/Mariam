import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = { title: "Booking received" };

type Props = {
  searchParams: Promise<{ ref?: string }>;
};

export default async function BookSuccessPage({ searchParams }: Props) {
  const sp = await searchParams;
  const ref = sp.ref ?? "";

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 sm:px-6 sm:py-20">
      <div className="border border-blood/30 bg-char p-6 text-center sm:p-10">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-blood/40 bg-blood/10 text-blood sm:h-14 sm:w-14">
          <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
          Reserved
        </p>
        <h1 className="mt-3 font-serif text-3xl leading-tight text-bandage sm:text-4xl md:text-5xl">
          Marked in the book
        </h1>
        {ref ? (
          <p className="mt-4 text-sm text-bone/80">
            Reference{" "}
            <span className="rounded-sm border border-bone/15 bg-ink/60 px-2 py-0.5 font-mono text-blood">
              {ref}
            </span>
          </p>
        ) : null}
      </div>

      <div className="mt-10 grid gap-3 sm:mt-12 sm:gap-4">
        <StepCard n="01" title="Check your email">
          A confirmation is on its way. Reply with any extra references or
          notes you forgot.
        </StepCard>
        <StepCard n="02" title="Pay your deposit">
          You&apos;ll receive a secure Square link to lock in your slot. The
          deposit is non-refundable per studio policy.
        </StepCard>
        <StepCard n="03" title="Prepare for the session">
          Eat well, hydrate, sleep. Read the aftercare guide so you&apos;re
          ready the moment we finish.
        </StepCard>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/aftercare"
          className={cn(buttonVariants({ variant: "ghost" }), "w-full sm:w-auto")}
        >
          Read aftercare
        </Link>
        <Link
          href="/"
          className={cn(buttonVariants(), "w-full sm:w-auto sm:min-w-[180px]")}
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

function StepCard({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 border border-bone/10 bg-char p-4 sm:p-5">
      <span className="font-mono text-xs text-blood">{n}</span>
      <div>
        <p className="font-serif text-lg text-bandage sm:text-xl">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-bone/75">{children}</p>
      </div>
    </div>
  );
}
