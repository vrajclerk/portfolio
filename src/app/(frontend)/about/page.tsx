import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { RichTextRenderer } from "@/components/RichTextRenderer";
import { getProfile, getSiteSettings } from "@/lib/cms";

export const metadata: Metadata = {
  title: "About & Experience",
  description:
    "Professional background, engineering work experience, and verified technical skills of full-stack developer Vraj Clerk.",
};

export default async function AboutPage() {
  const [profile, siteSettings] = await Promise.all([
    getProfile(),
    getSiteSettings(),
  ]);

  const experience = Array.isArray(profile.experience) ? profile.experience : [];
  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  const socialLinks = profile.socialLinks || siteSettings.socialLinks || [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 border-b border-border pb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">
          Background
        </span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          About & Experience
        </h1>
        {profile.headline && (
          <p className="mt-3 text-lg font-medium text-muted-foreground">
            {profile.headline}
          </p>
        )}
      </div>

      {/* Biography Section */}
      {profile.shortBio && (
        <section className="mb-14">
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">
            Biography
          </h2>
          <RichTextRenderer data={profile.shortBio} />
        </section>
      )}

      {/* Work Experience Timeline */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Work Experience
          </h2>
          <Link
            href="/resume"
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
          >
            View Full Resume →
          </Link>
        </div>

        {experience.length > 0 ? (
          <div className="relative border-l-2 border-border ml-3 space-y-8 pl-6 sm:ml-4 sm:pl-8">
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
                <div key={entry.id || entry.role} className="relative">
                  {/* Timeline bullet */}
                  <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-accent" />

                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <h3 className="text-base font-bold text-foreground">
                      {entry.role}
                    </h3>
                    <span className="text-xs font-mono text-muted-foreground">
                      {startFormatted} – {endFormatted}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-accent mt-0.5">
                    {entry.organization}
                  </p>

                  {entry.summary && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {entry.summary}
                    </p>
                  )}
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

      {/* Skills Grouped by Category */}
      {skills.length > 0 && (
        <section className="mb-14">
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-6">
            Technical Proficiencies & Practical Context
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {skills.map((cat) => (
              <div
                key={cat.id || cat.category}
                className="rounded-xl border border-border bg-card p-6 shadow-xs"
              >
                <h3 className="text-base font-bold text-foreground mb-4">
                  {cat.category}
                </h3>
                <ul className="space-y-3">
                  {cat.items.map((skill) => (
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

      {/* Social & Contact Links */}
      <section className="pt-8 border-t border-border">
        <h2 className="text-lg font-bold tracking-tight text-foreground mb-4">
          Connect & Verification
        </h2>
        <div className="flex flex-wrap gap-4">
          {socialLinks.map((link) => {
            const label = "platform" in link ? link.platform : link.label;
            return (
              <a
                key={link.id || link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                {label} ↗
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
