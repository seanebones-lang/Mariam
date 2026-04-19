import Link from "next/link";
import { AftercareForm } from "./form";

export const metadata = { title: "Aftercare" };

export default function AftercarePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
        Healing
      </p>
      <h1 className="mt-3 font-serif text-3xl leading-tight text-bandage sm:text-4xl md:text-5xl">
        Saniderm aftercare
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-bone/80">
        Saniderm (or similar transparent film) keeps a fresh tattoo sealed from
        friction and airborne grit while still allowing oxygen exchange. Follow
        your artist&apos;s specific instructions first — this page is a general
        guide only.
      </p>
      <ul className="mt-8 list-disc space-y-3 pl-5 text-sm leading-relaxed text-bone/85">
        <li>Wash hands before touching the film or tattoo.</li>
        <li>
          If fluid builds excessively under the film, or edges peel and expose
          the tattoo, remove per artist timing.
        </li>
        <li>After removal: gentle wash, pat dry, thin balm if advised.</li>
        <li>No sun, no soaking, no picking.</li>
      </ul>
      <h2 className="mt-12 font-serif text-2xl leading-tight text-blood sm:mt-14 sm:text-3xl">
        Email timeline
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-bone/80">
        Get gentle check-ins on day 0, 1, 3, 7, 14, and 30 — quick reminders
        of what your skin should be doing, and what to watch for.
      </p>
      <div className="mt-6">
        <AftercareForm />
      </div>
      <p className="mt-10 text-xs leading-relaxed text-muted">
        Not medical advice. Redness spreading with fever — seek urgent care.
      </p>
      <Link
        href="/faq"
        className="mt-6 inline-block text-sm text-blood underline"
      >
        Studio policies
      </Link>
    </div>
  );
}
