/**
 * Shopify connection boundary.
 * When both public env vars are present the site reads live Shopify data;
 * otherwise it falls back to the isolated, visibly-labelled mock adapter.
 */
export const shopifyConfig = {
  domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "",
  storefrontToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ?? "",
  apiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || "2025-07",
};

export const isShopifyConnected = Boolean(
  shopifyConfig.domain && shopifyConfig.storefrontToken,
);
