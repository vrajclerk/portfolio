/**
 * Root layout — minimal shell that defines <html> and <body>.
 *
 * Do NOT import globals.css or Tailwind here. The full Tailwind stylesheet
 * (including preflight) is imported only in src/app/(frontend)/layout.tsx so
 * that the Payload admin UI (Phase 2) can provide its own CSS without
 * preflight conflicts (DECISIONS_AND_ASSUMPTIONS.md §D5).
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  // Default title template — page-level metadata overrides the `title` segment.
  title: {
    template: "%s | TODO: Portfolio",
    default: "TODO: Portfolio", // replaced with real name in Phase 7
  },
  description: "TODO: Developer portfolio — replace with confirmed bio copy.",
  // Prevent search engines from indexing until Phase 7 review.
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
