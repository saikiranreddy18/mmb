/**
 * Contact details supplied by the brand. The phone number is used only to build
 * WhatsApp links; it is never printed on the site.
 */
const WHATSAPP_NUMBER = "918309532183";
export const whatsappLink = (text = "Hi Mumma's Bite! I have a question.") =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export const SUPPORT_EMAIL = "support@mummasbite.com";

export const ADDRESS = {
  lines: ["Kurmannapalem, Gajuwaka", "Visakhapatnam, Andhra Pradesh 530046", "India"],
  locality: "Visakhapatnam",
  region: "Andhra Pradesh",
  postalCode: "530046",
  country: "IN",
} as const;

/** Shopify customer accounts (sign in, orders, addresses), on the checkout domain. */
export const ACCOUNT_URL = "https://shop.mummasbite.com/account";
