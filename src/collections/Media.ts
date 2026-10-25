import type { CollectionConfig } from "payload";
import path from "path";
import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: "alt",
    defaultColumns: ["filename", "alt", "mimeType", "filesize", "updatedAt"],
  },
  upload: {
    staticDir: path.resolve(process.cwd(), "media"),
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/gif",
      "application/pdf",
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Alt Text",
      admin: {
        description:
          "Required for non-decorative images for accessibility (WCAG AA).",
      },
      validate: (value: unknown, { siblingData }: { siblingData?: Record<string, unknown> }) => {
        const isDecorative = Boolean(siblingData?.decorative);
        if (!isDecorative && (!value || typeof value !== "string" || value.trim().length === 0)) {
          return "Alt text is required for non-decorative images.";
        }
        return true;
      },
    },
    {
      name: "decorative",
      type: "checkbox",
      label: "Decorative Image",
      defaultValue: false,
      admin: {
        description:
          "Mark true if this image conveys no information and is purely decorative.",
      },
    },
    {
      name: "caption",
      type: "text",
      label: "Caption",
    },
    {
      name: "credit",
      type: "text",
      label: "Credit / Attribution",
    },
  ],
};
