import { getTourPreview } from "@/lib/site-data";

export const metadata = { title: "Tour" };

export default async function TourPage() {
  const rows = await getTourPreview();
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
        Calendar
      </p>
      <h1 className="mt-3 font-serif text-3xl leading-tight text-bandage sm:text-4xl md:text-5xl">
        Guest spots
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-bone/80">
        Where Mari is working next. Tap any city to request a slot at that
        guest residency.
      </p>
      <ul className="mt-10 space-y-3 sm:space-y-4">
        {rows.length === 0 ? (
          <li className="border border-dashed border-bone/15 bg-char/40 px-5 py-10 text-center text-sm text-muted">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
              Quiet stretch
            </p>
            <p className="mt-3 leading-relaxed">
              No travel dates on the books right now. Follow on Instagram for
              the next announcement.
            </p>
          </li>
        ) : (
          rows.map((t) => (
            <li
              key={t.id}
              className="border border-bone/10 bg-char px-4 py-4 text-sm sm:px-5"
            >
              <p className="font-serif text-xl text-bandage sm:text-2xl">
                {t.city}
              </p>
              {t.venue ? (
                <p className="text-muted">{t.venue}</p>
              ) : null}
              <p className="mt-2 text-bone/85">
                {new Date(t.startsOn).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              {t.bookingUrl ? (
                <a
                  href={t.bookingUrl}
                  className="mt-3 inline-block text-blood underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book this guest spot
                </a>
              ) : null}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
