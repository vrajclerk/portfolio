import type { GlobalConfig } from "payload";
import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: "siteName",
      type: "text",
      required: true,
      defaultValue: "Developer Portfolio",
      label: "Site Name",
    },
    {
      name: "siteUrl",
      type: "text",
      required: true,
      defaultValue: "http://localhost:3000",
      label: "Site URL",
      admin: {
        description: "Canonical site base URL (e.g. https://yourname.vercel.app)",
      },
    },
    {
      name: "defaultDescription",
      type: "textarea",
      label: "Default Meta Description",
      admin: {
        description: "Fallback description used when a page does not specify its own.",
      },
    },
    {
      name: "defaultSocialImage",
      type: "upload",
      relationTo: "media",
      label: "Default Social Share Image",
      admin: {
        description: "Fallback Open Graph image for the site.",
      },
    },
    {
      name: "socialLinks",
      type: "array",
      label: "Social Links",
      labels: {
        singular: "Social Link",
        plural: "Social Links",
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          label: "Platform / Label (e.g. GitHub, LinkedIn)",
        },
        {
          name: "url",
          type: "text",
          required: true,
          label: "Profile URL",
        },
      ],
    },
    {
      name: "publicEmail",
      type: "text",
      label: "Public Contact Email",
      admin: {
        description: "Optional public email address displayed on the site.",
      },
    },
  ],
};
