import "server-only";
import { POLICIES, type Policy, type PolicySlug } from "@/content/policies";
import { isShopifyConnected } from "./config";
import { storefrontFetch } from "./shopify/client";

type RawPolicy = { title: string; body: string } | null;

const query = /* GraphQL */ `
  query Policies @inContext(country: IN, language: EN) {
    shop {
      privacyPolicy { title body }
      refundPolicy { title body }
      shippingPolicy { title body }
      termsOfService { title body }
    }
  }
`;

const SHOPIFY_FIELD: Partial<Record<PolicySlug, "privacyPolicy" | "refundPolicy" | "shippingPolicy" | "termsOfService">> = {
  "privacy-policy": "privacyPolicy",
  "refund-policy": "refundPolicy",
  "shipping-policy": "shippingPolicy",
  "terms-of-service": "termsOfService",
};

/** The Shopify version of a policy when the merchant has written one there, otherwise the site's copy. */
export async function getPolicy(slug: PolicySlug): Promise<Policy> {
  const local = POLICIES[slug];
  const field = SHOPIFY_FIELD[slug];
  if (!isShopifyConnected || !field) return local;
  try {
    const data = await storefrontFetch<{ shop: Record<string, RawPolicy> }>(query, {}, { revalidate: 3600 });
    const remote = data.shop[field];
    return remote?.body?.trim() ? { ...local, body: remote.body } : local;
  } catch {
    return local;
  }
}
