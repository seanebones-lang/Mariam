import { asc } from "drizzle-orm";
import { getDb } from "@/db";
import { tourDates } from "@/db/schema";
import {
  AddFlashForm,
  AddTourForm,
  DeleteTourButton,
} from "./admin-forms";

export default async function AdminDashboardPage() {
  const db = getDb();
  const tours = db
    ? await db.select().from(tourDates).orderBy(asc(tourDates.startsOn))
    : [];

  return (
    <div className="mx-auto max-w-3xl space-y-14 px-5 py-12 sm:space-y-16 sm:px-6 sm:py-16">
      <section>
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
          Calendar
        </p>
        <h1 className="mt-3 font-serif text-3xl leading-tight text-bandage sm:text-4xl">
          Tour dates
        </h1>
        <ul className="mt-6 space-y-3 text-sm">
          {tours.length === 0 ? (
            <li className="border border-dashed border-bone/15 bg-char/40 px-4 py-6 text-center text-muted">
              No tour dates yet. Add the first one below.
            </li>
          ) : (
            tours.map((t) => {
              const label = `${t.city} — ${new Date(t.startsOn).toLocaleDateString()}`;
              return (
                <li
                  key={t.id}
                  className="flex flex-col gap-3 border border-bone/10 bg-char p-4 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-3"
                >
                  <span className="break-words">{label}</span>
                  <DeleteTourButton id={t.id} label={label} />
                </li>
              );
            })
          )}
        </ul>
        <AddTourForm />
      </section>

      <section>
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
          Shop
        </p>
        <h2 className="mt-3 font-serif text-2xl leading-tight text-bandage sm:text-3xl">
          Flash piece
        </h2>
        <AddFlashForm />
      </section>
    </div>
  );
}
