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
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
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

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

// ---------------------------------------------------------------------------
// Dynamic Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings.siteName || "Developer Portfolio";
  const siteUrl = settings.siteUrl || "http://localhost:3000";
  const defaultDesc =
    settings.defaultDescription ||
    "Software engineer portfolio specializing in backend systems, TypeScript architectures, and modern web applications.";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      template: `%s | ${siteName}`,
      default: siteName,
    },
    description: defaultDesc,
    alternates: {
      canonical: "/",
      types: {
        "application/rss+xml": "/feed.xml",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName,
      title: siteName,
      description: defaultDesc,
      url: siteUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: defaultDesc,
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
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        {/* Inline script to prevent theme flash; light theme is default */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');if(s==='dark'){document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','dark');}else{document.documentElement.classList.remove('dark');document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} flex min-h-full flex-col font-sans antialiased`}
      >
        {/* Skip to main content link for keyboard and screen reader accessibility (WCAG 2.2 AA) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-background focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent"
        >
          Skip to main content
        </a>

        <div className="flex min-h-screen flex-col bg-background text-foreground">
          <Suspense fallback={<div className="h-16 w-full border-b border-border/70" />}>
            <Header siteName={siteSettings.siteName} />
          </Suspense>
          <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer siteSettings={siteSettings} />
        </div>
      </body>
    </html>
  );
}
