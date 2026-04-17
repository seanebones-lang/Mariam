# Mari Belle Bones — MBB site

Next.js 16 (App Router), React 19, Tailwind v4, Drizzle + Neon, Square (deposits / gift cards), xAI Grok + TTS concierge, Instagram Graph portfolio, Resend-ready aftercare cron.

## Local development

```bash
npm install
cp .env.example .env.local
# Add XAI_API_KEY, DATABASE_URL (Neon), Square sandbox keys when ready
npm run dev
```

- **Admin**: `/admin` — set `ADMIN_PASSWORD` (and optionally `ADMIN_SESSION_SECRET`) in `.env.local`.
- **Cron**: `/api/cron/aftercare` and `/api/cron/flash-holds` expect `Authorization: Bearer $CRON_SECRET` (Vercel Cron sends this when configured in the dashboard to match).

## Database

```bash
npm run db:push   # push schema to Neon (requires DATABASE_URL)
```

## Security

If an API key was ever pasted in chat or committed by mistake, **rotate it immediately** in the provider console (xAI, Square, etc.). `.env.local` is gitignored; only `.env.example` is tracked.

## Deploy

Vercel: link repo, add environment variables from `.env.example`, connect Neon + Blob via Marketplace, set `CRON_SECRET`, point Square webhook URL to `https://<your-domain>/api/square/webhook` (must match the notification URL used for signature verification).
