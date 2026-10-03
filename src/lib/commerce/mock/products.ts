/**
 * ════════════════════════════════════════════════════════════════
 *  MOCK DATA — REPLACE WITH SHOPIFY DATA
 * ════════════════════════════════════════════════════════════════
 * Stand-in product so the shop, product page and cart can be tested
 * before Shopify is connected. Its values are read off the pack shown in
 * the supplied process film ("Dry Fruit Bar · Dates | Nuts | Seeds ·
 * 20 g · ₹30 each · No Added Sugar · No Preservatives"). That pack is a
 * render, so every value stays UNVERIFIED until it matches the real
 * printed label. The protein figure on the rendered pack is illegible and
 * is deliberately not used.
 */

import { unknown, unverified } from "@/content/status";
import type { Product } from "../types";

const pack = {
  url: "/assets/pack.jpg",
  altText: "Mumma's Bite Dry Fruit Bar pouch",
  width: 800,
  height: 1000,
};
const bar = {
  url: "/assets/bar-pressed.jpg",
  altText: "A dry fruit bar of dates and nuts",
  width: 864,
  height: 1080,
};

export const mockProducts: Product[] = [
  {
    id: "gid://mock/Product/1",
    handle: "dry-fruit-bar",
    title: "Dry Fruit Bar",
    shortDescription: "Dates, nuts and seeds, pressed into one honest bar.",
    description:
      "Soft dates, a handful of nuts and a sprinkle of seeds, pressed together into a bar that tastes like something made at home.",
    featuredImage: pack,
    images: [pack, bar],
    priceRange: { minVariantPrice: { amount: "30.00", currencyCode: "INR" } },
    variants: [
      {
        id: "gid://mock/ProductVariant/1",
        title: "20 g",
        availableForSale: true,
        price: { amount: "30.00", currencyCode: "INR" },
        selectedOptions: [{ name: "Size", value: "20 g" }],
      },
    ],
    availableForSale: true,
    details: {
      netQuantity: unverified("20 g"),
      claims: unverified("No added sugar · No preservatives"),
      ingredients: unverified("Dates, nuts (almonds, cashews, walnuts, pistachios), seeds (pumpkin, sunflower)"),
      nutrition: unknown(),
      allergens: unknown(),
      storage: unknown(),
      shelfLife: unknown(),
      fssai: unknown(),
    },
    isMock: true,
  },
];
