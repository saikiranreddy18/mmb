/** Production domain. NEXT_PUBLIC_SITE_URL can override it (e.g. for a staging deploy). */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://mummasbite.com").replace(/\/$/, "");

export const siteName = "Mumma's Bite";
export const defaultTitle = "Mumma's Bite | Affordable Healthy Snack Bars & Dry Fruit Bars, No Added Sugar";
export const defaultDescription =
  "Affordable healthy snack bars made with dates, nuts and seeds: dry fruit and multi-seed energy bars with no added sugar and no preservatives. Order online, delivered across India.";

export const keywords = [
  "Mumma's Bite",
  "affordable healthy snack bar",
  "healthy snack bar India",
  "dry fruit bar",
  "dry fruit energy bar",
  "multi seed energy bar",
  "seed bar",
  "dates and nuts bar",
  "no added sugar snack bar",
  "healthy snacks for kids",
  "healthy snacks online India",
  "homemade energy bars",
];
