import type { CollectionConfig } from "payload";
import { authenticated } from "@/access/authenticated";
import { authenticatedOrPublished } from "@/access/authenticatedOrPublished";
import { formatSlug } from "@/utilities/slugify";

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "projectType", "featured", "_status"],
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
      label: "Project Title",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Slug",
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
      name: "summary",
      type: "textarea",
      required: true,
      label: "Short Summary",
      admin: {
        description: "Concise summary for project cards and listings.",
      },
    },
    {
      name: "projectType",
      type: "select",
      required: true,
      label: "Project Type",
      options: [
        { label: "Professional", value: "professional" },
        { label: "Personal", value: "personal" },
        { label: "Open Source", value: "open-source" },
        { label: "Experiment", value: "experiment" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "role",
      type: "text",
      label: "Role",
      admin: {
        description: "Your specific role on the project (e.g. Lead Backend Engineer).",
      },
    },
    {
      name: "contribution",
      type: "richText",
      label: "Contribution",
      admin: {
        description: "Detailed description of your direct contributions and technical decisions.",
      },
    },
    {
      name: "problem",
      type: "richText",
      label: "Problem Statement",
    },
    {
      name: "constraints",
      type: "richText",
      label: "Constraints & Requirements",
    },
    {
      name: "architecture",
      type: "richText",
      label: "Architecture & Technical Approach",
    },
    {
      name: "decisions",
      type: "array",
      label: "Key Technical Decisions",
      labels: {
        singular: "Decision",
        plural: "Decisions",
      },
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          label: "Decision Title",
        },
        {
          name: "context",
          type: "textarea",
          label: "Context / Problem",
        },
        {
          name: "alternatives",
          type: "textarea",
          label: "Alternatives Considered",
        },
        {
          name: "decision",
          type: "textarea",
          label: "Decision Made",
        },
        {
          name: "tradeoffs",
          type: "textarea",
          label: "Tradeoffs & Outcomes",
        },
      ],
    },
    {
      name: "implementation",
      type: "richText",
      label: "Implementation Details",
    },
    {
      name: "testing",
      type: "richText",
      label: "Testing & Quality Assurance",
    },
    {
      name: "outcomes",
      type: "richText",
      label: "Outcomes & Impact",
    },
    {
      name: "lessonsLearned",
      type: "richText",
      label: "Lessons Learned",
    },
    {
      name: "technologies",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
      label: "Technologies Used",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "repositoryUrl",
      type: "text",
      label: "Repository URL",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "liveUrl",
      type: "text",
      label: "Live Demo URL",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      label: "Cover Image",
    },
    {
      name: "gallery",
      type: "relationship",
      relationTo: "media",
      hasMany: true,
      label: "Image Gallery / Screenshots",
    },
    {
      name: "relatedPosts",
      type: "relationship",
      relationTo: "posts",
      hasMany: true,
      label: "Related Blog Posts",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      label: "Featured Project",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "displayOrder",
      type: "number",
      label: "Display Order",
      admin: {
        position: "sidebar",
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
