import Link from "next/link";
import { Gift, Mail, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = { title: "Gift cards" };

const PRESETS = [
  { amount: 100, label: "Small piece or accessory" },
  { amount: 200, label: "Half-day or flash" },
  { amount: 400, label: "Full session credit" },
];

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

      <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-3">
        {PRESETS.map((p) => (
          <div
            key={p.amount}
            className="border border-bone/10 bg-char p-5 sm:p-6"
          >
            <p className="font-serif text-3xl text-bandage sm:text-4xl">
              ${p.amount}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{p.label}</p>
          </div>
        ))}
      </div>

      <ul className="mt-10 grid gap-3 text-sm leading-relaxed text-bone/85 sm:gap-4">
        <Bullet icon={Mail}>Recipient receives a redemption code by email.</Bullet>
        <Bullet icon={Gift}>Apply at booking — covers deposit and session.</Bullet>
        <Bullet icon={ShieldCheck}>
          Balances stay on file securely. Non-refundable per studio policy.
        </Bullet>
      </ul>

      <div className="mt-10 border border-blood/30 bg-char p-5 sm:p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
          Coming soon
        </p>
        <p className="mt-2 text-sm leading-relaxed text-bone/85">
          Gift card checkout is launching with the next site update. In the
          meantime, message the studio for a custom amount.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/book"
            className={cn(buttonVariants(), "w-full sm:w-auto")}
          >
            Request a card
          </Link>
          <a
            href="https://www.instagram.com/maribellebones/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full sm:w-auto"
            )}
          >
            Message on Instagram
          </a>
        </div>
      </div>
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
