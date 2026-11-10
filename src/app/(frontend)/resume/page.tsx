import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getProfile, getSiteSettings } from "@/lib/cms";
import { generateBreadcrumbSchema } from "@/utilities/structuredData";
import { getLiveSiteUrl } from "@/utilities/siteUrl";

export async function generateMetadata(): Promise<Metadata> {
  const [profile, siteSettings] = await Promise.all([
    getProfile(),
    getSiteSettings(),
  ]);

  const siteName = siteSettings.siteName || "Vraj Clerk";
  const title = "Resume & Curriculum Vitae";
  const description =
    profile.headline ||
    "Curriculum Vitae and professional software engineering experience of full-stack developer Vraj Clerk.";

  return {
    title,
    description,
    alternates: {
      canonical: "/resume",
    },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url: "/resume",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
    },
  };
}

export default async function ResumePage() {
  const [profile, siteSettings] = await Promise.all([
    getProfile(),
    getSiteSettings(),
  ]);

  const resumeUrl =
    profile.resumeFile &&
    typeof profile.resumeFile === "object" &&
    "url" in profile.resumeFile &&
    profile.resumeFile.url
      ? (profile.resumeFile.url as string)
      : "/media/VRAJ_Python_Developer.pdf";

  const experience = Array.isArray(profile.experience) ? profile.experience : [];
  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  const publicEmail = siteSettings.publicEmail || "vrajclerk.dev@gmail.com";
  const siteUrl = getLiveSiteUrl(siteSettings.siteUrl);

  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: "Home", path: "/" },
      { name: "Resume", path: "/resume" },
    ],
    siteUrl
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Top action bar (hidden during print) */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-border print:hidden">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            Curriculum Vitae
          </span>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Software Engineering Resume
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={resumeUrl}
            download="VRAJ_Python_Developer.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 rounded-xl bg-accent px-4 sm:px-5 py-2.5 text-xs font-bold text-accent-foreground shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md hover:shadow-accent/25 active:scale-[0.98] overflow-hidden"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 w-3/5 h-full bg-linear-to-r from-transparent via-white/30 to-transparent -skew-x-20 animate-shimmer-sweep pointer-events-none"
            />
            <svg
              className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            <span>Download PDF Resume</span>
          </a>

          <Link
            href="/contact"
            className="inline-flex items-center rounded-xl border border-border/80 dark:border-white/10 bg-card/80 px-4 py-2.5 text-xs font-semibold text-foreground shadow-xs transition-all duration-200 hover:border-accent hover:text-accent hover:bg-card"
          >
            Contact
          </Link>
        </div>
      </div>

      {/* Printable Resume Document */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-8 md:p-12 shadow-xs print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <header className="border-b border-border pb-6 mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Vraj Clerk
          </h2>
          <p className="mt-1 text-lg font-medium text-accent">
            {profile.headline || "Full-Stack Software Engineer"}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs font-mono text-muted-foreground">
            <a href={`mailto:${publicEmail}`} className="hover:underline text-foreground">
              {publicEmail}
            </a>
            <span>•</span>
            <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {siteUrl.replace(/^https?:\/\//, "")}
            </a>
            <span>•</span>
            <a
              href="https://github.com/vrajclerk"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              github.com/vrajclerk
            </a>
            <span>•</span>
            <a
              href="https://linkedin.com/in/vrajclerk"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              linkedin.com/in/vrajclerk
            </a>
          </div>
        </header>

        {/* Summary Section */}
        <section className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Summary
          </h3>
          <p className="text-sm leading-relaxed text-foreground/90">
            Full-stack software engineer with approximately 1.5 years of professional engineering experience. Focused on backend reliability, high-throughput webhook pipelines, PostgreSQL schema modeling, and modern TypeScript architectures. Experienced in building production systems with zero-cost operational requirements.
          </p>
        </section>

        {/* Work Experience Section */}
        <section className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Professional Experience
          </h3>
          <div className="space-y-6">
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
                <div key={entry.id || entry.role} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <h4 className="text-base font-bold text-foreground">
                      {entry.role}
                    </h4>
                    <span className="text-xs font-mono text-muted-foreground">
                      {startFormatted} – {endFormatted}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-accent">
                    {entry.organization}
                  </p>

                  {entry.summary && (
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {entry.summary}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Technical Skills Section */}
        <section className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Technical Skills & Tooling
          </h3>
          <div className="space-y-3">
            {skills.map((group) => (
              <div key={group.id || group.category} className="text-sm">
                <span className="font-bold text-foreground">{group.category}: </span>
                <span className="text-muted-foreground">
                  {group.items.map((i) => i.name).join(", ")}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Education
          </h3>
          <div className="space-y-1 text-sm">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <h4 className="font-bold text-foreground">
                Bachelor of Engineering / Computer Science
              </h4>
              <span className="text-xs font-mono text-muted-foreground">
                Verified Degree
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Core coursework in Data Structures, Algorithms, Database Management Systems, and Computer Networks.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
