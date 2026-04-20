import { defineField, defineType } from "sanity";

export default defineType({
  name: "flashPiece",
  title: "Flash piece",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      description:
        "Used in the shop link /flash/your-slug — keep it short, unique, lowercase.",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "priceCents",
      title: "Price (cents)",
      type: "number",
      description: "e.g. 22000 = $220.00 before deposit.",
      initialValue: 20000,
      validation: (Rule) => Rule.required().integer().min(0),
    }),
    defineField({
      name: "available",
      title: "Available to claim",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "sortOrder",
      title: "Order",
      type: "number",
      description: "Lower numbers appear first in lists.",
      initialValue: 0,
      validation: (Rule) => Rule.integer(),
    }),
  ],
  preview: {
    select: { title: "title", media: "image", slug: "slug.current" },
    prepare({ title, media, slug }) {
      return {
        title: title || "Flash piece",
        subtitle: slug ? `/flash/${slug}` : "",
        media,
      };
    },
  },
  orderings: [
    {
      title: "Sort order",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
});
