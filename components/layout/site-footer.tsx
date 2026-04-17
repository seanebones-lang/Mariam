import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-bone/10 bg-char py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:flex-row md:justify-between md:px-6">
        <div>
          <p className="font-display text-2xl text-bandage">MBB</p>
          <p className="mt-2 max-w-xs text-sm text-muted">
            Mari Belle Bones — dark art tattoo. Traveling artist. Bookings &
            deposits handled on this site.
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
      <p className="mt-10 text-center text-xs text-muted">
        © {new Date().getFullYear()} Mari Belle Bones. All rites reserved.
      </p>
    </footer>
  );
}
