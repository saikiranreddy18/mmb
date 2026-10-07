"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ImageOff } from "lucide-react";
import { formatMoney, wasPrice } from "@/lib/commerce/money";
import type { Product } from "@/lib/commerce/types";
import { MQ } from "@/lib/motion/gsap";
import { shortAllergens, summarise } from "@/lib/seo/product-summary";
import { VariantPurchase } from "./VariantPurchase";

const SLIDE_MS = 3000;

/**
 * Product card. The whole card opens the product page (stretched title link);
 * only the add-to-cart controls sit above it.
 *
 * MOTION CONTRACT — Card slideshow
 * All of the product's photos crossfade one after another, 3s each (700ms fade),
 * non-stop while the card is on screen; `offset` staggers neighbouring cards.
 * Reduced motion: first photo only.
 */
export function ProductCard({ product, priority, offset = 0 }: { product: Product; priority?: boolean; offset?: number }) {
  // Offer: Shopify compare-at price above the price (shown crossed out, with a badge).
  const cheapest = [...product.variants].sort((a, b) => Number(a.price.amount) - Number(b.price.amount))[0];
  const cheapestWas = cheapest ? wasPrice(cheapest.price, cheapest.compareAtPrice) : null;
  const onOffer = product.variants.some((v) => wasPrice(v.price, v.compareAtPrice));
  const images = product.images.length ? product.images : product.featuredImage ? [product.featuredImage] : [];
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const href = `/shop/${product.handle}`;
  const facts = summarise(product);
  const meta = [facts.barWeight && `${facts.barWeight} per bar`, shortAllergens(facts.allergens)].filter(Boolean).join(" · ");

  useEffect(() => {
    const el = ref.current;
    if (!el || images.length < 2 || !window.matchMedia(MQ.motion).matches) return;
    let timer = 0;
    let start = 0;
    const io = new IntersectionObserver(([e]) => {
      window.clearTimeout(start);
      window.clearInterval(timer);
      if (!e.isIntersecting) return;
      start = window.setTimeout(() => {
        setActive((i) => (i + 1) % images.length);
        timer = window.setInterval(() => setActive((i) => (i + 1) % images.length), SLIDE_MS);
      }, SLIDE_MS + offset);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(start);
      window.clearInterval(timer);
    };
  }, [images.length, offset]);

  return (
    <article ref={ref} className="group relative flex h-full flex-col">
      <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-cream">
        {onOffer && (
          <span className="absolute left-3 top-3 z-[2] rounded-full bg-brown px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-cream shadow-sm">
            Offer
          </span>
        )}
        {images.length ? (
          images.map((img, i) => (
            <Image
              key={img.url}
              src={img.url}
              alt={img.altText ?? product.title}
              fill
              priority={priority && i === 0}
              sizes="(min-width:1024px) 22vw, (min-width:640px) 40vw, 46vw"
              className={`object-cover transition-[opacity,transform] duration-700 ease-brand group-hover:scale-[1.03] ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))
        ) : (
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 border border-dashed border-brown/25 text-brown">
            <ImageOff className="size-6 opacity-70" strokeWidth={1.5} aria-hidden />
            <span className="eyebrow">Asset required</span>
          </span>
        )}
        {images.length > 1 && (
          <span aria-hidden className="absolute inset-x-0 bottom-3 flex justify-center gap-1">
            {images.map((img, i) => (
              <span
                key={img.url}
                className={`h-1 rounded-full transition-all duration-500 ${i === active ? "w-4 bg-green" : "w-1.5 bg-ink/25"}`}
              />
            ))}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-3 md:pt-4">
        <h2 className="text-base font-extrabold leading-tight text-ink md:text-lg">
          {/* stretched link: the whole card opens the product */}
          <Link href={href} className="after:absolute after:inset-0 after:z-[1] after:rounded-[1.5rem] hover:text-green">
            {product.title}
          </Link>
        </h2>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-base font-bold text-green md:text-lg">
          {product.variants.length > 1 && <span className="text-xs font-semibold text-ink-soft">from </span>}
          {cheapestWas && (
            <del className="text-sm font-semibold text-ink-soft/70">
              <span className="sr-only">Regular price </span>
              {formatMoney(cheapestWas)}
            </del>
          )}
          <span>{formatMoney(product.priceRange.minVariantPrice)}</span>
        </p>
        <p className="mt-1 hidden text-sm leading-relaxed text-ink-soft sm:block">{product.shortDescription}</p>
        {meta && <p className="mt-1.5 text-xs font-semibold text-ink-soft">{meta}</p>}
        <div className="relative z-[2] mt-auto">
          <VariantPurchase product={product} compact />
        </div>
      </div>
    </article>
  );
}
