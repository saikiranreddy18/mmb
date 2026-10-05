import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/commerce/products";
import { siteUrl } from "@/lib/seo/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const now = new Date();
  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/our-story`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    // Mock products are excluded so placeholder data is never submitted to search engines.
    ...products
      .filter((p) => !p.isMock)
      .map((p) => ({
        url: `${siteUrl}/shop/${p.handle}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
        images: p.images.map((i) => (i.url.startsWith("/") ? `${siteUrl}${i.url}` : i.url)),
      })),
  ];
}
