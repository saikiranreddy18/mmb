import type { Money } from "./types";

export function formatMoney({ amount, currencyCode }: Money): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

export function multiplyMoney(money: Money, qty: number): Money {
  return { amount: (Number(money.amount) * qty).toFixed(2), currencyCode: money.currencyCode };
}
