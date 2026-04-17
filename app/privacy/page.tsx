export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 text-sm text-bone/85 leading-relaxed">
      <h1 className="font-serif text-4xl text-bandage">Privacy</h1>
      <p className="mt-6">
        We collect booking information (name, email, phone), optional reference
        uploads stored in Vercel Blob, and consent signatures with a hashed IP
        for audit. Payments are processed by Square — refer to Square&apos;s
        privacy policy for card data handling.
      </p>
      <p className="mt-4">
        Analytics may use Vercel Speed Insights. Error reporting may use Sentry.
        You can request deletion of booking rows by emailing the studio contact
        once that address is configured.
      </p>
    </div>
  );
}
