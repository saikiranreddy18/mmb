/**
 * The 7 cards of the Home "everyday" 3D carousel — the brand's social-style
 * posts (text is part of each image). `placeholder` marks a slot still using a
 * product photo until the brand's own card image is supplied.
 */
export type SocialCard = { src: string; alt: string; width: number; height: number; placeholder?: boolean };

export const SOCIAL_CARDS: SocialCard[] = [
  {
    src: "/assets/social/pre-workout.jpg",
    alt: "Pre-workout fuel: a Mumma's Bite Multi-Seed Energy Bar pack on a bench beside a gym bag, towel and steel bottle",
    width: 1080,
    height: 1920,
  },
  { src: "/assets/dryfruit-front-v2.jpg", alt: "Mumma's Bite Dry Fruit Energy Bar pouch", width: 1080, height: 1457, placeholder: true },
  {
    src: "/assets/social/work-slumps.jpg",
    alt: "Power through work slumps: a Mumma's Bite Multi-Seed Energy Bar pack on a desk beside a laptop and a cup of coffee",
    width: 1125,
    height: 2000,
  },
  { src: "/assets/multiseed-lifestyle-v2.jpg", alt: "Mumma's Bite Multi-Seed Energy Bar pouch on slate", width: 1121, height: 1403, placeholder: true },
  { src: "/assets/dryfruit-lifestyle.jpg", alt: "Two Mumma's Bite Dry Fruit Energy Bar pouches with a bar, dates and nuts", width: 750, height: 937, placeholder: true },
  { src: "/assets/multiseed-front-v2.jpg", alt: "Mumma's Bite Multi-Seed Energy Bar pouch", width: 1080, height: 1457, placeholder: true },
  { src: "/assets/dryfruit-film-poster.jpg", alt: "Dates and nuts swirling around a Mumma's Bite Dry Fruit Bar pouch", width: 720, height: 1280, placeholder: true },
];
