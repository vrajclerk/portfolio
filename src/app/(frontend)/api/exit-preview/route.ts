import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Exit Preview Route Handler.
 *
 * Disables Next.js draft mode and redirects back to the requested page or home.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url") || "/";

  // Prevent open redirect vulnerabilities
  const safeUrl =
    targetUrl.startsWith("/") && !targetUrl.startsWith("//") ? targetUrl : "/";

  const draft = await draftMode();
  draft.disable();

  redirect(safeUrl);
}
