import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/cms";
import { getLiveSiteUrl } from "@/utilities/siteUrl";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const siteUrl = getLiveSiteUrl(settings.siteUrl);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
