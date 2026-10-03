/** Production domain is not yet confirmed — set NEXT_PUBLIC_SITE_URL before launch. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const siteName = "Mummas Bite";
export const defaultTitle = "Mummas Bite | Homemade Dry Fruit Bars";
export const defaultDescription =
  "Made with a mother's love. Simple ingredients. Honest nourishment. A little piece of home in every bite.";
