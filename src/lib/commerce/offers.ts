import type { Money } from "./types";

/**
 * Cart offers, mirroring what Shopify applies at checkout:
 *   ₹799 or more   → 5% off      (automatic discount, min subtotal 799)
 *   ₹2,000 or more → 10% off     (automatic discount, min subtotal 2000; the best one applies)
 *   free delivery when the total after the discount is ₹1,299 or more
 *     (Shopify "Standard ₹0" rate, condition: order price ≥ 1299)
 * Shopify checkout is the source of truth for the final price.
 */
export const OFFER_TIERS = [
  { min: 799, percent: 5, freeDelivery: false },
  { min: 1299, percent: 5, freeDelivery: true },
  { min: 2000, percent: 10, freeDelivery: true },
] as const;

/** Free delivery applies when the order total AFTER the percentage offer reaches this (Shopify's rate rule). */
export const FREE_DELIVERY_MIN = 1299;

export const OFFER_LINES = [
  "5% off on orders of ₹799 or more",
  "Free delivery on orders of ₹1,299 or more (after offers)",
  "10% off on orders of ₹2,000 or more",
];

export type OfferResult = {
  percent: number;
  freeDelivery: boolean;
  discount: Money;
  total: Money;
  /** Next thing to unlock, with how much more is needed. */
  next: { amountNeeded: number; label: string } | null;
};

function evaluate(value: number) {
  const reached = [...OFFER_TIERS].reverse().find((t) => value >= t.min);
  const percent = reached?.percent ?? 0;
  const discount = Math.round(value * percent) / 100;
  const total = value - discount;
  // Shopify's free-delivery rate compares the order total after discounts.
  return { percent, discount, total, freeDelivery: total >= FREE_DELIVERY_MIN };
}

export function applyOffers(subtotal: Money): OfferResult {
  const value = Number(subtotal.amount);
  const now = evaluate(value);
  // Smallest extra amount (in whole rupees) that unlocks something new.
  let next: OfferResult["next"] = null;
  for (let extra = 1; extra <= 5000; extra++) {
    const then = evaluate(value + extra);
    const morePercent = then.percent > now.percent;
    const freeNow = then.freeDelivery && !now.freeDelivery;
    if (morePercent || freeNow) {
      const label =
        morePercent && freeNow
          ? `${then.percent}% off + free delivery`
          : morePercent
            ? `${then.percent}% off`
            : "free delivery";
      next = { amountNeeded: extra, label };
      break;
    }
  }
  return {
    percent: now.percent,
    freeDelivery: now.freeDelivery,
    discount: { amount: now.discount.toFixed(2), currencyCode: subtotal.currencyCode },
    total: { amount: now.total.toFixed(2), currencyCode: subtotal.currencyCode },
    next,
  };
}
