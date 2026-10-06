/**
 * Commerce domain types.
 *
 * These deliberately mirror the Shopify Storefront API shapes (Money, Image,
 * ProductVariant, Cart, CartLine, Customer, Order, MailingAddress) so the mock
 * adapter and the Shopify adapter are interchangeable and nothing in the UI
 * needs rewriting when Shopify is connected.
 */

import type { ContentField } from "@/content/status";

export type Money = {
  amount: string; // decimal string, as Shopify returns it
  currencyCode: string; // ISO 4217, e.g. "INR"
};

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type SelectedOption = { name: string; value: string };

export type ProductVariant = {
  id: string; // gid://shopify/ProductVariant/...
  title: string;
  availableForSale: boolean;
  price: Money;
  /** Shopify "Compare-at price": the regular price while an offer runs (null when there's no offer). */
  compareAtPrice?: Money | null;
  selectedOptions: SelectedOption[];
};

/**
 * Regulated / factual product information. In Shopify these map to product
 * metafields in the `mummas` namespace (see lib/commerce/shopify/queries.ts).
 * Every field carries a content status so unknown values are never presented
 * as facts.
 */
export type ProductDetails = {
  netQuantity: ContentField;
  /** On-pack claims, e.g. "No added sugar". Shown only with their content status. */
  claims: ContentField;
  ingredients: ContentField;
  nutrition: ContentField;
  allergens: ContentField;
  storage: ContentField;
  shelfLife: ContentField;
  fssai: ContentField;
};

export type Product = {
  id: string; // gid://shopify/Product/...
  handle: string;
  title: string;
  description: string;
  shortDescription: string;
  featuredImage: ShopifyImage | null;
  images: ShopifyImage[];
  priceRange: { minVariantPrice: Money };
  variants: ProductVariant[];
  availableForSale: boolean;
  details: ProductDetails;
  /** true when this record is mock data and must not be treated as live. */
  isMock: boolean;
};

export type CartMerchandise = {
  id: string; // variant id
  title: string;
  price: Money;
  compareAtPrice?: Money | null;
  product: {
    handle: string;
    title: string;
    featuredImage: ShopifyImage | null;
  };
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: Money };
  merchandise: CartMerchandise;
};

/** Where the cart ships to: enough to price delivery (PIN code level). */
export type DeliveryAddress = {
  zip: string; // Indian PIN code
  city: string | null;
  provinceCode: string | null; // Shopify province code, e.g. "TS"
};

/** A delivery rate Shopify offers for the cart (shipping settings or a carrier app). */
export type DeliveryOption = {
  handle: string;
  title: string;
  cost: Money;
};

export type Cart = {
  id: string;
  checkoutUrl: string | null;
  totalQuantity: number;
  cost: { subtotalAmount: Money };
  lines: CartLine[];
  delivery: {
    address: DeliveryAddress | null;
    /** Cheapest first. Empty when no address is set or nothing ships there. */
    options: DeliveryOption[];
  };
  isMock: boolean;
};

export type CartLineInput = { merchandiseId: string; quantity: number };
export type CartLineUpdateInput = { id: string; quantity: number };

export type MailingAddress = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  zip: string | null;
  country: string | null;
  phone: string | null;
};

export type OrderLine = {
  title: string;
  quantity: number;
  variantTitle: string | null;
};

export type Order = {
  id: string;
  name: string; // e.g. "#1001"
  processedAt: string; // ISO date
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  totalPrice: Money;
  lineItems: OrderLine[];
};

export type Customer = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  defaultAddress: MailingAddress | null;
  addresses: MailingAddress[];
  orders: Order[];
};

/**
 * The account experience is driven by a session state rather than a
 * Customer object, so the UI can never render a fabricated customer.
 */
export type CustomerSession =
  | { status: "not-connected" } // Shopify customer accounts not enabled yet
  | { status: "signed-out"; loginUrl: string }
  | { status: "signed-in"; customer: Customer; logoutUrl: string };
