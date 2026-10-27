import { getPublishedPosts, getSiteSettings } from "@/lib/cms";
import { generateRssFeed } from "@/utilities/rss";

export async function GET() {
  const [posts, siteSettings] = await Promise.all([
    getPublishedPosts(),
    getSiteSettings(),
  ]);

  const rss = generateRssFeed({ posts, siteSettings });

  return new Response(rss, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
