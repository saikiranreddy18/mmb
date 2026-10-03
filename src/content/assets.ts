/**
 * ASSET CONTRACT — registry of every brand image the site uses.
 *
 * `src: null` means the real asset has not been supplied yet. The UI then
 * renders an explicit "ASSET REQUIRED" frame instead of a stand-in image.
 *
 * To add a supplied asset:
 *   1. Put the file in /public/assets/ (e.g. /public/assets/mascot.png)
 *   2. Set `src` to "/assets/mascot.png" and the real `width` / `height`.
 *
 * Never replace the supplied mother-and-child character or real packaging
 * with a generated substitute.
 */

import type { IngredientAssetKey } from "./brand";

export type BrandAsset = {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  /** Plain-language description of the asset that must be supplied. */
  required: string;
};

type AssetKey =
  | "mascot"
  | "heroScene"
  | "productPack"
  | "storyKitchen"
  | "storyRecipe"
  | "storyExperiments"
  | "storyProduct"
  | "storyBrand"
  | "storyNext"
  | IngredientAssetKey;

export const assets: Record<AssetKey, BrandAsset> = {
  mascot: {
    src: null,
    alt: "The Mummas Bite mother and child character",
    width: 1200,
    height: 1400,
    required: "Supplied mother-and-child character illustration (transparent PNG or SVG)",
  },
  heroScene: {
    src: null,
    alt: "Mummas Bite in a warm home kitchen",
    width: 1600,
    height: 1200,
    required: "Hero brand photograph (product or kitchen scene)",
  },
  productPack: {
    src: null,
    alt: "Mummas Bite product packaging",
    width: 1200,
    height: 1200,
    required: "Real product packaging photograph",
  },
  storyKitchen: { src: null, alt: "", width: 1200, height: 1500, required: "Story image — the idea / home" },
  storyRecipe: { src: null, alt: "", width: 1200, height: 1500, required: "Story image — the recipe" },
  storyExperiments: { src: null, alt: "", width: 1200, height: 1500, required: "Story image — the experiments" },
  storyProduct: { src: null, alt: "", width: 1200, height: 1500, required: "Story image — the product" },
  storyBrand: { src: null, alt: "", width: 1200, height: 1500, required: "Story image — the brand / character" },
  storyNext: { src: null, alt: "", width: 1200, height: 1500, required: "Story image — what comes next" },
  ingredientDates: { src: null, alt: "Dates", width: 800, height: 800, required: "Ingredient photo — dates" },
  ingredientAlmonds: { src: null, alt: "Almonds", width: 800, height: 800, required: "Ingredient photo — almonds" },
  ingredientCashews: { src: null, alt: "Cashews", width: 800, height: 800, required: "Ingredient photo — cashews" },
  ingredientWalnuts: { src: null, alt: "Walnuts", width: 800, height: 800, required: "Ingredient photo — walnuts" },
  ingredientSeeds: { src: null, alt: "Seeds", width: 800, height: 800, required: "Ingredient photo — seeds" },
};

export const storyAssetFor: Record<string, AssetKey> = {
  idea: "storyKitchen",
  recipe: "storyRecipe",
  experiments: "storyExperiments",
  product: "storyProduct",
  brand: "storyBrand",
  next: "storyNext",
};
