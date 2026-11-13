/**
 * Buffer Discovery Script
 *
 * Connects to the Buffer GraphQL API and outputs your Organization ID
 * and connected Channels (specifically your LinkedIn Channel ID).
 *
 * Usage:
 *   pnpm tsx scripts/buffer-discovery.ts
 *
 * Requires BUFFER_API_TOKEN in .env.local or passed as an argument:
 *   pnpm tsx scripts/buffer-discovery.ts <your_token>
 */

import "@next/env";
import { loadEnvConfig } from "@next/env";
import { getBufferOrganizations, getBufferChannels } from "../src/lib/buffer";

// Load local environment variables
loadEnvConfig(process.cwd());

async function main() {
  const tokenArg = process.argv[2];
  const token = tokenArg || process.env.BUFFER_API_TOKEN;

  console.log("\n=======================================================");
  console.log("       BUFFER API DISCOVERY TOOL (PORTFOLIO CMS)       ");
  console.log("=======================================================\n");

  if (!token) {
    console.error("❌ Error: BUFFER_API_TOKEN is not set.");
    console.log("Please add BUFFER_API_TOKEN to your .env.local file or pass it as an argument:");
    console.log("  pnpm tsx scripts/buffer-discovery.ts <YOUR_BUFFER_API_TOKEN>\n");
    process.exit(1);
  }

  console.log("🔍 Authenticating with Buffer GraphQL API...");

  try {
    const orgs = await getBufferOrganizations(token);

    if (orgs.length === 0) {
      console.warn("⚠️ No organizations found for this account.");
      return;
    }

    console.log(`\n✅ Found ${orgs.length} organization(s):\n`);

    for (const org of orgs) {
      console.log(`🏢 Organization: "${org.name}" (ID: ${org.id})`);
      const channels = await getBufferChannels(token, org.id);

      if (channels.length === 0) {
        console.log("   (No channels connected in this organization)");
        continue;
      }

      console.log(`   Connected Channels (${channels.length}):`);
      for (const channel of channels) {
        const isLinkedIn = channel.service.toLowerCase().includes("linkedin");
        const icon = isLinkedIn ? "⭐ [LINKEDIN]" : "  ";
        console.log(
          `   ${icon} ${channel.name} (${channel.displayName || channel.service})`
        );
        console.log(`      • Channel ID: ${channel.id}`);
        console.log(`      • Service:    ${channel.service}`);
        console.log(`      • Status:     ${channel.isQueuePaused ? "Paused" : "Active"}\n`);
      }

      const linkedInChannel = channels.find((c) =>
        c.service.toLowerCase().includes("linkedin")
      );

      if (linkedInChannel) {
        console.log("-------------------------------------------------------");
        console.log("📋 Ready-to-copy .env.local Configuration:");
        console.log("-------------------------------------------------------");
        console.log(`BUFFER_API_TOKEN=${token}`);
        console.log(`BUFFER_ORGANIZATION_ID=${org.id}`);
        console.log(`BUFFER_LINKEDIN_CHANNEL_ID=${linkedInChannel.id}`);
        console.log("-------------------------------------------------------\n");
      }
    }
  } catch (error) {
    console.error("❌ Discovery failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();

