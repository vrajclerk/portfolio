import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Protected Preview Route Handler.
 *
 * Validates the secret token before enabling Next.js draft mode.
 * Denies access (401) to unauthorized requests.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const targetUrl = searchParams.get("url");

  const expectedSecret =
    process.env.PAYLOAD_SECRET || process.env.PREVIEW_SECRET;

  if (!secret || secret !== expectedSecret) {
    return new Response("Unauthorized: Invalid preview token", { status: 401 });
  }

  if (!targetUrl) {
    return new Response("Bad Request: Missing target URL parameter", {
      status: 400,
    });
  }

  // Ensure target URL is a safe local path (prevent open redirect vulnerabilities)
  if (!targetUrl.startsWith("/") || targetUrl.startsWith("//")) {
    return new Response("Bad Request: Invalid target URL", { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(targetUrl);
}
