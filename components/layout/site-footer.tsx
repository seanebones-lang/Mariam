import Link from "next/link";
import { Instagram } from "lucide-react";

const NAV = [
  { href: "/portfolio", label: "Work" },
  { href: "/flash", label: "Flash" },
  { href: "/book", label: "Book" },
  { href: "/aftercare", label: "Aftercare" },
];

const LEGAL = [
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-bone/10 bg-char py-12 sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-bandage">
            Mari Belle Bones
          </p>
          <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-muted sm:text-sm">
            Dark art, drawn by hand. Private NYC studio + traveling guest
            spots. By appointment only.
          </p>
          <a
            href="https://www.instagram.com/maribellebones/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-bone/80 transition hover:text-blood"
          >
            <Instagram className="h-4 w-4" aria-hidden />
            @maribellebones
          </a>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
            Studio
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-bone/80 hover:text-blood">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
            Reference
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {LEGAL.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-bone/80 hover:text-blood">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
            Where
          </p>
          <p className="mt-4 text-sm leading-relaxed text-bone/80">
            New York City
            <br />
            Private studio
            <br />
            <Link href="/tour" className="text-blood hover:underline">
              Tour calendar →
            </Link>
          </p>
        </div>
      </div>
      <p className="mt-12 px-5 text-center text-[11px] text-muted sm:px-6 sm:text-xs">
        © {new Date().getFullYear()} Mari Belle Bones. All rites reserved.
      </p>
    </footer>
  );
}
