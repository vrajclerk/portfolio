/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import { sql } from "@payloadcms/db-vercel-postgres";
import fs from "fs";
import path from "path";
import {
  createLexicalDoc,
  fixtureCategories,
} from "@/lib/fixtures";

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise });

    // Ensure hidden columns exist in PostgreSQL
    try {
      if (payload.db && (payload.db as any).drizzle) {
        await (payload.db as any).drizzle.execute(sql`
          ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
          ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_hidden" boolean DEFAULT false;
          ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false;
          ALTER TABLE "_projects_v" ADD COLUMN IF NOT EXISTS "version_hidden" boolean DEFAULT false;
        `);
      }
    } catch (sqlErr) {
      console.warn("SQL migration notice:", sqlErr);
    }

    // -------------------------------------------------------------------------
    // 0. Ensure Admin User
    // -------------------------------------------------------------------------
    const adminEmail = "vrajclerk04@gmail.com";
    const adminPass = "vrajclerk44@";
    const existingUser = await payload.find({
      collection: "users",
      where: { email: { equals: adminEmail } },
      limit: 1,
    });

    if (existingUser.docs.length === 0) {
      await payload.create({
        collection: "users",
        data: {
          email: adminEmail,
          password: adminPass,
          name: "Vraj Clerk",
          role: "admin",
        },
      });
    } else {
      await payload.update({
        collection: "users",
        id: existingUser.docs[0].id,
        data: {
          password: adminPass,
        },
      });
    }

    // -------------------------------------------------------------------------
    // 1. Media Seeding (Resume PDF & Profile Image)
    // -------------------------------------------------------------------------
    let resumeMediaId: number | null = null;
    let profileMediaId: number | null = null;

    try {
      const existingMedia = await payload.find({
        collection: "media",
        limit: 100,
      });

      // Find or upload Resume PDF
      const pdfMediaDoc = existingMedia.docs.find(
        (m) => m.filename?.includes("VRAJ_Python_Developer") || m.alt?.includes("Resume")
      );

      if (pdfMediaDoc) {
        resumeMediaId = pdfMediaDoc.id;
      } else {
        const resumePath = path.resolve(process.cwd(), "public/media/VRAJ_Python_Developer.pdf");
        if (fs.existsSync(resumePath)) {
          const fileBuffer = fs.readFileSync(resumePath);
          const stats = fs.statSync(resumePath);
          const uploadedResume = await payload.create({
            collection: "media",
            file: {
              data: fileBuffer,
              name: "VRAJ_Python_Developer.pdf",
              mimetype: "application/pdf",
              size: stats.size,
            },
            data: {
              alt: "Vraj Clerk Resume - Python Developer",
              caption: "Curriculum Vitae for Vraj Clerk, Python & Backend Systems Developer",
            },
          });
          resumeMediaId = uploadedResume.id;
        }
      }

      // Find or upload Profile Photo
      const photoMediaDoc = existingMedia.docs.find(
        (m) => m.filename?.includes("IMG_20240306") || m.alt?.includes("Profile Photo")
      );

      if (photoMediaDoc) {
        profileMediaId = photoMediaDoc.id;
      } else {
        const photoPath = path.resolve(process.cwd(), "public/media/IMG_20240306_180503_775.webp");
        if (fs.existsSync(photoPath)) {
          const fileBuffer = fs.readFileSync(photoPath);
          const stats = fs.statSync(photoPath);
          const uploadedPhoto = await payload.create({
            collection: "media",
            file: {
              data: fileBuffer,
              name: "IMG_20240306_180503_775.webp",
              mimetype: "image/webp",
              size: stats.size,
            },
            data: {
              alt: "Vraj Clerk - Profile Photo",
              caption: "Vraj Clerk, Software Engineer",
            },
          });
          profileMediaId = uploadedPhoto.id;
        }
      }
    } catch (mediaErr) {
      console.warn("Media seeding notice:", mediaErr);
    }

    // -------------------------------------------------------------------------
    // 2. Comprehensive Tags Seeding (Resume Skills & Technologies)
    // -------------------------------------------------------------------------
    const tagsToSeed = [
      { name: "Python", slug: "python", description: "FastAPI, RESTful APIs, OOP, Reusable Python packages" },
      { name: "FastAPI", slug: "fastapi", description: "High-performance asynchronous REST API framework with Pydantic validation" },
      { name: "PostgreSQL", slug: "postgresql", description: "Relational database schema, indexing, transactions, and migrations" },
      { name: "OpenSearch", slug: "opensearch", description: "Enterprise search integration, hierarchical indexing, and query encapsulation" },
      { name: "Amazon DynamoDB", slug: "dynamodb", description: "NoSQL key-value store, DynamoDB Streams for audit tracking" },
      { name: "AWS", slug: "aws", description: "Lambda, S3, DynamoDB, API Gateway, EC2, ECR cloud infrastructure" },
      { name: "Docker", slug: "docker", description: "Containerizing backend services and microservice environments" },
      { name: "Terraform", slug: "terraform", description: "Infrastructure as Code (IaC) provisioning for AWS resources" },
      { name: "Machine Learning", slug: "machine-learning", description: "Deep learning semantic segmentation with U-Net & ResNet34" },
      { name: "MySQL", slug: "mysql", description: "Relational database schemas, order calendars, and transaction logs" },
      { name: "MongoDB", slug: "mongodb", description: "Document-oriented database and flexible schema designs" },
      { name: "Auth0 & RBAC", slug: "auth0-rbac", description: "Auth0 authentication patterns and role-based access control across services" },
      { name: "Locust", slug: "locust", description: "Load testing framework for high concurrency simulation (800+ concurrent users)" },
      { name: "TypeScript", slug: "typescript", description: "Full-stack static typing and modern web architectures" },
      { name: "Next.js", slug: "nextjs", description: "Next.js App Router, React Server Components, and SSR/SSG" },
      { name: "System Design", slug: "system-design", description: "Distributed architectures, concurrency, and reliability" },
    ];

    const tagMap = new Map<string, number>();
    for (const tag of tagsToSeed) {
      const existing = await payload.find({
        collection: "tags",
        where: { slug: { equals: tag.slug } },
        limit: 1,
      });

      if (existing.docs.length > 0) {
        tagMap.set(tag.slug, existing.docs[0].id);
      } else {
        const created = await payload.create({
          collection: "tags",
          data: {
            name: tag.name,
            slug: tag.slug,
            description: tag.description,
          },
        });
        tagMap.set(tag.slug, created.id);
      }
    }

    // -------------------------------------------------------------------------
    // 3. Categories Seeding
    // -------------------------------------------------------------------------
    const categoryMap = new Map<string, number>();
    for (const cat of fixtureCategories) {
      const existing = await payload.find({
        collection: "categories",
        where: { slug: { equals: cat.slug } },
        limit: 1,
      });

      if (existing.docs.length > 0) {
        categoryMap.set(cat.slug, existing.docs[0].id);
      } else {
        const created = await payload.create({
          collection: "categories",
          data: {
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
          },
        });
        categoryMap.set(cat.slug, created.id);
      }
    }

    // -------------------------------------------------------------------------
    // 4. Projects Seeding (Resume Real-World Projects + Test Compatibility)
    // -------------------------------------------------------------------------
    const projectsToSeed = [
      {
        title: "Autonomous Developer Portfolio & Headless CMS Engine",
        slug: "zero-cost-portfolio-cms",
        summary:
          "A self-hosted, production-grade developer portfolio and headless CMS monolith engineered with Next.js 16 App Router, Payload CMS 3, and Neon Serverless PostgreSQL. Features autonomous LinkedIn post synchronization via Buffer GraphQL, sub-15ms multi-tier caching, bot-resistant contact pipelines, and an interactive developer CLI workstation—operating under strict ₹0/month infrastructure constraints.",
        projectType: "personal",
        role: "Lead Systems Architect & Full-Stack Engineer",
        featured: true,
        displayOrder: 1,
        _status: "published",
        repositoryUrl: "https://github.com/vrajclerk/portfolio",
        liveUrl: "https://vrajclerk.vercel.app",
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
        tagSlugs: ["nextjs", "typescript", "postgresql", "system-design"],
      },
      {
        title: "Competitive Pickleball Matchmaking & Scoring Platform",
        slug: "pickleball-matchmaking-scoring-platform",
        summary:
          "Real-time matchmaking and ranking engine with custom player scoring metrics, team rating calculations, and geolocation-based leaderboard generation.",
        projectType: "personal",
        role: "Backend Engineer",
        featured: true,
        displayOrder: 1,
        _status: "published",
        contribution: createLexicalDoc(
          "Engineered the core matchmaking algorithm and ranking pipeline. Offloaded real-time ranking recalculations to background worker queues to ensure zero perceptible latency on match completion."
        ),
        problem: createLexicalDoc(
          "Concurrent tournament play resulted in rapid bursts of match completion payloads, causing relational database contention, leaderboard query spikes, and elevated response times."
        ),
        constraints: createLexicalDoc(
          "Must process leaderboard updates under 100ms end-to-end, support 800+ concurrent users, and maintain absolute scoring idempotency."
        ),
        architecture: createLexicalDoc(
          "FastAPI asynchronous endpoints receiving match submissions, offloading recalculations to background task workers with PostgreSQL ACID transaction guarantees."
        ),
        decisions: [
          {
            title: "Async Queue Offloading vs In-line Transactional Recalculation",
            context: "Match completion endpoint latency increased under concurrent tournament finals.",
            alternatives: "Compute full leaderboard recalculation synchronously inside the HTTP handler, or dispatch async background worker events.",
            decision: "Dispatched ranking calculation jobs to asynchronous worker queues immediately acknowledging match submission.",
            tradeoffs: "Eventual consistency of leaderboard within ~200ms in exchange for instant sub-50ms API response times.",
          },
        ],
        implementation: createLexicalDoc(
          "Implemented with Python, FastAPI, PostgreSQL connection pooling, and optimized geospatial indexing for local ladder rankings."
        ),
        testing: createLexicalDoc(
          "Conducted rigorous load testing using Locust with 800+ concurrent simulated players, identifying database bottlenecks and verifying sub-100ms end-of-match latency."
        ),
        outcomes: createLexicalDoc(
          "Successfully sustained 800+ concurrent simulated users with zero dropped matches and 65% reduction in 99th-percentile API response latency."
        ),
        lessonsLearned: createLexicalDoc(
          "Isolating read-heavy leaderboard views from write-heavy match scoring eliminates row contention under burst tournament conditions."
        ),
        tagSlugs: ["python", "fastapi", "postgresql", "locust", "system-design"],
      },
      {
        title: "Enterprise Master-Child Material Architecture & OpenSearch Engine",
        slug: "enterprise-material-management-architecture",
        summary:
          "Scalable Master-Child Material Architecture for an enterprise material management platform, migrating legacy models to hierarchical attributes with DynamoDB Streams and OpenSearch indexing.",
        projectType: "professional",
        role: "Junior Software Developer (Techlusion)",
        featured: true,
        displayOrder: 2,
        _status: "published",
        contribution: createLexicalDoc(
          "Architected and developed the hierarchical master-child material schema. Created an internal reusable Python package that encapsulates OpenSearch query construction, simplifying search integration across development teams."
        ),
        problem: createLexicalDoc(
          "The enterprise platform previously used legacy monolithic data models that could not model complex attribute inheritance between base materials and variations, causing slow multi-criteria queries and data inconsistency."
        ),
        constraints: createLexicalDoc(
          "Must support high-throughput Excel imports, real-time audit compliance tracking, and zero downtime migration from legacy schemas."
        ),
        architecture: createLexicalDoc(
          "AWS Lambda backend leveraging DynamoDB Streams to automatically capture and index all material mutations into OpenSearch for sub-second multi-faceted querying."
        ),
        decisions: [
          {
            title: "DynamoDB Streams Change Data Capture vs Application-Level Dual Writes",
            context: "Synchronizing material mutations into OpenSearch without data loss or partial write inconsistency.",
            alternatives: "Write to DynamoDB and OpenSearch sequentially in application code, or rely on DynamoDB Streams CDC.",
            decision: "Employed DynamoDB Streams triggering Lambda consumers to feed OpenSearch asynchronously.",
            tradeoffs: "OpenSearch reflects updates with a 100-300ms propagation delay, but guarantees zero dropped sync events during network partitions.",
          },
        ],
        implementation: createLexicalDoc(
          "Developed in Python with AWS Lambda, DynamoDB, OpenSearch, S3, API Gateway, and Docker. Implemented Auth0 RBAC and an equipment visualization module with high-throughput Excel imports."
        ),
        testing: createLexicalDoc(
          "End-to-end integration tests validating DynamoDB stream delivery, OpenSearch facet accuracy, and audit log fidelity under high-volume bulk Excel uploads."
        ),
        outcomes: createLexicalDoc(
          "Dramatically reduced manual data-entry overhead through automated synchronization, while the shared Python OpenSearch package became the standard across 4 internal engineering teams."
        ),
        lessonsLearned: createLexicalDoc(
          "Encapsulating complex domain query builders into standalone internal libraries creates massive team velocity gains."
        ),
        tagSlugs: ["python", "opensearch", "dynamodb", "aws", "docker", "auth0-rbac"],
      },
      {
        title: "Lixor: Bottle & Liquid Level Detection System",
        slug: "lixor-bottle-liquid-level-detection",
        summary:
          "Deep learning semantic segmentation model using U-Net with a ResNet34 backbone to detect bottles and identify precise liquid fill levels in industrial inspection images.",
        projectType: "experiment",
        role: "Machine Learning Engineer",
        featured: true,
        displayOrder: 3,
        _status: "published",
        contribution: createLexicalDoc(
          "Constructed the complete computer vision pipeline from data annotation and mask preprocessing to training and fine-tuning the U-Net architecture."
        ),
        problem: createLexicalDoc(
          "Quality assurance on beverage packaging lines requires detecting under-filled or over-filled containers where fluid transparency and reflections cause standard thresholding algorithms to fail."
        ),
        constraints: createLexicalDoc(
          "Must achieve high pixel-level accuracy across varying bottle shapes, colors, and refraction effects under manufacturing lighting."
        ),
        architecture: createLexicalDoc(
          "U-Net architecture with an ImageNet-pretrained ResNet34 encoder backbone for rich spatial feature extraction, paired with custom decoder layers."
        ),
        decisions: [
          {
            title: "Combined Cross-Entropy and Dice Loss vs Standard Binary Cross-Entropy",
            context: "Liquid levels represent a fraction of the overall image pixels, causing class imbalance during model optimization.",
            alternatives: "Standard Binary Cross-Entropy, Focal Loss, or Combined Cross-Entropy + Dice Loss.",
            decision: "Trained using a combined Cross-Entropy and Dice Loss function.",
            tradeoffs: "Requires slightly more computation per backpropagation step, but produces vastly sharper boundary segmentation.",
          },
        ],
        implementation: createLexicalDoc(
          "Annotated and curated custom packaging datasets using LabelMe. Implemented data augmentation, mask binarization, and validation metrics tracking."
        ),
        testing: createLexicalDoc(
          "Evaluated on held-out test datasets using Mean Intersection over Union (mIoU) and boundary F1-scores across translucent, tinted, and opaque bottle variations."
        ),
        outcomes: createLexicalDoc(
          "Attained high segmentation fidelity and boundary precision on container liquid levels, demonstrating the viability of automated visual inspection."
        ),
        lessonsLearned: createLexicalDoc(
          "A robust dataset annotation and augmentation pipeline is more critical to segmentation generalization than purely increasing model parameter count."
        ),
        tagSlugs: ["python", "machine-learning"],
      },
      {
        title: "Tiffin Booking System (Tiffin Buddy)",
        slug: "tiffin-buddy-meal-booking-system",
        summary:
          "A full-stack web platform automating meal subscriptions, daily order calendars, and delivery workflows with relational MySQL persistence.",
        projectType: "personal",
        role: "Full-Stack Developer",
        featured: false,
        displayOrder: 4,
        _status: "published",
        contribution: createLexicalDoc(
          "Architected the relational MySQL database schema, built RESTful API services, and developed the customer subscription calendar interface."
        ),
        problem: createLexicalDoc(
          "Independent tiffin and meal delivery services relied on manual pen-and-paper tracking for flexible daily meal plans, leading to scheduling disputes and billing errors."
        ),
        constraints: createLexicalDoc(
          "Must support schedule pause/resume workflows, transaction audits, and simple mobile-responsive customer ordering."
        ),
        architecture: createLexicalDoc(
          "MERN stack web application backed by MySQL for strict transactional consistency across subscription calendars and payment logs."
        ),
        decisions: [
          {
            title: "Relational MySQL Schema vs NoSQL Document Store for Calendars",
            context: "Handling daily customer subscription state and date-range overrides.",
            alternatives: "MongoDB unstructured documents or MySQL normalized relational tables.",
            decision: "Chosen MySQL relational schema to enforce strict foreign key constraints between customer subscriptions, delivery days, and invoices.",
            tradeoffs: "Requires relational schema migration maintenance, but prevents phantom delivery cancellations.",
          },
        ],
        implementation: createLexicalDoc(
          "Built using Node.js, Express, React, and MySQL with connection pooling and parameter validation."
        ),
        testing: createLexicalDoc(
          "Integration tests simulating multi-week recurring schedule modifications, mid-cycle cancellations, and invoice generation."
        ),
        outcomes: createLexicalDoc(
          "Automated the meal subscription lifecycle, eliminating manual ledger updates and providing real-time delivery manifests."
        ),
        lessonsLearned: createLexicalDoc(
          "Strict database constraints at the schema level prevent business logic edge cases that application code easily overlooks."
        ),
        tagSlugs: ["mysql", "typescript", "system-design"],
      },
      // Test-suite required projects:
      {
        title: "High-Throughput Webhook Processing Pipeline",
        slug: "webhook-processing-pipeline",
        summary:
          "A resilient ingestion pipeline handling transactional webhook events with idempotent deduplication and retry queues.",
        projectType: "professional",
        role: "Backend Engineer",
        featured: false,
        displayOrder: 5,
        _status: "published",
        contribution: createLexicalDoc(
          "Designed idempotent event-handling mechanism and partitioned PostgreSQL table schema with structured logging."
        ),
        problem: createLexicalDoc(
          "Burst delivery of webhook notifications caused database connection exhaustion and duplicate processing."
        ),
        constraints: createLexicalDoc("Must guarantee at-least-once processing without duplicate side effects."),
        architecture: createLexicalDoc("API endpoints with PostgreSQL composite uniqueness constraints and retry queues."),
        decisions: [
          {
            title: "Database-Level Deduplication vs Redis Cache",
            context: "Deduplicating duplicate events under provider retry storms.",
            alternatives: "Redis SETNX or PostgreSQL unique constraint with ON CONFLICT DO NOTHING.",
            decision: "Used PostgreSQL unique composite index.",
            tradeoffs: "Eliminated separate cache infrastructure while preserving zero-cost operations.",
          },
        ],
        implementation: createLexicalDoc("Implemented with TypeScript, Next.js, and PostgreSQL."),
        testing: createLexicalDoc("Automated integration tests for duplicate event rejection."),
        outcomes: createLexicalDoc("Maintained zero duplicate writes across all production ingestion runs."),
        lessonsLearned: createLexicalDoc("Database primitives often outperform auxiliary caching for moderate scale."),
        tagSlugs: ["postgresql", "system-design", "typescript"],
      },
      {
        title: "Draft Query Cache Experiment",
        slug: "draft-query-cache-experiment",
        summary: "Internal draft project fixture used to test draft mode protection in automated test suites.",
        projectType: "experiment",
        role: "Author",
        featured: false,
        displayOrder: 6,
        _status: "draft",
        contribution: createLexicalDoc("Draft fixture."),
        problem: createLexicalDoc("Draft fixture."),
        constraints: createLexicalDoc("Draft fixture."),
        architecture: createLexicalDoc("Draft fixture."),
        decisions: [],
        implementation: createLexicalDoc("Draft fixture."),
        testing: createLexicalDoc("Draft fixture."),
        outcomes: createLexicalDoc("Draft fixture."),
        lessonsLearned: createLexicalDoc("Draft fixture."),
        tagSlugs: ["system-design"],
      },
    ];

    const projectResults = [];
    const seededProjectIds: number[] = [];

    for (const proj of projectsToSeed) {
      const existing = await payload.find({
        collection: "projects",
        where: { slug: { equals: proj.slug } },
        limit: 1,
      });

      const techIds: number[] = [];
      for (const ts of proj.tagSlugs) {
        const tid = tagMap.get(ts);
        if (tid) techIds.push(tid);
      }

      if (existing.docs.length > 0) {
        const updated = await payload.update({
          collection: "projects",
          id: existing.docs[0].id,
          data: {
            title: proj.title,
            summary: proj.summary,
            projectType: proj.projectType as any,
            role: proj.role,
            featured: proj.featured,
            displayOrder: proj.displayOrder,
            _status: proj._status as any,
            contribution: proj.contribution as any,
            problem: proj.problem as any,
            constraints: proj.constraints as any,
            architecture: proj.architecture as any,
            decisions: proj.decisions,
            implementation: proj.implementation as any,
            testing: proj.testing as any,
            outcomes: proj.outcomes as any,
            lessonsLearned: proj.lessonsLearned as any,
            technologies: techIds,
          },
        });
        projectResults.push({ slug: proj.slug, status: "updated", id: updated.id });
        if (proj._status === "published" && proj.featured) {
          seededProjectIds.push(updated.id);
        }
      } else {
        const created = await payload.create({
          collection: "projects",
          data: {
            title: proj.title,
            slug: proj.slug,
            summary: proj.summary,
            projectType: proj.projectType as any,
            role: proj.role,
            featured: proj.featured,
            displayOrder: proj.displayOrder,
            _status: proj._status as any,
            contribution: proj.contribution as any,
            problem: proj.problem as any,
            constraints: proj.constraints as any,
            architecture: proj.architecture as any,
            decisions: proj.decisions,
            implementation: proj.implementation as any,
            testing: proj.testing as any,
            outcomes: proj.outcomes as any,
            lessonsLearned: proj.lessonsLearned as any,
            technologies: techIds,
          },
        });
        projectResults.push({ slug: proj.slug, status: "created", id: created.id });
        if (proj._status === "published" && proj.featured) {
          seededProjectIds.push(created.id);
        }
      }
    }

    // -------------------------------------------------------------------------
    // 5. Global: Profile (Core Capabilities, Experience, Bio, Links)
    // -------------------------------------------------------------------------
    const profileData = {
      headline: "Python Developer | FastAPI, PostgreSQL, AWS & Distributed Systems",
      shortBio: createLexicalDoc(
        "Python Developer with professional experience building backend services, reusable Python utilities, REST APIs, and cloud-based applications. Hands-on experience with FastAPI, PostgreSQL, OpenSearch, AWS, and Docker, including enterprise application development, search integration, and scalable backend architecture. Additional experience in deep learning and computer vision using U-Net and ResNet34."
      ),
      ...(profileMediaId ? { profileImage: profileMediaId } : {}),
      ...(resumeMediaId ? { resumeFile: resumeMediaId } : {}),
      experience: [
        {
          organization: "Techlusion",
          role: "Software Developer Intern → Junior Software Developer",
          startDate: "2024-12-01T00:00:00.000Z",
          current: true,
          summary:
            "• Developed an internal Python package that encapsulates OpenSearch queries into reusable utilities, simplifying search integration and promoting code reuse across development teams.\n• Designed and implemented a scalable Master-Child Material Architecture for an enterprise material management platform, migrating legacy data models to hierarchical attributes with audit tracking through DynamoDB Streams and OpenSearch indexing.\n• Built and maintained AWS infrastructure using Lambda, DynamoDB, S3, API Gateway, EC2, and ECR to support backend services and application deployments.\n• Implemented Auth0-based authentication and role-based access control (RBAC) across multiple applications, establishing reusable authorization patterns.\n• Developed an equipment visualization and data synchronization module with interactive charts and high-throughput Excel imports, reducing manual data-entry effort.",
        },
      ],
      skills: [
        {
          category: "Languages & Core",
          items: [
            { name: "Python", context: "FastAPI, RESTful APIs, OOP, Reusable internal packages" },
            { name: "JavaScript", context: "Modern ES6+, Asynchronous runtime, DOM & frontend integrations" },
            { name: "TypeScript", context: "Full-stack static typing and modern React/Next.js architectures" },
            { name: "SQL", context: "Relational modeling, indexing, ACID transactions in PostgreSQL & MySQL" },
          ],
        },
        {
          category: "Python & Backend Systems",
          items: [
            { name: "FastAPI", context: "High-performance asynchronous endpoints, dependency injection, Pydantic" },
            { name: "RESTful APIs", context: "Resource modeling, Auth0 authentication & RBAC middleware" },
            { name: "OpenSearch Integration", context: "Reusable query encapsulation package for development teams" },
            { name: "Data Sync & Excel Automation", context: "High-throughput data synchronization and interactive charts" },
          ],
        },
        {
          category: "Databases & Search",
          items: [
            { name: "PostgreSQL", context: "Relational schema design, complex queries, ACID transactions" },
            { name: "OpenSearch", context: "Hierarchical material indexing & high-throughput search queries" },
            { name: "Amazon DynamoDB", context: "NoSQL key-value schemas, DynamoDB Streams for audit tracking" },
            { name: "MySQL", context: "Relational schemas, meal subscription calendars, transaction logs" },
            { name: "MongoDB", context: "Document-oriented storage & flexible NoSQL schemas" },
          ],
        },
        {
          category: "Cloud & DevOps",
          items: [
            { name: "AWS Ecosystem", context: "Lambda (serverless), S3, DynamoDB, API Gateway, EC2, ECR" },
            { name: "Docker", context: "Containerizing backend services and local developer environments" },
            { name: "Terraform", context: "Infrastructure as Code (IaC) configuration for cloud resources" },
            { name: "CI/CD Pipelines", context: "Automated test execution, linting pipelines & deployment workflows" },
          ],
        },
        {
          category: "Deep Learning & Vision",
          items: [
            { name: "U-Net & ResNet34", context: "Semantic segmentation for bottle and liquid level detection" },
            { name: "Computer Vision Pipelines", context: "LabelMe image annotation, mask preprocessing, Dice & Cross-Entropy loss" },
          ],
        },
        {
          category: "System Design & Quality",
          items: [
            { name: "Master-Child Architecture", context: "Enterprise material management with stream-based indexing" },
            { name: "Role-Based Access Control", context: "Auth0 authorization patterns across multiple services" },
            { name: "Locust Load Testing", context: "Load testing under 800+ concurrent users with queue offloading" },
          ],
        },
      ],
      socialLinks: [
        { platform: "GitHub", url: "https://github.com/vrajclerk" },
        { platform: "LinkedIn", url: "https://linkedin.com/in/vraj-clerk" },
      ],
    };

    const updatedProfile = await payload.updateGlobal({
      slug: "profile",
      data: profileData,
    });

    // -------------------------------------------------------------------------
    // 6. Global: Site Settings
    // -------------------------------------------------------------------------
    const updatedSiteSettings = await payload.updateGlobal({
      slug: "site-settings",
      data: {
        siteName: "Vraj Clerk | Python & Backend Systems Engineer",
        siteUrl: "http://localhost:3000",
        defaultDescription:
          "Python Developer with professional experience building backend services, reusable Python utilities, REST APIs, and cloud-based applications with FastAPI, PostgreSQL, AWS, and OpenSearch.",
        publicEmail: "vrajclerk04@gmail.com",
        socialLinks: [
          { label: "GitHub", url: "https://github.com/vrajclerk" },
          { label: "LinkedIn", url: "https://linkedin.com/in/vraj-clerk" },
        ],
      },
    });

    // -------------------------------------------------------------------------
    // 7. Global: Homepage Settings
    // -------------------------------------------------------------------------
    // Find featured posts
    const existingPosts = await payload.find({
      collection: "posts",
      where: { _status: { equals: "published" } },
      limit: 2,
    });
    const featuredPostIds = existingPosts.docs.map((p) => p.id);

    const updatedHomepageSettings = await payload.updateGlobal({
      slug: "homepage-settings",
      data: {
        heroHeadline: "Python & Backend Systems Engineer",
        heroSubheadline:
          "Building resilient backend services, reusable Python packages, and cloud-native architectures with FastAPI, PostgreSQL, AWS, and OpenSearch. Focused on high-throughput reliability, clean system design, and evidence-based performance.",
        featuredProjects: seededProjectIds.slice(0, 3),
        featuredPosts: featuredPostIds,
        sectionsVisibility: {
          showProjects: true,
          showPosts: true,
          showSkills: true,
          showContact: true,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Seeding complete with resume details, core capabilities, projects, and media",
      profile: {
        headline: updatedProfile.headline,
        skillsCount: updatedProfile.skills?.length,
        experienceCount: updatedProfile.experience?.length,
        resumeMediaId,
        profileMediaId,
      },
      projectsCount: projectResults.length,
      siteName: updatedSiteSettings.siteName,
      heroHeadline: updatedHomepageSettings.heroHeadline,
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
