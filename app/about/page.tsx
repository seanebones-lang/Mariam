import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
        About
      </p>
      <h1 className="mt-3 font-serif text-3xl leading-tight text-bandage sm:text-4xl md:text-5xl">
        Mari Belle Bones
      </h1>
      <p className="mt-6 text-base leading-relaxed text-bone/85 sm:text-lg">
        Mari is an internationally published, award-winning tattoo artist with
        more than twenty years of professional experience. She completed her
        apprenticeship with Sean E Bones in September 2004 and is a co-founder
        of the Worldwide Tattoo Artists Guild. Her early career included work
        in respected shops across Texas, New Mexico, Missouri, and Kansas.
        Today she welcomes clients by appointment in a private studio in
        Ruidoso, New Mexico, with select guest residencies each year.
      </p>

      <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-3">
        <Stat label="Years tattooing" value="20+" />
        <Stat label="Apprenticeship" value="2004" />
        <Stat label="Prior shop markets" value="4 states" />
      </div>

      <h2 className="mt-14 font-serif text-2xl leading-tight text-blood sm:mt-16 sm:text-3xl">
        Approach
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-bone/85 sm:text-base">
        Every booking begins with a clear conversation. Whether you arrive with
        finished reference art or a rough idea, we discuss placement, scale,
        and how the tattoo will age on your skin. Custom designs are drafted for
        one client and one placement at a time.
      </p>

      <h2 className="mt-12 font-serif text-2xl leading-tight text-blood sm:mt-14 sm:text-3xl">
        Studio &amp; travel
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-bone/85 sm:text-base">
        The home studio is private and by appointment in Ruidoso, New Mexico.
        Mari travels for guest residencies—see the{" "}
        <Link href="/tour" className="text-blood underline">
          travel calendar
        </Link>{" "}
        for upcoming dates and booking links for each stop.
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
