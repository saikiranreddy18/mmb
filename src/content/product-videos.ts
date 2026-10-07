/**
 * Short product films shown in the product gallery (second slide, after the
 * front pack). Keyed by Shopify product handle. Muted, looping, no audio.
 */
export type ProductVideo = {
  mp4: string;
  webm?: string;
  poster: string;
  alt: string;
  width: number;
  height: number;
};

export const PRODUCT_VIDEOS: Record<string, ProductVideo> = {
  "dry-fruit-energy-bar": {
    mp4: "/assets/dryfruit-film.mp4",
    webm: "/assets/dryfruit-film.webm",
    poster: "/assets/dryfruit-film-poster.jpg",
    alt: "Dates, almonds, cashews and seeds swirling around a Mumma's Bite Dry Fruit Bar pouch, with bars on slate",
    width: 720,
    height: 1280,
  },
};
