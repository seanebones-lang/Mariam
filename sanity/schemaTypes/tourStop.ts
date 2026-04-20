import { defineField, defineType } from "sanity";

export default defineType({
  name: "tourStop",
  title: "Guest spot (tour)",
  type: "document",
  fields: [
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "venue",
      title: "Venue / studio",
      type: "string",
    }),
    defineField({
      name: "startsOn",
      title: "Starts on",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endsOn",
      title: "Ends on (optional)",
      type: "datetime",
    }),
    defineField({
      name: "bookingUrl",
      title: "Booking link",
      type: "url",
      description: "Guest spot booking URL (opens in a new tab).",
    }),
    defineField({
      name: "notes",
      title: "Internal notes",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "sortOrder",
      title: "Order",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.integer(),
    }),
  ],
  preview: {
    select: { city: "city", venue: "venue", startsOn: "startsOn" },
    prepare({ city, venue, startsOn }) {
      const d = startsOn
        ? new Date(startsOn).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "";
      return {
        title: city || "Guest spot",
        subtitle: [venue, d].filter(Boolean).join(" · "),
      };
    },
  },
  orderings: [
    {
      title: "Date (soonest first)",
      name: "startsAsc",
      by: [{ field: "startsOn", direction: "asc" }],
    },
    {
      title: "Sort order",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
});
