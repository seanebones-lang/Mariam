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
      <div className="mx-auto max-w-xl px-4 py-16 text-sm text-muted">
        Database not configured — cannot load tracker.
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
    <div className="mx-auto max-w-xl px-4 py-16 md:px-6">
      <h1 className="font-serif text-3xl text-bandage">Healing timeline</h1>
      <p className="mt-2 text-sm text-muted">Private link — do not share.</p>
      <p className="mt-6 text-sm text-bone/85">
        Tattoo date:{" "}
        <span className="text-blood">
          {start.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        . Today is day <strong>{Math.max(0, diffDays)}</strong> relative to that
        date.
      </p>
      <ul className="mt-8 space-y-3 text-sm">
        {DAYS.map((d) => (
          <li
            key={d}
            className={`border border-bone/10 px-3 py-2 ${
              diffDays >= d ? "border-blood/40 text-bone" : "text-muted"
            }`}
          >
            Day {d}:{" "}
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
