"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import type { ProductVariant } from "@/lib/commerce/types";

type Props = {
  variant: ProductVariant | undefined;
  productTitle: string;
  withQuantity?: boolean;
  className?: string;
  size?: "default" | "compact";
};

export function AddToCartButton({ variant, productTitle, withQuantity, className = "", size = "default" }: Props) {
  const { addItem, isBusy } = useCart();
  const [qty, setQty] = useState(1);
  const available = Boolean(variant?.availableForSale);

  const add = () => variant && addItem(variant.id, withQuantity ? qty : 1);

  return (
    <div className={`flex items-stretch gap-3 ${className}`}>
      {withQuantity && (
        <div className="flex items-center rounded-full border border-green/25" role="group" aria-label="Quantity">
          <button
            className="grid size-12 place-items-center rounded-full text-green hover:bg-cream disabled:opacity-40"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" aria-hidden />
          </button>
          <output className="w-8 text-center font-bold tabular-nums" aria-live="polite">
            {qty}
          </output>
          <button
            className="grid size-12 place-items-center rounded-full text-green hover:bg-cream"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            aria-label="Increase quantity"
          >
            <Plus className="size-4" aria-hidden />
          </button>
        </div>
      )}
      <Button
        onClick={add}
        disabled={!available || isBusy}
        className={`flex-1 ${size === "compact" ? "min-h-11 px-5" : ""}`}
        aria-label={available ? `Add ${productTitle} to cart` : `${productTitle} is sold out`}
      >
        {available ? (isBusy ? "Adding…" : "Add to cart") : "Sold out"}
      </Button>
    </div>
  );
}
