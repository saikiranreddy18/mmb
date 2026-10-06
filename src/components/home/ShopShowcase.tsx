import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/shop/ProductCard";
import type { Product } from "@/lib/commerce/types";

/** WORLD 02 — straight after the hero: what you can buy. */
export function ShopShowcase({ products }: { products: Product[] }) {
  return (
    <section id="shop-preview" aria-labelledby="shop-preview-title" className="scroll-mt-20 py-20 md:py-28">
      <div className="shell grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow mb-6 text-brown">The shop</p>
          <h2 id="shop-preview-title" className="display text-[clamp(2.5rem,6vw,4.75rem)] text-green">
            From our <span className="editorial block text-brown">kitchen to yours.</span>
          </h2>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-ink-soft">
            Affordable, healthy snack bars: dates, nuts and seeds, pressed into honest bars with no added sugar and
            no preservatives.
          </p>
          <Link
            href="/shop"
            className="group mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-green"
          >
            Visit the shop
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </Link>
          <Link
            href="/healthy-snack-bars"
            className="mt-1 block text-sm text-ink-soft underline underline-offset-4 hover:text-green"
          >
            Compare our dry fruit and seed bars
          </Link>
        </Reveal>
        <Reveal as="ul" stagger={0.1} className="grid max-w-2xl grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6">
          {products.slice(0, 4).map((p, i) => (
            <li key={p.id}>
              <ProductCard product={p} priority={i === 0} offset={i * 1500} />
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
