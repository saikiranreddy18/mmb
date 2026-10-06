import { getProducts } from "@/lib/commerce/products";
import { FREE_DELIVERY_MIN } from "@/lib/commerce/offers";
import { GOOGLE_PRODUCT_CATEGORY } from "@/lib/seo/google-category";
import { siteName, siteUrl } from "@/lib/seo/site";

/**
 * Google Merchant Center product feed (RSS 2.0 + g: namespace), built from the
 * live Shopify catalogue. Add it in Merchant Center as a scheduled fetch of
 * https://mummasbite.com/merchant-feed.xml so Shopping listings point at this site.
 */
export const revalidate = 3600;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
const abs = (u: string) => (u.startsWith("/") ? `${siteUrl}${u}` : u);
const tag = (name: string, value: string | undefined | null) => (value ? `<g:${name}>${esc(value)}</g:${name}>` : "");

export async function GET() {
  const products = (await getProducts()).filter((p) => !p.isMock);

  const items = products.flatMap((p) =>
    p.variants.map((v) => {
      const link = `${siteUrl}/shop/${p.handle}`;
      const [main, ...more] = p.images.length ? p.images : p.featuredImage ? [p.featuredImage] : [];
      const claims = p.details.claims.status === "verified" ? p.details.claims.value : null;
      const description = [p.description, claims, p.details.ingredients.value ? `Ingredients: ${p.details.ingredients.value}.` : null]
        .filter(Boolean)
        .join(" ");
      const title = p.variants.length > 1 || v.title !== "Default Title" ? `${p.title}, ${v.title}` : p.title;
      return `<item>
${tag("id", v.id.split("/").pop())}
${tag("item_group_id", p.variants.length > 1 ? p.handle : null)}
<title>${esc(`${siteName} ${title}`)}</title>
<link>${esc(link)}</link>
<description>${esc(description.slice(0, 4900))}</description>
${tag("link", link)}
${main ? tag("image_link", abs(main.url)) : ""}
${more.slice(0, 10).map((i) => tag("additional_image_link", abs(i.url))).join("\n")}
${tag("availability", v.availableForSale ? "in_stock" : "out_of_stock")}
${tag("price", `${Number((v.compareAtPrice && Number(v.compareAtPrice.amount) > Number(v.price.amount) ? v.compareAtPrice : v.price).amount).toFixed(2)} ${v.price.currencyCode}`)}
${v.compareAtPrice && Number(v.compareAtPrice.amount) > Number(v.price.amount) ? tag("sale_price", `${Number(v.price.amount).toFixed(2)} ${v.price.currencyCode}`) : ""}
${tag("brand", siteName)}
${tag("condition", "new")}
${tag("identifier_exists", "no")}
${tag("google_product_category", GOOGLE_PRODUCT_CATEGORY)}
${tag("product_type", "Snacks > Energy Bars")}
<g:shipping><g:country>IN</g:country><g:service>Standard</g:service><g:price>79.00 INR</g:price></g:shipping>
</item>`.replace(/\n{2,}/g, "\n");
    }),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>${esc(siteName)}</title>
<link>${siteUrl}</link>
<description>${esc(`${siteName} energy bars. Free delivery on orders of ₹${FREE_DELIVERY_MIN.toLocaleString("en-IN")} or more after offers.`)}</description>
${items.join("\n")}
</channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=3600" } });
}
