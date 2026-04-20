/**
 * Canonical booking URL (PrimeCraft). Override with NEXT_PUBLIC_BOOKING_URL.
 */
const DEFAULT_BOOKING =
  "https://primecraft.mothership-ai.com/p/mbbtattoos";

export function getBookingUrl(): string {
  const raw = process.env.NEXT_PUBLIC_BOOKING_URL?.trim();
  if (raw) return raw;
  return DEFAULT_BOOKING;
}

export const BOOKING_URL = getBookingUrl();
