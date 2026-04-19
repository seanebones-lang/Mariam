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
        Reserve a consultation or session in four short steps. We&apos;ll
        confirm by email and send a secure link for your deposit.
      </p>
      <ol className="mt-6 grid grid-cols-2 gap-3 text-[11px] uppercase tracking-[0.2em] text-muted sm:grid-cols-4">
        <li className="border border-bone/10 px-3 py-2">
          <span className="font-mono text-blood">01</span> Contact
        </li>
        <li className="border border-bone/10 px-3 py-2">
          <span className="font-mono text-blood">02</span> Details
        </li>
        <li className="border border-bone/10 px-3 py-2">
          <span className="font-mono text-blood">03</span> Consent
        </li>
        <li className="border border-bone/10 px-3 py-2">
          <span className="font-mono text-blood">04</span> Review
        </li>
      </ol>
      <div className="mt-8 sm:mt-10">
        <BookWizard />
      </div>
    </div>
  );
}
