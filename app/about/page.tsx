export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="font-serif text-4xl text-bandage">Mari Belle Bones</h1>
      <p className="mt-6 text-sm leading-relaxed text-bone/85">
        Dark art and occult imagery with surgical line weight and reverence for
        the body as canvas. Mari works by appointment, prioritizes consent and
        clarity, and travels for guest residencies.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-bone/85">
        This site handles deposits through Square, stores booking data in Neon
        Postgres, and sends aftercare drips through Resend when DNS is verified.
      </p>
    </div>
  );
}
