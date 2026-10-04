import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ImageOff } from "lucide-react";
import { IntroReveal } from "@/components/motion/IntroReveal";
import { ProductFacts } from "@/components/ui/ProductFacts";
import type { Product } from "@/lib/commerce/types";
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
            </div>
            <h1 className="mt-4 overflow-hidden pb-[0.08em] text-green">
              <span data-hero-reveal="line" className="display block text-[clamp(2.5rem,6vw,4.5rem)]">
                {product.title}
              </span>
            </h1>

            <div data-hero-reveal="fade">
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">{product.description}</p>

              <VariantPurchase product={product} />

              <h2 className="eyebrow mb-2 mt-14 text-green">Product information</h2>
              <ProductFacts details={product.details} />
            </div>
          </div>
        </IntroReveal>
      </div>

    </article>
  );
}
