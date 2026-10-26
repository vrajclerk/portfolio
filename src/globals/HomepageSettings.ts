import type { GlobalConfig } from "payload";
import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";
import { revalidateHomepageAfterChange } from "@/utilities/revalidate";

export const HomepageSettings: GlobalConfig = {
  slug: "homepage-settings",
  access: {
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateHomepageAfterChange],
  },
  fields: [
    {
      name: "heroHeadline",
      type: "text",
      label: "Hero Headline",
      defaultValue: "Full-Stack Software Engineer",
    },
    {
      name: "heroSubheadline",
      type: "textarea",
      label: "Hero Subheadline",
    },
    {
      name: "featuredProjects",
      type: "relationship",
      relationTo: "projects",
      hasMany: true,
      maxRows: 6,
      label: "Featured Projects",
      admin: {
        description: "Select up to 6 projects to spotlight on the homepage.",
      },
    },
    {
      name: "featuredPosts",
      type: "relationship",
      relationTo: "posts",
      hasMany: true,
      maxRows: 6,
      label: "Featured Posts",
      admin: {
        description: "Select up to 6 articles to spotlight on the homepage.",
      },
    },
    {
      name: "sectionsVisibility",
      type: "group",
      label: "Section Visibility",
      fields: [
        {
          name: "showProjects",
          type: "checkbox",
          label: "Show Projects Section",
          defaultValue: true,
        },
        {
          name: "showPosts",
          type: "checkbox",
          label: "Show Writing / Posts Section",
          defaultValue: true,
        },
        {
          name: "showSkills",
          type: "checkbox",
          label: "Show Skills Section",
          defaultValue: true,
        },
        {
          name: "showContact",
          type: "checkbox",
          label: "Show Contact Section",
          defaultValue: true,
        },
      ],
    },
  ],
};
