import type { Payload } from "payload";
import { sql } from "@payloadcms/db-vercel-postgres";
import { formatSlug } from "@/utilities/slugify";

// ============================================================================
// Types
// ============================================================================

export interface BufferImageAsset {
  id?: string;
  mimeType?: string;
  source?: string;
  thumbnail?: string;
  image?: {
    altText?: string;
    width?: number;
    height?: number;
  };
}

export interface BufferPostNode {
  id: string;
  text: string;
  status: "sent" | "scheduled" | "draft" | "error" | string;
  sentAt?: string | null;
  dueAt?: string | null;
  externalLink?: string | null;
  externalUrl?: string | null;
  assets?: BufferImageAsset[];
}

export interface BufferOrganization {
  id: string;
  name: string;
}

export interface BufferChannel {
  id: string;
  name: string;
  displayName?: string;
  service: string;
  avatar?: string;
  isQueuePaused?: boolean;
}

export interface BufferSyncResult {
  success: boolean;
  totalFetched: number;
  imported: number;
  skipped: number;
  errors: string[];
  importedPosts: Array<{ id: string | number; title: string; slug: string }>;
}

// ============================================================================
// Buffer GraphQL Client
// ============================================================================

const BUFFER_GRAPHQL_ENDPOINT = "https://api.buffer.com";

export async function callBufferGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {},
  apiToken: string
): Promise<T> {
  if (!apiToken) {
    throw new Error("[Buffer] Missing BUFFER_API_TOKEN.");
  }

  const response = await fetch(BUFFER_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken.trim()}`,
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `[Buffer API HTTP ${response.status}] ${response.statusText}: ${errorText}`
    );
  }

  const result = await response.json();

  if (result.errors && result.errors.length > 0) {
    const errorMessages = result.errors
      .map((e: { message?: string }) => e.message || JSON.stringify(e))
      .join("; ");
    throw new Error(`[Buffer GraphQL Error]: ${errorMessages}`);
  }

  return result.data as T;
}

// ============================================================================
// Discovery Functions
// ============================================================================

export async function getBufferOrganizations(
  apiToken: string
): Promise<BufferOrganization[]> {
  const query = `
    query GetBufferOrganizations {
      account {
        organizations {
          id
          name
        }
      }
    }
  `;

  interface AccountQueryResponse {
    account?: {
      organizations?: BufferOrganization[];
    };
  }

  const data = await callBufferGraphQL<AccountQueryResponse>(query, {}, apiToken);
  return data.account?.organizations || [];
}

export async function getBufferChannels(
  apiToken: string,
  organizationId: string
): Promise<BufferChannel[]> {
  const query = `
    query GetBufferChannels {
      channels(input: { organizationId: ${JSON.stringify(organizationId)} }) {
        id
        name
        displayName
        service
        avatar
        isQueuePaused
      }
    }
  `;

  interface ChannelsQueryResponse {
    channels?: BufferChannel[];
  }

  const data = await callBufferGraphQL<ChannelsQueryResponse>(query, {}, apiToken);

  return data.channels || [];
}

// ============================================================================
// Post Querying
// ============================================================================

export async function getBufferSentPosts(params: {
  apiToken: string;
  organizationId: string;
  channelId: string;
  limit?: number;
  cursor?: string;
}): Promise<{ posts: BufferPostNode[]; hasNextPage: boolean; endCursor?: string }> {
  const { apiToken, organizationId, channelId, limit = 10, cursor } = params;

  const afterClause = cursor ? `, after: ${JSON.stringify(cursor)}` : "";

  const query = `
    query GetSentPosts {
      posts(
        first: ${limit}${afterClause},
        input: {
          organizationId: ${JSON.stringify(organizationId)},
          filter: {
            status: [sent],
            channelIds: [${JSON.stringify(channelId)}]
          }
        }
      ) {
        edges {
          node {
            id
            text
            status
            sentAt
            dueAt
            externalLink
            assets {
              id
              mimeType
              source
              thumbnail
              ... on ImageAsset {
                image {
                  altText
                  width
                  height
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  interface PostsQueryResponse {
    posts?: {
      edges?: Array<{ node: BufferPostNode }>;
      pageInfo?: {
        hasNextPage: boolean;
        endCursor?: string;
      };
    };
  }

  const data = await callBufferGraphQL<PostsQueryResponse>(query, {}, apiToken);
  const edges = data.posts?.edges || [];
  const posts = edges.map((edge) => edge.node);

  return {
    posts,
    hasNextPage: Boolean(data.posts?.pageInfo?.hasNextPage),
    endCursor: data.posts?.pageInfo?.endCursor,
  };
}

// ============================================================================
// Content Transformation Utilities
// ============================================================================

/**
 * Extracts a clean title from the opening hook of a LinkedIn post.
 */
export function extractPostTitle(rawText: string): string {
  if (!rawText || typeof rawText !== "string") {
    return "Untitled Post";
  }

  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return "Untitled Post";
  }

  // Helper to sanitize a title candidate line
  const cleanLine = (line: string): string => {
    return line
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "") // remove emojis
      .replace(/^[#*_\->\s\d.]+/g, "") // remove leading markdown headers, bullets, numbers
      .replace(/^[":'"]+|[":'"]+$/g, "") // trim wrapping quotes or colons
      .trim();
  };

  let titleCandidate = cleanLine(lines[0]);

  // If the first line is very short (e.g. "Here's the thing:" or "A quick thought:"),
  // combine it with line 2 if available
  if (titleCandidate.length < 25 && lines.length > 1) {
    const nextLine = cleanLine(lines[1]);
    if (nextLine.length > 0) {
      titleCandidate = `${titleCandidate}: ${nextLine}`;
    }
  }

  // Fallback if line was only emojis or symbols
  if (titleCandidate.length < 3) {
    titleCandidate = lines.find((l) => cleanLine(l).length >= 10) || lines[0];
    titleCandidate = cleanLine(titleCandidate);
  }

  // Truncate at word boundary if excessively long (e.g. max 100 characters)
  if (titleCandidate.length > 100) {
    const truncated = titleCandidate.slice(0, 97);
    const lastSpace = truncated.lastIndexOf(" ");
    titleCandidate = (lastSpace > 40 ? truncated.slice(0, lastSpace) : truncated).trim() + "...";
  }

  return titleCandidate || "Engineering Note";
}

/**
 * Generates an excerpt strictly complying with Payload's 240 character limit.
 */
export function extractPostExcerpt(rawText: string, title?: string): string {
  if (!rawText || typeof rawText !== "string") {
    return "Technical insights and engineering notes from LinkedIn.";
  }

  // Remove trailing hashtag block
  const cleanedText = rawText
    .replace(/(?:\r?\n\s*)*(?:#[a-zA-Z0-9_-]+\s*)+$/g, "")
    .trim();

  const lines = cleanedText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // If we have a title, skip the title line when possible
  let bodyCandidates = lines;
  if (title && lines.length > 1) {
    const firstClean = lines[0].toLowerCase().replace(/[^a-z0-9]/g, "");
    const titleClean = title.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (titleClean.includes(firstClean) || firstClean.includes(titleClean.slice(0, 20))) {
      bodyCandidates = lines.slice(1);
    }
  }

  const joinedBody = bodyCandidates.join(" ").replace(/\s+/g, " ").trim();
  const sourceSnippet = joinedBody.length > 0 ? joinedBody : cleanedText.replace(/\s+/g, " ").trim();

  // Maximum allowed in Posts collection is 240 characters
  const MAX_EXCERPT_LENGTH = 235;

  if (sourceSnippet.length <= MAX_EXCERPT_LENGTH) {
    return sourceSnippet;
  }

  const truncated = sourceSnippet.slice(0, MAX_EXCERPT_LENGTH);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 100 ? truncated.slice(0, lastSpace) : truncated).trim() + "...";
}

/**
 * Extracts unique hashtags without the '#' symbol.
 */
export function extractHashtags(rawText: string): string[] {
  if (!rawText || typeof rawText !== "string") {
    return [];
  }

  const hashtagRegex = /(?:^|\s)#([a-zA-Z0-9_]+)/g;
  const matches = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = hashtagRegex.exec(rawText)) !== null) {
    if (match[1] && match[1].length > 1) {
      matches.add(match[1]);
    }
  }

  return Array.from(matches);
}

/**
 * Converts plain text into a valid Payload Lexical richText AST document.
 * Creates standard paragraph and text nodes fully compatible with Payload's JSX serializer.
 */
export function convertTextToLexical(rawText: string) {
  if (!rawText || typeof rawText !== "string") {
    return {
      root: {
        type: "root",
        format: "" as const,
        indent: 0,
        version: 1,
        direction: "ltr" as const,
        children: [],
      },
    };
  }

  // Split by double newlines or single newlines into distinct paragraphs
  const rawParagraphs = rawText
    .split(/\r?\n\r?\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const paragraphs = rawParagraphs.length > 0 ? rawParagraphs : [rawText.trim()];

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

// ============================================================================
// Media Ingestion
// ============================================================================

/**
 * Downloads an image asset from Buffer CDN and creates an entry in Payload's Media collection.
 */
export async function downloadAndCreateMedia(
  asset: BufferImageAsset,
  postTitle: string,
  payload: Payload
): Promise<number | null> {
  const isDocument =
    asset.mimeType === "application/pdf" ||
    Boolean(asset.source?.toLowerCase().includes(".pdf"));

  // For PDF document carousels, prioritize thumbnail image so it can be rendered as a cover image
  const targetUrl = isDocument
    ? (asset.thumbnail || asset.source)
    : (asset.source || asset.thumbnail);

  if (!targetUrl) {
    return null;
  }

  try {
    const res = await fetch(targetUrl);
    if (!res.ok) {
      console.warn(`[Buffer Sync] Failed to download media from ${targetUrl} (${res.status})`);
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Detect actual content type from HTTP response or fallback
    const detectedContentType = res.headers.get("content-type");
    let mimeType =
      detectedContentType && detectedContentType !== "application/octet-stream"
        ? detectedContentType
        : isDocument && asset.thumbnail
          ? "image/jpeg"
          : asset.mimeType || "image/jpeg";

    // Clean mimeType of parameters like charset=utf-8
    if (mimeType.includes(";")) {
      mimeType = mimeType.split(";")[0].trim();
    }

    let extension = "jpg";
    if (mimeType.includes("png")) extension = "png";
    else if (mimeType.includes("webp")) extension = "webp";
    else if (mimeType.includes("gif")) extension = "gif";
    else if (mimeType.includes("pdf")) extension = "pdf";
    else if (mimeType.includes("jpeg") || mimeType.includes("jpg")) extension = "jpg";

    const safeFilename = `buffer-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;
    const altText = asset.image?.altText || `Cover image for ${postTitle.slice(0, 80)}`;

    const mediaDoc = await payload.create({
      collection: "media",
      data: {
        alt: altText,
        decorative: false,
        caption: isDocument ? "Attached carousel slide from LinkedIn" : "Attached media from LinkedIn",
      },
      file: {
        data: buffer,
        mimetype: mimeType,
        name: safeFilename,
        size: buffer.length,
      },
    });

    return typeof mediaDoc.id === "number" ? mediaDoc.id : Number(mediaDoc.id);
  } catch (error) {
    console.error("[Buffer Sync] Media creation error:", error);
    return null;
  }
}

// ============================================================================
// Taxonomies Matching & Ingestion
// ============================================================================

/**
 * Finds or creates tags in Payload CMS for each extracted hashtag.
 */
export async function resolveTagsForHashtags(
  hashtags: string[],
  payload: Payload
): Promise<number[]> {
  const tagIds: number[] = [];

  for (const tag of hashtags) {
    const slug = formatSlug(tag);
    if (!slug) continue;

    try {
      const existing = await payload.find({
        collection: "tags",
        where: {
          slug: { equals: slug },
        },
        limit: 1,
      });

      if (existing.docs.length > 0) {
        const id = existing.docs[0].id;
        tagIds.push(typeof id === "number" ? id : Number(id));
      } else {
        // Auto-create tag
        const newTag = await payload.create({
          collection: "tags",
          data: {
            name: tag,
            slug,
            description: `Automated topic tag for #${tag} from LinkedIn.`,
          },
        });
        const id = newTag.id;
        tagIds.push(typeof id === "number" ? id : Number(id));
      }
    } catch (err) {
      console.warn(`[Buffer Sync] Could not resolve tag #${tag}:`, err);
    }
  }

  return tagIds;
}

/**
 * Resolves or maps the post's primary category based on topic keywords and hashtags.
 */
export async function resolveCategoryForPost(
  text: string,
  hashtags: string[],
  payload: Payload
): Promise<number | null> {
  try {
    const categoriesResult = await payload.find({
      collection: "categories",
      limit: 20,
    });

    const categories = categoriesResult.docs;
    if (categories.length === 0) return null;

    const lowerText = text.toLowerCase();
    const tagSlugs = hashtags.map((h) => formatSlug(h));

    // Keyword mapping heuristics
    const architectureKeywords = [
      "architecture",
      "system-design",
      "systems",
      "database",
      "postgres",
      "postgresql",
      "backend",
      "concurrency",
      "reliability",
      "scalability",
    ];

    const toolingKeywords = [
      "typescript",
      "javascript",
      "nextjs",
      "python",
      "fastapi",
      "git",
      "testing",
      "tooling",
      "developer-experience",
    ];

    const hasArchMatch =
      architectureKeywords.some((k) => lowerText.includes(k) || tagSlugs.includes(k));
    const hasToolingMatch =
      toolingKeywords.some((k) => lowerText.includes(k) || tagSlugs.includes(k));

    if (hasArchMatch) {
      const archCat = categories.find(
        (c) => c.slug === "architecture-systems" || c.name.toLowerCase().includes("architecture")
      );
      if (archCat) {
        return typeof archCat.id === "number" ? archCat.id : Number(archCat.id);
      }
    }

    if (hasToolingMatch) {
      const toolCat = categories.find(
        (c) => c.slug === "typescript-tooling" || c.name.toLowerCase().includes("typescript")
      );
      if (toolCat) {
        return typeof toolCat.id === "number" ? toolCat.id : Number(toolCat.id);
      }
    }

    // Default to the first available category
    const defaultCat = categories[0];
    return typeof defaultCat.id === "number" ? defaultCat.id : Number(defaultCat.id);
  } catch (err) {
    console.warn("[Buffer Sync] Failed to resolve category:", err);
    return null;
  }
}

// ============================================================================
// Main Synchronization Orchestrator
// ============================================================================

export async function syncBufferLinkedInPosts(
  payload: Payload,
  options: {
    limit?: number;
    apiToken?: string;
    organizationId?: string;
    channelId?: string;
  } = {}
): Promise<BufferSyncResult> {
  const apiToken = options.apiToken || process.env.BUFFER_API_TOKEN;
  const organizationId = options.organizationId || process.env.BUFFER_ORGANIZATION_ID;
  const channelId = options.channelId || process.env.BUFFER_LINKEDIN_CHANNEL_ID;

  if (!apiToken) {
    throw new Error(
      "BUFFER_API_TOKEN is not configured in environment variables or request parameters."
    );
  }

  if (!organizationId || !channelId) {
    throw new Error(
      "BUFFER_ORGANIZATION_ID and BUFFER_LINKEDIN_CHANNEL_ID must be configured. Run the discovery script or API to find them."
    );
  }

  // 1. Fetch published posts from Buffer GraphQL API
  const { posts } = await getBufferSentPosts({
    apiToken,
    organizationId,
    channelId,
    limit: options.limit || 10,
  });

  const result: BufferSyncResult = {
    success: true,
    totalFetched: posts.length,
    imported: 0,
    skipped: 0,
    errors: [],
    importedPosts: [],
  };

  // 2. Ensure schema columns exist in PostgreSQL
  try {
    const dbAny = payload.db as unknown as {
      drizzle?: { execute: (q: unknown) => Promise<unknown> };
    };
    if (dbAny?.drizzle?.execute) {
      await dbAny.drizzle.execute(sql`
        ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "source" varchar DEFAULT 'native';
        ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "buffer_post_id" varchar;
        ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "linkedin_url" varchar;
        CREATE UNIQUE INDEX IF NOT EXISTS "posts_buffer_post_id_idx" ON "posts" ("buffer_post_id");

        ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_source" varchar DEFAULT 'native';
        ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_buffer_post_id" varchar;
        ALTER TABLE "_posts_v" ADD COLUMN IF NOT EXISTS "version_linkedin_url" varchar;
        CREATE INDEX IF NOT EXISTS "_posts_v_version_buffer_post_id_idx" ON "_posts_v" ("version_buffer_post_id");
      `);
    }
  } catch (sqlErr) {
    console.warn("[Buffer Sync] Database DDL notice:", sqlErr);
  }

  // 3. Iterate each post with idempotency enforcement
  for (const post of posts) {
    try {
      // Must be confirmed 'sent'
      if (post.status !== "sent") {
        result.skipped++;
        continue;
      }

      // Check if already imported by Buffer Post ID
      const existing = await payload.find({
        collection: "posts",
        where: {
          bufferPostId: { equals: post.id },
        },
        limit: 1,
      });

      if (existing.docs.length > 0) {
        const existingPost = existing.docs[0];

        // Check if existing post needs cover image repair (e.g. was imported as a PDF or missing cover)
        let needsMediaUpdate = false;
        if (!existingPost.coverImage) {
          needsMediaUpdate = true;
        } else if (typeof existingPost.coverImage === "object" && existingPost.coverImage !== null) {
          const mediaDoc = existingPost.coverImage as { mimeType?: string; filename?: string; url?: string };
          if (
            mediaDoc.mimeType === "application/pdf" ||
            mediaDoc.filename?.toLowerCase().endsWith(".pdf") ||
            mediaDoc.url?.toLowerCase().endsWith(".pdf")
          ) {
            needsMediaUpdate = true;
          }
        }

        if (needsMediaUpdate && post.assets && post.assets.length > 0) {
          const imageAsset = post.assets.find((a) => a.thumbnail || a.source);
          if (imageAsset) {
            const title = extractPostTitle(post.text);
            const mediaId = await downloadAndCreateMedia(imageAsset, title, payload);
            if (mediaId) {
              await payload.update({
                collection: "posts",
                id: existingPost.id,
                data: {
                  coverImage: mediaId,
                },
              });
              console.info(
                `[Buffer Sync] Repaired cover image for existing post "${existingPost.title}"`
              );
            }
          }
        }

        result.skipped++;
        continue;
      }

      // Extract metadata
      const title = extractPostTitle(post.text);
      let slug = formatSlug(title);

      // Verify slug uniqueness
      const existingSlug = await payload.find({
        collection: "posts",
        where: {
          slug: { equals: slug },
        },
        limit: 1,
      });

      if (existingSlug.docs.length > 0) {
        slug = `${slug}-${post.id.slice(-5)}`;
      }

      const excerpt = extractPostExcerpt(post.text, title);
      const hashtags = extractHashtags(post.text);
      const tagIds = await resolveTagsForHashtags(hashtags, payload);
      const categoryId = await resolveCategoryForPost(post.text, hashtags, payload);

      // Handle Cover Image / Media Asset
      let mediaId: number | null = null;
      if (post.assets && post.assets.length > 0) {
        const imageAsset = post.assets.find((a) => a.source || a.thumbnail);
        if (imageAsset) {
          mediaId = await downloadAndCreateMedia(imageAsset, title, payload);
        }
      }

      const lexicalContent = convertTextToLexical(post.text);
      const publishedAt = post.sentAt || new Date().toISOString();

      // Create new published post in Payload CMS
      const newPost = await payload.create({
        collection: "posts",
        data: {
          title,
          slug,
          excerpt,
          content: lexicalContent,
          coverImage: mediaId || undefined,
          category: categoryId || undefined,
          tags: tagIds.length > 0 ? tagIds : undefined,
          source: "linkedin",
          bufferPostId: post.id,
          linkedinUrl: post.externalLink || post.externalUrl || undefined,
          publishedAt,
          _status: "published",
          seo: {
            title: `${title} | Vraj Clerk`,
            description: excerpt,
          },
        },
        draft: false,
      });

      result.imported++;
      result.importedPosts.push({
        id: newPost.id,
        title: newPost.title,
        slug: newPost.slug,
      });

      console.info(
        `[Buffer Sync] Successfully imported LinkedIn post: "${title}" (Buffer ID: ${post.id})`
      );
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`[Buffer Sync] Error processing post ID ${post.id}:`, errMsg);
      result.errors.push(`Post ${post.id}: ${errMsg}`);
    }
  }

  return result;
}
