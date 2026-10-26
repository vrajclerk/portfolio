import type { CollectionConfig } from "payload";
import { authenticated } from "@/access/authenticated";
import { authenticatedOrPublished } from "@/access/authenticatedOrPublished";
import {
  revalidatePostAfterChange,
  revalidatePostAfterDelete,
} from "@/utilities/revalidate";
import { formatSlug } from "@/utilities/slugify";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "category", "_status", "publishedAt"],
    preview: (doc) => {
      if (doc?.slug && typeof doc.slug === "string") {
        const siteUrl =
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const secret =
          process.env.PAYLOAD_SECRET || process.env.PREVIEW_SECRET || "";
        return `${siteUrl}/api/preview?url=${encodeURIComponent(
          `/blog/${doc.slug}`
        )}&secret=${encodeURIComponent(secret)}`;
      }
      return null;
    },
  },
  hooks: {
    afterChange: [revalidatePostAfterChange],
    afterDelete: [revalidatePostAfterDelete],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: authenticatedOrPublished,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Title",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Slug",
      admin: {
        description: "URL slug generated from title; can be edited manually.",
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (typeof value === "string" && value.length > 0) {
              return formatSlug(value);
            }
            if (data?.title && typeof data.title === "string") {
              return formatSlug(data.title);
            }
            return value;
          },
        ],
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      maxLength: 240,
      label: "Excerpt",
      admin: {
        description: "Short summary for listings and SEO (max 240 characters).",
      },
    },
    {
      name: "content",
      type: "richText",
      required: true,
      label: "Content",
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      label: "Cover Image",
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
      label: "Author",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
      label: "Category",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
      label: "Tags",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "relatedProjects",
      type: "relationship",
      relationTo: "projects",
      hasMany: true,
      label: "Related Projects",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      label: "Publication Date",
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            // Automatically record first publication date if not manually set
            if (siblingData._status === "published" && !value) {
              return new Date().toISOString();
            }
            return value;
          },
        ],
      },
    },
    {
      name: "seo",
      type: "group",
      label: "SEO Overrides",
      fields: [
        {
          name: "title",
          type: "text",
          label: "SEO Title",
        },
        {
          name: "description",
          type: "textarea",
          label: "SEO Description",
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Social Share Image",
        },
      ],
    },
  ],
};
