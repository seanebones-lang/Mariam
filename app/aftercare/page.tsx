import Link from "next/link";
import { AftercareForm } from "./form";
import { getAftercarePageContent } from "@/lib/get-aftercare";

export const metadata = { title: "Aftercare" };

export default async function AftercarePage() {
  const c = await getAftercarePageContent();

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
        {c.kicker}
      </p>
      <h1 className="mt-3 font-serif text-3xl leading-tight text-bandage sm:text-4xl md:text-5xl">
        {c.headline}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-bone/80">{c.intro}</p>
      <ul className="mt-8 list-disc space-y-3 pl-5 text-sm leading-relaxed text-bone/85">
        {c.bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h2 className="mt-12 font-serif text-2xl leading-tight text-blood sm:mt-14 sm:text-3xl">
        {c.emailSectionTitle}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-bone/80">
        {c.emailSectionIntro}
      </p>
      <div className="mt-6">
        <AftercareForm />
      </div>
      <p className="mt-10 text-xs leading-relaxed text-muted">{c.disclaimer}</p>
      {/^https?:\/\//i.test(c.policiesHref) ? (
        <a
          href={c.policiesHref}
          className="mt-6 inline-block text-sm text-blood underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {c.policiesLinkLabel}
        </a>
      ) : (
        <Link
          href={c.policiesHref}
          className="mt-6 inline-block text-sm text-blood underline"
        >
          {c.policiesLinkLabel}
        </Link>
      )}
    </div>
  );
}
