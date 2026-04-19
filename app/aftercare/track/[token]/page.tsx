import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { aftercareSubscribers } from "@/db/schema";

type Props = { params: Promise<{ token: string }> };

const DAYS = [0, 1, 3, 7, 14, 30];

export default async function AftercareTrackPage({ params }: Props) {
  const { token } = await params;
  const db = getDb();
  if (!db) {
    return (
      <div className="mx-auto max-w-xl px-5 py-12 text-center sm:px-6 sm:py-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
          Unavailable
        </p>
        <p className="mt-3 text-sm leading-relaxed text-bone/80">
          The tracker is temporarily offline. Please try again shortly.
        </p>
      </div>
    );
  }
  const [row] = await db
    .select()
    .from(aftercareSubscribers)
    .where(eq(aftercareSubscribers.token, token))
    .limit(1);
  if (!row) notFound();

  const start = new Date(row.tattooDate);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="mx-auto max-w-xl px-5 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
        Private link
      </p>
      <h1 className="mt-3 font-serif text-3xl leading-tight text-bandage sm:text-4xl">
        Healing timeline
      </h1>
      <p className="mt-2 text-sm text-muted">Do not share.</p>
      <p className="mt-6 text-sm leading-relaxed text-bone/85">
        Tattoo date:{" "}
        <span className="text-blood">
          {start.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        . Today is day <strong>{Math.max(0, diffDays)}</strong> relative to
        that date.
      </p>
      <ul className="mt-8 space-y-3 text-sm">
        {DAYS.map((d) => (
          <li
            key={d}
            className={`border border-bone/10 px-4 py-3 leading-relaxed ${
              diffDays >= d ? "border-blood/40 text-bone" : "text-muted"
            }`}
          >
            <span className="mr-2 font-mono text-xs text-blood">
              Day {String(d).padStart(2, "0")}
            </span>
            {d === 0
              ? "Film on, gentle day."
              : d === 1
                ? "Check edges / fluid."
                : d === 3
                  ? "Possible film change."
                  : d === 7
                    ? "Often film off — lotion phase."
                    : d === 14
                      ? "Healing audit."
                      : "Final check-in + review ask."}
          </li>
        ))}
      </ul>
    </div>
  );
}
