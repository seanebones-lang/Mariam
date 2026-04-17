export const metadata = { title: "Gift cards" };

export default function GiftCardsPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
        Shop
      </p>
      <h1 className="mt-3 font-serif text-3xl leading-tight text-bandage sm:text-4xl md:text-5xl">
        Gift cards
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-bone/80">
        Square Gift Cards API will mount here with{" "}
        <code className="text-blood">react-square-web-payments-sdk</code> once
        application ID and location are configured. Amount presets: $100, $200,
        $400.
      </p>
      <ul className="mt-8 space-y-3 text-sm leading-relaxed text-muted">
        <li>Recipient receives email with redemption code.</li>
        <li>Balances sync with Square.</li>
        <li>Non-refundable per studio policy.</li>
      </ul>
    </div>
  );
}
