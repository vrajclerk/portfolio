import { NextRequest, NextResponse } from "next/server";
import configPromise from "@payload-config";
import { getPayload, type Payload } from "payload";
import {
  syncBufferLinkedInPosts,
  getBufferOrganizations,
  getBufferChannels,
} from "@/lib/buffer";

/**
 * Validates request authorization.
 * Accepts:
 * 1. Bearer token matching process.env.CRON_SECRET (standard Vercel Cron & GitHub Actions format)
 * 2. URL query param `?secret=` matching process.env.CRON_SECRET
 * 3. Logged-in admin session in Payload CMS
 */
async function isAuthorized(req: NextRequest, payload: Payload): Promise<boolean> {
  const cronSecret = process.env.CRON_SECRET;

  // 1. Check Bearer token or custom header
  const authHeader = req.headers.get("authorization");
  if (authHeader && cronSecret) {
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (token === cronSecret.trim()) {
      return true;
    }
  }

  // 2. Check query param ?secret=
  const { searchParams } = new URL(req.url);
  const secretParam = searchParams.get("secret");
  if (secretParam && cronSecret && secretParam.trim() === cronSecret.trim()) {
    return true;
  }

  // 3. Fallback: Check Payload CMS authenticated user session (for Payload Admin buttons/manual testing)
  try {
    const { user } = await payload.auth({ headers: req.headers });
    if (user) {
      return true;
    }
  } catch {
    // Session check failed or outside session context
  }

  return false;
}

/**
 * GET /api/sync/buffer
 * Provides status, health check, and diagnostic info.
 */
export async function GET(req: NextRequest) {
  const payload = await getPayload({ config: configPromise });

  const authorized = await isAuthorized(req, payload);
  if (!authorized) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message:
          "Provide Authorization: Bearer <CRON_SECRET> header or ?secret=<CRON_SECRET> query parameter.",
      },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  const configured = {
    hasApiToken: Boolean(process.env.BUFFER_API_TOKEN),
    hasOrgId: Boolean(process.env.BUFFER_ORGANIZATION_ID),
    hasChannelId: Boolean(process.env.BUFFER_LINKEDIN_CHANNEL_ID),
    hasCronSecret: Boolean(process.env.CRON_SECRET),
  };

  // If action=discover, discover and return organizations and channels
  if (action === "discover") {
    const apiToken = process.env.BUFFER_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json(
        {
          error: "BUFFER_API_TOKEN is required to run discovery.",
          configured,
        },
        { status: 400 }
      );
    }

    try {
      const orgs = await getBufferOrganizations(apiToken);
      const results: Array<Record<string, unknown>> = [];

      for (const org of orgs) {
        const channels = await getBufferChannels(apiToken, org.id);
        results.push({
          organization: org,
          channels,
        });
      }

      return NextResponse.json({
        success: true,
        discovery: results,
      });
    } catch (err) {
      return NextResponse.json(
        {
          error: "Buffer discovery failed",
          details: err instanceof Error ? err.message : String(err),
        },
        { status: 500 }
      );
    }
  }

  // If action=sync, execute synchronization directly
  if (action === "sync") {
    try {
      const limit = Number(searchParams.get("limit")) || 10;
      const result = await syncBufferLinkedInPosts(payload, { limit });
      return NextResponse.json(result);
    } catch (err) {
      return NextResponse.json(
        {
          error: "Buffer sync failed",
          details: err instanceof Error ? err.message : String(err),
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    status: "healthy",
    endpoint: "/api/sync/buffer",
    configured,
    availableActions: [
      "?action=discover — List your Buffer organization and channel IDs",
      "?action=sync — Trigger manual synchronization",
    ],
  });
}

/**
 * POST /api/sync/buffer
 * Primary synchronization webhook / cron ingestion endpoint.
 */
export async function POST(req: NextRequest) {
  const payload = await getPayload({ config: configPromise });

  const authorized = await isAuthorized(req, payload);
  if (!authorized) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message:
          "Provide Authorization: Bearer <CRON_SECRET> header or ?secret=<CRON_SECRET> query parameter.",
      },
      { status: 401 }
    );
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    // Body is optional for standard cron triggers
  }

  const { searchParams } = new URL(req.url);
  const action = body.action || searchParams.get("action");

  // Optional discovery action in POST
  if (action === "discover") {
    const apiToken = (body.apiToken as string) || process.env.BUFFER_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json(
        { error: "BUFFER_API_TOKEN is required to run discovery." },
        { status: 400 }
      );
    }

    try {
      const orgs = await getBufferOrganizations(apiToken);
      const results: Array<Record<string, unknown>> = [];

      for (const org of orgs) {
        const channels = await getBufferChannels(apiToken, org.id);
        results.push({
          organization: org,
          channels,
        });
      }

      return NextResponse.json({
        success: true,
        discovery: results,
      });
    } catch (err) {
      return NextResponse.json(
        {
          error: "Buffer discovery failed",
          details: err instanceof Error ? err.message : String(err),
        },
        { status: 500 }
      );
    }
  }

  // Execute synchronization
  try {
    const limit = Number(body.limit || searchParams.get("limit")) || 10;
    const result = await syncBufferLinkedInPosts(payload, { limit });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[Buffer Sync Endpoint Error]:", err);
    return NextResponse.json(
      {
        error: "Buffer sync failed",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
