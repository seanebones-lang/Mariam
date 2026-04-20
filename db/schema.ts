import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const bookings = pgTable("bookings", {
  id: text("id").primaryKey(),
  kind: text("kind").notNull(), // consultation | tattoo
  status: text("status").notNull().default("pending_deposit"),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  clientPhone: text("client_phone"),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  intake: jsonb("intake").$type<Record<string, unknown>>().notNull().default({}),
  referenceUrls: jsonb("reference_urls").$type<string[]>().notNull().default([]),
  quotedPriceCents: integer("quoted_price_cents"),
  quoteExpiresAt: timestamp("quote_expires_at", { withTimezone: true }),
  depositCents: integer("deposit_cents").notNull().default(0),
  squarePaymentId: text("square_payment_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const flashPieces = pgTable("flash_pieces", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  priceCents: integer("price_cents").notNull(),
  imageUrl: text("image_url").notNull(),
  available: boolean("available").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const flashClaims = pgTable("flash_claims", {
  id: text("id").primaryKey(),
  /** Postgres flash id or Sanity flash slug (`slug.current`). */
  flashPieceId: text("flash_piece_id").notNull(),
  clientEmail: text("client_email").notNull(),
  clientName: text("client_name").notNull(),
  status: text("status").notNull().default("hold"), // hold | paid | expired | released
  holdUntil: timestamp("hold_until", { withTimezone: true }).notNull(),
  squarePaymentId: text("square_payment_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const aftercareSubscribers = pgTable("aftercare_subscribers", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  tattooDate: timestamp("tattoo_date", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  lastSentDay: integer("last_sent_day").notNull().default(-1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const aftercareEvents = pgTable("aftercare_events", {
  id: text("id").primaryKey(),
  subscriberId: text("subscriber_id")
    .notNull()
    .references(() => aftercareSubscribers.id),
  dayKey: integer("day_key").notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
});

export const giftCardOrders = pgTable("gift_card_orders", {
  id: text("id").primaryKey(),
  recipientEmail: text("recipient_email").notNull(),
  amountCents: integer("amount_cents").notNull(),
  status: text("status").notNull().default("pending"),
  squarePaymentId: text("square_payment_id"),
  squareGiftCardId: text("square_gift_card_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const tourDates = pgTable("tour_dates", {
  id: text("id").primaryKey(),
  city: text("city").notNull(),
  venue: text("venue"),
  startsOn: timestamp("starts_on", { withTimezone: true }).notNull(),
  endsOn: timestamp("ends_on", { withTimezone: true }),
  bookingUrl: text("booking_url"),
  notes: text("notes"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const consents = pgTable("consents", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id").references(() => bookings.id),
  signerName: text("signer_name").notNull(),
  signerEmail: text("signer_email").notNull(),
  ipHash: text("ip_hash").notNull(),
  bodyVersion: text("body_version").notNull().default("v1"),
  signedAt: timestamp("signed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const waitlistEntries = pgTable("waitlist_entries", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  desiredDate: timestamp("desired_date", { withTimezone: true }).notNull(),
  notified: boolean("notified").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: text("id").primaryKey(),
  quote: text("quote").notNull(),
  author: text("author").notNull(),
  source: text("source").notNull().default("manual"), // manual | google
  sortOrder: integer("sort_order").notNull().default(0),
});
