import { storyPublished } from "@/content/brand";
import { ACCOUNT_URL } from "@/content/contact";

export const navItems: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  // Hidden until the brand's real story is supplied (see content/brand.ts).
  ...(storyPublished ? [{ href: "/our-story", label: "Our Story" }] : []),
  // Shopify customer accounts: sign in, order history and tracking, addresses.
  { href: ACCOUNT_URL, label: "Account" },
];

export const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
