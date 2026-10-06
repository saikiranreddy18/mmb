"use client";

import { useState } from "react";
import { formatMoney, perBarPrice, wasPrice } from "@/lib/commerce/money";
import type { Product, ProductVariant } from "@/lib/commerce/types";
import { TrustBadges } from "@/components/ui/TrustBadges";
import { AddToCartButton } from "./AddToCartButton";

/** "Pack of 10 · 220 g" → price per bar, e.g. ₹35 per bar. */
function perBar(v: ProductVariant | undefined) {
  const each = v && perBarPrice(v);
  return each ? formatMoney(each) : null;
}

/**
 * Pack picker (shown only when there is more than one pack) + price + add to cart.
 * `compact` is the product-card version; the full version adds a quantity stepper.
 */
export function VariantPurchase({ product, compact = false }: { product: Product; compact?: boolean }) {
  const [selectedId, setSelectedId] = useState(product.variants[0]?.id);
  const variant = product.variants.find((v) => v.id === selectedId) ?? product.variants[0];
  const groupName = `pack-${product.handle}${compact ? "-card" : ""}`;
  const was = variant ? wasPrice(variant.price, variant.compareAtPrice) : null;

  return (
    <div className={compact ? "mt-4" : "mt-8"}>
      {!compact && (
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-3xl font-extrabold text-green">
          {was && (
            <del className="text-xl font-semibold text-ink-soft/70">
              <span className="sr-only">Regular price </span>
              {formatMoney(was)}
            </del>
          )}
          {variant && (
            <span>
              {was && <span className="sr-only">Offer price </span>}
              {formatMoney(variant.price)}
            </span>
          )}
          {was && (
            <span className="self-center rounded-full bg-brown px-2.5 py-1 text-xs font-bold uppercase tracking-[0.12em] text-cream">
              Offer
            </span>
          )}
          {perBar(variant) && <span className="text-base font-semibold text-ink-soft">{perBar(variant)} per bar</span>}
        </p>
      )}
      {product.variants.length === 1 && variant && (
        <p className={`text-sm font-semibold text-ink-soft ${compact ? "" : "mt-2"}`}>{variant.title}</p>
      )}
      {product.variants.length > 1 && (
        <fieldset className={compact ? "" : "mt-5"}>
          <legend className="sr-only">Choose a pack for {product.title}</legend>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => {
              const on = v.id === variant?.id;
              return (
                <label
                  key={v.id}
                  className={`relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-green ${
                    on ? "border-green bg-green text-cream" : "border-line text-ink hover:border-green/50"
                  }`}
                >
                  <input
                    type="radio"
                    name={groupName}
                    value={v.id}
                    checked={on}
                    onChange={() => setSelectedId(v.id)}
                    className="sr-only"
                  />
                  {v.title}
                  {wasPrice(v.price, v.compareAtPrice) && (
                    <del className={on ? "text-cream/60" : "text-ink-soft/60"}>
                      <span className="sr-only">Regular price </span>
                      {formatMoney(wasPrice(v.price, v.compareAtPrice)!)}
                    </del>
                  )}
                  <span className={on ? "text-cream/80" : "text-ink-soft"}>{formatMoney(v.price)}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}
      <AddToCartButton
        variant={variant}
        productTitle={`${product.title} (${variant?.title ?? ""})`}
        withQuantity={!compact}
        withBuyNow={!compact}
        size={compact ? "compact" : "default"}
        className={compact ? "mt-4" : "mt-6 max-w-md"}
      />
      {!compact && product.details.allergens.status === "verified" && product.details.allergens.value && (
        <p className="mt-4 max-w-md text-sm text-ink-soft">
          <span className="font-bold text-ink">Allergens:</span> {product.details.allergens.value}
          {product.details.shelfLife.status === "verified" && product.details.shelfLife.value && (
            <>
              {" "}
              <span className="font-bold text-ink">Shelf life:</span> {product.details.shelfLife.value}.
            </>
          )}
          {product.details.storage.status === "verified" && product.details.storage.value && (
            <> {product.details.storage.value}</>
          )}
        </p>
      )}
      {!compact && <TrustBadges />}
    </div>
  );
}
