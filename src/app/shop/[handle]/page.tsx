import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { getProduct, getProducts } from "@/lib/commerce/products";
import { siteUrl } from "@/lib/seo/site";

type Params = { params: Promise<{ handle: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Product not found" };
  return {
    title: product.title,
    description: product.shortDescription,
    alternates: { canonical: `/shop/${product.handle}` },
    // Mock products must never be indexed as real products.
    robots: product.isMock ? { index: false, follow: true } : undefined,
    openGraph: {
      title: product.title,
      description: product.shortDescription,
      images: product.featuredImage ? [{ url: product.featuredImage.url }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  // Product structured data only from live Shopify data — never from mock data.
  const jsonLd = product.isMock
    ? null
    : {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: product.description,
        image: product.images.map((i) => i.url),
        brand: { "@type": "Brand", name: "Mummas Bite" },
        offers: product.variants.map((v) => ({
          "@type": "Offer",
          price: v.price.amount,
          priceCurrency: v.price.currencyCode,
          availability: v.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          url: `${siteUrl}/shop/${product.handle}`,
        })),
      };

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <ProductDetail product={product} />
    </>
  );
}
