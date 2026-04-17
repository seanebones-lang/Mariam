import { z } from "zod";
import { getServerEnv } from "@/lib/env";
import { limitApi } from "@/lib/rate-limit";

function clientId(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: Request) {
  const id = clientId(req);
  const { success } = await limitApi(`tts:${id}`);
  if (!success) {
    return new Response("Too many requests", { status: 429 });
  }

  const env = getServerEnv();
  if (!env.XAI_API_KEY) {
    return new Response("XAI_API_KEY not configured", { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const parsed = z
    .object({
      text: z.string().max(1500),
      voice_id: z.enum(["eve", "ara", "leo", "rex", "sal"]).optional(),
    })
    .safeParse(body);
  if (!parsed.success) {
    return new Response("Invalid body", { status: 400 });
  }

  const res = await fetch("https://api.x.ai/v1/tts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.XAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: parsed.data.text,
      voice_id: parsed.data.voice_id ?? "eve",
      language: "en",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return new Response(err || "TTS failed", { status: res.status });
  }

  const buf = await res.arrayBuffer();
  return new Response(buf, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    },
  });
}
