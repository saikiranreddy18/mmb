import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/site";

/**
 * AI search and assistant crawlers are welcomed by name, so answer engines
 * (ChatGPT search, Perplexity, Claude, Gemini, Copilot) can read and cite the
 * site. They get the same access as everyone else.
 */
const AI_CRAWLERS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
];

const DISALLOW = ["/profile", "/api/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: DISALLOW },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
