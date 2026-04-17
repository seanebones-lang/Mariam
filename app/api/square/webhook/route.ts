import { WebhooksHelper } from "square";
import { getServerEnv } from "@/lib/env";
import { limitApi } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const { success } = await limitApi(`square-webhook:${req.headers.get("x-forwarded-for") ?? "x"}`);
  if (!success) return new Response("rate limited", { status: 429 });

  const raw = await req.text();
  const sig = req.headers.get("x-square-hmacsha256-signature") ?? "";
  const env = getServerEnv();
  const key = env.SQUARE_WEBHOOK_SIGNATURE_KEY;

  if (!key || key === "placeholder") {
    return new Response("ok", { status: 200 });
  }

  const base =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const notificationUrl = `${base.replace(/\/$/, "")}/api/square/webhook`;

  const ok = await WebhooksHelper.verifySignature({
    requestBody: raw,
    signatureHeader: sig,
    signatureKey: key,
    notificationUrl,
  });

  if (!ok) {
    return new Response("invalid signature", { status: 401 });
  }

  // TODO: parse JSON, map payment.updated → bookings / flash_claims / gift_card_orders
  return new Response("ok", { status: 200 });
}
