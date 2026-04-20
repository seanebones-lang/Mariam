import { defineField, defineType } from "sanity";

export default defineType({
  name: "portfolioPiece",
  title: "Portfolio piece",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title (optional, for studio list)",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe the piece for screen readers and SEO.",
      validation: (Rule) => Rule.required().min(10).max(200),
    }),
    defineField({
      name: "linkUrl",
      title: "Outbound link (optional)",
      type: "url",
      description: "Instagram post, press, etc. Opens in a new tab.",
    }),
    defineField({
      name: "sortOrder",
      title: "Order",
      type: "number",
      description: "Lower numbers appear first.",
      initialValue: 0,
      validation: (Rule) => Rule.integer(),
    }),
  ],
  preview: {
    select: { title: "title", media: "image", alt: "alt" },
    prepare({ title, media, alt }) {
      return {
        title: title || alt?.slice(0, 48) || "Portfolio piece",
        subtitle: alt,
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
