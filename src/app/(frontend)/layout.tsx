/**
 * Frontend route-group layout.
 *
 * Imports the full Tailwind CSS stylesheet (including preflight) that applies
 * only to public-facing pages grouped under (frontend). The Payload admin
 * uses a separate CSS entry without preflight (D5).
 *
 * Sets up Google Fonts via next/font and provides site-wide layout structure
 * including Header and Footer powered by SiteSettings global.
 */

import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteSettings } from "@/lib/cms";
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
// Dynamic Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings.siteName || "Developer Portfolio";
  const defaultDesc =
    settings.defaultDescription ||
    "Software engineer portfolio specializing in backend systems, TypeScript architectures, and modern web applications.";

  return {
    metadataBase: new URL(settings.siteUrl || "http://localhost:3000"),
    title: {
      template: `%s | ${siteName}`,
      default: siteName,
    },
    description: defaultDesc,
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName,
    },
  };
}

// ---------------------------------------------------------------------------
// Layout component
// ---------------------------------------------------------------------------

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteSettings = await getSiteSettings();

  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-full flex-col font-sans antialiased`}
      >
        <div className="flex min-h-screen flex-col bg-background text-foreground">
          <Suspense fallback={<div className="h-16 w-full border-b border-border/70" />}>
            <Header siteName={siteSettings.siteName} />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer siteSettings={siteSettings} />
        </div>
      </body>
    </html>
  );
}
