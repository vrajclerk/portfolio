import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { PostCard } from "@/components/PostCard";
import { ProjectCard } from "@/components/ProjectCard";
import {
  getHomepageSettings,
  getProfile,
  getPublishedPosts,
  getPublishedProjects,
  getSiteSettings,
} from "@/lib/cms";
import type { Post, Project } from "@/payload-types";
import {
  generatePersonSchema,
  generateWebsiteSchema,
} from "@/utilities/structuredData";

export async function generateMetadata(): Promise<Metadata> {
  const [siteSettings, profile] = await Promise.all([
    getSiteSettings(),
    getProfile(),
  ]);

  const siteName = siteSettings.siteName || "Vraj Clerk | Developer Portfolio";
  const description =
    profile.headline ||
    siteSettings.defaultDescription ||
    "Full-stack software engineer portfolio focused on backend reliability, TypeScript architectures, and evidence-based engineering.";

  return {
    title: "Home",
    description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: siteName,
      description,
      url: "/",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
    },
  };
}

export default async function HomePage() {
  const [homepageSettings, profile, siteSettings, publishedProjects, publishedPosts] =
    await Promise.all([
      getHomepageSettings(),
      getProfile(),
      getSiteSettings(),
      getPublishedProjects({ limit: 3 }),
      getPublishedPosts({ limit: 2 }),
    ]);

  const websiteSchema = generateWebsiteSchema({
    siteName: siteSettings.siteName || "Vraj Clerk",
    siteUrl: siteSettings.siteUrl || "http://localhost:3000",
    description: siteSettings.defaultDescription,
  });

  const personSchema = generatePersonSchema({
    profile,
    siteSettings,
  });

  // Featured projects from HomepageSettings relationship or top published projects
  const featuredProjects: Project[] = Array.isArray(
    homepageSettings.featuredProjects
  )
    ? (homepageSettings.featuredProjects.filter(
        (p): p is Project =>
          typeof p === "object" && p !== null && p._status === "published"
      ) as Project[])
    : publishedProjects;

  const displayProjects =
    featuredProjects.length > 0 ? featuredProjects.slice(0, 3) : publishedProjects;

  // Featured posts from HomepageSettings relationship or latest published posts
  const featuredPosts: Post[] = Array.isArray(homepageSettings.featuredPosts)
    ? (homepageSettings.featuredPosts.filter(
        (p): p is Post =>
          typeof p === "object" && p !== null && p._status === "published"
      ) as Post[])
    : publishedPosts;

  const displayPosts =
    featuredPosts.length > 0 ? featuredPosts.slice(0, 2) : publishedPosts;

  const heroHeadline =
    homepageSettings.heroHeadline ||
    profile.headline ||
    "Building Resilient Full-Stack Systems & Thoughtful Web Architectures";

  const heroSubheadline =
    homepageSettings.heroSubheadline ||
    "Software engineer with ~1.5 years of professional experience focusing on TypeScript, PostgreSQL, and clean server-rendered architectures. Focused on evidence-based engineering and zero-cost operational efficiency.";

  const showProjects =
    homepageSettings.sectionsVisibility?.showProjects !== false;
  const showPosts = homepageSettings.sectionsVisibility?.showPosts !== false;
  const showSkills = homepageSettings.sectionsVisibility?.showSkills !== false;
  const showContact =
    homepageSettings.sectionsVisibility?.showContact !== false;

  return (
    <div className="flex flex-col gap-16 py-12 md:py-20">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      {/* ---------------------------------------------------------------------
       * Hero Section
       * --------------------------------------------------------------------- */}
      <section className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3.5 py-1 text-xs font-medium text-muted-foreground mb-6">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          <span>Available for Full-Stack & Backend Engineering Roles</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
          {heroHeadline}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-balance">
          {heroSubheadline}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-background transition-all hover:opacity-90 hover:shadow-md"
          >
            Explore Case Studies
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>

          <Link
            href="/resume"
            className="inline-flex items-center rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            View Resume
          </Link>

          <Link
            href="/about"
            className="inline-flex items-center rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            About & Experience →
          </Link>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
       * Featured Projects Section
       * --------------------------------------------------------------------- */}
      {showProjects && (
        <section className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-8 border-b border-border pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                Case Studies
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Featured Engineering Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="text-sm font-medium text-accent hover:underline flex items-center gap-1"
            >
              All projects ({publishedProjects.length}) →
            </Link>
          </div>

          {displayProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No published projects yet"
              description="Projects added and published in Payload CMS will appear here."
            />
          )}
        </section>
      )}

      {/* ---------------------------------------------------------------------
       * Practical Skills & Technology Groups Section
       * --------------------------------------------------------------------- */}
      {showSkills && Array.isArray(profile.skills) && profile.skills.length > 0 && (
        <section className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8">
          <div className="mb-8 border-b border-border pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              Core Capabilities
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Practical Technologies & Tooling
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Categorized by real-world usage and production experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {profile.skills.map((group) => (
              <div
                key={group.id || group.category}
                className="rounded-xl border border-border bg-card p-6 shadow-xs"
              >
                <h3 className="text-base font-bold text-foreground mb-4">
                  {group.category}
                </h3>
                <ul className="space-y-3">
                  {group.items.map((skill) => (
                    <li key={skill.id || skill.name} className="text-sm">
                      <span className="font-semibold text-foreground">
                        {skill.name}
                      </span>
                      {skill.context && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {skill.context}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------------
       * Latest Articles / Technical Writing Section
       * --------------------------------------------------------------------- */}
      {showPosts && (
        <section className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-8 border-b border-border pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                Technical Articles
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Recent Engineering Writing
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-sm font-medium text-accent hover:underline flex items-center gap-1"
            >
              All articles ({publishedPosts.length}) →
            </Link>
          </div>

          {displayPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {displayPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No published articles yet"
              description="Technical articles published in Payload CMS will appear here."
            />
          )}
        </section>
      )}

      {/* ---------------------------------------------------------------------
       * Bottom Contact CTA Section
       * --------------------------------------------------------------------- */}
      {showContact && (
        <section className="mx-auto max-w-4xl w-full px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-card/60 p-8 sm:p-12 shadow-xs">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Interested in collaborating or discussing a role?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
              Always open to conversations regarding backend engineering, distributed systems, and full-stack development opportunities.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-lg bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Get in Touch
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Learn More About My Background
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
