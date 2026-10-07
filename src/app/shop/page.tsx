import type { Metadata } from "next";
import Link from "next/link";
import { IntroReveal } from "@/components/motion/IntroReveal";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { PromiseQuotes } from "@/components/home/PromiseQuotes";
import { getProducts } from "@/lib/commerce/products";
import { ShopFaq } from "@/components/shop/ShopFaq";

export const metadata: Metadata = {
  title: "Buy Healthy Snack Bars & Dry Fruit Bars Online",
  description:
    "Buy affordable healthy snack bars online: Mumma's Bite dry fruit and multi-seed bars, made from dates, nuts and seeds. No added sugar. Delivered across India.",
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
          Find your everyday bite. Choose a soft, nutty Dry Fruit Bar or a crunchy Multi-Seed Bar, both made with dates
          and no added sugar or preservatives. Pick your favourite, choose a pack, and keep a little taste of home close
          by. Delivered across India.{" "}
          <Link href="/healthy-snack-bars" className="font-semibold text-green underline underline-offset-4">
            Compare the bars
          </Link>
          .
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
