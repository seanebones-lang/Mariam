import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";

/**
 * Public project id (same value as NEXT_PUBLIC_SANITY_PROJECT_ID).
 * Hosted Studio is built with Vite; `NEXT_PUBLIC_*` is not reliably inlined
 * there, and the old string fallback contained `_` which Sanity rejects.
 */
const SANITY_PROJECT_ID = "ug5rrbfw";

const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";

export default defineConfig({
  name: "mbb-site",
  title: "Mari Belle Bones — site content",
  projectId: SANITY_PROJECT_ID,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Site content")
          .items([
            S.documentTypeListItem("portfolioPiece").title("Portfolio"),
            S.documentTypeListItem("flashPiece").title("Flash (shop)"),
            S.documentTypeListItem("tourStop").title("Tour / guest spots"),
            S.documentTypeListItem("aftercarePage").title("Aftercare page"),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
