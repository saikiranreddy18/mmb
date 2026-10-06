import { getProducts } from "@/lib/commerce/products";
import { FREE_DELIVERY_MIN, OFFER_LINES } from "@/lib/commerce/offers";
import { POLICY_LINKS } from "@/content/policies";
import { SUPPORT_EMAIL } from "@/content/contact";
import { lowestPerBarAcross, summarise } from "@/lib/seo/product-summary";
import { siteUrl } from "@/lib/seo/site";

export const revalidate = 3600;

/**
 * /llms.txt — a plain-language summary of the brand and products for AI
 * assistants and answer engines (llmstxt.org format). Built from the same
 * verified label data and live prices as the product pages.
 */
export async function GET() {
  const products = (await getProducts()).filter((p) => !p.isMock);
  const s = products.map(summarise);
  const from = lowestPerBarAcross(s);

  const productBlocks = s.map((p) =>
    [
      `### [${p.title}](${siteUrl}/shop/${p.handle})`,
      p.perBar && `- Price: from ${p.perBar} per bar${p.barWeight ? ` (${p.barWeight} bar)` : ""}, sold in packs`,
      p.claims && `- On the pack: ${p.claims}`,
      p.ingredients && `- Ingredients: ${p.ingredients}`,
      (p.calories || p.protein) &&
        `- Per bar: ${[p.calories, p.protein && `${p.protein} protein`, p.fibre && `${p.fibre} fibre`, p.totalSugars && `${p.totalSugars} natural sugars`, p.addedSugars && `${p.addedSugars} added sugar`].filter(Boolean).join(", ")}`,
      p.allergens && `- Allergens: ${p.allergens}`,
      p.shelfLife && `- Shelf life: ${p.shelfLife}${p.storage ? `. ${p.storage}` : ""}`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  const body = `# Mumma's Bite

> Mumma's Bite makes affordable, healthy snack bars in India: dry fruit and multi-seed energy bars made from dates, nuts and seeds, with no added sugar and no preservatives${from ? `, from ${from} per bar` : ""}. Made in Visakhapatnam, Andhra Pradesh, sold online at mummasbite.com and delivered across India.

Mumma's Bite is a home-grown Indian brand started by a mother, Rajeswari, who turned her family's date, nut and seed laddus into convenient snack bars. The bars are sweetened only by dates. They suit school tiffins, office snacking, workouts and travel. FSSAI Lic. No. 20126052001147.

## Products

${productBlocks.join("\n\n")}

## Buying

- Order online: ${siteUrl}/shop
- Offers: ${OFFER_LINES.join("; ")}
- Delivery anywhere in India: ₹79, free when the order total after offers is ₹${FREE_DELIVERY_MIN.toLocaleString("en-IN")} or more
- Payment: UPI, cards, net banking and wallets through Razorpay
- Contact: ${SUPPORT_EMAIL}

## Pages

- [Affordable healthy snack bars and dry fruit bars](${siteUrl}/healthy-snack-bars): comparison, prices and FAQ
- [Shop](${siteUrl}/shop)
- [Our story](${siteUrl}/our-story)
${POLICY_LINKS.map((l) => `- [${l.label}](${siteUrl}/policies/${l.slug})`).join("\n")}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
