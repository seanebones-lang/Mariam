import { defineField, defineType } from "sanity";

export default defineType({
  name: "aftercarePage",
  title: "Aftercare page",
  type: "document",
  description:
    "Create a single published document to replace the default aftercare copy on the site.",
  fields: [
    defineField({
      name: "kicker",
      title: "Eyebrow label",
      type: "string",
      initialValue: "Healing",
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      initialValue: "Saniderm aftercare",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro paragraph",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bullets",
      title: "Care tips (bullets)",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "emailSectionTitle",
      title: "Email section title",
      type: "string",
      initialValue: "Email timeline",
    }),
    defineField({
      name: "emailSectionIntro",
      title: "Email section intro",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "disclaimer",
      title: "Disclaimer",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "policiesLinkLabel",
      title: "Footer link label",
      type: "string",
      initialValue: "Studio policies",
    }),
    defineField({
      name: "policiesHref",
      title: "Footer link URL",
      type: "string",
      description: "Path or full URL, e.g. /faq",
      initialValue: "/faq",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Aftercare page", subtitle: "Single page content" };
    },
  },
});
