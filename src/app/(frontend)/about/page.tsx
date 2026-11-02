import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { RichTextRenderer } from "@/components/RichTextRenderer";
import { CtaSection } from "@/components/CtaSection";
import { CopyEmailButton } from "@/components/CopyEmailButton";
import { AboutLocationSection } from "@/components/AboutLocationSection";
import { SkillCard } from "@/components/SkillCard";
import { getProfile, getSiteSettings } from "@/lib/cms";
import {
  generateBreadcrumbSchema,
  generatePersonSchema,
} from "@/utilities/structuredData";

import { fixtureProfile } from "@/lib/fixtures";

export async function generateMetadata(): Promise<Metadata> {
  const [profile, siteSettings] = await Promise.all([
    getProfile(),
    getSiteSettings(),
  ]);

  const title = "About & Experience";
  const description =
    profile.headline ||
    siteSettings.defaultDescription ||
    "Professional background, production engineering experience, and technical philosophies of full-stack developer Vraj Clerk.";

  return {
    title,
    description,
    alternates: {
      canonical: "/about",
    },
    openGraph: {
      title: `${title} | ${siteSettings.siteName || "Vraj Clerk"}`,
      description,
      url: "/about",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteSettings.siteName || "Vraj Clerk"}`,
      description,
    },
  };
}

export default async function AboutPage() {
  const [profile, siteSettings] = await Promise.all([
    getProfile(),
    getSiteSettings(),
  ]);

  const siteUrl = siteSettings.siteUrl || "http://localhost:3000";
  const personSchema = generatePersonSchema({ profile, siteSettings });
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
    ],
    siteUrl
  );

  const experience =
    Array.isArray(profile.experience) && profile.experience.length > 0
      ? profile.experience
      : fixtureProfile.experience || [];
  const skills =
    Array.isArray(profile.skills) && profile.skills.length > 0
      ? profile.skills
      : fixtureProfile.skills || [];
  const bioData = profile.shortBio || fixtureProfile.shortBio;
  const socialLinks = profile.socialLinks || siteSettings.socialLinks || [];
  const publicEmail = siteSettings.publicEmail || "vrajclerk04@gmail.com";

  const avatarUrl =
    profile.profileImage &&
    typeof profile.profileImage === "object" &&
    "url" in profile.profileImage &&
    profile.profileImage.url
      ? (profile.profileImage.url as string)
      : "/media/IMG_20240306_180503_775.webp";

  return (
    <div className="relative overflow-hidden py-12 md:py-20">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ---------------------------------------------------------------------
       * Ambient Dynamic Atmosphere & Grid Background
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
         * PAGE HEADER & IDENTITY HERO BANNER
         * =================================================================== */}
        <div className="mb-14 sm:mb-20 text-left max-w-3xl">
          {/* Eyebrow Kicker Pill */}
          <div className="animate-fade-in-up inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-card/85 dark:bg-card/60 px-3.5 py-1.5 text-xs text-foreground shadow-xs backdrop-blur-md transition-all duration-300 hover:border-accent/40 hover:shadow-xs">
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-semibold text-foreground tracking-tight">
              Professional Background
            </span>
            <span className="h-3 w-px bg-border/80" />
            <span className="text-muted-foreground font-medium hidden sm:inline">
              Python &amp; Backend Engineering
            </span>
          </div>

          {/* Display Headline with Fraunces Serif Accent */}
          <h1 className="animate-fade-in-up delay-100 mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.08] text-balance">
            Architecting resilient systems with{" "}
            <span className="font-serif italic font-normal text-accent underline decoration-accent/30 decoration-wavy underline-offset-8 inline-block">
              engineering discipline.
            </span>
          </h1>

          <p className="animate-fade-in-up delay-200 mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl text-balance">
            {profile.headline ||
              "Full-stack software engineer specializing in TypeScript, PostgreSQL, and clean server-rendered architectures. Focused on evidence-based engineering, high-throughput reliability, and zero-cost cloud operational efficiency."}
          </p>

          {/* Quick Candidate Telemetry Bar */}
          <div className="animate-fade-in-up delay-300 mt-8 inline-flex flex-wrap items-center gap-y-2 gap-x-4 rounded-2xl border border-border/80 dark:border-white/10 bg-card/80 dark:bg-card/40 p-3 sm:px-5 sm:py-2.5 font-mono text-xs text-muted-foreground shadow-xs backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span>Role: <strong className="text-foreground">Full-Stack / Backend</strong></span>
            </div>
            <span className="text-border hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span>Status: <strong className="text-foreground">Employed (Software Developer)</strong></span>
            </div>
            <span className="text-border hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span>Base: <strong className="text-foreground">Ahmedabad / Surat</strong></span>
            </div>
          </div>
        </div>

        {/* ===================================================================
         * ASYMMETRIC MAIN SECTION: NARRATIVE & VISUAL IDENTITY CANVAS (7/5 Split)
         * =================================================================== */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 items-start mb-20 sm:mb-28">
          
          {/* LEFT COLUMN: Editorial Narrative & Principles (7 Cols) */}
          <div className="lg:col-span-7 space-y-10">
            {/* Biography Section */}
            {bioData && (
              <section className="rounded-3xl border border-border/80 bg-card/80 dark:bg-card/40 p-6 sm:p-8 shadow-xs backdrop-blur-md">
                <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-accent mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>Engineering Narrative</span>
                </div>
                <RichTextRenderer data={bioData} />
              </section>
            )}

            {/* Core Engineering Philosophies */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-accent mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span>Core Operating Principles</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs transition-all duration-300 hover:border-accent hover:shadow-md hover:-translate-y-0.5">
                  <div className="text-xl mb-2">⚡</div>
                  <h3 className="font-bold text-sm text-foreground mb-1.5">
                    Simplicity Over Cleverness
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Write code that is easy to reason about and debug at 2 AM in production. Avoid premature abstractions and bloated microservices.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs transition-all duration-300 hover:border-accent hover:shadow-md hover:-translate-y-0.5">
                  <div className="text-xl mb-2">🛡️</div>
                  <h3 className="font-bold text-sm text-foreground mb-1.5">
                    Concurrency & Idempotency
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Design every mutation, webhook handler, and worker job to safely tolerate retries and out-of-order execution without state corruption.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs transition-all duration-300 hover:border-accent hover:shadow-md hover:-translate-y-0.5">
                  <div className="text-xl mb-2">🎯</div>
                  <h3 className="font-bold text-sm text-foreground mb-1.5">
                    Strict Type Safety
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    End-to-end type validation from database schemas (PostgreSQL) to frontend views (Next.js), catching structural defects at compile time.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs transition-all duration-300 hover:border-accent hover:shadow-md hover:-translate-y-0.5">
                  <div className="text-xl mb-2">📊</div>
                  <h3 className="font-bold text-sm text-foreground mb-1.5">
                    Zero-Cost Efficiency
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Maximize operational throughput through edge caching, pooled databases, and lightweight runtimes before reaching for costly cloud infrastructure.
                  </p>
                </div>
              </div>
            </section>

            {/* Quick Actions Row */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <Link
                href="/resume"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-foreground shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-accent/30 active:scale-[0.98]"
              >
                <span>View Full Resume</span>
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">↗</span>
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-6 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:border-accent hover:text-accent hover:bg-accent/5 hover:-translate-y-0.5"
              >
                <span>Discuss a Role</span>
                <span>→</span>
              </Link>

              <CopyEmailButton email={publicEmail} />
            </div>
          </div>

          {/* RIGHT COLUMN: Identity Plate & Overlapping Proof HUD (5 Cols) */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-[380px] sm:max-w-[420px] lg:max-w-none">
              
              {/* Visual Plate Frame */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border bg-card shadow-2xl transition-all duration-300 hover:shadow-accent/10">
                {/* Floating Candidate Availability Badge */}
                <div className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-border/80 dark:border-white/10 bg-card/90 dark:bg-card/85 px-3 py-1 font-mono text-[10px] font-bold text-foreground shadow-md backdrop-blur-md">
                  <span className="relative flex h-2 w-2 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-muted-foreground uppercase text-[9px]">STATUS:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-wide">
                    READY TO JOIN
                  </span>
                </div>

                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Vraj Clerk"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 420px"
                    className="object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full flex-col justify-between p-6 sm:p-8 bg-gradient-to-br from-card via-muted/60 to-background text-left">
                    <div className="flex items-center justify-between border-b border-border/80 pb-4">
                      <div className="font-bold text-sm tracking-tight text-foreground flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
                        <span>Vraj Clerk</span>
                      </div>
                      <span className="font-mono text-[10px] uppercase font-bold text-accent bg-accent/10 px-2.5 py-0.5 rounded-full border border-accent/20">
                        sys.online
                      </span>
                    </div>

                    <div className="my-auto py-6 flex flex-col items-start gap-3">
                      <div className="h-16 w-16 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center font-mono text-2xl font-extrabold shadow-lg shadow-accent/25">
                        VC
                      </div>
                      <div>
                        <div className="text-lg font-bold text-foreground">
                          Full-Stack Engineer
                        </div>
                        <div className="text-xs text-muted-foreground font-mono mt-1">
                          TypeScript • PostgreSQL • Next.js
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border/80 pt-3 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                      <span>status: active software developer</span>
                      <span className="text-accent font-bold">LIVE</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Engineering Telemetry & Production Metrics */}
              <div className="mt-5 rounded-2xl border border-border/80 bg-card/90 dark:bg-card/75 p-4 sm:p-5 shadow-xs backdrop-blur-md">
                <div className="grid grid-cols-3 divide-x divide-border/60 text-center font-mono">
                  <div className="px-2">
                    <div className="text-xl sm:text-2xl font-extrabold tracking-tight font-sans text-foreground">
                      1.5+
                    </div>
                    <div className="mt-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Prod Exp
                    </div>
                  </div>

                  <div className="px-2">
                    <div className="text-xl sm:text-2xl font-extrabold tracking-tight font-sans text-foreground">
                      &lt; 45ms
                    </div>
                    <div className="mt-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Edge TTFB
                    </div>
                  </div>

                  <div className="px-2">
                    <div className="text-xl sm:text-2xl font-extrabold tracking-tight font-sans text-accent">
                      $0.00
                    </div>
                    <div className="mt-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Cloud Cost
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified External Profile Channels */}
              <div className="mt-6 flex flex-col gap-2">
                <span className="font-mono text-[11px] uppercase tracking-wider font-bold text-muted-foreground">
                  Verified Identity & Channels
                </span>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((link) => {
                    const label = "platform" in link ? link.platform : link.label;
                    return (
                      <a
                        key={link.id || link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card/80 px-3.5 py-1.5 text-xs font-mono font-medium text-foreground hover:border-accent hover:text-accent hover:bg-card transition-all duration-200"
                      >
                        <span>{label}</span>
                        <span className="text-muted-foreground text-[10px]">↗</span>
                      </a>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ===================================================================
         * GEOGRAPHIC BACKGROUND & LOCATION: AHMEDABAD & SURAT
         * =================================================================== */}
        <AboutLocationSection />

        {/* ===================================================================
         * CAREER PROGRESSION: WORK EXPERIENCE TIMELINE
         * =================================================================== */}
        <section className="mb-20 sm:mb-28 pt-8 border-t border-border/80">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-10 pb-4 border-b border-border">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                Career History
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mt-1">
                Work Experience & Engineering Roles
              </h2>
            </div>
            <Link
              href="/resume"
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
            >
              View Full PDF Resume →
            </Link>
          </div>

          {experience.length > 0 ? (
            <div className="relative border-l-2 border-accent/30 dark:border-accent/40 ml-4 sm:ml-6 space-y-10 pl-6 sm:pl-10">
              {experience.map((entry) => {
                const startFormatted = entry.startDate
                  ? new Date(entry.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  : "";

                const endFormatted = entry.current
                  ? "Present"
                  : entry.endDate
                  ? new Date(entry.endDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  : "";

                return (
                  <div key={entry.id || entry.role} className="relative group">
                    {/* Glowing Timeline Node */}
                    <span className="absolute -left-[31px] sm:-left-[47px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-card ring-4 ring-background border-2 border-accent transition-transform duration-300 group-hover:scale-125 group-hover:bg-accent" />

                    {/* Timeline Entry Card */}
                    <div className="rounded-2xl border border-border/80 bg-card/90 dark:bg-card/60 p-5 sm:p-7 shadow-xs backdrop-blur-sm transition-all duration-300 hover:border-accent hover:shadow-md hover:-translate-y-0.5">
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-bold text-foreground">
                            {entry.role}
                          </h3>
                          {entry.current && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              CURRENT ROLE
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono text-muted-foreground">
                          {startFormatted} – {endFormatted}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-accent mb-3">
                        {entry.organization}
                      </p>

                      {entry.summary && (
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {entry.summary}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Experience entries added in Payload CMS will appear here.
            </p>
          )}
        </section>

        {/* ===================================================================
         * PRACTICAL SKILLS & TECHNOLOGIES MATRIX
         * =================================================================== */}
        {skills.length > 0 && (
          <section className="mb-20 sm:mb-28 pt-8 border-t border-border/80">
            <div className="mb-10 pb-4 border-b border-border">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                Core Capabilities
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mt-1">
                Technical Proficiencies & Practical Context
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Categorized by actual production application and real-world system architecture.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
              {skills.map((cat, idx) => (
                <SkillCard
                  key={cat.id || cat.category || idx}
                  group={cat}
                  index={idx}
                />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* ===================================================================
       * SEAMLESS BOTTOM CTA
       * =================================================================== */}
      <CtaSection email={publicEmail} />
    </div>
  );
}
