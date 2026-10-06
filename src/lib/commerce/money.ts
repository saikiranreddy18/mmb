import type { Money } from "./types";

export function formatMoney({ amount, currencyCode }: Money): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

/** The regular ("was") price when an offer is running — i.e. compare-at is set and higher than the price. */
export function wasPrice(price: Money, compareAt?: Money | null): Money | null {
  return compareAt && Number(compareAt.amount) > Number(price.amount) ? compareAt : null;
}

export function multiplyMoney(money: Money, qty: number): Money {
  return { amount: (Number(money.amount) * qty).toFixed(2), currencyCode: money.currencyCode };
}
