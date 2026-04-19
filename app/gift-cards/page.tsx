import { Gift, Mail, ShieldCheck } from "lucide-react";
import { GiftForm } from "./gift-form";

export const metadata = { title: "Gift cards" };

export default function GiftCardsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-blood sm:text-xs sm:tracking-[0.4em]">
        Shop
      </p>
      <h1 className="mt-3 font-serif text-3xl leading-tight text-bandage sm:text-4xl md:text-5xl">
        Gift cards
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-bone/80">
        A studio credit, sent by email — for the friend who&apos;s been
        circling a piece for years.
      </p>

      <ul className="mt-8 grid gap-3 text-sm leading-relaxed text-bone/85 sm:gap-4">
        <Bullet icon={Mail}>Recipient receives a redemption code by email.</Bullet>
        <Bullet icon={Gift}>Apply at booking — covers deposit and session.</Bullet>
        <Bullet icon={ShieldCheck}>
          Balances stay on file securely. Non-refundable per studio policy.
        </Bullet>
      </ul>

      <GiftForm />
    </div>
  );
}

function Bullet({
  icon: Icon,
  children,
}: {
  icon: typeof Gift;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3 border border-bone/10 bg-char/50 px-4 py-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-blood" aria-hidden />
      <span>{children}</span>
    </li>
  );
}
