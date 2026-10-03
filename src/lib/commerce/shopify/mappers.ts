import { type ContentField, unknown, verified } from "@/content/status";
import type { Cart, Product, ShopifyImage } from "../types";

/* Raw Storefront shapes (only the fields we query). */
type Raw<T> = { nodes: T[] };
export type RawProduct = Omit<Product, "images" | "variants" | "details" | "isMock" | "shortDescription"> & {
  images: Raw<ShopifyImage>;
  variants: Raw<Product["variants"][number]>;
  metafields: ({ key: string; value: string } | null)[];
};
export type RawCart = Omit<Cart, "lines" | "isMock"> & { lines: Raw<Cart["lines"][number]> };

/** A metafield the merchant filled in Shopify is treated as verified; absent = unknown. */
function field(meta: Map<string, string>, key: string): ContentField {
  const value = meta.get(key)?.trim();
  return value ? verified(value) : unknown();
}

export function mapProduct(raw: RawProduct): Product {
  const meta = new Map(
    raw.metafields.filter((m): m is { key: string; value: string } => Boolean(m)).map((m) => [m.key, m.value]),
  );
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
      netQuantity: field(meta, "net_quantity"),
      claims: field(meta, "claims"),
      ingredients: field(meta, "ingredients"),
      nutrition: field(meta, "nutrition"),
      allergens: field(meta, "allergens"),
      storage: field(meta, "storage"),
      shelfLife: field(meta, "shelf_life"),
      fssai: field(meta, "fssai"),
    },
    isMock: false,
  };
}

export function mapCart(raw: RawCart): Cart {
  return { ...raw, lines: raw.lines.nodes, isMock: false };
}
