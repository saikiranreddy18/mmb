import "server-only";
import { isShopifyConnected } from "./config";
import { mockProducts } from "./mock/products";
import { mapProduct, type RawProduct } from "./shopify/mappers";
import { storefrontFetch } from "./shopify/client";
import { productByHandleQuery, productsQuery } from "./shopify/queries";
import type { Product } from "./types";

const REVALIDATE_SECONDS = 300;

export async function getProducts(first = 24): Promise<Product[]> {
  if (!isShopifyConnected) return mockProducts;
  const data = await storefrontFetch<{ products: { nodes: RawProduct[] } }>(
    productsQuery,
    { first },
    { revalidate: REVALIDATE_SECONDS },
  );
  return data.products.nodes.map(mapProduct);
}

export async function getProduct(handle: string): Promise<Product | null> {
  if (!isShopifyConnected) return mockProducts.find((p) => p.handle === handle) ?? null;
  const data = await storefrontFetch<{ product: RawProduct | null }>(
    productByHandleQuery,
    { handle },
    { revalidate: REVALIDATE_SECONDS },
  );
  return data.product ? mapProduct(data.product) : null;
}
