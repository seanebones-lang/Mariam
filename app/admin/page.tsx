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
    <div className="mx-auto max-w-3xl space-y-16 px-4 py-16 md:px-6">
      <section>
        <h1 className="font-serif text-3xl text-bandage">Tour dates</h1>
        <ul className="mt-6 space-y-3 text-sm">
          {tours.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between border border-bone/10 bg-char px-3 py-2"
            >
              <span>
                {t.city} — {new Date(t.startsOn).toLocaleDateString()}
              </span>
              <form action={deleteTourDate}>
                <input type="hidden" name="id" value={t.id} />
                <Button type="submit" variant="outline" size="sm">
                  Remove
                </Button>
              </form>
            </li>
          ))}
        </ul>
        <form action={addTourDate} className="mt-8 grid gap-4 border border-bone/10 p-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="venue">Venue</Label>
            <Input id="venue" name="venue" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="startsOn">Starts (datetime-local)</Label>
            <Input
              id="startsOn"
              name="startsOn"
              type="datetime-local"
              required
              className="mt-1"
            />
          </div>
          <Button type="submit">Add tour row</Button>
        </form>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-bandage">Flash piece</h2>
        <form action={addFlashPiece} className="mt-6 grid gap-4 border border-bone/10 p-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" name="imageUrl" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="priceUsd">Price (USD)</Label>
            <Input
              id="priceUsd"
              name="priceUsd"
              type="number"
              min={1}
              step={1}
              required
              className="mt-1"
            />
          </div>
          <Button type="submit">Add flash</Button>
        </form>
      </section>
    </div>
  );
}
