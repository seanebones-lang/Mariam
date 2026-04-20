import { createXai } from "@ai-sdk/xai";
import { stepCountIs, streamText, tool } from "ai";
import { z } from "zod";
import { getServerEnv } from "@/lib/env";
import { BOOKING_URL } from "@/lib/booking-url";
import { limitChat } from "@/lib/rate-limit";

export const maxDuration = 60;

function clientId(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: Request) {
  const id = clientId(req);
  const { success } = await limitChat(id);
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
      messages: z.array(
        z.object({
          role: z.enum(["user", "assistant", "system"]),
          content: z.string(),
        })
      ),
    })
    .safeParse(body);
  if (!parsed.success) {
    return new Response("Invalid body", { status: 400 });
  }

  const xai = createXai({ apiKey: env.XAI_API_KEY });

  const checkAvailability = tool({
    description:
      "Check which time slots appear open on a given calendar date (YYYY-MM-DD). Use for consultations or tattoo sessions.",
    inputSchema: z.object({
      date: z.string().describe("ISO date YYYY-MM-DD"),
      kind: z
        .enum(["consultation", "tattoo"])
        .describe("Type of booking"),
    }),
    execute: async ({ date }) => {
      const d = new Date(`${date}T12:00:00Z`);
      if (Number.isNaN(d.getTime())) {
        return { ok: false as const, error: "Invalid date" };
      }
      const day = d.getUTCDay();
      if (day === 0 || day === 6) {
        return {
          ok: true as const,
          date,
          slots: ["11:00", "14:30"],
          note: "Weekend — limited availability.",
        };
      }
      return {
        ok: true as const,
        date,
        slots: ["10:00", "12:30", "15:00", "17:30"],
        note: "Slots are indicative; final confirmation after deposit.",
      };
    },
  });

  const startBookingFlow = tool({
    description:
      "Tell the user to open the live booking page (PrimeCraft) to pick a time, complete intake, and pay deposit when the studio requires it.",
    inputSchema: z.object({
      kind: z.enum(["consultation", "tattoo"]),
    }),
    execute: async ({ kind }) => ({
      ok: true as const,
      url: BOOKING_URL,
      kind,
      message:
        "Open the booking link to continue — choose consultation or tattoo in the flow as offered.",
    }),
  });

  const aftercareTips = tool({
    description:
      "Return Saniderm-focused aftercare tips for a given day relative to the tattoo (day 0 = day of tattoo).",
    inputSchema: z.object({
      day: z.number().int().min(0).max(30),
    }),
    execute: async ({ day }) => {
      if (day <= 1) {
        return {
          phase: "Saniderm on",
          tips: [
            "Keep Saniderm on unless it fills with fluid or leaks.",
            "Avoid soaking — quick showers only.",
            "No picking, scratching, or sun exposure.",
          ],
        };
      }
      if (day <= 7) {
        return {
          phase: "Heal / transition",
          tips: [
            "If removing Saniderm, wash gently with fragrance-free soap, pat dry.",
            "Thin layer of artist-approved balm if advised.",
          ],
        };
      }
      return {
        phase: "Settled",
        tips: [
          "Moisturize as needed; SPF when healed enough for sun.",
          "Book a touch-up consult if any patchy spots persist after 30 days.",
        ],
      };
    },
  });

  const generateQuote = tool({
    description:
      "Produce a rough price estimate in USD for a described tattoo idea. Always remind that final price is confirmed by Mari after consult.",
    inputSchema: z.object({
      description: z.string(),
      placement: z.string().optional(),
      sizeInches: z.number().optional(),
    }),
    execute: async ({ description, placement, sizeInches }) => {
      const base = 180;
      const mult = Math.min(4, 1 + (sizeInches ?? 4) / 8);
      const low = Math.round(base * mult);
      const high = Math.round(low * 1.6);
      return {
        currency: "USD",
        low,
        high,
        placement: placement ?? "unspecified",
        descriptionSummary: description.slice(0, 200),
        disclaimer:
          "Estimate only. Deposit secures calendar time; final quote from Mari after consult.",
      };
    },
  });

  const result = streamText({
    model: xai("grok-3-fast"),
    stopWhen: stepCountIs(8),
    system: `You are the chat concierge for Mari Belle Bones (MBB), a professional tattoo artist: internationally published and award-winning, 20+ years experience, apprenticeship completed with Sean E Bones in September 2004, co-founder of the Worldwide Tattoo Artists Guild, with prior shop experience across Texas, New Mexico, Missouri, and Kansas; home base is a private studio in Ruidoso, New Mexico, plus guest spots.
Tone: calm, precise, gallery-level hospitality—never gothic or occult framing.
You help with: booking consultations or tattoo sessions, explaining deposits via Square, Saniderm aftercare, flash holds, gift cards, and travel / guest spots.
Never invent policies, award names, or publication titles you are unsure of — offer /faq or the live booking link.
If asked for medical advice beyond standard tattoo aftercare, say you are not a medical professional.
When a user wants to book, prefer the startBookingFlow tool and give them the full booking URL (PrimeCraft).
Keep answers concise unless the user asks for detail.`,
    messages: parsed.data.messages,
    tools: {
      checkAvailability,
      startBookingFlow,
      aftercareTips,
      generateQuote,
    },
  });

  return result.toTextStreamResponse();
}
