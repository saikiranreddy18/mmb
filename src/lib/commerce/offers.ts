import type { Money } from "./types";

/**
 * Current cart offers:
 *   ₹800 or more  → 5% off
 *   ₹2,000 or more → 10% off + free delivery
 * Shopify checkout is the source of truth for the final price and shipping.
 */
export const OFFER_TIERS = [
  { min: 800, percent: 5, freeDelivery: false },
  { min: 2000, percent: 10, freeDelivery: true },
] as const;

/** Free delivery applies when the order subtotal reaches ₹2,000. */
export const FREE_DELIVERY_MIN = 2000;

export const OFFER_LINES = [
  "5% off on orders of ₹800 or more",
  "10% off + free delivery on orders of ₹2,000 or more",
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
  // Free delivery unlocks only at the ₹2,000 offer threshold.
  return { percent, discount, total, freeDelivery: value >= FREE_DELIVERY_MIN };
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
