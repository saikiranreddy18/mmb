import type { NextConfig } from "next";

const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Shopify product media is served from cdn.shopify.com.
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },
  // mummasbite.com serves this site; Shopify's primary domain is shop.mummasbite.com.
  // Shopify links that still carry the bare domain (cart permalinks, order status
  // pages in older emails) land here, so hand them back to Shopify, which forwards
  // them to its primary domain. Requires Shopify's primary domain NOT to be
  // mummasbite.com, or this loops.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // No one may frame the site (clickjacking).
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
        ],
      },
    ];
  },
  async redirects() {
    if (!shopifyDomain) return [];
    const toShopify = (source: string, path = source) => ({
      source,
      destination: `https://${shopifyDomain}${path}`,
      permanent: false,
    });
    return [
      toShopify("/cart/c/:path*"),
      toShopify("/checkouts/:path*"),
      toShopify("/cart/:variants(\\d+:\\d+.*)", "/cart/:variants"),
      toShopify("/:shopId(\\d{6,})/:path*", "/:shopId/:path*"),
    ];
  },
};

export default nextConfig;
