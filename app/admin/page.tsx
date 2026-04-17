import { asc } from "drizzle-orm";
import { getDb } from "@/db";
import { tourDates } from "@/db/schema";
import { addFlashPiece, addTourDate, deleteTourDate } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
          {tours.map((t) => (
            <li
              key={t.id}
              className="flex flex-col gap-3 border border-bone/10 bg-char p-4 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-3"
            >
              <span className="break-words">
                {t.city} — {new Date(t.startsOn).toLocaleDateString()}
              </span>
              <form action={deleteTourDate}>
                <input type="hidden" name="id" value={t.id} />
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Remove
                </Button>
              </form>
            </li>
          ))}
        </ul>
        <form
          action={addTourDate}
          className="mt-8 grid gap-4 border border-bone/10 p-4 sm:p-5"
        >
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" required className="mt-2" />
          </div>
          <div>
            <Label htmlFor="venue">Venue</Label>
            <Input id="venue" name="venue" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="startsOn">Starts (datetime-local)</Label>
            <Input
              id="startsOn"
              name="startsOn"
              type="datetime-local"
              required
              className="mt-2"
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            Add tour row
          </Button>
        </form>
      </section>

      <section>
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
          Shop
        </p>
        <h2 className="mt-3 font-serif text-2xl leading-tight text-bandage sm:text-3xl">
          Flash piece
        </h2>
        <form
          action={addFlashPiece}
          className="mt-6 grid gap-4 border border-bone/10 p-4 sm:p-5"
        >
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required className="mt-2" />
          </div>
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              inputMode="url"
              required
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="priceUsd">Price (USD)</Label>
            <Input
              id="priceUsd"
              name="priceUsd"
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              required
              className="mt-2"
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            Add flash
          </Button>
        </form>
      </section>
    </div>
  );
}
