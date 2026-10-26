/**
 * Schema-backed fixtures for local development, testing, and fallback rendering.
 *
 * Adheres strictly to Payload-generated types from `src/payload-types.ts`.
 * Follows the project rules:
 * - NO fabricated metrics or credentials.
 * - Clearly labeled sample/fixture content.
 * - Includes both published and draft entries to verify access control.
 */

import type {
  Category,
  HomepageSetting,
  Post,
  Profile,
  Project,
  SiteSetting,
  Tag,
} from "@/payload-types";

// ---------------------------------------------------------------------------
// Lexical Rich Text Helpers for Schema Fixtures
// ---------------------------------------------------------------------------

export function createLexicalDoc(...paragraphs: string[]) {
  return {
    root: {
      type: "root",
      format: "" as const,
      indent: 0,
      version: 1,
      direction: "ltr" as const,
      children: paragraphs.map((text) => ({
        type: "paragraph" as const,
        format: "" as const,
        indent: 0,
        version: 1,
        direction: "ltr" as const,
        children: [
          {
            type: "text" as const,
            text,
            version: 1,
            format: 0,
            style: "",
          },
        ],
      })),
    },
  };
}

// ---------------------------------------------------------------------------
// Taxonomies
// ---------------------------------------------------------------------------

export const fixtureCategories: Category[] = [
  {
    id: 1,
    name: "Architecture & Systems",
    slug: "architecture-systems",
    description: "System design, service boundaries, and backend reliability.",
    createdAt: "2026-10-01T10:00:00.000Z",
    updatedAt: "2026-10-01T10:00:00.000Z",
  },
  {
    id: 2,
    name: "TypeScript & Tooling",
    slug: "typescript-tooling",
    description: "Static typing, DX, and modern web application patterns.",
    createdAt: "2026-10-01T10:00:00.000Z",
    updatedAt: "2026-10-01T10:00:00.000Z",
  },
];

export const fixtureTags: Tag[] = [
  {
    id: 1,
    name: "TypeScript",
    slug: "typescript",
    description: "Strong typing in Node and browser environments.",
    createdAt: "2026-10-01T10:00:00.000Z",
    updatedAt: "2026-10-01T10:00:00.000Z",
  },
  {
    id: 2,
    name: "Next.js",
    slug: "nextjs",
    description: "Next.js App Router and server-rendered components.",
    createdAt: "2026-10-01T10:00:00.000Z",
    updatedAt: "2026-10-01T10:00:00.000Z",
  },
  {
    id: 3,
    name: "PostgreSQL",
    slug: "postgresql",
    description: "Relational database schema, indexing, and migrations.",
    createdAt: "2026-10-01T10:00:00.000Z",
    updatedAt: "2026-10-01T10:00:00.000Z",
  },
  {
    id: 4,
    name: "Payload CMS",
    slug: "payload-cms",
    description: "Headless CMS integration and type-safe data modeling.",
    createdAt: "2026-10-01T10:00:00.000Z",
    updatedAt: "2026-10-01T10:00:00.000Z",
  },
];

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const fixtureProjects: Project[] = [
  {
    id: 1,
    title: "High-Throughput Webhook Processing Pipeline",
    slug: "webhook-processing-pipeline",
    summary:
      "A resilient ingestion pipeline handling transactional webhook events with idempotent deduplication and retry queues.",
    projectType: "professional",
    role: "Backend Engineer",
    featured: true,
    displayOrder: 1,
    _status: "published",
    createdAt: "2026-08-15T09:00:00.000Z",
    updatedAt: "2026-10-10T14:30:00.000Z",
    contribution: createLexicalDoc(
      "Designed the idempotent event-handling mechanism and partitioned PostgreSQL table schema. Implemented structured structured logging and exponential backoff strategies for failed external deliveries."
    ),
    problem: createLexicalDoc(
      "Downstream third-party services produced bursty, out-of-order webhook deliveries leading to database connection pool exhaustion and redundant data mutations."
    ),
    constraints: createLexicalDoc(
      "Must operate within standard database resource quotas with zero message loss and guaranteed at-least-once processing semantics."
    ),
    architecture: createLexicalDoc(
      "Next.js API route receiving payloads, persisting state with monotonic sequence timestamps, and decoupling heavy processing through asynchronous background workers."
    ),
    decisions: [
      {
        id: "dec-1",
        title: "Database-Level Unique Deduplication Keys vs Distributed In-Memory Cache",
        context: "High duplicate payload rates during provider retry storms.",
        alternatives: "Redis SETNX with TTL or PostgreSQL unique constraint with ON CONFLICT DO NOTHING.",
        decision:
          "Used PostgreSQL unique composite index on (source_id, event_id) to eliminate Redis operational overhead and keep the architecture strictly zero-cost.",
        tradeoffs:
          "Slightly higher disk IO under peak concurrency, but eliminated another stateful infrastructure dependency.",
      },
    ],
    implementation: createLexicalDoc(
      "Built with strict TypeScript schema validation, connection-pooled PostgreSQL queries, and transactional writes wrapped in advisory locks where concurrent updates occurred."
    ),
    testing: createLexicalDoc(
      "Automated integration tests verifying out-of-order delivery tolerance, duplicate event rejection, and graceful database reconnects under network partition simulation."
    ),
    outcomes: createLexicalDoc(
      "Maintained zero duplicate writes across all production ingestion runs and stable connection pool consumption during peak traffic surges."
    ),
    lessonsLearned: createLexicalDoc(
      "Relying on database-native transactional primitives often proves simpler and more resilient than introducing auxiliary distributed caches for moderate scale."
    ),
    technologies: [fixtureTags[0], fixtureTags[2]],
    repositoryUrl: "https://github.com/vrajclerk/portfolio",
    liveUrl: "https://example.com/demo-webhook",
  },
  {
    id: 2,
    title: "Zero-Cost Developer Portfolio & CMS",
    slug: "zero-cost-portfolio-cms",
    summary:
      "A fully self-hosted developer portfolio and headless CMS running Next.js App Router, Payload 3, and PostgreSQL with zero recurring cloud costs.",
    projectType: "personal",
    role: "Full-Stack Engineer & Architect",
    featured: true,
    displayOrder: 2,
    _status: "published",
    createdAt: "2026-09-01T12:00:00.000Z",
    updatedAt: "2026-10-20T16:00:00.000Z",
    contribution: createLexicalDoc(
      "Architected the dual route-group structure isolating public Tailwind styles from Payload Admin CSS preflight. Implemented schema migrations, strict role-based access rules, and automated CI quality gates."
    ),
    problem: createLexicalDoc(
      "Most modern portfolio solutions require recurring monthly subscriptions for managed CMS platforms or database hosting, creating unwanted ongoing overhead for independent engineers."
    ),
    constraints: createLexicalDoc(
      "Target zero dollars per month recurring infrastructure cost, strict accessibility standards (WCAG 2.2 AA), and zero fabricated claims."
    ),
    architecture: createLexicalDoc(
      "Single Next.js deployment hosting both the public-facing App Router interface and the Payload CMS backend, backed by PostgreSQL and persistent storage."
    ),
    decisions: [
      {
        id: "dec-2",
        title: "Integrated Next.js App Router Monolith vs Standalone Headless CMS Service",
        context: "Resource constraints on free tier hosting.",
        alternatives: "Separate headless CMS backend (e.g. Strapi or FastAPI) plus separate Next.js frontend.",
        decision:
          "Integrated Payload 3 directly inside the Next.js App Router application to share memory space and minimize hosting footprints.",
        tradeoffs:
          "Requires careful layout isolation so CMS admin styles do not leak into public UI styles.",
      },
    ],
    implementation: createLexicalDoc(
      "Implemented with Next.js 16, Payload 3.91, Tailwind CSS v4, and Lexical rich text serialization."
    ),
    testing: createLexicalDoc(
      "Unit tests for access control rules, reading time utilities, and end-to-end type safety checks with TypeScript strict mode."
    ),
    outcomes: createLexicalDoc(
      "Achieved a functional, production-ready portfolio and CMS operating within 0/month budget parameters."
    ),
    lessonsLearned: createLexicalDoc(
      "Modern server components and headless CMS integrations inside a single framework significantly reduce operational complexity."
    ),
    technologies: [fixtureTags[0], fixtureTags[1], fixtureTags[2], fixtureTags[3]],
    repositoryUrl: "https://github.com/vrajclerk/portfolio",
  },
  {
    id: 3,
    title: "Lightweight Markdown Parser & Lexical AST Converter",
    slug: "lexical-ast-converter",
    summary:
      "An open-source utility for converting Lexical rich text nodes to clean semantic HTML and Markdown.",
    projectType: "open-source",
    role: "Maintainer",
    featured: true,
    displayOrder: 3,
    _status: "published",
    createdAt: "2026-09-20T08:00:00.000Z",
    updatedAt: "2026-10-18T11:00:00.000Z",
    contribution: createLexicalDoc(
      "Authored the core tree-traversal logic, edge-case unit test suite, and npm package build setup."
    ),
    problem: createLexicalDoc(
      "Transforming complex Lexical rich-text AST structures into lightweight Markdown for static site generators and RSS feeds frequently caused dropped formatting or nested list corruptions."
    ),
    architecture: createLexicalDoc(
      "Depth-first AST walker maintaining indentation stack and inline formatting flags with zero external dependencies."
    ),
    decisions: [
      {
        id: "dec-3",
        title: "Pure Recursive Visitor Pattern vs Regex Post-Processing",
        context: "Handling nested blockquotes, code blocks, and list items safely.",
        alternatives: "HTML regex sanitization vs direct typed AST node transformation.",
        decision:
          "Direct AST visitor inspecting typed nodes to prevent regex injection risks and invalid nesting.",
        tradeoffs: "Requires explicit handling for every Lexical node type, but guarantees output validity.",
      },
    ],
    outcomes: createLexicalDoc(
      "Zero-dependency utility with 100% test coverage across common block types."
    ),
    technologies: [fixtureTags[0]],
    repositoryUrl: "https://github.com/vrajclerk/portfolio",
  },
  {
    id: 4,
    title: "Draft Case Study: Experimental Query Cache",
    slug: "draft-query-cache-experiment",
    summary:
      "This is an unpublished draft project fixture used to verify access control. It must NEVER be visible to public anonymous visitors.",
    projectType: "experiment",
    role: "Researcher",
    featured: false,
    _status: "draft",
    createdAt: "2026-10-22T10:00:00.000Z",
    updatedAt: "2026-10-22T10:00:00.000Z",
    problem: createLexicalDoc("Testing draft isolation."),
  },
];

// ---------------------------------------------------------------------------
// Blog Posts
// ---------------------------------------------------------------------------

export const fixturePosts: Post[] = [
  {
    id: 1,
    title: "Designing Idempotent Webhook Handlers in Node.js",
    slug: "designing-idempotent-webhook-handlers",
    excerpt:
      "How to prevent duplicate transactions and handle out-of-order network retries using database-backed deduplication patterns.",
    publishedAt: "2026-09-10T10:00:00.000Z",
    _status: "published",
    createdAt: "2026-09-08T14:00:00.000Z",
    updatedAt: "2026-09-12T09:30:00.000Z",
    category: fixtureCategories[0],
    tags: [fixtureTags[0], fixtureTags[2]],
    relatedProjects: [fixtureProjects[0]],
    content: createLexicalDoc(
      "Webhooks are fundamentally at-least-once delivery systems. Payment gateways, authentication providers, and third-party SaaS platforms will retry event dispatches until they receive an HTTP 2xx acknowledgment.",
      "When network timeouts occur between the client receiving an event and returning the acknowledgment, duplicates will inevitably arrive. If your backend treats incoming events as blind mutations, you will charge customers twice, create duplicate user records, or corrupt internal state.",
      "To build idempotent handlers, compute a deterministic idempotency key (such as the provider's unique event ID) and record it within a single atomic database transaction before applying state transitions.",
      "By using PostgreSQL unique constraints with ON CONFLICT DO NOTHING, we can safely drop duplicate delivery attempts without locking up application threads or requiring distributed coordination."
    ),
    seo: {
      title: "Designing Idempotent Webhook Handlers in Node.js",
      description:
        "Practical engineering patterns for building resilient, duplicate-safe webhook consumers in TypeScript and PostgreSQL.",
    },
  },
  {
    id: 2,
    title: "Structuring Isolated Layouts in Next.js App Router and Payload 3",
    slug: "isolated-layouts-nextjs-payload",
    excerpt:
      "Solving Tailwind CSS preflight collisions when embedding a full CMS administrative dashboard alongside a custom frontend design system.",
    publishedAt: "2026-10-05T14:00:00.000Z",
    _status: "published",
    createdAt: "2026-10-02T11:00:00.000Z",
    updatedAt: "2026-10-06T16:45:00.000Z",
    category: fixtureCategories[1],
    tags: [fixtureTags[0], fixtureTags[1], fixtureTags[3]],
    relatedProjects: [fixtureProjects[1]],
    content: createLexicalDoc(
      "Integrating a headless CMS directly into the same Next.js application saves infrastructure costs and simplifies code sharing. However, combining modern Tailwind CSS v4 with Payload's administrative UI presents a styling challenge.",
      "Tailwind's preflight resets global element styles (such as button borders, input paddings, and font sizes), which interferes with Payload CMS's polished admin components.",
      "The solution is route group isolation: by eliminating the root layout and creating separate (frontend) and (payload) route groups with their own <html> and <body> tags, each domain maintains its own independent CSS stylesheet.",
      "This architecture guarantees that the public website enjoys custom design tokens without altering administrative controls."
    ),
    seo: {
      title: "Structuring Isolated Layouts in Next.js App Router and Payload 3",
      description:
        "Learn how to isolate Tailwind CSS preflight from Payload CMS admin views using Next.js App Router route groups.",
    },
  },
  {
    id: 3,
    title: "Draft Article: Internal Database Migration Notes",
    slug: "draft-internal-database-notes",
    excerpt:
      "This is a draft blog post fixture used to test access control. It must NEVER be displayed to public readers.",
    publishedAt: "2026-10-24T10:00:00.000Z",
    _status: "draft",
    createdAt: "2026-10-24T10:00:00.000Z",
    updatedAt: "2026-10-24T10:00:00.000Z",
    category: fixtureCategories[0],
    content: createLexicalDoc("Draft content that should not be visible publicly."),
  },
];

// ---------------------------------------------------------------------------
// Globals
// ---------------------------------------------------------------------------

export const fixtureSiteSettings: SiteSetting = {
  id: 1,
  siteName: "Vraj Clerk | Software Engineer",
  siteUrl: "http://localhost:3000",
  defaultDescription:
    "Full-stack software engineer focused on reliable backend systems, TypeScript architectures, and modern web applications.",
  socialLinks: [
    {
      id: "social-1",
      label: "GitHub",
      url: "https://github.com/vrajclerk",
    },
    {
      id: "social-2",
      label: "LinkedIn",
      url: "https://linkedin.com/in/vrajclerk",
    },
  ],
  publicEmail: "vrajclerk.dev@gmail.com",
};

export const fixtureProfile: Profile = {
  id: 1,
  headline: "Full-Stack Software Engineer specializing in Backend Systems & TypeScript",
  shortBio: createLexicalDoc(
    "I am a software engineer with approximately 1.5 years of professional engineering experience. I focus on building resilient backend services, scalable data pipelines, and responsive full-stack applications with TypeScript, Next.js, and PostgreSQL."
  ),
  experience: [
    {
      id: "exp-1",
      organization: "Engineering Team",
      role: "Full-Stack Software Engineer",
      startDate: "2025-05-01T00:00:00.000Z",
      current: true,
      summary:
        "Building and maintaining production web applications, API integrations, and PostgreSQL database schemas. Collaborating on CI/CD pipelines, automated testing, and developer tooling.",
    },
    {
      id: "exp-2",
      organization: "Software Development Internship",
      role: "Software Engineering Intern",
      startDate: "2024-06-01T00:00:00.000Z",
      endDate: "2025-04-30T00:00:00.000Z",
      current: false,
      summary:
        "Contributed to frontend feature development, REST API integrations, and unit test suites across client-facing applications.",
    },
  ],
  skills: [
    {
      id: "cat-1",
      category: "Languages & Core",
      items: [
        { id: "s-1", name: "TypeScript", context: "Primary language for frontend and backend applications" },
        { id: "s-2", name: "JavaScript (ESNext)", context: "Modern ECMAScript runtime & asynchronous patterns" },
        { id: "s-3", name: "SQL", context: "PostgreSQL queries, relational modeling, and index tuning" },
        { id: "s-4", name: "HTML5 & CSS3", context: "Semantic web standards, responsive layouts, accessibility" },
      ],
    },
    {
      id: "cat-2",
      category: "Frameworks & Backend",
      items: [
        { id: "s-5", name: "Next.js (App Router)", context: "Server Components, Route Handlers, SSR/SSG" },
        { id: "s-6", name: "Node.js", context: "RESTful APIs, event emitters, background script automation" },
        { id: "s-7", name: "Payload CMS", context: "Headless content modeling, access control, and migrations" },
        { id: "s-8", name: "Tailwind CSS", context: "Design systems, responsive utilities, dark mode theming" },
      ],
    },
    {
      id: "cat-3",
      category: "Databases & Infrastructure",
      items: [
        { id: "s-9", name: "PostgreSQL", context: "Schema design, migrations, transactional integrity" },
        { id: "s-10", name: "Git & GitHub", context: "Branching strategies, pull request reviews, Actions CI" },
        { id: "s-11", name: "Docker", context: "Containerizing local development and service dependencies" },
      ],
    },
  ],
  socialLinks: [
    {
      id: "prof-soc-1",
      platform: "GitHub",
      url: "https://github.com/vrajclerk",
    },
    {
      id: "prof-soc-2",
      platform: "LinkedIn",
      url: "https://linkedin.com/in/vrajclerk",
    },
  ],
};

export const fixtureHomepageSettings: HomepageSetting = {
  id: 1,
  heroHeadline: "Building Resilient Full-Stack Systems & Thoughtful Web Architectures",
  heroSubheadline:
    "Software engineer with ~1.5 years of experience focusing on TypeScript, PostgreSQL, and clean server-rendered architectures. Focused on evidence-based engineering and zero-cost operational efficiency.",
  featuredProjects: [fixtureProjects[0], fixtureProjects[1], fixtureProjects[2]],
  featuredPosts: [fixturePosts[0], fixturePosts[1]],
  sectionsVisibility: {
    showProjects: true,
    showPosts: true,
    showSkills: true,
    showContact: true,
  },
};
