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

## Sanity (portfolio, flash, tour, aftercare)

**Mari never needs code or Vercel to change most marketing content.** She uses **Sanity Studio** (browser). The site reads **published** documents via the API:

| Studio type | What it drives |
|---------------|------------------|
| **Portfolio piece** | Home + `/portfolio` grids |
| **Flash piece** | `/flash` shop (image, price, slug URL). Claims/deposits still use Postgres; `flash_claims.flash_piece_id` may be a Sanity **slug** or a legacy DB id. |
| **Guest spot (tour)** | Home tour strip + `/tour` (replaces Neon `tour_dates` when at least one published stop exists). |
| **Aftercare page** | `/aftercare` copy when **one** published document exists; otherwise the built-in default text is shown. |

If Sanity has **no** tour rows, the app falls back to **Neon `tour_dates`** (and `/admin` can still add those). If Sanity has **no** flash pieces, the app falls back to **Neon `flash_pieces`** / demo seeds.

### One-time setup (you or a dev)

1. In [sanity.io/manage](https://www.sanity.io/manage), create or open the project (e.g. **MBB Tattoos**). Copy the **Project ID** from the project URL or **Project → Settings** (short id, e.g. `xxxxxxxx`).
2. Ensure a **dataset** exists (default is often `production`).
3. In this repo, add to **`.env.local`** (and the same public vars on **Vercel** for the live site). The Sanity CLI (`sanity:schemas`, `sanity:deploy`, `sanity:dev`) **loads `.env.local` via `sanity.cli.ts`** — you do not need a separate `.env` for Sanity unless you prefer it.

   - `NEXT_PUBLIC_SANITY_PROJECT_ID` — project id from the dashboard  
   - `NEXT_PUBLIC_SANITY_DATASET` — usually `production`  
   - `SANITY_API_READ_TOKEN` — **API → Tokens** in manage; create a **read** token for the dataset (the site uses it server-side only)

4. **Deploy the schema** (defines Portfolio piece, Flash piece, Guest spot, Aftercare page in the dataset):

   ```bash
   npm run sanity:schemas
   ```

5. **Deploy Studio** so the dashboard **Studios** tab is no longer empty and Mari has a real CMS URL. From the repo (with the same env in `.env.local`):

   ```bash
   npx sanity login
   npm run sanity:deploy
   ```

   First run prompts for a hostname (e.g. `mbb-tattoos` → `https://mbb-tattoos.sanity.studio`). After that, **invite Mari** under **Project → Members** with role **Editor** (or **Administrator** if she should manage tokens too).

6. **Optional — updates on the public site within ~seconds:** set `SANITY_REVALIDATE_SECRET` on Vercel, then in manage add a **Webhook** (HTTP POST) to `https://<your-domain>/api/revalidate/sanity` with header `Authorization: Bearer <SANITY_REVALIDATE_SECRET>`. That route revalidates portfolio, flash, tour, and aftercare tags. Without it, the site still updates on the ~3 minute cache (or after redeploy).

7. **Postgres (existing deployments):** if `flash_claims` was created with a foreign key to `flash_pieces`, drop that constraint once so holds can reference Sanity-only slugs (constraint name varies — check your DB or a recent `drizzle-kit` migration).

### Mari’s workflow (ongoing)

1. Open the hosted Studio URL from step 5 (or from **Studios** in manage).  
2. Create documents as needed: **Portfolio piece** (image + alt + order), **Flash piece** (image, price in cents, **URL slug** for `/flash/your-slug`, availability), **Guest spot (tour)** (city, dates, optional booking link), **Aftercare page** (keep a **single** published doc for live copy).  
3. **Publish** each document. The live site shows **published** content only.

**Local Studio** (optional, for you): `npm run sanity:dev` with the same env vars.

Instagram env vars are **not** used for the portfolio grid anymore; they remain optional for future use.

## Security

If an API key was ever pasted in chat or committed by mistake, **rotate it immediately** in the provider console (xAI, Square, etc.). `.env.local` is gitignored; only `.env.example` is tracked.

## Deploy

Vercel: link repo, add environment variables from `.env.example`, connect Neon + Blob via Marketplace, set `CRON_SECRET`, point Square webhook URL to `https://<your-domain>/api/square/webhook` (must match the notification URL used for signature verification).
