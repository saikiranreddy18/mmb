/** Production domain. NEXT_PUBLIC_SITE_URL can override it (e.g. for a staging deploy). */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://mummasbite.com").replace(/\/$/, "");

export const siteName = "Mumma's Bite";
export const defaultTitle = "Mumma's Bite | Dry Fruit Bars Made with a Mother's Love";
export const defaultDescription =
  "Made with a mother's love. Simple ingredients. Honest nourishment. A little piece of home in every bite.";
