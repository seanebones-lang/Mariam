export const metadata = { title: "FAQ" };

export default function FaqPage() {
  const items = [
    {
      q: "How much is the deposit?",
      a: "Consultation and tattoo deposits differ by piece — the booking flow shows the current amount before Square checkout.",
    },
    {
      q: "Is the deposit refundable?",
      a: "Deposits hold calendar time and cover drawing prep — generally non-refundable. Exceptions for emergencies are at Mari’s discretion.",
    },
    {
      q: "Saniderm vs dry heal?",
      a: "Mari often recommends Saniderm for the first phase; follow the written aftercare you receive after the session.",
    },
    {
      q: "Do you tattoo minors?",
      a: "No. This studio is eighteen plus only.",
    },
  ];
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="font-serif text-4xl text-bandage">FAQ & policies</h1>
      <dl className="mt-10 space-y-8">
        {items.map((it) => (
          <div key={it.q}>
            <dt className="font-serif text-lg text-blood">{it.q}</dt>
            <dd className="mt-2 text-sm text-bone/85">{it.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
