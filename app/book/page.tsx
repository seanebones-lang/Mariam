import { BookWizard } from "./book-wizard";

export const metadata = { title: "Book" };

export default function BookPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
        Appointment
      </p>
      <h1 className="mt-3 font-serif text-3xl leading-tight text-bandage sm:text-4xl md:text-5xl">
        Book + deposit
      </h1>
      <p className="mt-4 text-[13px] leading-relaxed text-bone/70 sm:text-sm">
        Consultation or tattoo session. Intake, consent, then Square deposit
        when keys are live.
      </p>
      <div className="mt-8 sm:mt-10">
        <BookWizard />
      </div>
    </div>
  );
}
