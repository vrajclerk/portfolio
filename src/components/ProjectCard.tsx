import React from "react";
import Link from "next/link";
import type { Project, Tag } from "@/payload-types";
import { Badge, type BadgeVariant } from "./Badge";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
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

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-xs transition-all duration-300 hover:border-accent hover:shadow-lg hover:-translate-y-0.5">
      <div>
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <Badge variant={badgeVariant}>
            {project.projectType.replace("-", " ")}
          </Badge>
          {project.role && (
            <span className="text-xs text-muted-foreground font-medium">
              {project.role}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-accent">
          <Link href={`/projects/${project.slug}`} className="focus:outline-hidden">
            {project.title}
          </Link>
        </h3>

        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {project.summary}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-border/50">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center rounded-full bg-muted/70 px-2.5 py-0.5 text-xs text-muted-foreground font-mono"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center font-medium text-accent hover:underline"
          >
            Case Study
            <svg
              className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>

          <div className="flex items-center gap-3">
            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={`GitHub repository for ${project.title}`}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={`Live demo for ${project.title}`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
