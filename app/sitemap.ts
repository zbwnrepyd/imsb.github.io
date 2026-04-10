import type { MetadataRoute } from "next";

const siteUrl = "https://imsbtest.com";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date("2026-04-10T00:00:00.000Z"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
