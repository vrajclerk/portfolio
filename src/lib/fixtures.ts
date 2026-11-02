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
  {
    id: 5,
    name: "System Design",
    slug: "system-design",
    description: "Distributed architectures, concurrency, and reliability.",
    createdAt: "2026-10-01T10:00:00.000Z",
    updatedAt: "2026-10-01T10:00:00.000Z",
  },
  {
    id: 6,
    name: "AI Engineering",
    slug: "ai-engineering",
    description: "AI-assisted coding workflows, agent guardrails, and code generation.",
    createdAt: "2026-10-01T10:00:00.000Z",
    updatedAt: "2026-10-01T10:00:00.000Z",
  },
  {
    id: 7,
    name: "Git & Version Control",
    slug: "git",
    description: "Source control strategies, diff hygiene, and staging workflows.",
    createdAt: "2026-10-01T10:00:00.000Z",
    updatedAt: "2026-10-01T10:00:00.000Z",
  },
  {
    id: 8,
    name: "Code Review",
    slug: "code-review",
    description: "Maintainability, observability, and code review practices.",
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
    title: "The Most Important AI Coding Skill: Knowing When to Say NO",
    slug: "most-important-ai-coding-skill-knowing-when-to-say-no",
    excerpt:
      "AI can generate functions in seconds, but speed without judgment turns small tasks into technical debt. Knowing how to critically evaluate AI output is the real engineering skill.",
    publishedAt: "2026-10-30T10:00:00.000Z",
    _status: "published",
    createdAt: "2026-10-29T14:00:00.000Z",
    updatedAt: "2026-10-30T10:00:00.000Z",
    category: fixtureCategories[1],
    tags: [fixtureTags[5], fixtureTags[7], fixtureTags[0]],
    content: createLexicalDoc(
      "The most important AI coding skill might be knowing when to say NO.",
      "AI can generate a function in seconds. It can suggest a refactor, write unit tests, explain an unfamiliar codebase, and even pinpoint bugs. But just because AI suggests a solution doesn't mean it's the right solution.",
      "Sometimes, the code works but introduces unnecessary complexity. Sometimes, the fix solves the immediate problem but ignores established patterns and architectural boundaries in the codebase. And sometimes, the best solution is the one you already had.",
      "That's why AI-assisted development requires far more than writing better prompts. It requires knowing how to evaluate the output with seasoned engineering judgment.",
      "Before accepting AI-generated code, ask these five questions:",
      "1. Does this solve the actual root problem or merely patch a symptom?",
      "2. Is there a simpler, more idiomatic approach using built-in language primitives?",
      "3. Does it fit the existing system architecture and database transaction boundaries?",
      "4. What failure modes could emerge under high concurrency or network latency?",
      "5. Can I independently maintain, debug, and explain this code to a teammate in production?",
      "AI helps developers move faster. But speed without judgment turns a small task into a much bigger problem. The goal isn't to accept more AI-generated code—it's to make better engineering decisions with AI."
    ),
    seo: {
      title: "The Most Important AI Coding Skill: Knowing When to Say NO",
      description:
        "A practical evaluation framework for reviewing AI-generated code and avoiding architectural technical debt.",
    },
  },
  {
    id: 2,
    title: "Why Anthropic Built Scion: The New Bottleneck in AI-Accelerated Engineering",
    slug: "why-anthropic-built-scion-version-control",
    excerpt:
      "When daily code changes jumped from 2,500 to over 30,000 per day, Git became the bottleneck. Why faster code generation merely shifts the bottleneck to CI and reviews.",
    publishedAt: "2026-10-27T10:00:00.000Z",
    _status: "published",
    createdAt: "2026-10-26T12:00:00.000Z",
    updatedAt: "2026-10-27T10:00:00.000Z",
    category: fixtureCategories[0],
    tags: [fixtureTags[4], fixtureTags[6], fixtureTags[5]],
    content: createLexicalDoc(
      "Anthropic built its own internal version control system. But the interesting part isn't that they built an alternative to Git—it's why they needed one.",
      "In May, Anthropic was merging around 2,500 code changes per day. By September, that volume exploded past 30,000 daily merges. As AI accelerated code generation, the bottleneck started moving elsewhere.",
      "Source control, builds, and CI had become the primary bottlenecks in their development workflow. So Anthropic built Scion and migrated its monorepo from Git in five months.",
      "Of course, this doesn't mean Git is suddenly obsolete. Scion isn't intended to replace Git for general use. But there is a crucial engineering lesson here:",
      "Making code generation faster doesn't automatically make software delivery faster.",
      "If code can be produced faster than a team can review, test, integrate, and deploy it, the bottleneck simply moves down the pipeline to the next stage.",
      "What matters most in the AI era is the architecture behind your delivery pipeline and the design decisions that help you handle scale."
    ),
    seo: {
      title: "Why Anthropic Built Scion: The New Bottleneck in AI-Accelerated Engineering",
      description:
        "An analysis of version control bottlenecks and why AI code generation shifts throughput challenges downstream to CI/CD.",
    },
  },
  {
    id: 3,
    title: "The Code Was Correct. I Still Asked for Changes.",
    slug: "the-code-was-correct-still-asked-for-changes",
    excerpt:
      "It passed all tests and met the requirements, but maintainability, observability, and query scalability require careful engineering judgment beyond green checkmarks.",
    publishedAt: "2026-10-24T10:00:00.000Z",
    _status: "published",
    createdAt: "2026-10-23T11:00:00.000Z",
    updatedAt: "2026-10-24T10:00:00.000Z",
    category: fixtureCategories[1],
    tags: [fixtureTags[7], fixtureTags[0]],
    content: createLexicalDoc(
      "The code was correct. I still asked for changes.",
      "It passed all tests. It met the requirements. It worked exactly as expected. But something didn't feel right during the review.",
      "A function that was doing too many disparate things. An error being caught in a try/catch block but never logged or surfaced to observability tooling. A database query that worked fine with 100 records in local development, but would struggle with 100,000 in production. A quick fix that introduced unnecessary architectural complexity.",
      "None of these necessarily broke the feature today. At least, not yet.",
      "And that's something AI-assisted development is making me think about more often: getting code that works is becoming easier. Getting code that's maintainable, observable, and safe to operate in production still requires careful human judgment.",
      "I've started spending more time asking: 'Should we ship this implementation?' instead of only: 'Does this implementation work?'",
      "Because passing tests is an important part of code quality, but it isn't the entire definition. The best code review doesn't just find immediate bugs—it prevents future production incidents."
    ),
    seo: {
      title: "The Code Was Correct. I Still Asked for Changes.",
      description:
        "Why code reviews must prioritize maintainability, observability, and query scalability beyond passing tests.",
    },
  },
  {
    id: 4,
    title: "The Feature Worked Perfectly. Until Two Requests Arrived at the Same Time.",
    slug: "feature-worked-until-two-concurrent-requests",
    excerpt:
      "A flow can be completely correct in isolation and still be wrong as a system. Why concurrency, race conditions, and idempotency define backend reliability.",
    publishedAt: "2026-10-21T10:00:00.000Z",
    _status: "published",
    createdAt: "2026-10-20T09:00:00.000Z",
    updatedAt: "2026-10-21T10:00:00.000Z",
    category: fixtureCategories[0],
    tags: [fixtureTags[4], fixtureTags[2]],
    relatedProjects: [fixtureProjects[0]],
    content: createLexicalDoc(
      "The feature worked perfectly. Until two requests arrived at the same time.",
      "That's one of the foundational lessons backend development has taught me: A flow can be completely correct in isolation and still be wrong as a system.",
      "The validation can be correct. The database queries can be correct. The tests can all pass. But production doesn't execute your logic politely, one request at a time.",
      "Two workers can pick up the same job. Two webhooks can arrive seconds apart. Two requests can read the same state before either has finished updating it.",
      "And suddenly the question is no longer: 'Is this logic correct?' It becomes: 'Is this operation still correct if it runs twice?'",
      "That small shift changes how you design backend systems. You start thinking about idempotency before duplicate processing becomes an incident. You stop assuming that the state you just read will still be valid when you write. You treat retries, duplicate events, and concurrent updates as normal system behavior, not unusual edge cases.",
      "The happy path tells you whether a feature works. Concurrency tells you whether the system works."
    ),
    seo: {
      title: "The Feature Worked Perfectly. Until Two Requests Arrived at the Same Time.",
      description:
        "Practical architectural considerations for handling concurrency, race conditions, and idempotency in distributed backend systems.",
    },
  },
  {
    id: 5,
    title: "Beyond Code Writing: The Harder Part of Software Engineering",
    slug: "beyond-code-writing-software-engineering",
    excerpt:
      "Writing code is becoming the easy part. The high-value engineering skill is shifting from 'Can I write this code?' to 'Should we write it this way?'",
    publishedAt: "2026-10-18T10:00:00.000Z",
    _status: "published",
    createdAt: "2026-10-17T15:00:00.000Z",
    updatedAt: "2026-10-18T10:00:00.000Z",
    category: fixtureCategories[0],
    tags: [fixtureTags[4], fixtureTags[2], fixtureTags[0]],
    content: createLexicalDoc(
      "Writing code is becoming the easy part.",
      "When I started as a developer, I thought getting better mostly meant writing better syntax. Now I'm realizing that writing the code is often the most straightforward part.",
      "The harder questions usually come before and after implementation:",
      "• Should this logic even exist here?",
      "• What happens when this third-party dependency fails?",
      "• Are we fixing the root cause or just patching the symptom?",
      "• Will this still make sense six months from now?",
      "• How do we debug it when something goes wrong in production?",
      "• What happens when traffic increases by 10x?",
      "• Is there a simpler, zero-cost architecture?",
      "Writing a function can be quick. Understanding what that function should do, where it belongs, what it depends on, and how it affects the rest of the system takes much more thought.",
      "With AI making implementation faster, that distinction matters even more. The valuable skill is becoming less about: 'Can I write this code?' and more about: 'Should we write it this way?'",
      "Good engineering is not just about producing code. It is about making better decisions around the code."
    ),
    seo: {
      title: "Beyond Code Writing: The Harder Part of Software Engineering",
      description:
        "Why architecture, failure modes, and system design judgment matter more than raw code syntax in the age of AI.",
    },
  },
  {
    id: 6,
    title: "A Git Checklist for AI-Assisted Coding (Why I Stopped Using git add . on Autopilot)",
    slug: "git-checklist-ai-assisted-coding",
    excerpt:
      "Why small AI-assisted tasks leave surprisingly large diffs, and how a deliberate staging checklist prevents phantom refactors and unintended commits.",
    publishedAt: "2026-10-14T10:00:00.000Z",
    _status: "published",
    createdAt: "2026-10-13T08:00:00.000Z",
    updatedAt: "2026-10-14T10:00:00.000Z",
    category: fixtureCategories[1],
    tags: [fixtureTags[6], fixtureTags[5], fixtureTags[7]],
    content: createLexicalDoc(
      "Why I stopped using git add . on autopilot.",
      "A small AI-assisted task can leave a surprisingly large diff. You ask for a button fix. You get the fix, a scratch script, a local config change, and a refactor nobody requested. Apparently, the button had side quests.",
      "When in a hurry, it's tempting to run: `git add . && git commit && git push`. The risky part is skipping the moment where you ask, 'Do all these changes belong in this commit?'",
      "So I've been more deliberate: check `git status`, review the diff and new files, stage the changes I intend to ship (`git add -p`), then check the staged diff (`git diff --staged`) before committing.",
      "I also want safeguards around that habit: appropriate .gitignore rules, secret checks, and push protection where available. Choosing specific files helps me review; it doesn't make a commit automatically safe.",
      "One instruction I give AI coding agents: 'Never commit or push code unless I explicitly ask you to.' Permission controls matter too—an instruction alone isn't enforcement.",
      "I still use AI tools every day. I'm just learning to give the resulting diff the attention it deserves."
    ),
    seo: {
      title: "A Git Checklist for AI-Assisted Coding",
      description:
        "A practical Git review workflow and safety checklist for developers collaborating with AI coding agents.",
    },
  },
  {
    id: 7,
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
    id: 8,
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
  siteName: "Vraj Clerk | Python & Backend Systems Engineer",
  siteUrl: "http://localhost:3000",
  defaultDescription:
    "Python Developer with professional experience building backend services, reusable Python utilities, REST APIs, and cloud-based applications with FastAPI, PostgreSQL, AWS, and OpenSearch.",
  socialLinks: [
    {
      id: "social-1",
      label: "GitHub",
      url: "https://github.com/vrajclerk",
    },
    {
      id: "social-2",
      label: "LinkedIn",
      url: "https://linkedin.com/in/vraj-clerk",
    },
  ],
  publicEmail: "vrajclerk04@gmail.com",
};

export const fixtureProfile: Profile = {
  id: 1,
  headline: "Python Developer | FastAPI, PostgreSQL, AWS & Distributed Systems",
  profileImage: {
    id: 1,
    alt: "Vraj Clerk",
    url: "/media/IMG_20240306_180503_775.webp",
    createdAt: "2026-10-29T19:11:21.438Z",
    updatedAt: "2026-10-29T19:11:21.439Z",
  },
  shortBio: createLexicalDoc(
    "Python Developer with professional experience building backend services, reusable Python utilities, REST APIs, and cloud-based applications. Hands-on experience with FastAPI, PostgreSQL, OpenSearch, AWS, and Docker, including enterprise application development, search integration, and scalable backend architecture. Additional experience in deep learning and computer vision using U-Net and ResNet34."
  ),
  experience: [
    {
      id: "exp-1",
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
      id: "cat-1",
      category: "Languages & Core",
      items: [
        { id: "s-1", name: "Python", context: "FastAPI, RESTful APIs, OOP, Reusable internal packages" },
        { id: "s-2", name: "JavaScript", context: "Modern ES6+, Asynchronous runtime, DOM & frontend integrations" },
        { id: "s-3", name: "TypeScript", context: "Full-stack static typing and modern React/Next.js architectures" },
        { id: "s-4", name: "SQL", context: "Relational modeling, indexing, ACID transactions in PostgreSQL & MySQL" },
      ],
    },
    {
      id: "cat-2",
      category: "Python & Backend Systems",
      items: [
        { id: "s-5", name: "FastAPI", context: "High-performance asynchronous endpoints, dependency injection, Pydantic" },
        { id: "s-6", name: "RESTful APIs", context: "Resource modeling, Auth0 authentication & RBAC middleware" },
        { id: "s-7", name: "OpenSearch Integration", context: "Reusable query encapsulation package for development teams" },
        { id: "s-8", name: "Data Sync & Excel Automation", context: "High-throughput data synchronization and interactive charts" },
      ],
    },
    {
      id: "cat-3",
      category: "Databases & Search",
      items: [
        { id: "s-9", name: "PostgreSQL", context: "Relational schema design, complex queries, ACID transactions" },
        { id: "s-10", name: "OpenSearch", context: "Hierarchical material indexing & high-throughput search queries" },
        { id: "s-11", name: "Amazon DynamoDB", context: "NoSQL key-value schemas, DynamoDB Streams for audit tracking" },
        { id: "s-12", name: "MySQL", context: "Relational schemas, meal subscription calendars, transaction logs" },
        { id: "s-13", name: "MongoDB", context: "Document-oriented storage & flexible NoSQL schemas" },
      ],
    },
    {
      id: "cat-4",
      category: "Cloud & DevOps",
      items: [
        { id: "s-14", name: "AWS Ecosystem", context: "Lambda (serverless), S3, DynamoDB, API Gateway, EC2, ECR" },
        { id: "s-15", name: "Docker", context: "Containerizing backend services and local developer environments" },
        { id: "s-16", name: "Terraform", context: "Infrastructure as Code (IaC) configuration for cloud resources" },
        { id: "s-17", name: "CI/CD Pipelines", context: "Automated test execution, linting pipelines & deployment workflows" },
      ],
    },
    {
      id: "cat-5",
      category: "Deep Learning & Vision",
      items: [
        { id: "s-18", name: "U-Net & ResNet34", context: "Semantic segmentation for bottle and liquid level detection" },
        { id: "s-19", name: "Computer Vision Pipelines", context: "LabelMe image annotation, mask preprocessing, Dice & Cross-Entropy loss" },
      ],
    },
    {
      id: "cat-6",
      category: "System Design & Quality",
      items: [
        { id: "s-20", name: "Master-Child Architecture", context: "Enterprise material management with stream-based indexing" },
        { id: "s-21", name: "Role-Based Access Control", context: "Auth0 authorization patterns across multiple services" },
        { id: "s-22", name: "Locust Load Testing", context: "Load testing under 800+ concurrent users with queue offloading" },
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
      url: "https://linkedin.com/in/vraj-clerk",
    },
  ],
};

export const fixtureHomepageSettings: HomepageSetting = {
  id: 1,
  heroHeadline: "Python & Backend Systems Engineer",
  heroSubheadline:
    "Building resilient backend services, reusable Python packages, and cloud-native architectures with FastAPI, PostgreSQL, AWS, and OpenSearch. Focused on high-throughput reliability, clean system design, and evidence-based performance.",
  featuredProjects: [fixtureProjects[0], fixtureProjects[1], fixtureProjects[2]],
  featuredPosts: [fixturePosts[0], fixturePosts[1]],
  sectionsVisibility: {
    showProjects: true,
    showPosts: true,
    showSkills: true,
    showContact: true,
  },
};
