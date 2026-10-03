import { shopifyConfig } from "../config";

type GraphQLResponse<T> = { data?: T; errors?: { message: string }[] };

/**
 * Minimal Storefront API client. Safe to call from server or browser —
 * the Storefront token is a public token by Shopify's design.
 */
export async function storefrontFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  init: { revalidate?: number | false; cache?: RequestCache } = {},
): Promise<T> {
  const endpoint = `https://${shopifyConfig.domain}/api/${shopifyConfig.apiVersion}/graphql.json`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": shopifyConfig.storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
    cache: init.cache,
    next: init.revalidate === undefined ? undefined : { revalidate: init.revalidate },
  } as RequestInit);

  if (!res.ok) throw new Error(`Shopify Storefront API ${res.status}`);
  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  if (!json.data) throw new Error("Shopify Storefront API returned no data");
  return json.data;
}
