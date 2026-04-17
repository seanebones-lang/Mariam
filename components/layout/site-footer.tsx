import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-bone/10 bg-char py-10 sm:py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 sm:px-6 md:flex-row md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-bandage">
            Mari Belle Bones
          </p>
          <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-muted sm:text-sm">
            Dark art tattoo. Traveling artist. Bookings &amp; deposits handled
            on this site.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <Link href="/privacy" className="text-bone/70 hover:text-blood">
            Privacy
          </Link>
          <Link href="/terms" className="text-bone/70 hover:text-blood">
            Terms
          </Link>
          <a
            href="https://www.instagram.com/maribellebones/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-bone/70 hover:text-blood"
          >
            Instagram
          </a>
        </div>
      </div>
      <p className="mt-8 px-5 text-center text-[11px] text-muted sm:mt-10 sm:px-6 sm:text-xs">
        © {new Date().getFullYear()} Mari Belle Bones. All rites reserved.
      </p>
    </footer>
  );
}
