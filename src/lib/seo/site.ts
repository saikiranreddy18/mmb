/** Production domain is not yet confirmed — set NEXT_PUBLIC_SITE_URL before launch. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const siteName = "Mumma's Bite";
export const defaultTitle = "Mumma's Bite | Dry Fruit Bars Made with a Mother's Love";
export const defaultDescription =
  "Made with a mother's love. Simple ingredients. Honest nourishment. A little piece of home in every bite.";
