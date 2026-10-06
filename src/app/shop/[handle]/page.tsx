import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { getProduct, getProducts } from "@/lib/commerce/products";
import { formatMoney } from "@/lib/commerce/money";
import type { Product } from "@/lib/commerce/types";
import { siteName, siteUrl } from "@/lib/seo/site";
import { GOOGLE_PRODUCT_CATEGORY } from "@/lib/seo/google-category";

const absolute = (url: string) => (url.startsWith("/") ? `${siteUrl}${url}` : url);

/** Search snippet: the product's own line, its verified claims, pack size and price, kept under ~160 chars. */
function seoDescription(p: Product) {
  const parts = [p.shortDescription];
  if (p.details.claims.status === "verified" && p.details.claims.value) parts.push(`${p.details.claims.value}.`);
  const v = p.variants[0];
  if (v) parts.push(`${v.title}, ${formatMoney(v.price)}.`);
  let text = parts.join(" ").replace(/\s+/g, " ").trim();
  if (text.length > 160) text = `${text.slice(0, 157).replace(/\s+\S*$/, "")}…`;
  return text;
}

type Params = { params: Promise<{ handle: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Product not found" };
  const description = seoDescription(product);
  const images = product.featuredImage ? [{ url: absolute(product.featuredImage.url), alt: product.featuredImage.altText ?? product.title }] : undefined;
  return {
    title: product.title,
    description,
    alternates: { canonical: `/shop/${product.handle}` },
    // Mock products must never be indexed as real products.
    robots: product.isMock ? { index: false, follow: true } : undefined,
    openGraph: { title: `${product.title} | ${siteName}`, description, url: `/shop/${product.handle}`, images },
    twitter: { card: "summary_large_image", title: `${product.title} | ${siteName}`, description, images },
  };
}

export default async function ProductPage({ params }: Params) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  // Product structured data only from live Shopify data — never from mock data.
  const url = `${siteUrl}/shop/${product.handle}`;
  const jsonLd = product.isMock
    ? null
    : {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Product",
            "@id": `${url}#product`,
            name: product.title,
            description: product.description,
            url,
            image: product.images.map((i) => absolute(i.url)),
            brand: { "@type": "Brand", name: siteName },
            category: GOOGLE_PRODUCT_CATEGORY,
            offers: product.variants.map((v) => ({
              "@type": "Offer",
              name: v.title,
              price: v.price.amount,
              priceCurrency: v.price.currencyCode,
              itemCondition: "https://schema.org/NewCondition",
              availability: v.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              url,
              seller: { "@id": `${siteUrl}/#organization` },
              // Mirrors the Shopify shipping rate for India (₹79; free on larger orders at checkout).
              shippingDetails: {
                "@type": "OfferShippingDetails",
                shippingRate: { "@type": "MonetaryAmount", value: "79", currency: "INR" },
                shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
              },
            })),
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
              { "@type": "ListItem", position: 2, name: "Shop", item: `${siteUrl}/shop` },
              { "@type": "ListItem", position: 3, name: product.title, item: url },
            ],
          },
        ],
      };

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <ProductDetail product={product} />
    </>
  );
}
