/**
 * Frontend route-group layout.
 *
 * Imports the full Tailwind CSS stylesheet (including preflight) that applies
 * only to public-facing pages grouped under (frontend). The Payload admin
 * (Phase 2) will use a separate CSS entry without preflight (D5).
 *
 * Sets up Google Fonts via next/font and provides a configurable site-wide
 * metadata base.
 *
 * TODO (Phase 7): Replace placeholder title and description with real copy.
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

// ---------------------------------------------------------------------------
// Fonts
// ---------------------------------------------------------------------------

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: {
    template: "%s | TODO: Portfolio",
    default: "TODO: Portfolio",
  },
  description:
    "TODO: Developer portfolio — replace this with confirmed bio copy before launch.",
  openGraph: {
    type: "website",
    locale: "en_US",
    // TODO (Phase 5): set `url` and `images` from SiteSettings global.
  },
};

// ---------------------------------------------------------------------------
// Layout component
// ---------------------------------------------------------------------------

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-full flex-col font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
