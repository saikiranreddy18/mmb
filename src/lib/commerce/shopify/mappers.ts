import { type ContentField, unknown, verified } from "@/content/status";
import { mockProducts } from "../mock/products";
import type { Cart, DeliveryAddress, DeliveryOption, Money, Product, ShopifyImage } from "../types";

/* Raw Storefront shapes (only the fields we query). */
type Raw<T> = { nodes: T[] };
export type RawProduct = Omit<Product, "images" | "variants" | "details" | "isMock" | "shortDescription"> & {
  images: Raw<ShopifyImage>;
  variants: Raw<Product["variants"][number]>;
  metafields: ({ key: string; value: string } | null)[];
};
export type RawCart = Omit<Cart, "lines" | "delivery" | "isMock"> & {
  lines: Raw<Cart["lines"][number]>;
  delivery: { addresses: { selected: boolean; address: Partial<DeliveryAddress> }[] };
  deliveryGroups: Raw<{ deliveryOptions: { handle: string; title: string | null; estimatedCost: Money }[] }>;
};

/**
 * A metafield the merchant filled in Shopify is treated as verified. When it is
 * empty, the brand-confirmed label facts in the local catalogue (same handle)
 * are used, so a missing metafield never hides known information.
 */
function field(meta: Map<string, string>, key: string, fallback?: ContentField): ContentField {
  const value = meta.get(key)?.trim();
  if (value) return verified(value);
  return fallback?.status === "verified" ? fallback : unknown();
}

export function mapProduct(raw: RawProduct): Product {
  const meta = new Map(
    raw.metafields.filter((m): m is { key: string; value: string } => Boolean(m)).map((m) => [m.key, m.value]),
  );
  const local = mockProducts.find((p) => p.handle === raw.handle)?.details;
  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    description: raw.description,
    shortDescription: meta.get("short_description") ?? raw.description.split(". ")[0] ?? "",
    featuredImage: raw.featuredImage,
    images: raw.images.nodes,
    priceRange: raw.priceRange,
    variants: raw.variants.nodes,
    availableForSale: raw.availableForSale,
    details: {
      netQuantity: field(meta, "net_quantity", local?.netQuantity),
      claims: field(meta, "claims", local?.claims),
      ingredients: field(meta, "ingredients", local?.ingredients),
      nutrition: field(meta, "nutrition", local?.nutrition),
      allergens: field(meta, "allergens", local?.allergens),
      storage: field(meta, "storage", local?.storage),
      shelfLife: field(meta, "shelf_life", local?.shelfLife),
      fssai: field(meta, "fssai", local?.fssai),
    },
    isMock: false,
  };
}

export function mapCart({ delivery, deliveryGroups, lines, ...raw }: RawCart): Cart {
  const selected = delivery.addresses.find((a) => a.selected)?.address;
  const options: DeliveryOption[] = (deliveryGroups.nodes[0]?.deliveryOptions ?? [])
    .map((o) => ({ handle: o.handle, title: o.title ?? "Delivery", cost: o.estimatedCost }))
    .sort((a, b) => Number(a.cost.amount) - Number(b.cost.amount));
  return {
    ...raw,
    lines: lines.nodes,
    delivery: {
      address: selected?.zip
        ? { zip: selected.zip, city: selected.city ?? null, provinceCode: selected.provinceCode ?? null }
        : null,
      options,
    },
    isMock: false,
  };
}
