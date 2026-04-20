import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * POST from a Sanity GROQ webhook or manual curl.
 * Header: Authorization: Bearer <SANITY_REVALIDATE_SECRET>
 */
export async function POST(req: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "SANITY_REVALIDATE_SECRET not configured" },
      { status: 503 }
    );
  }
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ")
    ? auth.slice("Bearer ".length).trim()
    : null;
  if (token !== secret) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  revalidateTag("portfolio", "default");
  return NextResponse.json({ ok: true, revalidated: "portfolio" });
}
