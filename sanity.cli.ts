import { resolve } from "node:path";
import { config } from "dotenv";
import { defineCliConfig } from "sanity/cli";

// Sanity CLI does not load .env.local by default (Next.js does). Load both.
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ?? "";
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";

if (!projectId) {
  throw new Error(
    "Set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local or .env before running sanity deploy / sanity schemas."
  );
}

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
});
