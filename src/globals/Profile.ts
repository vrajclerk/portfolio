import type { GlobalConfig } from "payload";
import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";
import { revalidateProfileAfterChange } from "@/utilities/revalidate";

export const Profile: GlobalConfig = {
  slug: "profile",
  access: {
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateProfileAfterChange],
  },
  fields: [
    {
      name: "headline",
      type: "text",
      label: "Professional Headline",
      admin: {
        description: "One-line professional summary (e.g. Full-Stack Engineer specializing in TypeScript and Distributed Systems).",
      },
    },
    {
      name: "shortBio",
      type: "richText",
      label: "Short Biography",
      admin: {
        description: "Factual biography for the About section and homepage.",
      },
    },
    {
      name: "profileImage",
      type: "upload",
      relationTo: "media",
      label: "Profile Photo",
    },
    {
      name: "resumeFile",
      type: "upload",
      relationTo: "media",
      label: "Resume / CV PDF",
    },
    {
      name: "experience",
      type: "array",
      label: "Work Experience",
      labels: {
        singular: "Experience Entry",
        plural: "Experience Entries",
      },
      fields: [
        {
          name: "organization",
          type: "text",
          required: true,
          label: "Organization / Company",
        },
        {
          name: "role",
          type: "text",
          required: true,
          label: "Role / Title",
        },
        {
          name: "startDate",
          type: "date",
          required: true,
          label: "Start Date",
          admin: {
            date: {
              pickerAppearance: "monthOnly",
            },
          },
        },
        {
          name: "endDate",
          type: "date",
          label: "End Date",
          admin: {
            date: {
              pickerAppearance: "monthOnly",
            },
          },
        },
        {
          name: "current",
          type: "checkbox",
          label: "Current Role",
          defaultValue: false,
        },
        {
          name: "summary",
          type: "textarea",
          label: "Summary / Responsibilities",
        },
      ],
    },
    {
      name: "skills",
      type: "array",
      label: "Skills by Category",
      labels: {
        singular: "Skill Category",
        plural: "Skill Categories",
      },
      fields: [
        {
          name: "category",
          type: "text",
          required: true,
          label: "Category Name (e.g. Languages, Frameworks, Infrastructure)",
        },
        {
          name: "items",
          type: "array",
          required: true,
          label: "Skills in this Category",
          fields: [
            {
              name: "name",
              type: "text",
              required: true,
              label: "Skill Name",
            },
            {
              name: "context",
              type: "text",
              label: "Practical Context / Usage",
              admin: {
                description:
                  "Practical experience context (e.g. 'Production Next.js systems', 'Neon serverless Postgres').",
              },
            },
          ],
        },
      ],
    },
    {
      name: "socialLinks",
      type: "array",
      label: "Professional & Social Links",
      fields: [
        {
          name: "platform",
          type: "text",
          required: true,
          label: "Platform",
        },
        {
          name: "url",
          type: "text",
          required: true,
          label: "URL",
        },
      ],
    },
  ],
};
