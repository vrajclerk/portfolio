/**
 * Buffer Manual CLI Sync Script
 *
 * Runs the Buffer LinkedIn post synchronization locally using Payload Local API.
 *
 * Usage:
 *   pnpm tsx scripts/buffer-sync.ts
 */

import "@next/env";
import { loadEnvConfig } from "@next/env";

// Load local environment variables
loadEnvConfig(process.cwd());

async function main() {
  console.log("\n=======================================================");
  console.log("       BUFFER LINKEDIN SYNC (PAYLOAD CMS LOCAL)        ");
  console.log("=======================================================\n");

  try {
    const { default: configPromise } = await import("@payload-config");
    const { getPayload } = await import("payload");
    const { syncBufferLinkedInPosts } = await import("../src/lib/buffer");

    console.log("🚀 Initializing Payload CMS Local API...");
    const payload = await getPayload({ config: configPromise });

    console.log("📡 Querying Buffer GraphQL API for published LinkedIn posts...");
    const result = await syncBufferLinkedInPosts(payload, { limit: 10 });

    console.log("\n-------------------------------------------------------");
    console.log("📊 SYNC EXECUTION SUMMARY:");
    console.log("-------------------------------------------------------");
    console.log(`• Total Posts Fetched: ${result.totalFetched}`);
    console.log(`• New Posts Ingested:  ${result.imported}`);
    console.log(`• Existing (Skipped):  ${result.skipped}`);

    if (result.importedPosts.length > 0) {
      console.log("\n✨ Newly Published Posts:");
      result.importedPosts.forEach((post) => {
        console.log(`  + [ID: ${post.id}] "${post.title}" (/blog/${post.slug})`);
      });
    }

    if (result.errors.length > 0) {
      console.warn("\n⚠️ Warnings / Errors:");
      result.errors.forEach((err) => console.warn(`  - ${err}`));
    }

    console.log("\n✅ Synchronization finished successfully.\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Sync failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();

