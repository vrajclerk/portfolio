import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { ProjectCard } from "@/components/ProjectCard";
import { getPublishedProjects } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Projects & Case Studies",
  description:
    "Detailed engineering case studies distinguishing professional, personal, open-source, and experimental projects.",
};

const filterTabs = [
  { label: "All Projects", value: "all" },
  { label: "Professional", value: "professional" },
  { label: "Personal", value: "personal" },
  { label: "Open Source", value: "open-source" },
  { label: "Experiments", value: "experiment" },
];

async function ProjectsList({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type: rawType } = await searchParams;
  const currentType = rawType || "all";

  const projects = await getPublishedProjects({
    projectType: currentType === "all" ? undefined : currentType,
  });

  return (
    <>
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4" role="tablist">
        {filterTabs.map((tab) => {
          const isActive = currentType === tab.value;
          return (
            <Link
              key={tab.value}
              href={tab.value === "all" ? "/projects" : `/projects?type=${tab.value}`}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
              role="tab"
              aria-selected={isActive}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Project Grid / Empty State */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No ${currentType === "all" ? "" : currentType} projects found`}
          description="There are currently no published projects in this category."
          actionHref="/projects"
          actionLabel="View all projects"
        />
      )}
    </>
  );
}

export default function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
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
