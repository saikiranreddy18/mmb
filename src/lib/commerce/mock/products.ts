/**
 * PRODUCT CATALOGUE — the brand's real products, held here until Shopify is
 * connected (then products, prices and stock come from Shopify instead).
 * Details are transcribed from the supplied pack labels and confirmed by the
 * brand. The pack's phone number and barcode look like placeholders and are
 * not used.
 */

import { type ContentField, unknown, verified } from "@/content/status";
import type { Product, ShopifyImage } from "../types";

const img = (file: string, altText: string, width = 760, height = 1024): ShopifyImage => ({
  url: `/assets/${file}`,
  altText,
  width,
  height,
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
      "Soft dates with almonds, cashews, walnuts and pistachios, and a sprinkle of pumpkin, sunflower and watermelon seeds. A bar that tastes like something made at home. Each bar is about 4 × 5 cm.",
    featuredImage: img("dryfruit-front.jpg", "Mumma's Bite Dry Fruit Energy Bar pouch, front"),
    images: [
      img("dryfruit-front.jpg", "Mumma's Bite Dry Fruit Energy Bar pouch, front"),
      img("dryfruit-lifestyle.jpg", "Two Mumma's Bite Dry Fruit Energy Bar pouches with a bar, dates and nuts", 750, 937),
      img(
        "dryfruit-ingredients.jpg",
        "The Dry Fruit Energy Bar (about 4 × 5 cm) surrounded by its ingredients: almonds, cashews, pumpkin seeds, walnuts, dates, sunflower seeds, watermelon seeds and pistachios",
        1145,
        1374,
      ),
      img("dryfruit-back.jpg", "Mumma's Bite Dry Fruit Energy Bar pouch, back label with ingredients and nutrition"),
    ],
    priceRange: { minVariantPrice: { amount: "300.00", currencyCode: "INR" } },
    variants: [
      {
        id: "gid://mumma/ProductVariant/dry-fruit-pack-10",
        title: "Pack of 10 · 200 g",
        availableForSale: true,
        price: { amount: "300.00", currencyCode: "INR" },
        selectedOptions: [{ name: "Pack", value: "Pack of 10 (200 g)" }],
      },
    ],
    availableForSale: true,
    details: {
      netQuantity: verified("200 g (pack of 10 × 20 g bars)"),
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
    shortDescription: "Seeds, roasted peanuts and dates, pressed into one bar.",
    description:
      "Peanuts, pumpkin, sunflower, watermelon, sesame and flax seeds, held together with dates and a touch of ghee. A crunchy, seedy bar from the Mumma's Bite kitchen. Each bar is about 4 × 5 cm.",
    featuredImage: img("multiseed-25g-front.jpg", "Mumma's Bite Multi-Seed Energy Bar pouch, front"),
    images: [
      img("multiseed-25g-front.jpg", "Mumma's Bite Multi-Seed Energy Bar pouch, front"),
      img("multiseed-lifestyle.jpg", "Mumma's Bite Multi-Seed Energy Bar pouch with a bar, peanuts and seeds", 892, 1116),
      img(
        "multiseed-ingredients.jpg",
        "The Multi-Seed Energy Bar (about 4 × 5 cm) surrounded by its ingredients: peanuts, pumpkin, sunflower, watermelon, sesame and flax seeds, and dates",
        1122,
        1402,
      ),
      img("multiseed-25g-back.jpg", "Mumma's Bite Multi-Seed Energy Bar pouch, back label with ingredients and nutrition"),
    ],
    priceRange: { minVariantPrice: { amount: "250.00", currencyCode: "INR" } },
    variants: [
      {
        id: "gid://mumma/ProductVariant/multi-seed-pack-10",
        title: "Pack of 10 · 250 g",
        availableForSale: true,
        price: { amount: "250.00", currencyCode: "INR" },
        selectedOptions: [{ name: "Pack", value: "Pack of 10 (250 g)" }],
      },
    ],
    availableForSale: true,
    details: {
      netQuantity: verified("250 g (pack of 10 × 25 g bars)"),
      claims: verified("No added sugar · No preservatives · Rich in natural nutrients · 3 g protein per 25 g bar"),
      ingredients: verified(
        "Dates, pumpkin seeds, sunflower seeds, roasted peanuts, sesame seeds, flaxseed, dried watermelon seed kernels, pure Indian ghee",
      ),
      nutrition: nutrition("25 g bar", [
        ["Calories", "120 kcal"],
        ["Total fat", "7 g"],
        ["Saturated fat", "1 g"],
        ["Trans fat", "0 g"],
        ["Polyunsaturated fat", "3 g"],
        ["Monounsaturated fat", "2 g"],
        ["Cholesterol", "0 mg"],
        ["Sodium", "10 mg"],
        ["Total carbohydrate", "11 g"],
        ["Dietary fibre", "2 g"],
        ["Total sugars", "8 g"],
        ["Added sugars", "0 g"],
        ["Protein", "3 g"],
        ["Iron", "0.9 mg"],
        ["Potassium", "90 mg"],
      ]),
      allergens: verified("Contains peanuts and sesame seeds."),
      storage: unknown(),
      shelfLife: verified("30 days"),
      fssai: FSSAI,
    },
    isMock: false,
  },
];
