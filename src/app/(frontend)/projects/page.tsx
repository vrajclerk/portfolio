import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ProjectsFilterGrid } from "@/components/ProjectsFilterGrid";
import { getPublishedProjects, getSiteSettings } from "@/lib/cms";
import { generateBreadcrumbSchema } from "@/utilities/structuredData";

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const siteName = siteSettings.siteName || "Vraj Clerk";
  const title = "Projects & Case Studies";
  const description =
    "Detailed engineering case studies distinguishing professional, personal, open-source, and experimental projects.";

  return {
    title,
    description,
    alternates: {
      canonical: "/projects",
    },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url: "/projects",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
    },
  };
}

async function ProjectsList({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type: rawType } = await searchParams;
  const currentType = rawType || "all";

  // Fetch all published projects once so client-side filter can query instantly
  const projects = await getPublishedProjects();

  return <ProjectsFilterGrid initialProjects={projects} initialType={currentType} />;
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const siteSettings = await getSiteSettings();
  const siteUrl = siteSettings.siteUrl || "http://localhost:3000";
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: "Home", path: "/" },
      { name: "Projects", path: "/projects" },
    ],
    siteUrl
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Page Header */}
      <div className="max-w-3xl mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">
          Portfolio
        </span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Engineering Projects & Case Studies
        </h1>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed">
          In-depth architectural breakdowns detailing problems, technical constraints, concrete decisions, and verified outcomes. Clear separation is maintained between professional and personal initiatives.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="py-12 text-center text-sm text-muted-foreground">
            Loading case studies...
          </div>
        }
      >
        <ProjectsList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
