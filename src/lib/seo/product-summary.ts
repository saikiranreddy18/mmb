import { formatMoney, lowestPerBarPrice, perBarPrice } from "@/lib/commerce/money";
import type { Product } from "@/lib/commerce/types";

/**
 * Plain facts about a product, read from its verified label data and live
 * prices, for answer-style pages, llms.txt and structured data. Anything not
 * verified comes back null so it is never stated as fact.
 */
export type ProductSummary = {
  title: string;
  handle: string;
  barWeight: string | null;
  perBar: string | null;
  perBarAmount: number | null;
  /** True when bigger packs really do cost less per bar (not true for every product). */
  biggerPacksCheaper: boolean;
  /** Highest per-bar price (smallest pack), e.g. "₹25". */
  perBarMax: string | null;
  calories: string | null;
  protein: string | null;
  totalSugars: string | null;
  addedSugars: string | null;
  fibre: string | null;
  ingredients: string | null;
  allergens: string | null;
  claims: string | null;
  shelfLife: string | null;
  storage: string | null;
};

const verifiedValue = (f: { status: string; value: string | null }) => (f.status === "verified" ? f.value : null);

/** "Energy: 110 kcal" / "Calories: 120 kcal" style rows from the nutrition panel. */
function nutritionRow(text: string | null, label: RegExp): string | null {
  for (const line of (text ?? "").split("\n")) {
    const [k, ...v] = line.split(":");
    if (label.test(k.trim())) return v.join(":").trim() || null;
  }
  return null;
}

export function summarise(p: Product): ProductSummary {
  const nutrition = verifiedValue(p.details.nutrition);
  const perBar = lowestPerBarPrice(p.variants);
  const each = p.variants.map(perBarPrice).filter((m) => m !== null).map((m) => Number(m!.amount));
  const max = each.length ? Math.max(...each) : null;
  return {
    title: p.title,
    handle: p.handle,
    barWeight: nutrition?.match(/^Per ([\d.]+ ?g) bar/im)?.[1] ?? null,
    perBar: perBar ? formatMoney(perBar) : null,
    perBarAmount: perBar ? Number(perBar.amount) : null,
    biggerPacksCheaper: max !== null && perBar !== null && max - Number(perBar.amount) >= 0.01,
    perBarMax: max !== null && perBar ? formatMoney({ amount: max.toFixed(2), currencyCode: perBar.currencyCode }) : null,
    calories: nutritionRow(nutrition, /^(energy|calories)$/i),
    protein: nutritionRow(nutrition, /^protein$/i),
    totalSugars: nutritionRow(nutrition, /^total sugars$/i),
    addedSugars: nutritionRow(nutrition, /^added sugars$/i),
    fibre: nutritionRow(nutrition, /^dietary fib(re|er)$/i),
    ingredients: verifiedValue(p.details.ingredients),
    allergens: verifiedValue(p.details.allergens),
    claims: verifiedValue(p.details.claims),
    shelfLife: verifiedValue(p.details.shelfLife),
    storage: verifiedValue(p.details.storage),
  };
}

/** Cheapest per-bar price across all products, e.g. "₹23.25". */
export function lowestPerBarAcross(summaries: ProductSummary[]): string | null {
  const best = summaries.filter((s) => s.perBarAmount !== null).sort((a, b) => a.perBarAmount! - b.perBarAmount!)[0];
  return best?.perBar ?? null;
}

/** "Contains tree nuts (almonds, cashews) and milk (ghee)." → "Contains tree nuts and milk". */
export function shortAllergens(text: string | null): string | null {
  return text ? text.replace(/\s*\([^)]*\)/g, "").replace(/\.\s*$/, "").trim() : null;
}
