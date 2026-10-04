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
const msFront = {
  url: "/assets/multiseed-front.jpg",
  altText: "Mumma's Bite Multi-Seed Energy Bar pouch, front",
  width: 760,
  height: 1024,
};
const msBack = {
  url: "/assets/multiseed-back.jpg",
  altText: "Mumma's Bite Multi-Seed Energy Bar pouch, back label with ingredients and nutrition",
  width: 760,
  height: 1024,
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
  {
    /*
     * Values transcribed from the supplied pack artwork (front + back label).
     * UNVERIFIED until checked against the printed, approved label. The pack's
     * phone number and barcode look like placeholders, so they're not used.
     */
    id: "gid://mock/Product/2",
    handle: "multi-seed-energy-bar",
    title: "Multi-Seed Energy Bar",
    shortDescription: "Peanuts, six seeds and dates, pressed into one bar.",
    description:
      "Peanuts, pumpkin, sunflower, watermelon, sesame and flax seeds, held together with dates. A crunchy, seedy bar from the Mumma's Bite kitchen.",
    featuredImage: msFront,
    images: [msFront, msBack],
    priceRange: { minVariantPrice: { amount: "30.00", currencyCode: "INR" } },
    variants: [
      {
        id: "gid://mock/ProductVariant/2",
        title: "20 g",
        availableForSale: true,
        price: { amount: "30.00", currencyCode: "INR" },
        selectedOptions: [{ name: "Size", value: "20 g" }],
      },
    ],
    availableForSale: true,
    details: {
      netQuantity: unverified("20 g"),
      claims: unverified("No added sugar · No preservatives · Rich in natural nutrients · 3.1 g protein per 20 g bar"),
      ingredients: unverified("Peanuts, pumpkin seeds, sunflower seeds, watermelon seeds, sesame seeds, flax seeds, dates"),
      nutrition: unverified(
        [
          "Per 20 g bar (approx.)",
          "Energy: 100 kcal",
          "Protein: 3.1 g",
          "Total carbohydrate: 11.5 g",
          "Total sugars: 8.5 g",
          "Added sugars: 0 g",
          "Total fat: 5.8 g",
          "Saturated fat: 1.1 g",
          "Trans fat: 0 g",
          "Cholesterol: 0 mg",
          "Dietary fibre: 1.8 g",
          "Sodium: 10 mg",
        ].join("\n"),
      ),
      allergens: unverified("Contains peanuts and sesame seeds."),
      storage: unknown(),
      shelfLife: unknown(),
      fssai: unverified("Lic. No. 20126052001147"),
    },
    isMock: true,
  },
];
