/**
 * BRAND CONTENT — single source of truth for copy.
 *
 * Only information supplied in the build brief is marked `verified`.
 * The founding story below is the founder's own (Rajeswari, supplied 6 Oct 2026),
 * edited for length. Do not add invented history, numbers, people or claims.
 */

import { type ContentField, unknown, unverified, verified } from "./status";

export type Ingredient = {
  id: string;
  name: string;
  /** Short, neutral description of the ingredient itself — no health claims. */
  note: string;
  /** Supplied ingredient illustrations (backgrounds removed, artwork unaltered). */
  art: IngredientArt[];
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

export type IngredientArt = { src: string; alt: string; width: number; height: number };

const art = (name: string, alt: string, width: number, height: number): IngredientArt => ({
  src: `/assets/ingredients/${name}.webp`,
  alt,
  width,
  height,
});

export const brand = {
  /** As written on the supplied logo and packaging. */
  name: "Mumma's Bite",
  wordmark: "mumma's bite",
  promise: verified("Made with a mother's love."),
  supporting: verified(
    "Simple ingredients. Honest nourishment. A little piece of home in every bite.",
  ),
  idea: verified("A modern food brand inspired by the food a mother makes at home."),
  /** Product name as printed on the pack in the supplied process film. */
  category: unverified("Dry Fruit Bar"),
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
  { id: "brand", label: "Brand", needs: "Why the name Mumma's Bite." },
];

export const story: BrandStory = {
  opening: "It started with something simple.",
  chapters: [
    {
      id: "idea",
      index: "01",
      title: "The idea",
      body: verified("I'm Rajeswari. At 44 I'm still learning new things: travelling to new places, cooking, trying what I haven't tried before. The pandemic changed how so many of us think about food, and it changed me too. I started cooking healthier, and that became a new beginning."),
      needs: "The moment the idea appeared. Who had it, and what prompted it?",
    },
    {
      id: "recipe",
      index: "02",
      title: "The recipe",
      body: verified("At home I made laddus with dates, nuts and seeds. No added sugar, just the natural sweetness of dates holding everything together. My family reached for them every day, and that simple recipe is the heart of every Mumma's Bite bar."),
      needs: "The original home recipe — what made it special in your family?",
    },
    {
      id: "experiments",
      index: "03",
      title: "The experiments",
      body: verified("Laddus are perfect at home, but hard to carry. So I kept making batch after batch, changing the mix of nuts and seeds and how firmly to press it, until it became a bar you can slip into a school bag, an office desk or a travel bag."),
      needs: "What was tried, what failed, what changed along the way?",
    },
    {
      id: "product",
      index: "04",
      title: "The product",
      body: verified("Today there are two bars: Dry Fruit, with dates, cashews, almonds, walnuts and pistachios, and Multi-Seed, with dates, peanuts and five kinds of seeds. Natural ingredients, no added sugar and no preservatives, at a price everyone can try."),
      needs: "What the final product is today and how it is made.",
    },
    {
      id: "brand",
      index: "05",
      title: "The brand",
      body: verified("Mumma's Bite is my first step into something new. The name says what it is: made with a mother's love. Have a bite, and remember your mother."),
      needs: "Why “Mumma's Bite”, and the story behind the mother-and-child character.",
    },
    {
      id: "next",
      index: "06",
      title: "What comes next",
      body: verified("This is only the beginning. My dream is to take a recipe from my home kitchen to homes around the world, so that wherever you are, one bite tastes like home. I'm still learning, and I'll keep creating healthy, honest snacks made the way a mother makes them."),
      needs: "Where the brand is heading — only plans you are happy to share publicly.",
    },
  ],
};

/**
 * Ingredient groups as printed on the pack in the supplied process film
 * ("Dates | Nuts | Seeds"). The film shows almonds, cashews, walnuts and
 * pistachios as the nuts. UNVERIFIED — confirm against the real label.
 */
export const ingredientsStatus = unverified("Dates | Nuts | Seeds — from pack in process film");

export const ingredients: Ingredient[] = [
  {
    id: "dates",
    name: "Dates",
    note: "Soft, naturally sweet fruit at the heart of the bar.",
    art: [art("date", "A glossy date", 680, 720)],
  },
  {
    id: "nuts",
    name: "Nuts",
    note: "Walnuts, almonds, pistachios and cashews for crunch in every bite.",
    art: [
      art("walnut", "A walnut", 720, 679),
      art("almond", "An almond", 452, 720),
      art("pistachio", "A pistachio in its shell", 720, 715),
      art("cashew", "A cashew", 720, 596),
    ],
  },
  {
    id: "seeds",
    name: "Seeds",
    note: "A sprinkle of seeds through every piece.",
    art: [
      art("pumpkin-seed", "A pumpkin seed", 554, 720),
      art("sunflower-seed", "A sunflower seed", 720, 419),
      art("watermelon-seed", "A watermelon seed", 701, 593),
      art("sesame-seed", "Sesame seeds", 720, 355),
      art("flax-seed", "Flax seeds", 366, 167),
    ],
  },
];

/**
 * The talking ingredients (Contact section): the supplied 3D ingredient
 * illustrations take turns saying what they bring to the bar.
 * Kept short and factual, no health or medical claims.
 * UNVERIFIED — written for the site; the brand should approve the wording.
 */
export const talkingIngredients: { id: string; name: string; line: string; art: IngredientArt }[] = [
  { id: "date", name: "Date", line: "I'm the sweetness. No added sugar!", art: art("date", "", 680, 720) },
  { id: "walnut", name: "Walnut", line: "I bring the crunch and good fats.", art: art("walnut", "", 720, 679) },
  { id: "almond", name: "Almond", line: "Protein and fibre in every bite.", art: art("almond", "", 452, 720) },
  { id: "pistachio", name: "Pistachio", line: "Colour, crunch and plant protein.", art: art("pistachio", "", 720, 715) },
  { id: "cashew", name: "Cashew", line: "Creamy. I hold it all together.", art: art("cashew", "", 720, 596) },
  { id: "pumpkin-seed", name: "Pumpkin seed", line: "Small and green, packed with plant protein.", art: art("pumpkin-seed", "", 554, 720) },
  { id: "sunflower-seed", name: "Sunflower seed", line: "A nutty little crunch, from me.", art: art("sunflower-seed", "", 720, 419) },
  { id: "watermelon-seed", name: "Watermelon seed", line: "Tiny, but I add the bite.", art: art("watermelon-seed", "", 701, 593) },
  { id: "sesame", name: "Sesame", line: "Tiny seeds, big nutty flavour.", art: art("sesame-seed", "", 720, 355) },
  { id: "flax", name: "Flax seed", line: "Small and glossy, with a gentle crunch.", art: art("flax-seed", "", 366, 167) },
];
export const talkingIngredientsStatus = unverified("Speech-bubble lines written for the site — brand to approve");

/**
 * The story page goes public (menu, links, sitemap, search engines) once at
 * least one chapter has real, verified words from the brand.
 */
export const storyPublished = story.chapters.some((c) => c.body.status === "verified");
