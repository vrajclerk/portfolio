import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Badge, type BadgeVariant } from "@/components/Badge";
import { PostCard } from "@/components/PostCard";
import { PreviewBanner } from "@/components/PreviewBanner";
import { RichTextRenderer } from "@/components/RichTextRenderer";
import { getProjectBySlug, getPublishedProjects } from "@/lib/cms";
import type { Post, Tag } from "@/payload-types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug, true);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.seo?.title || project.title,
    description: project.seo?.description || project.summary,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { isEnabled: isDraftMode } = await draftMode();
  const project = await getProjectBySlug(slug, isDraftMode);

  // Return 404 for missing slugs or unpublished content outside draft mode
  if (!project || (!isDraftMode && project._status !== "published")) {
    notFound();
  }

  const badgeVariant: BadgeVariant =
    project.projectType === "professional"
      ? "professional"
      : project.projectType === "personal"
      ? "personal"
      : project.projectType === "open-source"
      ? "open-source"
      : "experiment";

  const tags = Array.isArray(project.technologies)
    ? (project.technologies.filter(
        (t): t is Tag => typeof t === "object" && t !== null && "name" in t
      ) as Tag[])
    : [];

  const relatedPosts = Array.isArray(project.relatedPosts)
    ? (project.relatedPosts.filter(
        (p): p is Post =>
          typeof p === "object" && p !== null && p._status === "published"
      ) as Post[])
    : [];

  return (
    <>
      {isDraftMode && <PreviewBanner exitUrl={`/projects/${slug}`} />}
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Link */}
      <div className="mb-8">
        <Link
          href="/projects"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to all projects
        </Link>
      </div>

      {/* Case Study Header */}
      <header className="border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge variant={badgeVariant}>
            {project.projectType.replace("-", " ")}
          </Badge>
          {project.role && (
            <span className="text-sm font-semibold text-muted-foreground">
              Role: {project.role}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {project.title}
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {project.summary}
        </p>

        {/* Links & Repository */}
        <div className="mt-6 flex flex-wrap items-center gap-4 pt-4 border-t border-border/50 text-sm">
          {project.repositoryUrl && (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg border border-border bg-card px-4 py-2 font-medium text-foreground hover:bg-muted transition-colors"
            >
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              View Repository
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg bg-foreground px-4 py-2 font-medium text-background hover:opacity-90 transition-opacity"
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Live Demo / Service
            </a>
          )}
        </div>
      </header>

      {/* Case Study Content Sections */}
      <div className="space-y-12 py-10">
        {/* Direct Contribution */}
        {project.contribution && (
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">
              Direct Contribution & Role
            </h2>
            <RichTextRenderer data={project.contribution} />
          </section>
        )}

        {/* Problem Statement */}
        {project.problem && (
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">
              Context & Problem Statement
            </h2>
            <RichTextRenderer data={project.problem} />
          </section>
        )}

        {/* Constraints */}
        {project.constraints && (
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">
              Technical Constraints & Requirements
            </h2>
            <RichTextRenderer data={project.constraints} />
          </section>
        )}

        {/* Architecture & Approach */}
        {project.architecture && (
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">
              Architecture & System Design
            </h2>
            <RichTextRenderer data={project.architecture} />
          </section>
        )}

        {/* Key Technical Decisions */}
        {Array.isArray(project.decisions) && project.decisions.length > 0 && (
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-6">
              Key Engineering Decisions & Tradeoffs
            </h2>
            <div className="space-y-6">
              {project.decisions.map((decision) => (
                <div
                  key={decision.id || decision.title}
                  className="rounded-xl border border-border bg-card p-6 shadow-xs"
                >
                  <h3 className="text-base font-bold text-foreground mb-3">
                    {decision.title}
                  </h3>

                  {decision.context && (
                    <div className="mb-2 text-sm">
                      <span className="font-semibold text-foreground">Context: </span>
                      <span className="text-muted-foreground">{decision.context}</span>
                    </div>
                  )}

                  {decision.alternatives && (
                    <div className="mb-2 text-sm">
                      <span className="font-semibold text-foreground">Alternatives Considered: </span>
                      <span className="text-muted-foreground">{decision.alternatives}</span>
                    </div>
                  )}

                  {decision.decision && (
                    <div className="mb-2 text-sm">
                      <span className="font-semibold text-foreground">Decision Made: </span>
                      <span className="text-muted-foreground">{decision.decision}</span>
                    </div>
                  )}

                  {decision.tradeoffs && (
                    <div className="text-sm">
                      <span className="font-semibold text-foreground">Tradeoffs: </span>
                      <span className="text-muted-foreground">{decision.tradeoffs}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Implementation Details */}
        {project.implementation && (
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">
              Implementation Details
            </h2>
            <RichTextRenderer data={project.implementation} />
          </section>
        )}

        {/* Testing & Reliability */}
        {project.testing && (
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">
              Testing & Quality Assurance
            </h2>
            <RichTextRenderer data={project.testing} />
          </section>
        )}

        {/* Verified Outcomes */}
        {project.outcomes && (
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">
              Verified Outcomes & Production Status
            </h2>
            <RichTextRenderer data={project.outcomes} />
          </section>
        )}

        {/* Lessons Learned */}
        {project.lessonsLearned && (
          <section>
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">
              Lessons Learned & Future Improvements
            </h2>
            <RichTextRenderer data={project.lessonsLearned} />
          </section>
        )}

        {/* Technologies Used */}
        {tags.length > 0 && (
          <section className="pt-6 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">
              Technologies & Tooling
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-md border border-border bg-muted/60 px-3 py-1 font-mono text-xs text-foreground"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Related Blog Posts */}
        {relatedPosts.length > 0 && (
          <section className="pt-8 border-t border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {relatedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
    </>
  );
}
