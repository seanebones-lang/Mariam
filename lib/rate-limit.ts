import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getServerEnv } from "./env";

type LimitResult = { success: boolean; remaining: number };

const memoryBuckets = new Map<string, { count: number; reset: number }>();

function memoryLimit(key: string, limit: number, windowMs: number): LimitResult {
  const now = Date.now();
  const b = memoryBuckets.get(key);
  if (!b || now > b.reset) {
    memoryBuckets.set(key, { count: 1, reset: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }
  if (b.count >= limit) return { success: false, remaining: 0 };
  b.count += 1;
  return { success: true, remaining: limit - b.count };
}

let chatLimiter: Ratelimit | null = null;
let defaultLimiter: Ratelimit | null = null;

function redisFromEnv() {
  const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = getServerEnv();
  if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) return null;
  return new Redis({
    url: UPSTASH_REDIS_REST_URL,
    token: UPSTASH_REDIS_REST_TOKEN,
  });
}

function getChatLimiter() {
  const redis = redisFromEnv();
  if (!redis) return null;
  if (!chatLimiter) {
    chatLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "1 m"),
      prefix: "mbb:chat",
    });
  }
  return chatLimiter;
}

function getDefaultLimiter() {
  const redis = redisFromEnv();
  if (!redis) return null;
  if (!defaultLimiter) {
    defaultLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, "1 m"),
      prefix: "mbb:api",
    });
  }
  return defaultLimiter;
}

export async function limitChat(identifier: string): Promise<LimitResult> {
  const lim = getChatLimiter();
  if (!lim) return memoryLimit(`chat:${identifier}`, 20, 60_000);
  const r = await lim.limit(identifier);
  return { success: r.success, remaining: r.remaining };
}

export async function limitApi(identifier: string): Promise<LimitResult> {
  const lim = getDefaultLimiter();
  if (!lim) return memoryLimit(`api:${identifier}`, 60, 60_000);
  const r = await lim.limit(identifier);
  return { success: r.success, remaining: r.remaining };
}
