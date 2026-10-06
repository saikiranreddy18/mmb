import type { Metadata } from "next";
import { IntroReveal } from "@/components/motion/IntroReveal";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { PromiseQuotes } from "@/components/home/PromiseQuotes";
import { getProducts } from "@/lib/commerce/products";
import { ShopFaq } from "@/components/shop/ShopFaq";

export const metadata: Metadata = {
  title: "Buy Dry Fruit & Seed Energy Bars Online",
  description:
    "Shop Mumma's Bite energy bars: Dry Fruit and Multi-Seed bars made with dates, nuts and seeds. No added sugar, no preservatives. Delivered across India.",
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
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
          Dry fruit bars and multi-seed energy bars made from dates, nuts and seeds. A healthy snack with no added
          sugar and no preservatives, with 3–3.5 g of protein in every bar. For school tiffins, office desks, the gym
          and travel, delivered across India.
        </p>
      </IntroReveal>
      <div className="shell">
        <ProductGrid products={products} />
      </div>
      <ShopFaq />
      <div className="mt-20 md:mt-28">
        <PromiseQuotes />
      </div>
    </div>
  );
}
