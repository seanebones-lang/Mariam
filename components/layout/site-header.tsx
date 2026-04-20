"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { BOOKING_URL } from "@/lib/booking-url";

const links: {
  href: string;
  label: string;
  external?: boolean;
}[] = [
  { href: "/portfolio", label: "Work" },
  { href: "/flash", label: "Flash" },
  { href: BOOKING_URL, label: "Book", external: true },
  { href: "/aftercare", label: "Aftercare" },
  { href: "/gift-cards", label: "Gift cards" },
  { href: "/tour", label: "Tour" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

function isActive(pathname: string, href: string, external?: boolean) {
  if (external) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    const opener = openerRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  const navLinkClass = (active: boolean) =>
    cn(
      "relative px-3 py-2 text-[11px] font-medium uppercase tracking-widest transition-colors",
      active ? "text-bandage" : "text-bone/70 hover:text-blood"
    );

  const mobileLinkClass = (active: boolean) =>
    cn(
      "flex items-center justify-between px-6 py-5 font-serif text-2xl transition-colors",
      active ? "bg-blood/10 text-blood" : "text-bandage hover:text-blood"
    );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-bone/10 bg-ink/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 md:px-6">
          <Link
            href="/"
            onClick={close}
            className="font-mono text-[11px] uppercase tracking-[0.4em] text-bandage transition-colors hover:text-blood sm:text-xs"
          >
            Mari Belle Bones
          </Link>
          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Primary"
          >
            {links.map((l) => {
              const active = isActive(pathname, l.href, l.external);
              if (l.external) {
                return (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 text-[11px] font-medium uppercase tracking-widest text-bone/70 transition-colors hover:text-blood"
                  >
                    {l.label}
                  </a>
                );
              }
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={navLinkClass(active)}
                >
                  {l.label}
                  {active ? (
                    <span
                      aria-hidden
                      className="absolute inset-x-3 -bottom-px h-px bg-blood"
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>
          <button
            ref={openerRef}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
            className="-mr-2 p-2 text-bone hover:text-blood md:hidden"
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
          id="mobile-nav"
          className="mbb-fade-in fixed inset-0 top-14 z-40 flex flex-col bg-ink/95 backdrop-blur-xl md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <button
            ref={closeBtnRef}
            type="button"
            onClick={close}
            className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-3 focus:p-2 focus:text-bone"
            aria-label="Close menu"
          >
            Close
          </button>
          <nav
            className="mbb-slide-down flex flex-col divide-y divide-bone/10 border-t border-bone/10"
            aria-label="Mobile primary"
          >
            {links.map((l) => {
              const active = isActive(pathname, l.href, l.external);
              if (l.external) {
                return (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={close}
                    className="px-6 py-5 font-serif text-2xl text-bandage hover:text-blood"
                  >
                    {l.label}
                  </a>
                );
              }
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={close}
                  aria-current={active ? "page" : undefined}
                  className={mobileLinkClass(active)}
                >
                  <span>{l.label}</span>
                  {active ? (
                    <span
                      aria-hidden
                      className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood"
                    >
                      Here
                    </span>
                  ) : null}
                </Link>
              );
            })}
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
