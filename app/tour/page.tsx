import { getTourPreview } from "@/lib/site-data";

export const metadata = { title: "Tour" };

export default async function TourPage() {
  const rows = await getTourPreview();
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="font-serif text-4xl text-bandage">Guest spots</h1>
      <p className="mt-4 text-sm text-bone/80">
        Traveling artist calendar. Cities and venues are editable from{" "}
        <code className="text-blood">/admin</code> when database + admin password
        are set.
      </p>
      <ul className="mt-10 space-y-4">
        {rows.length === 0 ? (
          <li className="text-sm text-muted">No tour rows yet.</li>
        ) : (
          rows.map((t) => (
            <li
              key={t.id}
              className="border border-bone/10 bg-char px-5 py-4 text-sm"
            >
              <p className="font-serif text-xl text-bandage">{t.city}</p>
              {t.venue ? <p className="text-muted">{t.venue}</p> : null}
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
