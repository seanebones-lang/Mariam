export const metadata = { title: "Gift cards" };

export default function GiftCardsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <h1 className="font-serif text-4xl text-bandage">Gift cards</h1>
      <p className="mt-4 text-sm text-bone/80">
        Square Gift Cards API will mount here with{" "}
        <code className="text-blood">react-square-web-payments-sdk</code> once
        application ID and location are configured. Amount presets: $100, $200,
        $400.
      </p>
      <ul className="mt-8 space-y-3 text-sm text-muted">
        <li>Recipient receives email with redemption code.</li>
        <li>Balances sync with Square.</li>
        <li>Non-refundable per studio policy.</li>
      </ul>
    </div>
  );
}
