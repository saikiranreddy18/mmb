/**
 * ════════════════════════════════════════════════════════════════
 *  MOCK DATA — REPLACE WITH SHOPIFY DATA
 * ════════════════════════════════════════════════════════════════
 * Stand-in products so the shop, product page and cart can be tested before
 * Shopify is connected. Every value is transcribed from the supplied pack
 * artwork (front + back label) and stays UNVERIFIED until checked against the
 * printed, approved label. The pack's phone number (+91 90000 00000) and
 * barcode look like placeholders and are deliberately not used. Storage and
 * shelf life are not on the labels, so they stay "content required".
 */

import { type ContentField, unknown, unverified, verified } from "@/content/status";
import type { Product, ShopifyImage } from "../types";

const img = (file: string, altText: string): ShopifyImage => ({
  url: `/assets/${file}`,
  altText,
  width: 760,
  height: 1024,
});

const nutrition = (per: string, rows: [string, string][]): ContentField =>
  unverified([`Per ${per} (approx.)`, ...rows.map(([k, v]) => `${k}: ${v}`)].join("\n"));

const FSSAI = unverified("Lic. No. 20126052001147");

export const mockProducts: Product[] = [
  {
    id: "gid://mock/Product/1",
    handle: "dry-fruit-bar",
    title: "Dry Fruit Bar",
    shortDescription: "Dates, nuts and seeds, pressed into one honest bar.",
    description:
      "Soft dates with almonds, cashews, walnuts and pistachios, and a sprinkle of pumpkin, sunflower and watermelon seeds. A bar that tastes like something made at home.",
    featuredImage: img("dryfruit-front.jpg", "Mumma's Bite Dry Fruit Bar pouch, front"),
    images: [
      img("dryfruit-front.jpg", "Mumma's Bite Dry Fruit Bar pouch, front"),
      img("dryfruit-back.jpg", "Mumma's Bite Dry Fruit Bar pouch, back label with ingredients and nutrition"),
    ],
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
      claims: unverified("No added sugar · No preservatives · 3.1 g protein per 20 g bar"),
      ingredients: unverified(
        "Dates, almonds, cashews, walnuts, pistachios, pumpkin seeds, sunflower seeds, watermelon seeds",
      ),
      nutrition: nutrition("20 g bar", [
        ["Energy", "100 kcal"],
        ["Protein", "3.1 g"],
        ["Total carbohydrate", "11.5 g"],
        ["Total sugars", "8.5 g"],
        ["Added sugars", "0 g"],
        ["Total fat", "5.8 g"],
        ["Saturated fat", "1.1 g"],
        ["Trans fat", "0 g"],
        ["Cholesterol", "0 mg"],
        ["Dietary fibre", "1.8 g"],
        ["Sodium", "10 mg"],
      ]),
      allergens: unverified("Contains tree nuts (almonds, cashews, walnuts, pistachios)."),
      storage: unknown(),
      shelfLife: verified("30 days"),
      fssai: FSSAI,
    },
    isMock: true,
  },
  {
    id: "gid://mock/Product/2",
    handle: "multi-seed-energy-bar",
    title: "Multi-Seed Energy Bar",
    shortDescription: "Peanuts, six seeds and dates, pressed into one bar.",
    description:
      "Peanuts, pumpkin, sunflower, watermelon, sesame and flax seeds, held together with dates. A crunchy, seedy bar from the Mumma's Bite kitchen.",
    featuredImage: img("multiseed-25g-front.jpg", "Mumma's Bite Multi-Seed Energy Bar pouch, front"),
    images: [
      img("multiseed-25g-front.jpg", "Mumma's Bite Multi-Seed Energy Bar pouch, front"),
      img("multiseed-25g-back.jpg", "Mumma's Bite Multi-Seed Energy Bar pouch, back label with ingredients and nutrition"),
    ],
    priceRange: { minVariantPrice: { amount: "25.00", currencyCode: "INR" } },
    variants: [
      {
        id: "gid://mock/ProductVariant/2",
        title: "25 g",
        availableForSale: true,
        price: { amount: "25.00", currencyCode: "INR" },
        selectedOptions: [{ name: "Size", value: "25 g" }],
      },
    ],
    availableForSale: true,
    details: {
      netQuantity: unverified("25 g"),
      claims: unverified("No added sugar · No preservatives · Rich in natural nutrients · 3.5 g protein per 25 g bar"),
      ingredients: unverified("Peanuts, pumpkin seeds, sunflower seeds, watermelon seeds, sesame seeds, flax seeds, dates"),
      nutrition: nutrition("25 g bar", [
        ["Energy", "125 kcal"],
        ["Protein", "3.5 g"],
        ["Total carbohydrate", "15.0 g"],
        ["Total sugars", "10.0 g"],
        ["Added sugars", "0 g"],
        ["Total fat", "7.5 g"],
        ["Saturated fat", "1.4 g"],
        ["Trans fat", "0 g"],
        ["Cholesterol", "0 mg"],
        ["Dietary fibre", "2.2 g"],
        ["Sodium", "15 mg"],
      ]),
      allergens: unverified("Contains peanuts and sesame seeds."),
      storage: unknown(),
      shelfLife: verified("30 days"),
      fssai: FSSAI,
    },
    isMock: true,
  },
];
