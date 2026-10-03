import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ImageOff } from "lucide-react";
import { IntroReveal } from "@/components/motion/IntroReveal";
import { MockNotice } from "@/components/ui/MockNotice";
import { ProductFacts } from "@/components/ui/ProductFacts";
import { ContentValue } from "@/components/ui/ContentValue";
import { MockBadge } from "@/components/ui/StatusBadge";
import { formatMoney } from "@/lib/commerce/money";
import type { Product } from "@/lib/commerce/types";
import { AddToCartButton } from "./AddToCartButton";

export function ProductDetail({ product }: { product: Product }) {
  const variant = product.variants[0];
  const price = variant?.price ?? product.priceRange.minVariantPrice;
  const images = product.images.length ? product.images : product.featuredImage ? [product.featuredImage] : [];

  return (
    <article className="pb-32 pt-24 md:pb-32 md:pt-32">
      <div className="shell">
        <Link
          href="/shop"
          className="mb-8 inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-ink-soft hover:text-green"
        >
          <ArrowLeft className="size-4" aria-hidden /> Back to shop
        </Link>

        <IntroReveal className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          {/* Media */}
          <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            {images.length ? (
              images.map((img, i) => (
                <div key={img.url} data-hero-reveal={i === 0 ? "clip" : undefined} className={`${i > 0 ? "hidden sm:block" : ""} relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-cream`}>
                  <Image
                    src={img.url}
                    alt={img.altText ?? product.title}
                    fill
                    priority={i === 0}
                    sizes="(min-width:1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))
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
          </div>

          {/* Information */}
          <div>
            <div data-hero-reveal="fade" className="flex flex-wrap items-center gap-3">
              <p className="eyebrow text-brown">Mumma's Bite</p>
              {product.isMock && <MockBadge />}
            </div>
            <h1 className="mt-4 overflow-hidden pb-[0.08em] text-green">
              <span data-hero-reveal="line" className="display block text-[clamp(2.5rem,6vw,4.5rem)]">
                {product.title}
              </span>
            </h1>

            <div data-hero-reveal="fade">
              <div className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-2">
                <p className="text-3xl font-extrabold text-green">{formatMoney(price)}</p>
                <p className="text-sm text-ink-soft">
                  <span className="font-bold uppercase tracking-[0.14em]">Net qty</span>{" "}
                  <ContentValue field={product.details.netQuantity} />
                </p>
              </div>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">{product.description}</p>

              {product.isMock && (
                <MockNotice className="mt-6">
                  Mock product. Name, price and description are placeholders until Shopify is connected.
                </MockNotice>
              )}

              {/* Desktop/tablet CTA */}
              <AddToCartButton
                variant={variant}
                productTitle={product.title}
                withQuantity
                className="mt-8 hidden max-w-md sm:flex"
              />

              <h2 className="eyebrow mb-2 mt-14 text-green">Product information</h2>
              <ProductFacts details={product.details} />
            </div>
          </div>
        </IntroReveal>
      </div>

      {/* Mobile: thumb-reachable sticky add to cart */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md sm:hidden">
        <div className="mb-2 flex items-baseline justify-between text-sm">
          <span className="truncate font-bold">{product.title}</span>
          <span className="font-extrabold text-green">{formatMoney(price)}</span>
        </div>
        <AddToCartButton variant={variant} productTitle={product.title} withQuantity />
      </div>
    </article>
  );
}
