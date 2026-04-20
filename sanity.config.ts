import { resolve } from "node:path";
import { config } from "dotenv";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ?? "";
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";

export default defineConfig({
  name: "mbb-site",
  title: "Mari Belle Bones — site content",
  projectId: projectId || "missing-env-set-NEXT_PUBLIC_SANITY_PROJECT_ID",
  dataset,
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
