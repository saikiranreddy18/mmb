/**
 * Cards of the Home "everyday" 3D carousel — the brand's social-style posts
 * (text is part of each image). The ring spaces however many cards there are
 * evenly (designed for 7; one more card to come).
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
    src: "/assets/social/pre-workout.jpg",
    alt: "Pre-workout fuel: a Mumma's Bite Multi-Seed Energy Bar pack on a bench beside a gym bag, towel and steel bottle",
    width: 1080,
    height: 1920,
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
    src: "/assets/social/work-slumps.jpg",
    alt: "Power through work slumps: a Mumma's Bite Multi-Seed Energy Bar pack on a desk beside a laptop and a cup of coffee",
    width: 1125,
    height: 2000,
  },
  {
    src: "/assets/social/piece-of-home-everywhere.jpg",
    alt: "A little piece of home everywhere: a woman at her desk with a coffee, slipping a Mumma's Bite bar into her bag",
    width: 1080,
    height: 1920,
  },
];
