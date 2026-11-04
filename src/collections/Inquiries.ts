import type { CollectionConfig } from "payload";
import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";

export const Inquiries: CollectionConfig = {
  slug: "inquiries",
  labels: {
    singular: "Inquiry",
    plural: "Inquiries",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "topic", "status", "emailSent", "createdAt"],
    description: "Incoming contact messages, technical collaboration requests, and career inquiries.",
  },
  access: {
    // Anyone can submit an inquiry via the public contact form
    create: anyone,
    // Only authenticated admin can view, update, or delete inquiries
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Sender Name",
    },
    {
      name: "email",
      type: "email",
      required: true,
      label: "Email Address",
    },
    {
      name: "company",
      type: "text",
      label: "Company / Organization",
    },
    {
      name: "topic",
      type: "select",
      label: "Inquiry Topic",
      defaultValue: "collaboration",
      options: [
        { label: "Technical Collaboration", value: "collaboration" },
        { label: "Career & Opportunities", value: "opportunities" },
        { label: "Architecture / Systems", value: "architecture" },
        { label: "General Inquiry", value: "general" },
      ],
    },
    {
      name: "subject",
      type: "text",
      label: "Subject",
    },
    {
      name: "message",
      type: "textarea",
      required: true,
      label: "Message Content",
    },
    {
      name: "status",
      type: "select",
      label: "Review Status",
      defaultValue: "new",
      admin: {
        position: "sidebar",
      },
      options: [
        { label: "New (Unread)", value: "new" },
        { label: "Read", value: "read" },
        { label: "Replied", value: "replied" },
        { label: "Archived", value: "archived" },
      ],
    },
    {
      name: "emailSent",
      type: "checkbox",
      label: "Notification Email Dispatched",
      defaultValue: false,
      admin: {
        position: "sidebar",
        readOnly: true,
      },
    },
    {
      name: "emailError",
      type: "text",
      label: "Email Dispatch Log / Error",
      admin: {
        position: "sidebar",
        readOnly: true,
      },
    },
  ],
  timestamps: true,
};
