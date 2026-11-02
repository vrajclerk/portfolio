import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { HeroSection } from "@/components/HeroSection";
import { PostCard } from "@/components/PostCard";
import { ProjectCard } from "@/components/ProjectCard";
import { SkillCard } from "@/components/SkillCard";
import { CtaSection } from "@/components/CtaSection";
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

// Incremental Static Regeneration (1 hour TTL, invalidated on CMS change)
export const revalidate = 3600;

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

  const avatarUrl =
    profile.profileImage &&
    typeof profile.profileImage === "object" &&
    "url" in profile.profileImage &&
    profile.profileImage.url
      ? (profile.profileImage.url as string)
      : "/media/IMG_20240306_180503_775.webp";

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
       * Hero Section (Server Component - Immediate Zero-Hydration Paint)
       * --------------------------------------------------------------------- */}
      <HeroSection
        headline={heroHeadline}
        subheadline={heroSubheadline}
        avatarUrl={avatarUrl}
        email={siteSettings.publicEmail}
      />

      {/* ---------------------------------------------------------------------
       * Featured Projects Section (Optimized with content-visibility)
       * --------------------------------------------------------------------- */}
      {showProjects && (
        <section className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 [content-visibility:auto] [contain-intrinsic-size:1px_500px]">
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
              {displayProjects.map((project, idx) => (
                <ProjectCard key={project.id} project={project} index={idx} />
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
        <section className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 [content-visibility:auto] [contain-intrinsic-size:1px_400px]">
          <div className="mb-8 border-b border-border pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              Core Capabilities
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Practical Technologies & Tooling
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Categorized by real-world usage, architectural specialization, and production experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {profile.skills.map((group, idx) => (
              <SkillCard
                key={group.id || group.category || idx}
                group={group}
                index={idx}
              />
            ))}
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------------
       * Latest Articles / Technical Writing Section
       * --------------------------------------------------------------------- */}
      {showPosts && (
        <section className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 [content-visibility:auto] [contain-intrinsic-size:1px_450px]">
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-stretch">
              {displayPosts.map((post, idx) => (
                <PostCard key={post.id} post={post} index={idx} />
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
        <div className="[content-visibility:auto] [contain-intrinsic-size:1px_400px]">
          <CtaSection email={siteSettings.publicEmail || "vrajclerk04@gmail.com"} />
        </div>
      )}
    </div>
  );
}
