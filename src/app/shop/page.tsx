import type { Metadata } from "next";
import { IntroReveal } from "@/components/motion/IntroReveal";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { PromiseQuotes } from "@/components/home/PromiseQuotes";
import { getProducts } from "@/lib/commerce/products";

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop Mumma's Bite — made with a mother's love.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <div className="pt-32 md:pt-44">
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
      </IntroReveal>
      <div className="shell">
        <ProductGrid products={products} />
      </div>
      <div className="mt-20 md:mt-28">
        <PromiseQuotes />
      </div>
    </div>
  );
}
