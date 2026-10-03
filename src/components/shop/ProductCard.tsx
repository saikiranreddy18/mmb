import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { ContentValue } from "@/components/ui/ContentValue";
import { MockBadge } from "@/components/ui/StatusBadge";
import { formatMoney } from "@/lib/commerce/money";
import type { Product } from "@/lib/commerce/types";
import { AddToCartButton } from "./AddToCartButton";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const img = product.featuredImage;
  return (
    <article className="group flex flex-col">
      <Link
        href={`/shop/${product.handle}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-cream"
        aria-label={product.title}
      >
        {img ? (
          <Image
            src={img.url}
            alt={img.altText ?? product.title}
            fill
            priority={priority}
            sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 92vw"
            className="object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.03]"
          />
        ) : (
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 border border-dashed border-brown/25 text-brown">
            <ImageOff className="size-6 opacity-70" strokeWidth={1.5} aria-hidden />
            <span className="eyebrow">Asset required</span>
            <span className="text-xs opacity-80">Product photograph</span>
          </span>
        )}
        {product.isMock && (
          <span className="absolute left-4 top-4">
            <MockBadge />
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-extrabold leading-tight text-ink">
            <Link href={`/shop/${product.handle}`} className="hover:text-green">
              {product.title}
            </Link>
          </h2>
          <p className="shrink-0 text-lg font-bold text-green">{formatMoney(product.priceRange.minVariantPrice)}</p>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{product.shortDescription}</p>
        <p className="mt-3 text-xs text-ink-soft">
          <span className="font-bold uppercase tracking-[0.14em]">Net qty</span>{" "}
          <ContentValue field={product.details.netQuantity} />
        </p>
        <AddToCartButton
          variant={product.variants[0]}
          productTitle={product.title}
          size="compact"
          className="mt-5"
        />
      </div>
    </article>
  );
}
