/**
 * Homepage — placeholder shell.
 *
 * TODO (Phase 3): Replace with CMS-driven content from Payload globals
 * (HomepageSettings, Profile, SiteSettings) and featured Projects/Posts.
 *
 * TODO (Phase 7): Replace placeholder copy with real, owner-approved content.
 * Do NOT invent achievements, metrics, or biographical details.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "TODO: Confirm positioning statement with owner before publishing.",
};

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-24 text-center">
      <div className="max-w-2xl space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {/* TODO (Phase 7): Replace with real headline confirmed by owner */}
          TODO: Developer Portfolio
        </h1>

        <p className="text-lg text-muted-foreground">
          {/* TODO (Phase 7): Replace with real positioning statement */}
          Placeholder — backend-leaning full-stack developer. Phase 1 foundation
          shell only; CMS-driven content arrives in Phase 3.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <a
            href="/projects"
            className="inline-flex items-center rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:opacity-90"
          >
            View Projects
          </a>
          <a
            href="/blog"
            className="inline-flex items-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Read the Blog
          </a>
        </div>
      </div>

      {/* Development watermark — remove in Phase 3 */}
      <p className="mt-8 rounded border border-yellow-300 bg-yellow-50 px-4 py-2 text-xs text-yellow-800 dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
        ⚠ Phase 1 placeholder — CMS integration and real content coming in
        Phase 3.
      </p>
    </main>
  );
}
