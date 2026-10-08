/**
 * Cards of the Home "everyday" 3D carousel — the brand's social-style posts
 * (text is part of each image). The ring spaces however many cards there are
 * evenly (7 cards → 51.43° apart).
 */
export type SocialCard = { src: string; alt: string; width: number; height: number };

export const SOCIAL_CARDS: SocialCard[] = [
  {
    src: "/assets/social/wholesome-fuel.jpg",
    alt: "Wholesome fuel for every day: dates, nuts and seeds in bowls beside a notebook and a green water bottle",
    width: 1080,
    height: 1920,
  },
  {
    src: "/assets/social/pre-workout-30.jpg",
    alt: "Pre-workout fuel for ₹30: a Mumma's Bite Multi-Seed Energy Bar pack on a bench beside a gym bag, dumbbell, towel and steel bottle",
    width: 941,
    height: 1672,
  },
  {
    src: "/assets/social/piece-of-home-anywhere.jpg",
    alt: "A little piece of home anywhere: a smiling traveller eating a Mumma's Bite bar on a railway platform",
    width: 1080,
    height: 1920,
  },
  {
    src: "/assets/social/clean-ingredients.jpg",
    alt: "100% real, clean ingredients: a 4 × 5 cm Multi-Seed bar surrounded by bowls of peanuts and seeds",
    width: 1080,
    height: 1920,
  },
  {
    src: "/assets/social/work-slumps-25.jpg",
    alt: "Power through work slumps: a Mumma's Bite Multi-Seed Energy Bar pack on a desk beside a laptop, notebook and a cup of coffee",
    width: 941,
    height: 1672,
  },
  {
    src: "/assets/social/daily-journey.jpg",
    alt: "Nourishment for your daily journey: a Mumma's Bite Multi-Seed Energy Bar pack on a desk beside a laptop, succulent and coffee",
    width: 941,
    height: 1672,
  },
  {
    src: "/assets/social/piece-of-home-everywhere-v2.jpg",
    alt: "A little piece of home everywhere: a woman at her desk with a coffee, slipping a Mumma's Bite bar into her bag",
    width: 1080,
    height: 1920,
  },
];
