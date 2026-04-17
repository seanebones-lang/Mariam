const COOKIE = "mbb_admin";

const enc = new TextEncoder();

async function hmacHex(secret: string, message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const buf = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  const bytes = new Uint8Array(buf);
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function toBase64Url(s: string) {
  const b = btoa(s);
  return b.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string) {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  return atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
}

export async function createAdminSessionValue(secret: string) {
  const exp = String(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const sig = await hmacHex(secret, `mbb:${exp}`);
  return toBase64Url(`${exp}.${sig}`);
}

export async function verifyAdminSessionValue(
  secret: string | undefined,
  value: string | undefined
): Promise<boolean> {
  if (!secret || !value) return false;
  let raw: string;
  try {
    raw = fromBase64Url(value);
  } catch {
    return false;
  }
  const dot = raw.indexOf(".");
  if (dot < 0) return false;
  const exp = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  if (Number(exp) < Date.now()) return false;
  const expected = await hmacHex(secret, `mbb:${exp}`);
  if (expected.length !== sig.length) return false;
  let ok = 0;
  for (let i = 0; i < expected.length; i++) {
    ok |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  return ok === 0;
}

export const ADMIN_COOKIE_NAME = COOKIE;
