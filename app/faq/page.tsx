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
      q: "Film dressing (Saniderm) vs dry healing?",
      a: "Many clients use a transparent film dressing early in healing; Mari will recommend what suits your piece. Always follow the written aftercare you receive after your session.",
    },
    {
      q: "Do you tattoo minors?",
      a: "No. Services are for clients age eighteen and older only.",
    },
  ];
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
        Reference
      </p>
      <h1 className="mt-3 font-serif text-3xl leading-tight text-bandage sm:text-4xl md:text-5xl">
        FAQ &amp; policies
      </h1>
      <dl className="mt-10 divide-y divide-bone/10 border-y border-bone/10">
        {items.map((it) => (
          <div key={it.q} className="py-6 sm:py-8">
            <dt className="font-serif text-lg text-blood sm:text-xl">
              {it.q}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-bone/85">
              {it.a}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
