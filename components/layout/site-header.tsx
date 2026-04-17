import Link from "next/link";
import { Menu } from "lucide-react";

const links = [
  { href: "/portfolio", label: "Work" },
  { href: "/flash", label: "Flash" },
  { href: "/book", label: "Book" },
  { href: "/aftercare", label: "Aftercare" },
  { href: "/gift-cards", label: "Gift cards" },
  { href: "/tour", label: "Tour" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-bone/10 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="font-display text-xl tracking-tight text-bandage md:text-2xl"
        >
          MBB
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-xs font-medium uppercase tracking-widest text-bone/70 transition-colors hover:text-blood"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <details className="relative md:hidden">
          <summary className="list-none cursor-pointer p-2 text-bone [&::-webkit-details-marker]:hidden">
            <Menu className="h-6 w-6" aria-hidden />
            <span className="sr-only">Menu</span>
          </summary>
          <div className="absolute right-0 mt-2 w-48 border border-bone/15 bg-char py-2 shadow-xl">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block px-4 py-2 text-sm text-bone hover:bg-ink hover:text-blood"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
