/**
 * PRODUCT CATALOGUE — the brand's real products, held here until Shopify is
 * connected (then products, prices and stock come from Shopify instead).
 * Details are transcribed from the supplied pack labels and confirmed by the
 * brand. The pack's phone number and barcode look like placeholders and are
 * not used.
 */

import { type ContentField, verified } from "@/content/status";
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
    shortDescription: "Soft, chewy dates with almonds, cashews, walnuts and pistachios, a sprinkle of seeds and a touch of ghee.",
    description:
      "A soft, chewy mix of dates and nuts, finished with seeds and a touch of ghee. Almonds, cashews, walnuts and pistachios bring a nutty bite and dates bring the sweetness, with no added sugar. Each 22 g bar (about 4 × 5 cm) is easy to pack for work, school or travel.",
    featuredImage: img("dryfruit-front-v2.jpg", "Mumma's Bite Dry Fruit Energy Bar pouch, front: 22 g bar, 2.6 g protein, ₹35 each", 1080, 1457),
    images: [
      img("dryfruit-front-v2.jpg", "Mumma's Bite Dry Fruit Energy Bar pouch, front: 22 g bar, 2.6 g protein, ₹35 each", 1080, 1457),
      img("dryfruit-lifestyle.jpg", "Two Mumma's Bite Dry Fruit Energy Bar pouches with a bar, dates and nuts", 750, 937),
      img(
        "dryfruit-ingredients-ghee.jpg",
        "The Dry Fruit Energy Bar (about 4 × 5 cm) surrounded by its ingredients: almonds, ghee, cashews, pumpkin seeds, walnuts, dates, sunflower seeds, watermelon seeds and pistachios",
        1145,
        1374,
      ),
    ],
    priceRange: { minVariantPrice: { amount: "310.00", currencyCode: "INR" } },
    variants: [
      {
        id: "gid://mumma/ProductVariant/dry-fruit-pack-10",
        title: "Pack of 10 · 220 g",
        availableForSale: true,
        // Offer: ₹31 a bar (regular ₹35). Mirrors the Shopify price / compare-at price.
        price: { amount: "310.00", currencyCode: "INR" },
        compareAtPrice: { amount: "350.00", currencyCode: "INR" },
        selectedOptions: [{ name: "Pack", value: "Pack of 10 (220 g)" }],
      },
    ],
    availableForSale: true,
    details: {
      netQuantity: verified("22 g per bar · packs of 10 (220 g), 25 (550 g) or 50 (1.1 kg)"),
      claims: verified("No added sugar · No preservatives · Rich in fibre · 2.6 g protein per 22 g bar"),
      ingredients: verified(
        "Dates (45%), cashews (15%), almonds (12.5%), pumpkin seeds (5%), sunflower seeds (5%), watermelon seeds (5%), walnuts (5%), pistachios (5%), ghee (2.5%)",
      ),
      nutrition: nutrition("22 g bar", [
        ["Energy", "110 kcal"],
        ["Protein", "2.6 g"],
        ["Total carbohydrate", "12.1 g"],
        ["Total sugars", "9.0 g"],
        ["Added sugars", "0 g"],
        ["Total fat", "6.1 g"],
        ["Saturated fat", "1.2 g"],
        ["Trans fat", "0 g"],
        ["Cholesterol", "0 mg"],
        ["Dietary fibre", "1.9 g"],
        ["Sodium", "12 mg"],
      ]),
      allergens: verified("Contains tree nuts (almonds, cashews, walnuts, pistachios) and milk (ghee)."),
      storage: verified("Store in a cool, dry place."),
      shelfLife: verified("30 days from the date of manufacture"),
      fssai: FSSAI,
    },
    isMock: false,
  },
  {
    id: "gid://mumma/Product/multi-seed-energy-bar",
    handle: "multi-seed-energy-bar",
    title: "Multi-Seed Energy Bar",
    shortDescription: "Crunchy roasted peanuts and five kinds of seeds, held together with the natural sweetness of dates.",
    description:
      "A crunchy mix of roasted peanuts and seeds, brought together with dates and a touch of ghee. Pumpkin, sunflower, watermelon, sesame and flax seeds give it a varied, nutty crunch, with no added sugar. Each 25 g bar (about 4 × 5 cm) is an easy snack for your desk, bag or journey.",
    featuredImage: img("multiseed-front-v2.jpg", "Mumma's Bite Multi-Seed Energy Bar pouch, front: 25 g bar, 2.5 g protein, ₹30 each", 1080, 1457),
    images: [
      img("multiseed-front-v2.jpg", "Mumma's Bite Multi-Seed Energy Bar pouch, front: 25 g bar, 2.5 g protein, ₹30 each", 1080, 1457),
      img("multiseed-lifestyle-v2.jpg", "Mumma's Bite Multi-Seed Energy Bar pouch on slate with a bar, peanuts and seeds", 1121, 1403),
      img(
        "multiseed-ingredients-ghee.jpg",
        "The Multi-Seed Energy Bar (about 4 × 5 cm) surrounded by its ingredients: peanuts, ghee, sunflower seeds, pumpkin seeds, watermelon seeds, sesame seeds, flax seeds and dates",
        1122,
        1402,
      ),
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
      claims: verified("No added sugar · No preservatives · Rich in natural nutrients · 2.5 g protein per 25 g bar"),
      ingredients: verified(
        "Dates, pumpkin seeds, sunflower seeds, roasted peanuts, sesame seeds, flaxseed, dried watermelon seed kernels, pure Indian ghee",
      ),
      nutrition: nutrition("25 g bar", [
        ["Energy", "125 kcal"],
        ["Protein", "2.5 g"],
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
      allergens: verified("Contains peanuts, sesame seeds and milk (ghee)."),
      storage: verified("Store in a cool, dry place."),
      shelfLife: verified("30 days from the date of manufacture"),
      fssai: FSSAI,
    },
    isMock: false,
  },
];
