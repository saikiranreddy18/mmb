/**
 * PRODUCT CATALOGUE — the brand's real products, held here until Shopify is
 * connected (then products, prices and stock come from Shopify instead).
 * Details are transcribed from the supplied pack labels and confirmed by the
 * brand. The pack's phone number and barcode look like placeholders and are
 * not used.
 */

import { type ContentField, unknown, verified } from "@/content/status";
import type { Product, ShopifyImage } from "../types";

const img = (file: string, altText: string): ShopifyImage => ({
  url: `/assets/${file}`,
  altText,
  width: 760,
  height: 1024,
});

const nutrition = (per: string, rows: [string, string][]): ContentField =>
  verified([`Per ${per} (approx.)`, ...rows.map(([k, v]) => `${k}: ${v}`)].join("\n"));

const FSSAI = verified("Lic. No. 20126052001147");

export const mockProducts: Product[] = [
  {
    id: "gid://mumma/Product/dry-fruit-energy-bar",
    handle: "dry-fruit-energy-bar",
    title: "Dry Fruit Energy Bar",
    shortDescription: "Dates, nuts and seeds, pressed into one honest bar.",
    description:
      "Soft dates with almonds, cashews, walnuts and pistachios, and a sprinkle of pumpkin, sunflower and watermelon seeds. A bar that tastes like something made at home.",
    featuredImage: img("dryfruit-front.jpg", "Mumma's Bite Dry Fruit Energy Bar pouch, front"),
    images: [
      img("dryfruit-front.jpg", "Mumma's Bite Dry Fruit Energy Bar pouch, front"),
      img("dryfruit-back.jpg", "Mumma's Bite Dry Fruit Energy Bar pouch, back label with ingredients and nutrition"),
    ],
    priceRange: { minVariantPrice: { amount: "30.00", currencyCode: "INR" } },
    variants: [
      {
        id: "gid://mumma/ProductVariant/dry-fruit-pack-10",
        title: "Pack of 10 · 200 g",
        availableForSale: true,
        price: { amount: "300.00", currencyCode: "INR" },
        selectedOptions: [{ name: "Pack", value: "Pack of 10 (200 g)" }],
      },
      {
        id: "gid://mumma/ProductVariant/dry-fruit-single",
        title: "1 bar · 20 g",
        availableForSale: true,
        price: { amount: "30.00", currencyCode: "INR" },
        selectedOptions: [{ name: "Pack", value: "1 bar (20 g)" }],
      },
    ],
    availableForSale: true,
    details: {
      netQuantity: verified("200 g (pack of 10 × 20 g bars) · single bar 20 g"),
      claims: verified("No added sugar · No preservatives · 3.1 g protein per 20 g bar"),
      ingredients: verified(
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
      allergens: verified("Contains tree nuts (almonds, cashews, walnuts, pistachios)."),
      storage: unknown(),
      shelfLife: verified("30 days"),
      fssai: FSSAI,
    },
    isMock: false,
  },
  {
    id: "gid://mumma/Product/multi-seed-energy-bar",
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
        id: "gid://mumma/ProductVariant/multi-seed-pack-10",
        title: "Pack of 10 · 250 g",
        availableForSale: true,
        // 10 × ₹25 (no pack discount, matching the Dry Fruit pack) — confirm with the brand.
        price: { amount: "250.00", currencyCode: "INR" },
        selectedOptions: [{ name: "Pack", value: "Pack of 10 (250 g)" }],
      },
      {
        id: "gid://mumma/ProductVariant/multi-seed-single",
        title: "1 bar · 25 g",
        availableForSale: true,
        price: { amount: "25.00", currencyCode: "INR" },
        selectedOptions: [{ name: "Pack", value: "1 bar (25 g)" }],
      },
    ],
    availableForSale: true,
    details: {
      netQuantity: verified("250 g (pack of 10 × 25 g bars) · single bar 25 g"),
      claims: verified("No added sugar · No preservatives · Rich in natural nutrients · 3.5 g protein per 25 g bar"),
      ingredients: verified("Peanuts, pumpkin seeds, sunflower seeds, watermelon seeds, sesame seeds, flax seeds, dates"),
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
      allergens: verified("Contains peanuts and sesame seeds."),
      storage: unknown(),
      shelfLife: verified("30 days"),
      fssai: FSSAI,
    },
    isMock: false,
  },
];
