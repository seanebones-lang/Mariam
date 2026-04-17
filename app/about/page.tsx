export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
        The artist
      </p>
      <h1 className="mt-3 font-serif text-3xl leading-tight text-bandage sm:text-4xl md:text-5xl">
        Mari Belle Bones
      </h1>
      <p className="mt-6 text-sm leading-relaxed text-bone/85 sm:text-base">
        Dark art and occult imagery with surgical line weight and reverence for
        the body as canvas. Mari works by appointment, prioritizes consent and
        clarity, and travels for guest residencies.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-bone/85 sm:text-base">
        This site handles deposits through Square, stores booking data in Neon
        Postgres, and sends aftercare drips through Resend when DNS is
        verified.
      </p>
    </div>
  );
}
