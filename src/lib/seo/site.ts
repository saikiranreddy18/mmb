/** Public site URL. Set NEXT_PUBLIC_SITE_URL in the deploy environment (https://mummasbite.com). */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const siteName = "Mumma's Bite";
export const defaultTitle = "Mumma's Bite | Homemade Dry Fruit & Seed Energy Bars, No Added Sugar";
export const defaultDescription =
  "Homemade-style dry fruit and multi-seed energy bars made with dates, nuts and seeds. No added sugar, no preservatives. Order online with delivery across India.";

export const keywords = [
  "Mumma's Bite",
  "dry fruit energy bar",
  "multi seed energy bar",
  "no added sugar energy bar",
  "dates and nuts bar",
  "healthy snacks India",
  "homemade energy bars",
  "protein bar no sugar",
];

/** Contact used in structured data. */
export const contactPhone = "+91-83095-32183";
