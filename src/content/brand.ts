/**
 * BRAND CONTENT — single source of truth for copy.
 *
 * Only information supplied in the build brief is marked `verified`.
 * The real founding story has NOT been supplied yet, so every story beat is
 * `unknown` and carries a prompt describing what the brand needs to provide.
 * Do not fill these with invented history, numbers, people or claims.
 */

import { type ContentField, unknown, unverified, verified } from "./status";

export type Ingredient = {
  id: string;
  name: string;
  /** Short, neutral description of the ingredient itself — no health claims. */
  note: string;
  assetKey: IngredientAssetKey;
};

export type StoryChapter = {
  id: string;
  index: string;
  title: string;
  body: ContentField;
  /** What the brand team needs to supply for this beat. Shown while unknown. */
  needs: string;
};

export type BrandStory = {
  opening: string;
  chapters: StoryChapter[];
};

export type IngredientAssetKey =
  | "ingredientDates"
  | "ingredientAlmonds"
  | "ingredientCashews"
  | "ingredientWalnuts"
  | "ingredientSeeds";

export const brand = {
  name: "Mummas Bite",
  wordmark: "MUMMAS BITE",
  promise: verified("Made with a mother's love."),
  supporting: verified(
    "Simple ingredients. Honest nourishment. A little piece of home in every bite.",
  ),
  idea: verified("A modern food brand inspired by the food a mother makes at home."),
  /** Positioning suggested in the brief — confirm the category before launch. */
  category: unverified("Homemade Dry Fruit Bars"),
} as const;

/**
 * Landing page "It started at home" beats. Structure is from the brief;
 * the words for each beat must come from the brand.
 */
export const homeJourney: { id: string; label: string; needs: string }[] = [
  { id: "home", label: "Home", needs: "Where it began — whose kitchen, which city or town." },
  { id: "mother", label: "Mother", needs: "Who she is and what she made for the family." },
  { id: "recipe", label: "Recipe", needs: "The recipe at the heart of it and why it mattered." },
  { id: "experiments", label: "Experimentation", needs: "How the recipe was tested and refined." },
  { id: "product", label: "Product", needs: "How it became something others could buy." },
  { id: "brand", label: "Brand", needs: "Why the name Mummas Bite." },
];

export const story: BrandStory = {
  opening: "It started with something simple.",
  chapters: [
    {
      id: "idea",
      index: "01",
      title: "The idea",
      body: unknown(),
      needs: "The moment the idea appeared. Who had it, and what prompted it?",
    },
    {
      id: "recipe",
      index: "02",
      title: "The recipe",
      body: unknown(),
      needs: "The original home recipe — what made it special in your family?",
    },
    {
      id: "experiments",
      index: "03",
      title: "The experiments",
      body: unknown(),
      needs: "What was tried, what failed, what changed along the way?",
    },
    {
      id: "product",
      index: "04",
      title: "The product",
      body: unknown(),
      needs: "What the final product is today and how it is made.",
    },
    {
      id: "brand",
      index: "05",
      title: "The brand",
      body: unknown(),
      needs: "Why “Mummas Bite”, and the story behind the mother-and-child character.",
    },
    {
      id: "next",
      index: "06",
      title: "What comes next",
      body: unknown(),
      needs: "Where the brand is heading — only plans you are happy to share publicly.",
    },
  ],
};

/**
 * Ingredient list taken from the example in the brief.
 * UNVERIFIED — confirm against the real recipe/label before launch.
 */
export const ingredientsStatus = unverified("Ingredient list from brief example");

export const ingredients: Ingredient[] = [
  { id: "dates", name: "Dates", note: "Soft, naturally sweet fruit.", assetKey: "ingredientDates" },
  { id: "almonds", name: "Almonds", note: "A familiar crunch from every Indian kitchen.", assetKey: "ingredientAlmonds" },
  { id: "cashews", name: "Cashews", note: "Mild, creamy and buttery.", assetKey: "ingredientCashews" },
  { id: "walnuts", name: "Walnuts", note: "Earthy, with a gentle bite.", assetKey: "ingredientWalnuts" },
  { id: "seeds", name: "Seeds", note: "Small, toasty texture in every piece.", assetKey: "ingredientSeeds" },
];
