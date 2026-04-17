export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 text-sm leading-relaxed text-bone/85 sm:px-6 sm:py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
        Legal
      </p>
      <h1 className="mt-3 font-serif text-3xl leading-tight text-bandage sm:text-4xl md:text-5xl">
        Terms
      </h1>
      <p className="mt-6">
        This website is provided as-is for scheduling and information. Nothing
        here constitutes medical advice. Tattooing involves risk of infection
        and scarring — follow aftercare and seek medical attention if needed.
      </p>
      <p className="mt-4">
        Gift cards and deposits are handled under Square&apos;s terms. Artwork
        previews may differ slightly from final tattoo application.
      </p>
    </div>
  );
}
