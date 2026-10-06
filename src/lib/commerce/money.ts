import type { Money } from "./types";

/** Whole amounts without paise (₹250); anything else always with two digits (₹46.50, not ₹46.5). */
export function formatMoney({ amount, currencyCode }: Money): string {
  const value = Number(amount);
  const digits = Number.isInteger(Math.round(value * 100) / 100) ? 0 : 2;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

/** The regular ("was") price when an offer is running — i.e. compare-at is set and higher than the price. */
export function wasPrice(price: Money, compareAt?: Money | null): Money | null {
  return compareAt && Number(compareAt.amount) > Number(price.amount) ? compareAt : null;
}

export function multiplyMoney(money: Money, qty: number): Money {
  return { amount: (Number(money.amount) * qty).toFixed(2), currencyCode: money.currencyCode };
}

/** Bars in a pack, from its title ("Pack of 10 · 220 g", "40 bars"). */
export function barsInPack(variantTitle: string): number | null {
  const m = variantTitle.match(/pack of (\d+)|(\d+)\s*bars?\b/i);
  const n = Number(m?.[1] ?? m?.[2]);
  return n > 0 ? n : null;
}

/** Price of one bar in a pack, or null when the pack size is not in its title. */
export function perBarPrice(variant: { title: string; price: Money }): Money | null {
  const count = barsInPack(variant.title);
  if (!count) return null;
  return { amount: (Number(variant.price.amount) / count).toFixed(2), currencyCode: variant.price.currencyCode };
}

/** Lowest per-bar price across a product's packs (bigger packs are usually cheaper per bar). */
export function lowestPerBarPrice(variants: { title: string; price: Money }[]): Money | null {
  const prices = variants.map(perBarPrice).filter((m): m is Money => m !== null);
  return prices.sort((a, b) => Number(a.amount) - Number(b.amount))[0] ?? null;
}
