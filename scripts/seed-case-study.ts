/**
 * Portfolio Case Study Ingestion Script
 *
 * Upserts the comprehensive engineering case study for "Autonomous Developer Portfolio & Headless CMS Engine"
 * directly into Payload CMS (Neon PostgreSQL), making it live for both local development and production.
 *
 * Usage:
 *   pnpm tsx scripts/seed-case-study.ts
 */

import "@next/env";
import { loadEnvConfig } from "@next/env";

// Load environment variables (.env.local)
loadEnvConfig(process.cwd());

import { createLexicalDoc } from "../src/lib/fixtures";

async function main() {
  console.log("\n=======================================================");
  console.log("   SEEDING CASE STUDY: ZERO-COST PORTFOLIO & CMS      ");
  console.log("=======================================================\n");

  try {
    const { default: configPromise } = await import("@payload-config");
    const { getPayload } = await import("payload");

    console.log("🚀 Initializing Payload CMS Local API...");
    const payload = await getPayload({ config: configPromise });

    // 1. Ensure required tags exist
    const requiredTags = [
      { name: "Next.js", slug: "nextjs", description: "Next.js 16 App Router with Server Components and static rendering." },
      { name: "TypeScript", slug: "typescript", description: "Strict static typing and auto-generated Payload collection schemas." },
      { name: "PostgreSQL", slug: "postgresql", description: "Serverless relational database hosting on Neon with Drizzle ORM." },
      { name: "Payload CMS", slug: "payload-cms", description: "Headless CMS monolith running embedded inside Next.js." },
      { name: "Tailwind CSS", slug: "tailwind-css", description: "Tailwind CSS v4 with custom theme tokens and route-group preflight isolation." },
      { name: "System Design", slug: "system-design", description: "Distributed execution, multi-tier caching, and zero-cost cloud architecture." },
      { name: "GraphQL", slug: "graphql", description: "Buffer GraphQL API client for autonomous LinkedIn content synchronization." },
    ];

    const tagIds: number[] = [];

    for (const tag of requiredTags) {
      const existingTag = await payload.find({
        collection: "tags",
        where: { slug: { equals: tag.slug } },
        limit: 1,
      });

      if (existingTag.docs.length > 0) {
        tagIds.push(Number(existingTag.docs[0].id));
      } else {
        const createdTag = await payload.create({
          collection: "tags",
          data: {
            name: tag.name,
            slug: tag.slug,
            description: tag.description,
          },
        });
        tagIds.push(Number(createdTag.id));
        console.log(`+ Created tag: ${tag.name} (ID: ${createdTag.id})`);
      }
    }

    // 2. Prepare Case Study Content
    const projectSlug = "zero-cost-portfolio-cms";
    const projectData = {
      title: "Autonomous Developer Portfolio & Headless CMS Engine",
      slug: projectSlug,
      summary:
        "A self-hosted, production-grade developer portfolio and headless CMS monolith engineered with Next.js 16 App Router, Payload CMS 3, and Neon Serverless PostgreSQL. Features autonomous LinkedIn post synchronization via Buffer GraphQL, sub-15ms multi-tier caching, bot-resistant contact pipelines, and an interactive developer CLI workstation—operating under strict ₹0/month infrastructure constraints.",
      projectType: "personal" as const,
      role: "Lead Systems Architect & Full-Stack Engineer",
      featured: true,
      displayOrder: 1,
      repositoryUrl: "https://github.com/vrajclerk/portfolio",
      liveUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://vrajclerk.vercel.app",
      _status: "published" as const,
      technologies: tagIds,
      contribution: createLexicalDoc(
        "Architected and engineered the end-to-end full-stack monolith unifying Next.js 16 App Router with Payload CMS 3 within a single Node.js runtime. Designed the route group isolation architecture that eliminated styling conflicts between public Tailwind CSS v4 and Payload Admin UI.",
        "Engineered an autonomous social publishing ingestion pipeline using Buffer's GraphQL API. Implemented custom Lexical AST serializers, automatic topic tagging via hashtag parsing, keyword-based category inference, and PDF carousel slide cover resolution.",
        "Built a 4-tier data access and caching layer combining React cache() request memoization, process-level in-memory TTL caching, and granular Payload collection lifecycle hooks triggering targeted edge revalidations.",
        "Designed a bot-resistant serverless contact pipeline featuring an invisible honeypot trap, relational inquiry auditing in PostgreSQL, and direct SMTP notifications via Nodemailer and Google App Passwords."
      ),
      problem: createLexicalDoc(
        "Modern software engineers face a dilemma when publishing work: standard SaaS website builders (Webflow, Squarespace, Wix) introduce vendor lock-in, generic designs, and monthly subscription overhead ($15-$40/month) while obscuring technical capabilities. Conversely, headless CMS architectures typically require running two separate services—a CMS backend and a frontend application—multiplying hosting complexity, cold-start latency, and maintenance overhead.",
        "Additionally, cross-posting technical insights across LinkedIn and a personal portfolio is traditionally a manual, repetitive chore. Manually copying markdown, re-uploading media assets, and rebuilding sitemaps leads to content divergence, where personal blogs quickly become abandoned digital ghost towns.",
        "The objective was to build a self-hosted, high-performance developer portfolio and CMS engine that functions as an engineering showcase in itself: production-grade architecture, zero ongoing cloud expenses, strict accessibility (WCAG AA), and autonomous content synchronization."
      ),
      constraints: createLexicalDoc(
        "Financial & Cloud Constraint: Absolute ₹0/month recurring infrastructure spend. Card-free deployment on Vercel Hobby, Neon PostgreSQL free tier, and GitHub Actions, with strict zero-cost risk mitigation against accidental overages.",
        "Platform Limitations: Vercel Hobby limits serverless request bodies to 4.5 MB, restricts Cron jobs to a maximum of one execution per 24 hours, and shuts down idle execution lambdas. The system had to gracefully operate within these resource boundaries.",
        "Integrity & Realism: Strict zero-fabrication policy. All technical metrics, performance claims, and project histories must be verifiable in the codebase. Schema migrations in PostgreSQL must be executed with push: false for production safety."
      ),
      architecture: createLexicalDoc(
        "The application is structured as a unified Next.js 16 App Router monolith where Payload CMS 3 operates as an embedded service rather than a standalone HTTP backend. Communication between the public presentation layer and the content engine occurs via Payload's in-process Local API (getPayload()), eliminating inter-service network serialization, DNS overhead, and REST round-trip latency.",
        "To solve style collision, the codebase is partitioned into two distinct App Router route groups: src/app/(frontend) applies full Tailwind CSS v4 with global preflight resets, custom Google Fonts (Geist, Geist Mono, Fraunces), and theme tokens. The admin dashboard is quarantined under src/app/(payload) using a specialized payload-admin.css that imports only Tailwind utilities and theme variables, preventing CSS resets from breaking Payload's internal form components.",
        "Content persistence is managed by Neon Serverless PostgreSQL through @payloadcms/db-vercel-postgres and Drizzle ORM. An automated synchronization orchestrator runs on a daily schedule, querying Buffer's GraphQL API, transforming published posts into Lexical AST documents, saving media to local storage or Vercel Blob, and maintaining atomic transaction records."
      ),
      decisions: [
        {
          title: "Embedded Next.js Monolith vs Separate Headless CMS Microservices",
          context: "Hosting a separate Node.js server for Payload CMS alongside a Next.js frontend exceeded free-tier limits and introduced cross-origin latency.",
          alternatives: "Deploying Strapi or Payload CMS on a separate cloud container (Render / Railway) plus Next.js on Vercel.",
          decision: "Integrated Payload CMS 3 directly into Next.js App Router using route-group layout isolation and in-process Local API bindings.",
          tradeoffs: "Requires strict server/client boundary enforcement and CSS preflight isolation, but eliminates inter-service HTTP latency and reduces hosting costs to ₹0/month.",
        },
        {
          title: "Autonomous Buffer GraphQL Ingestion vs Direct LinkedIn API OAuth",
          context: "LinkedIn's official Developer API requires enterprise partner approval, complex app reviews, and short-lived OAuth access tokens (60 days) requiring manual re-authentication.",
          alternatives: "Direct LinkedIn REST API integration or third-party paid automation platforms (Zapier / Make).",
          decision: "Engineered a custom ingestion worker querying Buffer's GraphQL API with persistent Personal Access Tokens.",
          tradeoffs: "Posts are synchronized via scheduled batch jobs (daily cron) rather than instant webhooks, but requires zero maintenance and incurs zero third-party subscription fees.",
        },
        {
          title: "PDF Carousel Slide Thumbnail Prioritization vs Raw File Ingestion",
          context: "LinkedIn document carousel posts are uploaded as multi-slide PDFs. Downloading the raw application/pdf asset and binding it to coverImage crashed Next.js <Image> optimization.",
          alternatives: "Server-side headless browser rasterization of PDFs (e.g. Puppeteer/pdf2pic) or manual thumbnail uploads.",
          decision: "Intercepted asset MIME types in the ingestion pipeline, dynamically prioritizing Buffer's slide preview thumbnail image (JPEG/PNG) over the raw PDF.",
          tradeoffs: "Only the cover slide is rendered as a hero visual on the post page, but provides 100% reliable image rendering with an elegant fallback link to the original document.",
        },
        {
          title: "Multi-Tier In-Memory TTL & React Cache vs External Redis Layer",
          context: "Serverless PostgreSQL connections introduce cold-start latency (150-400ms) on cache misses, but hosting a persistent Redis cluster violated the ₹0 budget.",
          alternatives: "Uncached live database queries on every SSR request or external Upstash Redis free tier.",
          decision: "Constructed a 4-tier data access layer combining React cache() memoization, process-level in-memory TTL caching (60s), and event-driven Payload lifecycle hooks triggering Next.js revalidatePath().",
          tradeoffs: "In-memory cache is ephemeral across serverless cold starts, but revalidatePath() ensures edge-cached HTML is immediately updated upon CMS mutations.",
        },
        {
          title: "Invisible Honeypot & Database Ledger vs Third-Party CAPTCHAs",
          context: "Public contact forms are prone to bot scraping. Traditional CAPTCHAs create user friction and third-party trackers.",
          alternatives: "Google reCAPTCHA v3, Cloudflare Turnstile, or paid form services (Formspree).",
          decision: "Implemented an invisible honeypot field that silently drops automated bot payloads with a deceptive HTTP 200, coupled with PostgreSQL inquiry storage and Nodemailer SMTP delivery.",
          tradeoffs: "Gmail SMTP imposes a 500 emails/day quota, which is more than adequate for personal portfolio inquiries while maintaining complete independence from paid form APIs.",
        },
      ],
      implementation: createLexicalDoc(
        "Frontend & Design System: Built with Next.js 16 Server Components, React 19, and Tailwind CSS v4. Features an interactive System Architecture Topology diagram component with pipeline, idempotency, and failure state toggles. Integrated an interactive workstation Terminal Drawer (toggled via ~ shortcut) providing a command-line interface with custom commands (help, skills, projects, whoami, curl /api/health).",
        "Content Transformation Pipeline: In src/lib/buffer.ts, raw social media text is processed through specialized parsers: extractPostTitle strips emojis, bullet markers, and markdown syntax to formulate clean headlines; extractPostExcerpt extracts opening context while strictly enforcing Payload's 240-character schema constraint; extractHashtags normalizes tags and automatically creates Tag records; and convertTextToLexical serializes multi-paragraph text into valid Lexical AST nodes.",
        "Media Handling & Static Routing: Uploaded media is stored with staticDir: public/media. An afterRead hook in src/collections/Media.ts guarantees that media documents resolve their url to /media/${filename}, enabling Next.js static asset server to serve images directly without hitting API route handlers.",
        "Live Health & Telemetry: Implemented /api/health returning real-time system diagnostic telemetry including Node runtime version, process memory usage (heap and RSS), PostgreSQL driver status, connection latency in milliseconds, and total response time."
      ),
      testing: createLexicalDoc(
        "Engineered a zero-dependency automated test suite using Node.js native test runner (node:test) and tsx. The suite encompasses 61 unit tests across 23 test suites, achieving 100% test pass rates across all domains.",
        "Test suites rigorously validate: (1) Access control rules ensuring anonymous queries never expose draft posts or projects; (2) Title and excerpt extraction edge cases, including 240-character boundaries and hashtag stripping; (3) Lexical AST root and paragraph node serialization; (4) Media collection afterRead URL normalization; (5) Reading time estimation accuracy; (6) Schema.org structured data generators; and (7) Dynamic sitemap and robots exclusions."
      ),
      outcomes: createLexicalDoc(
        "Zero Recurring Infrastructure Cost: Successfully deployed and operating in production on Vercel Hobby + Neon Serverless PostgreSQL with ₹0.00/month recurring expenses.",
        "Sub-15ms Cached Edge Response: Multi-tier caching layer and React Server Components deliver lightning-fast page transitions with immediate edge cache invalidation upon CMS edits.",
        "Autonomous Weekly Content Sync: Ingested 10+ published LinkedIn technical articles and carousels automatically via Buffer GraphQL API, eliminating manual content management.",
        "100% Test & Type Safety: Full TypeScript strict mode compliance with zero type errors, zero lint warnings, and 61 passing unit tests."
      ),
      lessonsLearned: createLexicalDoc(
        "Co-locating a headless CMS inside Next.js App Router is a game-changer for solo engineers. The ability to use typed Local API calls in React Server Components without HTTP serialization dramatically simplifies architecture while keeping cloud footprints minimal.",
        "External API integration requires defensive content normalization. Assuming external APIs provide pure image URLs or clean text will inevitably break client renderers. Handling edge cases—such as PDF carousel uploads and emoji-laden hooks—at the ingestion boundary ensures downstream UI stability.",
        "Strict schema discipline and automated tests save days of debugging in serverless environments. Having a schema-backed fixture fallback allowed uninterrupted UI development even when database credentials were unavailable."
      ),
      seo: {
        title: "Autonomous Developer Portfolio & Headless CMS Engine | Vraj Clerk",
        description:
          "Comprehensive engineering case study on architecting a zero-cost full-stack portfolio monolith using Next.js 16, Payload CMS 3, and Neon PostgreSQL with automated Buffer LinkedIn sync.",
      },
    };

    // 3. Upsert into Projects Collection
    const existingProject = await payload.find({
      collection: "projects",
      where: { slug: { equals: projectSlug } },
      limit: 1,
    });

    if (existingProject.docs.length > 0) {
      const docId = existingProject.docs[0].id;
      const updated = await payload.update({
        collection: "projects",
        id: docId,
        data: projectData,
      });
      console.log(`\n✅ Successfully UPDATED project in Payload CMS!`);
      console.log(`   • Title: "${updated.title}"`);
      console.log(`   • Slug:  /projects/${updated.slug}`);
      console.log(`   • ID:    ${updated.id}\n`);
    } else {
      const created = await payload.create({
        collection: "projects",
        data: projectData,
        draft: false,
      });
      console.log(`\n✅ Successfully CREATED project in Payload CMS!`);
      console.log(`   • Title: "${created.title}"`);
      console.log(`   • Slug:  /projects/${created.slug}`);
      console.log(`   • ID:    ${created.id}\n`);
    }

    console.log("=======================================================");
    console.log("   CASE STUDY SEEDING FINISHED SUCCESSFULLY!           ");
    console.log("=======================================================\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Failed to seed case study:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();

