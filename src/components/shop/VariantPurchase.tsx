"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/commerce/money";
import type { Product } from "@/lib/commerce/types";
import { AddToCartButton } from "./AddToCartButton";

/**
 * Pack picker (shown only when there is more than one pack) + price + add to cart.
 * `compact` is the product-card version; the full version adds a quantity stepper.
 */
export function VariantPurchase({ product, compact = false }: { product: Product; compact?: boolean }) {
  const [selectedId, setSelectedId] = useState(product.variants[0]?.id);
  const variant = product.variants.find((v) => v.id === selectedId) ?? product.variants[0];
  const groupName = `pack-${product.handle}${compact ? "-card" : ""}`;

  return (
    <div className={compact ? "mt-4" : "mt-8"}>
      {!compact && <p className="text-3xl font-extrabold text-green">{variant && formatMoney(variant.price)}</p>}
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
        size={compact ? "compact" : "default"}
        className={compact ? "mt-4" : "mt-6 max-w-md"}
      />
    </div>
  );
}
