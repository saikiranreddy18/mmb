import type { Metadata } from "next";
import { IntroReveal } from "@/components/motion/IntroReveal";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductPreview } from "@/components/shop/ProductPreview";
import { MockNotice } from "@/components/ui/MockNotice";
import { isShopifyConnected } from "@/lib/commerce/config";
import { getProducts } from "@/lib/commerce/products";

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop Mumma's Bite — made with a mother's love.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <div className="pb-24 pt-28 md:pb-32 md:pt-40">
      <IntroReveal className="shell mb-12 md:mb-16">
        <p data-hero-reveal="fade" className="eyebrow mb-6 text-brown">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
        <h1 className="text-green">
          <span className="block overflow-hidden pb-[0.1em]">
            <span data-hero-reveal="line" className="display block text-[clamp(2.75rem,8vw,6.5rem)]">
              Shop <span className="editorial text-brown">Mumma's Bite</span>
            </span>
          </span>
        </h1>
        {!isShopifyConnected && (
          <div data-hero-reveal="fade" className="mt-8 max-w-2xl">
            <MockNotice>
              Showing mock products so the shopping journey can be tested. Real products, prices and stock will load
              from Shopify once it is connected.
            </MockNotice>
          </div>
        )}
      </IntroReveal>
      <div className="shell">
        <ProductGrid products={products} />
      </div>
      <div className="mt-16 border-t border-line md:mt-24">
        <ProductPreview product={products[0] ?? null} />
      </div>
    </div>
  );
}
