import "server-only";
import { POLICIES, type Policy, type PolicySlug } from "@/content/policies";
import { isShopifyConnected } from "./config";
import { storefrontFetch } from "./shopify/client";

type RawPolicy = { title: string; body: string } | null;

const query = /* GraphQL */ `
  query Policies @inContext(country: IN, language: EN) {
    shop {
      refundPolicy { title body }
      shippingPolicy { title body }
      termsOfService { title body }
    }
  }
`;

const SHOPIFY_FIELD: Partial<Record<PolicySlug, "refundPolicy" | "shippingPolicy" | "termsOfService">> = {
  // Privacy is always the site's own copy: it describes this storefront's actual
  // providers (Vercel, Shopify, Razorpay) and its single support address.
  "refund-policy": "refundPolicy",
  "shipping-policy": "shippingPolicy",
  "terms-of-service": "termsOfService",
};

/**
 * Shopify's policy HTML, tidied for this site: drops editor comments, and the
 * branded block's own heading (the page already shows the title as its h1).
 */
function forSite(body: string) {
  return body
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<p[^>]*>\s*Made with a mother(?:'|&#39;|&rsquo;|’)s love\s*<\/p>/i, "")
    .replace(/<h2[^>]*>[\s\S]*?<\/h2>/i, "")
    .trim();
}

/** The Shopify version of a policy when the merchant has written one there, otherwise the site's copy. */
export async function getPolicy(slug: PolicySlug): Promise<Policy> {
  const local = POLICIES[slug];
  const field = SHOPIFY_FIELD[slug];
  if (!isShopifyConnected || !field) return local;
  try {
    const data = await storefrontFetch<{ shop: Record<string, RawPolicy> }>(query, {}, { revalidate: 3600 });
    const remote = data.shop[field];
    return remote?.body?.trim() ? { ...local, body: forSite(remote.body) } : local;
  } catch {
    return local;
  }
}
