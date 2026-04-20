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

**Mari never needs code or Vercel to change photos or copy.** She uses **Sanity Studio** (browser). Images and text live in Sanity’s content lake and CDN; this Next site only **reads** them via the API.

### One-time setup (you or a dev)

1. In [sanity.io/manage](https://www.sanity.io/manage), create or open the project (e.g. **MBB Tattoos**). Copy the **Project ID** from the project URL or **Project → Settings** (short id, e.g. `xxxxxxxx`).
2. Ensure a **dataset** exists (default is often `production`).
3. In this repo, add to **`.env.local`** (and the same public vars on **Vercel** for the live site):

   - `NEXT_PUBLIC_SANITY_PROJECT_ID` — project id from the dashboard  
   - `NEXT_PUBLIC_SANITY_DATASET` — usually `production`  
   - `SANITY_API_READ_TOKEN` — **API → Tokens** in manage; create a **read** token for the dataset (the site uses it server-side only)

4. **Deploy the schema** (defines “Portfolio piece” in the dataset):

   ```bash
   npm run sanity:schemas
   ```

5. **Deploy Studio** so the dashboard **Studios** tab is no longer empty and Mari has a real CMS URL. From the repo (with the same env in `.env.local`):

   ```bash
   npx sanity login
   npm run sanity:deploy
   ```

   First run prompts for a hostname (e.g. `mbb-tattoos` → `https://mbb-tattoos.sanity.studio`). After that, **invite Mari** under **Project → Members** with role **Editor** (or **Administrator** if she should manage tokens too).

6. **Optional — updates on the public site within ~seconds:** set `SANITY_REVALIDATE_SECRET` on Vercel, then in manage add a **Webhook** (HTTP POST) to `https://<your-domain>/api/revalidate/sanity` with header `Authorization: Bearer <SANITY_REVALIDATE_SECRET>`. Without it, the site still updates on the cache window in `lib/get-portfolio.ts` (or after redeploy).

### Mari’s workflow (ongoing)

1. Open the hosted Studio URL from step 5 (or from **Studios** in manage).  
2. Create **Portfolio piece** documents: upload **Image**, fill **Alt text**, optional **Outbound link**, set **Order** (lower = earlier in the grid).  
3. **Publish** each document. The live site shows **published** content only.

**Local Studio** (optional, for you): `npm run sanity:dev` with the same env vars.

Instagram env vars are **not** used for the portfolio grid anymore; they remain optional for future use.

## Security

If an API key was ever pasted in chat or committed by mistake, **rotate it immediately** in the provider console (xAI, Square, etc.). `.env.local` is gitignored; only `.env.example` is tracked.

## Deploy

Vercel: link repo, add environment variables from `.env.example`, connect Neon + Blob via Marketplace, set `CRON_SECRET`, point Square webhook URL to `https://<your-domain>/api/square/webhook` (must match the notification URL used for signature verification).
