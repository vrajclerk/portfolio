import type { CollectionConfig } from "payload";
import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";
import { formatSlug } from "@/utilities/slugify";

export const Tags: CollectionConfig = {
  slug: "tags",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "updatedAt"],
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Name",
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
            if (data?.name && typeof data.name === "string") {
              return formatSlug(data.name);
            }
            return value;
          },
        ],
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
    },
  ],
};
