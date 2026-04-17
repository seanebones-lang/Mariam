import { createHash } from "node:crypto";

export function hashIp(ip: string | null) {
  const salt = process.env.ADMIN_SESSION_SECRET ?? "mbb-dev-salt";
  return createHash("sha256")
    .update(`${salt}:${ip ?? "unknown"}`)
    .digest("hex");
}
