"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-bone/10 bg-ink/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 md:px-6">
          <Link
            href="/"
            onClick={close}
            className="font-mono text-[11px] uppercase tracking-[0.4em] text-bandage sm:text-xs"
          >
            Mari Belle Bones
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 text-[11px] font-medium uppercase tracking-widest text-bone/70 transition-colors hover:text-blood"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="-mr-2 p-2 text-bone md:hidden"
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
      </header>

      {open ? (
        <div
          className="fixed inset-0 top-14 z-40 flex flex-col bg-ink/95 backdrop-blur-xl md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <nav className="flex flex-col divide-y divide-bone/10 border-t border-bone/10">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={close}
                className="px-6 py-5 font-serif text-2xl text-bandage hover:text-blood"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto border-t border-bone/10 px-6 py-6 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/55">
            <p>NYC · Traveling</p>
            <p className="mt-1 text-blood">By appointment only</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
