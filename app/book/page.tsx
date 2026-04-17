import { BookWizard } from "./book-wizard";

export const metadata = { title: "Book" };

export default function BookPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <h1 className="font-serif text-4xl text-bandage">Book + deposit</h1>
      <p className="mt-4 text-sm text-bone/75">
        Consultation or tattoo session. Intake, consent, then Square deposit when
        keys are live.
      </p>
      <div className="mt-10">
        <BookWizard />
      </div>
    </div>
  );
}
