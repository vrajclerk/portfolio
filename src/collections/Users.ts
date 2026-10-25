import type { CollectionConfig } from "payload";
import { authenticated } from "@/access/authenticated";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    // Prevent brute force attacks with account locking
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // 10 minutes
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "role"],
  },
  access: {
    admin: ({ req: { user } }) => Boolean(user),
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
    unlock: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Name",
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "admin",
      options: [
        {
          label: "Admin",
          value: "admin",
        },
      ],
      access: {
        update: ({ req: { user } }) => Boolean(user),
      },
    },
  ],
};
