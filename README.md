# Mari Belle Bones — MBB site

Next.js 16 (App Router), React 19, Tailwind v4, Drizzle + Neon, Square (deposits / gift cards), xAI Grok + TTS concierge, **Sanity** portfolio CMS, Resend-ready aftercare cron.

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

## Sanity (portfolio)

Mari edits **Portfolio piece** documents in [Sanity](https://www.sanity.io/manage) (create a project, invite her as Editor). The site reads published pieces on the home page and `/portfolio`.

1. Create a project + dataset (e.g. `production`).
2. Copy `.env.example` Sanity variables into `.env.local` and Vercel:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET` (usually `production`)
   - `SANITY_API_READ_TOKEN` (read token from **sanity.io/manage → API** — recommended even for public datasets)
3. From the repo root, deploy the content schema to that dataset:

   ```bash
   npm run sanity:schemas
   ```

4. **Optional — fast updates:** set `SANITY_REVALIDATE_SECRET` in Vercel, then add a Sanity **webhook** (HTTP POST) to `https://<your-domain>/api/revalidate/sanity` with header `Authorization: Bearer <SANITY_REVALIDATE_SECRET>`. Otherwise the portfolio cache revalidates on the interval set in `lib/get-portfolio.ts` (or on redeploy).

5. **Local Studio** (optional): `npm run sanity:dev` — requires the same env vars.

Instagram env vars are **not** used for the portfolio grid anymore; they remain optional for future use.

## Security

If an API key was ever pasted in chat or committed by mistake, **rotate it immediately** in the provider console (xAI, Square, etc.). `.env.local` is gitignored; only `.env.example` is tracked.

## Deploy

Vercel: link repo, add environment variables from `.env.example`, connect Neon + Blob via Marketplace, set `CRON_SECRET`, point Square webhook URL to `https://<your-domain>/api/square/webhook` (must match the notification URL used for signature verification).
