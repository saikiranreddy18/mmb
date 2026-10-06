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

export function multiplyMoney(money: Money, qty: number): Money {
  return { amount: (Number(money.amount) * qty).toFixed(2), currencyCode: money.currencyCode };
}
