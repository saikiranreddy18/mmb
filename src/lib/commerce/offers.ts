import type { Money } from "./types";

/**
 * Cart offers (supplied by the brand). Tiers are cumulative — the highest
 * tier reached applies:
 *   ₹799+  → 5% off
 *   ₹1299+ → 5% off + free delivery
 *   ₹2000+ → 10% off + free delivery
 *
 * This is an on-site estimate for the cart. When Shopify is connected the
 * same tiers must be created as automatic discounts / a free-shipping rate in
 * Shopify Admin — Shopify checkout is the source of truth for the final price.
 */
export const OFFER_TIERS = [
  { min: 799, percent: 5, freeDelivery: false },
  { min: 1299, percent: 5, freeDelivery: true },
  { min: 2000, percent: 10, freeDelivery: true },
] as const;

export const OFFER_LINES = [
  "5% off on orders above ₹799",
  "Free delivery + 5% off above ₹1299",
  "Free delivery + 10% off above ₹2000",
];

export type OfferResult = {
  percent: number;
  freeDelivery: boolean;
  discount: Money;
  total: Money;
  /** Next tier to unlock, with how much more is needed. */
  next: { amountNeeded: number; label: string } | null;
};

export function applyOffers(subtotal: Money): OfferResult {
  const value = Number(subtotal.amount);
  const reached = [...OFFER_TIERS].reverse().find((t) => value >= t.min);
  const nextTier = OFFER_TIERS.find((t) => value < t.min);
  const percent = reached?.percent ?? 0;
  const discount = Math.round(value * percent) / 100;
  return {
    percent,
    freeDelivery: reached?.freeDelivery ?? false,
    discount: { amount: discount.toFixed(2), currencyCode: subtotal.currencyCode },
    total: { amount: (value - discount).toFixed(2), currencyCode: subtotal.currencyCode },
    next: nextTier
      ? {
          amountNeeded: Math.ceil(nextTier.min - value),
          // Only name what's new compared with the tier already reached.
          label:
            nextTier.percent > percent
              ? `${nextTier.percent}% off${nextTier.freeDelivery ? " + free delivery" : ""}`
              : "free delivery",
        }
      : null,
  };
}
