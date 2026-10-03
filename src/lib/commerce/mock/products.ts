/**
 * ════════════════════════════════════════════════════════════════
 *  MOCK DATA — REPLACE WITH SHOPIFY DATA
 * ════════════════════════════════════════════════════════════════
 * These records exist only so the shop, product page and cart can be
 * built and tested before Shopify is connected. Names, prices and
 * descriptions are placeholders, not real products. Every product is
 * flagged `isMock: true` and the UI labels it as such.
 */

import { unknown, unverified } from "@/content/status";
import type { Product } from "../types";

const MOCK_CURRENCY = "INR";

const mockDetails = () => ({
  netQuantity: unknown(),
  ingredients: unverified("Dates, almonds, cashews, walnuts, seeds (from brief example — confirm against label)"),
  nutrition: unknown(),
  allergens: unknown(),
  storage: unknown(),
  shelfLife: unknown(),
  fssai: unknown(),
});

export const mockProducts: Product[] = [
  {
    id: "gid://mock/Product/1",
    handle: "mock-dry-fruit-bar",
    title: "Dry Fruit Bar",
    shortDescription: "Placeholder product — real name and description come from Shopify.",
    description:
      "MOCK DATA. This product card is a stand-in so the shopping journey can be tested. The real description, written by the brand, will be pulled from Shopify.",
    featuredImage: null,
    images: [],
    priceRange: { minVariantPrice: { amount: "100.00", currencyCode: MOCK_CURRENCY } },
    variants: [
      {
        id: "gid://mock/ProductVariant/1",
        title: "Default",
        availableForSale: true,
        price: { amount: "100.00", currencyCode: MOCK_CURRENCY },
        selectedOptions: [],
      },
    ],
    availableForSale: true,
    details: mockDetails(),
    isMock: true,
  },
  {
    id: "gid://mock/Product/2",
    handle: "mock-dry-fruit-bar-box",
    title: "Dry Fruit Bar Box",
    shortDescription: "Placeholder multi-pack — contents and pricing to be confirmed.",
    description:
      "MOCK DATA. A second stand-in product so the grid, cart quantities and subtotals can be tested with more than one item.",
    featuredImage: null,
    images: [],
    priceRange: { minVariantPrice: { amount: "500.00", currencyCode: MOCK_CURRENCY } },
    variants: [
      {
        id: "gid://mock/ProductVariant/2",
        title: "Default",
        availableForSale: true,
        price: { amount: "500.00", currencyCode: MOCK_CURRENCY },
        selectedOptions: [],
      },
    ],
    availableForSale: true,
    details: mockDetails(),
    isMock: true,
  },
];
