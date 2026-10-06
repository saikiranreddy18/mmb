import { getProducts } from "@/lib/commerce/products";
import { formatMoney } from "@/lib/commerce/money";
import { OFFER_LINES } from "@/lib/commerce/offers";
import type { ContentField } from "@/content/status";
import { brand } from "@/content/brand";
import { ADDRESS, SUPPORT_EMAIL, whatsappLink } from "@/content/contact";
import { FAQ } from "@/content/faq";
import { POLICY_LINKS, POLICIES } from "@/content/policies";
import { defaultDescription, siteName, siteUrl } from "@/lib/seo/site";

/**
 * /llms.txt — a plain-text brief for AI assistants and AI search (ChatGPT,
 * Gemini, Perplexity, Claude, Google AI Overviews), following llmstxt.org.
 * Built from the live catalogue and the site's own copy, so it never says
 * anything the site doesn't. Only VERIFIED product facts are included.
 */
export const revalidate = 3600;

const fact = (label: string, f: ContentField) =>
  f.status === "verified" && f.value ? `- ${label}: ${f.value.replace(/\n+/g, "; ")}` : null;

export async function GET() {
  const products = (await getProducts()).filter((p) => !p.isMock);

  const productBlocks = products.map((p) => {
    const d = p.details;
    const prices = p.variants
      .filter((v) => v.availableForSale)
      .map((v) => `${v.title === "Default Title" ? "Price" : v.title}: ${formatMoney(v.price)}`);
    return [
      `### [${p.title}](${siteUrl}/shop/${p.handle})`,
      p.description,
      ...prices.map((x) => `- ${x}`),
      fact("Net quantity", d.netQuantity),
      fact("Ingredients", d.ingredients),
      fact("On the pack", d.claims),
      fact("Nutrition", d.nutrition),
      fact("Allergens", d.allergens),
      fact("Storage", d.storage),
      fact("Shelf life", d.shelfLife),
      fact("FSSAI", d.fssai),
    ]
      .filter(Boolean)
      .join("\n");
  });

  const body = [
    `# ${siteName}`,
    "",
    `> ${defaultDescription}`,
    "",
    `${siteName} is an Indian food brand from ${ADDRESS.locality}, ${ADDRESS.region}. ${brand.idea.value} Tagline: "${brand.promise.value}" ${brand.supporting.value}`,
    "",
    "Key facts:",
    "- Products: dry fruit and multi-seed energy bars made from dates, nuts and seeds.",
    "- No added sugar and no preservatives (sweetness comes from dates).",
    "- Sold online at https://mummasbite.com with delivery across India.",
    `- Based in ${ADDRESS.lines.join(", ")}.`,
    "- FSSAI Lic. No. 20126052001147.",
    "",
    "## Products",
    "",
    productBlocks.join("\n\n"),
    "",
    "## Offers",
    "",
    ...OFFER_LINES.map((l) => `- ${l}`),
    "",
    "## Frequently asked questions",
    "",
    ...FAQ.flatMap(({ q, a }) => [`### ${q}`, a, ""]),
    "## Pages",
    "",
    `- [Home](${siteUrl}/): the brand and both bars`,
    `- [Shop](${siteUrl}/shop): all products, prices and FAQs`,
    `- [Our story](${siteUrl}/our-story): how Mumma's Bite began`,
    "",
    "## Policies",
    "",
    ...POLICY_LINKS.map(({ slug, label }) => `- [${label}](${siteUrl}/policies/${slug}): ${POLICIES[slug].description}`),
    "",
    "## Contact",
    "",
    `- Email: ${SUPPORT_EMAIL}`,
    `- WhatsApp: ${whatsappLink()}`,
    `- Address: ${ADDRESS.lines.join(", ")}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=3600" },
  });
}
