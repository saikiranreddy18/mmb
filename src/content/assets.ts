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
  /** Where a supplied asset came from, for the asset audit trail. */
  source?: string;
  /** Illustrations with transparency are contained, never cropped. */
  fit?: "cover" | "contain";
};

const MASCOT = "Supplied Mumma's Bite character illustration — used unaltered";

const FILM = "Still from the supplied process film (illustrated/rendered — not a product photograph)";
const HERO_FILM = "Still from the supplied hero film (rendered — not a product photograph)";

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
  | "barPressed"
  | "ingredientBowl"
  | "processPoster"
  | "heroPoster"
  | "mascotLaughing"
  | "mascotOffering"
  | "mascotSurprised"
  | IngredientAssetKey;

export const assets: Record<AssetKey, BrandAsset> = {
  /** Primary character: the mother feeding her child a bite. */
  mascot: {
    src: "/assets/mascot/mascot-feeding.webp",
    alt: "The Mumma's Bite mother, smiling, feeding her little boy a bite",
    width: 1312,
    height: 1199,
    required: "Supplied mother-and-child character illustration (transparent PNG or SVG)",
    source: MASCOT,
    fit: "contain",
  },
  mascotLaughing: {
    src: "/assets/mascot/mascot-laughing.webp",
    alt: "The Mumma's Bite mother laughing happily",
    width: 1254,
    height: 1254,
    required: "Character — laughing",
    source: MASCOT,
    fit: "contain",
  },
  mascotOffering: {
    src: "/assets/mascot/mascot-offering.webp",
    alt: "The Mumma's Bite mother holding out a bowl of homemade sweets",
    width: 1287,
    height: 1222,
    required: "Character — offering",
    source: MASCOT,
    fit: "contain",
  },
  mascotSurprised: {
    src: "/assets/mascot/mascot-surprised.webp",
    alt: "The Mumma's Bite mother looking surprised",
    width: 1254,
    height: 1254,
    required: "Character — surprised",
    source: MASCOT,
    fit: "contain",
  },
  heroScene: {
    src: null,
    alt: "Mumma's Bite in a warm home kitchen",
    width: 1600,
    height: 1200,
    required: "Hero brand photograph (product or kitchen scene)",
  },
  productPack: {
    src: "/assets/pack.jpg",
    alt: "Mumma's Bite Dry Fruit Bar pouch",
    width: 800,
    height: 1000,
    required: "Real product packaging photograph",
    source: `${FILM}. Replace with a real pack photo before launch.`,
  },
  barPressed: {
    src: "/assets/bar-pressed.jpg",
    alt: "A dry fruit bar of dates and nuts, freshly pressed",
    width: 864,
    height: 1080,
    required: "Close-up of the bar",
    source: FILM,
  },
  ingredientBowl: {
    src: "/assets/ingredients-bowl.jpg",
    alt: "Dates in a bowl with almonds, cashews, walnuts and pistachios falling in",
    width: 864,
    height: 1080,
    required: "Ingredients photograph",
    source: FILM,
  },
  processPoster: {
    src: "/assets/process-poster.jpg",
    alt: "Ingredients arriving on the line",
    width: 1280,
    height: 720,
    required: "Process film poster frame",
    source: FILM,
  },
  heroPoster: {
    src: "/assets/hero-poster.jpg",
    alt: "A wooden bowl filled with dates, nuts and seeds on a table in an orchard",
    width: 1280,
    height: 720,
    required: "Hero film final frame",
    source: HERO_FILM,
  },
  storyKitchen: { src: null, alt: "", width: 1200, height: 1500, required: "Story image — the idea / home" },
  storyRecipe: { src: null, alt: "", width: 1200, height: 1500, required: "Story image — the recipe" },
  storyExperiments: { src: null, alt: "", width: 1200, height: 1500, required: "Story image — the experiments" },
  storyProduct: { src: null, alt: "", width: 1200, height: 1500, required: "Story image — the product" },
  storyBrand: { src: null, alt: "", width: 1200, height: 1500, required: "Story image — the brand / character" },
  storyNext: { src: null, alt: "", width: 1200, height: 1500, required: "Story image — what comes next" },
  ingredientDates: { src: "/assets/ingredient-dates.jpg", alt: "Dates", width: 600, height: 600, required: "Ingredient photo — dates", source: FILM },
  ingredientNuts: { src: "/assets/ingredient-nuts.jpg", alt: "Almonds, cashews, walnuts and pistachios", width: 600, height: 600, required: "Ingredient photo — nuts", source: FILM },
  ingredientSeeds: { src: "/assets/ingredient-seeds.jpg", alt: "Pumpkin and sunflower seeds", width: 600, height: 600, required: "Ingredient photo — the seeds used in the bar", source: HERO_FILM },
};

export const storyAssetFor: Record<string, AssetKey> = {
  idea: "storyKitchen",
  recipe: "storyRecipe",
  experiments: "storyExperiments",
  product: "barPressed",
  brand: "mascotLaughing",
  next: "storyNext",
};
