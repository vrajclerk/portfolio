import React from "react";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/cms";
import { generateBreadcrumbSchema } from "@/utilities/structuredData";
import { ContactForm } from "./ContactForm";
import { CopyEmailButton } from "@/components/CopyEmailButton";

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const siteName = siteSettings.siteName || "Vraj Clerk";
  const title = "Contact & Engineering Inquiries";
  const description =
    "Direct contact channels, professional inquiries, and technical collaboration for Full-Stack & Backend Software Engineer Vraj Clerk.";

  return {
    title,
    description,
    alternates: {
      canonical: "/contact",
    },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url: "/contact",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
    },
  };
}

export default async function ContactPage() {
  const siteSettings = await getSiteSettings();
  const publicEmail = siteSettings.publicEmail || "vrajclerk04@gmail.com";
  const socialLinks = siteSettings.socialLinks || [];
  const siteUrl = siteSettings.siteUrl || "http://localhost:3000";

  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: "Home", path: "/" },
      { name: "Contact", path: "/contact" },
    ],
    siteUrl
  );

  return (
    <div className="relative overflow-hidden py-12 md:py-20">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ---------------------------------------------------------------------
       * Dynamic Lighting & Ambient Aurora Atmosphere
       * --------------------------------------------------------------------- */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-pattern opacity-50 dark:opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_80%)]"
        aria-hidden="true"
      />
      <div
        className="animate-aurora pointer-events-none absolute top-12 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-accent/15 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="animate-aurora pointer-events-none absolute top-96 right-10 -z-10 h-[400px] w-[400px] rounded-full bg-sky-400/10 dark:bg-amber-500/10 blur-[100px] [animation-delay:3s]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ===================================================================
         * PAGE HEADER & INQUIRY BANNER
         * =================================================================== */}
        <div className="mb-14 sm:mb-20 text-left max-w-3xl">
          {/* Eyebrow Kicker Pill with Live Beacon */}
          <div className="animate-fade-in-up inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-card/85 dark:bg-card/60 px-3.5 py-1.5 text-xs text-foreground shadow-xs backdrop-blur-md transition-all duration-300 hover:border-accent/40 hover:shadow-xs">
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-semibold text-foreground tracking-tight">
              Direct Inquiries
            </span>
            <span className="h-3 w-px bg-border/80" />
            <span className="text-muted-foreground font-medium hidden sm:inline">
              Fast Response (&lt; 24h)
            </span>
          </div>

          {/* Display Headline with Fraunces Serif Accent */}
          <h1 className="animate-fade-in-up delay-100 mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.08] text-balance">
            Let&apos;s discuss an engineering{" "}
            <span className="font-serif italic font-normal text-accent underline decoration-accent/30 decoration-wavy underline-offset-8 inline-block">
              collaboration.
            </span>
          </h1>

          <p className="animate-fade-in-up delay-200 mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl text-balance">
            Always open to connecting with fellow engineers, technology teams, and discussing technical architectures, impactful engineering challenges, or career opportunities. Feel free to reach out directly.
          </p>
        </div>

        {/* ===================================================================
         * ASYMMETRIC GRID: TELEMETRY CHANNELS & INTERACTIVE FORM (5 / 7 Split)
         * =================================================================== */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Communication Channels & Telemetry (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Card 1: Direct Email Channel */}
            <div className="rounded-3xl border border-border/80 bg-card/80 p-6 sm:p-7 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-accent hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Primary Channel
                </span>
                <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                  DIRECT INBOX
                </span>
              </div>

              <h2 className="text-lg font-bold text-foreground mb-1.5">
                Direct Email Communication
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed mb-5">
                Direct email is the fastest and most reliable way for technical inquiries, engineering discussions, and professional correspondence.
              </p>

              <div>
                <CopyEmailButton email={publicEmail} className="w-full justify-center py-2.5" />
              </div>
            </div>

            {/* Card 2: Professional Telemetry & Status */}
            <div className="rounded-3xl border border-border/80 bg-card/80 p-6 sm:p-7 shadow-xs backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Professional Status
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 border border-accent/30 px-2 py-0.5 text-[10px] font-mono font-bold text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  EMPLOYED
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-start justify-between gap-3 py-2 border-b border-border/60">
                  <span className="text-muted-foreground shrink-0">Specialization</span>
                  <span className="font-semibold text-foreground text-right">
                    Full-Stack / Backend Systems
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3 py-2 border-b border-border/60">
                  <span className="text-muted-foreground shrink-0">Notice Period</span>
                  <span className="font-semibold text-foreground text-right">
                    2 Months (Standard)
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3 py-2 border-b border-border/60">
                  <span className="text-muted-foreground shrink-0">Work Location</span>
                  <span className="font-semibold text-foreground text-right">
                    Remote / Hybrid / Relocation
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3 py-2 border-b border-border/60">
                  <span className="text-muted-foreground shrink-0">Current Base</span>
                  <span className="font-semibold text-foreground text-right">
                    Surat, Gujarat, India
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3 pt-2">
                  <span className="text-muted-foreground shrink-0">Response SLA</span>
                  <span className="font-semibold text-accent text-right">
                    &lt; 24h (Business Days)
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Professional Profiles & Verification */}
            <div className="rounded-3xl border border-border/80 bg-card/80 p-6 sm:p-7 shadow-xs backdrop-blur-md">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent flex items-center gap-2 mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Verified Profiles
              </span>

              <div className="space-y-2.5">
                {socialLinks.map((link) => (
                  <a
                    key={link.id || link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card/60 p-3.5 text-xs font-mono transition-all duration-200 hover:border-accent hover:bg-card hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-accent font-bold">●</span>
                      <span className="font-semibold text-foreground">{link.label}</span>
                    </div>
                    <span className="text-muted-foreground text-[11px] group-hover:text-accent transition-colors flex items-center gap-1 min-w-0">
                      <span className="truncate max-w-[130px] xs:max-w-[170px] sm:max-w-none">{link.url.replace(/^https?:\/\/(www\.)?/, "")}</span>
                      <span className="shrink-0">↗</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive High-End Contact Form (7 Cols) */}
          <div className="lg:col-span-7">
            <ContactForm recipientEmail={publicEmail} />
          </div>

        </div>
      </div>
    </div>
  );
}
