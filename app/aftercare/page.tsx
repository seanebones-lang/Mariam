import Link from "next/link";
import { AftercareForm } from "./form";

export const metadata = { title: "Aftercare" };

export default function AftercarePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="font-serif text-4xl text-bandage">Saniderm aftercare</h1>
      <p className="mt-4 text-sm text-bone/80">
        Saniderm (or similar transparent film) keeps a fresh tattoo sealed from
        friction and airborne grit while still allowing oxygen exchange. Follow
        your artist&apos;s specific instructions first — this page is a general
        guide only.
      </p>
      <ul className="mt-8 list-disc space-y-3 pl-5 text-sm text-bone/85">
        <li>Wash hands before touching the film or tattoo.</li>
        <li>
          If fluid builds excessively under the film, or edges peel and expose
          the tattoo, remove per artist timing.
        </li>
        <li>After removal: gentle wash, pat dry, thin balm if advised.</li>
        <li>No sun, no soaking, no picking.</li>
      </ul>
      <h2 className="mt-14 font-serif text-2xl text-blood">Email timeline</h2>
      <p className="mt-3 text-sm text-muted">
        Sign up for day 0 / 1 / 3 / 7 / 14 / 30 reminders (cron on Vercel + Resend
        when configured).
      </p>
      <div className="mt-6">
        <AftercareForm />
      </div>
      <p className="mt-10 text-xs text-muted">
        Not medical advice. Redness spreading with fever — seek urgent care.
      </p>
      <Link href="/faq" className="mt-6 inline-block text-sm text-blood underline">
        Studio policies
      </Link>
    </div>
  );
}
