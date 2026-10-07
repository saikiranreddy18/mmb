import Link from "next/link";
import { ArrowLeft, ImageOff } from "lucide-react";
import { IntroReveal } from "@/components/motion/IntroReveal";
import { ProductFacts } from "@/components/ui/ProductFacts";
import type { Product } from "@/lib/commerce/types";
import { FAQ } from "@/content/faq";
import { PRODUCT_VIDEOS } from "@/content/product-videos";
import { ProductGallery } from "./ProductGallery";
import { VariantPurchase } from "./VariantPurchase";

export function ProductDetail({ product }: { product: Product }) {
  const images = product.images.length ? product.images : product.featuredImage ? [product.featuredImage] : [];

  return (
    <article className="pb-24 pt-32 md:pb-32 md:pt-36">
      <div className="shell">
        <Link
          href="/shop"
          className="mb-8 inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-ink-soft hover:text-green"
        >
          <ArrowLeft className="size-4" aria-hidden /> Back to shop
        </Link>

        <IntroReveal className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          {/* Media */}
          {images.length ? (
            <ProductGallery images={images} title={product.title} handle={product.handle} video={PRODUCT_VIDEOS[product.handle]} />
          ) : (
            <div
              data-hero-reveal="clip"
              role="img"
              aria-label="Image placeholder: real product photograph required"
              className="flex aspect-[4/5] flex-col items-center justify-center gap-3 rounded-[2rem] border border-dashed border-brown/25 bg-cream text-brown"
            >
              <ImageOff className="size-7 opacity-70" strokeWidth={1.5} aria-hidden />
              <span className="eyebrow">Asset required</span>
              <span className="text-sm opacity-80">Real product photograph</span>
            </div>
          )}

          {/* Information */}
          <div>
            <div data-hero-reveal="fade" className="flex flex-wrap items-center gap-3">
              <p className="eyebrow text-brown">Mumma's Bite</p>
            </div>
            <h1 className="mt-4 overflow-hidden pb-[0.08em] text-green">
              <span data-hero-reveal="line" className="display block text-[clamp(2.5rem,6vw,4.5rem)]">
                {product.title}
              </span>
            </h1>

            <div>
              {/* 1. What it tastes like, in one line */}
              {product.shortDescription && (
                <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-soft">{product.shortDescription}</p>
              )}

              {/* 2–4. Pack, price and price per bar; quantity and buttons; allergens and delivery */}
              <VariantPurchase product={product} />
              <p className="mt-4 max-w-md text-sm text-ink-soft">
                <Link href="/policies/shipping-policy" className="font-semibold text-green underline underline-offset-4">
                  Delivery
                </Link>{" "}
                ·{" "}
                <Link href="/policies/refund-policy" className="font-semibold text-green underline underline-offset-4">
                  Replacements &amp; refunds
                </Link>
              </p>

              {/* 5. Full description */}
              <h2 className="eyebrow mb-3 mt-14 text-green">About this bar</h2>
              <p className="max-w-lg leading-relaxed text-ink-soft">{product.description}</p>

              {/* 6–7. Ingredients, nutrition, storage and shelf life */}
              <h2 className="eyebrow mb-2 mt-12 text-green">Product information</h2>
              <ProductFacts details={product.details} />

              {/* 7. Questions */}
              <h2 className="eyebrow mb-2 mt-12 text-green">Questions</h2>
              <div className="divide-y divide-line border-y border-line">
                {FAQ.map(({ q, a }) => (
                  <details key={q} className="group py-4">
                    <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
                      {q}
                      <span aria-hidden className="text-green transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-2 leading-relaxed text-ink-soft">{a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </IntroReveal>
      </div>

    </article>
  );
}
