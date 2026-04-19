import { Resend } from "resend";
import { getServerEnv } from "./env";

const FROM_DEFAULT = "Mari Belle Bones <studio@maribellebones.com>";

let _client: Resend | null = null;
function getResend(): Resend | null {
  const env = getServerEnv();
  if (!env.RESEND_API_KEY) return null;
  if (!_client) _client = new Resend(env.RESEND_API_KEY);
  return _client;
}

export function emailConfigured(): boolean {
  return Boolean(getServerEnv().RESEND_API_KEY);
}

function appUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "http://localhost:3000"
  );
}

type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
};

export async function sendEmail(args: SendArgs): Promise<{ ok: boolean; id?: string; error?: string }> {
  const client = getResend();
  if (!client) {
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }
  const from =
    args.from ??
    process.env.MBB_EMAIL_FROM ??
    FROM_DEFAULT;
  try {
    const r = await client.emails.send({
      from,
      to: args.to,
      subject: args.subject,
      html: args.html,
      text: args.text,
    });
    if (r.error) return { ok: false, error: r.error.message };
    return { ok: true, id: r.data?.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

const BASE_STYLE = `
  body { background:#060606; color:#ede7da; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; }
  .wrap { max-width: 560px; margin: 0 auto; background: #120e0e; border: 1px solid rgba(237,231,218,0.1); padding: 32px; }
  h1 { font-family: Georgia, serif; color: #ffffff; font-size: 28px; margin: 0 0 8px; }
  .eyebrow { color: #a3121f; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; margin: 0 0 8px; }
  p { line-height: 1.6; margin: 12px 0; color: rgba(237,231,218,0.85); }
  .btn { display: inline-block; background: #a3121f; color: #ffffff !important; text-decoration: none; padding: 12px 24px; font-weight: 600; margin: 16px 0; }
  .ref { display: inline-block; background: #060606; border: 1px solid rgba(237,231,218,0.15); color: #a3121f; font-family: monospace; padding: 4px 8px; }
  .muted { color: rgba(237,231,218,0.55); font-size: 12px; }
  hr { border: none; border-top: 1px solid rgba(237,231,218,0.1); margin: 24px 0; }
`;

function shell(eyebrow: string, title: string, body: string): string {
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>${BASE_STYLE}</style></head>
<body><div class="wrap">
<p class="eyebrow">${eyebrow}</p>
<h1>${title}</h1>
${body}
<hr/>
<p class="muted">Mari Belle Bones · By appointment only · <a style="color:#a3121f" href="${appUrl()}">maribellebones.com</a></p>
</div></body></html>`;
}

export function bookingConfirmationEmail(args: {
  clientName: string;
  bookingId: string;
  kind: "consultation" | "tattoo";
  scheduledAt?: string | null;
  depositCents: number;
  depositUrl?: string;
}): { subject: string; html: string; text: string } {
  const amount = `$${(args.depositCents / 100).toFixed(0)}`;
  const url = args.depositUrl ?? `${appUrl()}/book/success?ref=${encodeURIComponent(args.bookingId)}`;
  const when = args.scheduledAt
    ? new Date(args.scheduledAt).toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "TBD — we'll confirm by reply";
  const subject = `Booking received · ${args.bookingId}`;
  const html = shell(
    "Reserved",
    "Marked in the book",
    `
    <p>Hi ${escape(args.clientName)},</p>
    <p>Your ${args.kind === "consultation" ? "consultation" : "tattoo session"} request is in. Reference <span class="ref">${args.bookingId}</span>.</p>
    <p><strong>Preferred:</strong> ${escape(when)}<br/>
    <strong>Deposit:</strong> ${amount}</p>
    <p>Tap below to lock in your slot with a secure deposit. The link is valid for 24 hours.</p>
    <p><a class="btn" href="${url}">Pay deposit</a></p>
    <p>Reply with any extra references or notes you forgot — they go straight to Mari.</p>
    `
  );
  const text = `Hi ${args.clientName},

Your ${args.kind === "consultation" ? "consultation" : "tattoo session"} request is in. Reference ${args.bookingId}.
Preferred: ${when}
Deposit: ${amount}

Lock in your slot: ${url}

— Mari Belle Bones`;
  return { subject, html, text };
}

export function flashHoldEmail(args: {
  clientName: string;
  flashTitle: string;
  holdMinutes: number;
  payUrl: string;
}): { subject: string; html: string; text: string } {
  const subject = `Hold placed · ${args.flashTitle}`;
  const html = shell(
    "Hold placed",
    `${args.flashTitle} is yours for now`,
    `
    <p>Hi ${escape(args.clientName)},</p>
    <p>You have a <strong>${args.holdMinutes}-minute hold</strong> on this flash piece. Complete the deposit before the timer ends to lock it in.</p>
    <p><a class="btn" href="${args.payUrl}">Pay deposit</a></p>
    <p class="muted">If you don't pay in time, the piece is freed automatically and you'll need to claim again.</p>
    `
  );
  const text = `Hi ${args.clientName},

You have a ${args.holdMinutes}-minute hold on "${args.flashTitle}".
Complete the deposit before the timer ends: ${args.payUrl}

— Mari Belle Bones`;
  return { subject, html, text };
}

export function aftercareDayEmail(day: number): {
  subject: string;
  html: string;
  text: string;
} {
  const map: Record<number, { title: string; body: string }> = {
    0: {
      title: "Day 0 — film on, gentle day",
      body: "Sleep well. Don't pick at the film. If fluid pools heavily, that's normal — only remove if it leaks.",
    },
    1: {
      title: "Day 1 — check the edges",
      body: "Look at edges and corners of the Saniderm. If lifting, gently re-tape or remove per the instructions you received.",
    },
    3: {
      title: "Day 3 — possible film change",
      body: "Many heals get a fresh film around now. Wash hands first, peel slowly under warm water, pat dry, re-apply if instructed.",
    },
    7: {
      title: "Day 7 — film off, lotion phase",
      body: "Most pieces come out of film by now. Switch to a thin layer of unscented lotion 2–3× daily. No soaking, no sun.",
    },
    14: {
      title: "Day 14 — healing audit",
      body: "Check in: any odd flaking, scabbing, raised lines? Take a clear daylight photo and message us if anything looks off.",
    },
    30: {
      title: "Day 30 — final check + review",
      body: "Skin should feel like skin. If you're happy with the work, a Google review or Instagram tag means everything to a small studio.",
    },
  };
  const entry = map[day];
  const subject = `Aftercare · ${entry.title}`;
  const html = shell("Healing", entry.title, `<p>${escape(entry.body)}</p>`);
  const text = `${entry.title}\n\n${entry.body}\n\n— Mari Belle Bones`;
  return { subject, html, text };
}

export function giftCardEmail(args: {
  recipientName?: string;
  amountCents: number;
  code: string;
  message?: string;
  redeemUrl: string;
}): { subject: string; html: string; text: string } {
  const amount = `$${(args.amountCents / 100).toFixed(0)}`;
  const subject = `A gift from Mari Belle Bones · ${amount}`;
  const html = shell(
    "Gift card",
    `${amount} for ink`,
    `
    <p>${args.recipientName ? `Hi ${escape(args.recipientName)},` : "Hi,"}</p>
    <p>Someone wants you to get marked. You have <strong>${amount}</strong> in studio credit waiting at Mari Belle Bones.</p>
    ${args.message ? `<p><em>"${escape(args.message)}"</em></p>` : ""}
    <p><strong>Redemption code:</strong> <span class="ref">${args.code}</span></p>
    <p><a class="btn" href="${args.redeemUrl}">Book your session</a></p>
    `
  );
  const text = `${amount} in studio credit at Mari Belle Bones.
Code: ${args.code}
Book: ${args.redeemUrl}`;
  return { subject, html, text };
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
