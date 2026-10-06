/**
 * Cart adapter boundary.
 *
 * The UI talks only to `CartAdapter`. With Shopify connected, every call is a
 * Storefront API cart mutation and the Shopify cart is the source of truth
 * (its id is the only thing stored locally). Without Shopify, a mock adapter
 * implements the identical contract against the mock catalogue so nothing in
 * the UI needs rewriting later.
 */

import { isShopifyConnected } from "./config";
import { multiplyMoney } from "./money";
import { mockProducts } from "./mock/products";
import { mapCart, type RawCart } from "./shopify/mappers";
import { storefrontFetch } from "./shopify/client";
import {
  cartCreateMutation,
  cartDeliveryAddressesReplaceMutation,
  cartLinesAddMutation,
  cartLinesRemoveMutation,
  cartLinesUpdateMutation,
  cartQuery,
} from "./shopify/queries";
import type { Cart, CartLine, CartLineInput, CartLineUpdateInput, DeliveryAddress } from "./types";

export interface CartAdapter {
  get(cartId: string): Promise<Cart | null>;
  create(lines: CartLineInput[], address?: DeliveryAddress | null): Promise<Cart>;
  addLines(cartId: string, lines: CartLineInput[]): Promise<Cart>;
  updateLines(cartId: string, lines: CartLineUpdateInput[]): Promise<Cart>;
  removeLines(cartId: string, lineIds: string[]): Promise<Cart>;
  /** Set where the cart ships to; the returned cart carries delivery rates for it. */
  setDeliveryAddress(cartId: string, address: DeliveryAddress): Promise<Cart>;
}

/* ── Shopify ─────────────────────────────────────────────────── */

type Payload = { cart: RawCart | null; userErrors: { message: string }[] };

/** Shopify's selectable-address input. PIN code level is enough to price delivery. */
const addressInput = (a: DeliveryAddress) => [
  {
    selected: true,
    oneTimeUse: false,
    validationStrategy: "COUNTRY_CODE_ONLY",
    address: {
      deliveryAddress: {
        countryCode: "IN",
        zip: a.zip,
        ...(a.city ? { city: a.city } : {}),
        ...(a.provinceCode ? { provinceCode: a.provinceCode } : {}),
      },
    },
  },
];

function unwrap(p: Payload): Cart {
  if (p.userErrors.length) throw new Error(p.userErrors.map((e) => e.message).join("; "));
  if (!p.cart) throw new Error("Shopify returned no cart");
  return mapCart(p.cart);
}

const shopifyCart: CartAdapter = {
  async get(cartId) {
    const d = await storefrontFetch<{ cart: RawCart | null }>(cartQuery, { id: cartId }, { cache: "no-store" });
    return d.cart ? mapCart(d.cart) : null;
  },
  async create(lines, address) {
    const d = await storefrontFetch<{ cartCreate: Payload }>(cartCreateMutation, {
      lines,
      addresses: address ? addressInput(address) : [],
    });
    return unwrap(d.cartCreate);
  },
  async addLines(cartId, lines) {
    const d = await storefrontFetch<{ cartLinesAdd: Payload }>(cartLinesAddMutation, { cartId, lines });
    return unwrap(d.cartLinesAdd);
  },
  async updateLines(cartId, lines) {
    const d = await storefrontFetch<{ cartLinesUpdate: Payload }>(cartLinesUpdateMutation, { cartId, lines });
    return unwrap(d.cartLinesUpdate);
  },
  async removeLines(cartId, lineIds) {
    const d = await storefrontFetch<{ cartLinesRemove: Payload }>(cartLinesRemoveMutation, { cartId, lineIds });
    return unwrap(d.cartLinesRemove);
  },
  async setDeliveryAddress(cartId, address) {
    const d = await storefrontFetch<{ cartDeliveryAddressesReplace: Payload }>(cartDeliveryAddressesReplaceMutation, {
      cartId,
      addresses: addressInput(address),
    });
    return unwrap(d.cartDeliveryAddressesReplace);
  },
};

/* ── MOCK DATA — REPLACE WITH SHOPIFY DATA ───────────────────── */

const MOCK_KEY = "mb-mock-cart";
type MockState = {
  id: string;
  lines: { id: string; merchandiseId: string; quantity: number }[];
  address?: DeliveryAddress | null;
};

function readMock(): MockState | null {
  try {
    const raw = window.localStorage.getItem(MOCK_KEY);
    return raw ? (JSON.parse(raw) as MockState) : null;
  } catch {
    return null;
  }
}

function writeMock(state: MockState) {
  try {
    window.localStorage.setItem(MOCK_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — cart lives for this page view only */
  }
}

function hydrateMock(state: MockState): Cart {
  const lines: CartLine[] = [];
  for (const l of state.lines) {
    const product = mockProducts.find((p) => p.variants.some((v) => v.id === l.merchandiseId));
    const variant = product?.variants.find((v) => v.id === l.merchandiseId);
    if (!product || !variant) continue;
    lines.push({
      id: l.id,
      quantity: l.quantity,
      cost: { totalAmount: multiplyMoney(variant.price, l.quantity) },
      merchandise: {
        id: variant.id,
        title: variant.title,
        price: variant.price,
        product: { handle: product.handle, title: product.title, featuredImage: product.featuredImage },
      },
    });
  }
  const currencyCode = lines[0]?.merchandise.price.currencyCode ?? "INR";
  const subtotal = lines.reduce((s, l) => s + Number(l.cost.totalAmount.amount), 0);
  return {
    id: state.id,
    checkoutUrl: null, // no checkout without Shopify
    totalQuantity: lines.reduce((s, l) => s + l.quantity, 0),
    cost: { subtotalAmount: { amount: subtotal.toFixed(2), currencyCode } },
    lines,
    // No shipping rates without Shopify; the address is kept so the cart can show it.
    delivery: { address: state.address ?? null, options: [] },
    isMock: true,
  };
}

let mockMemory: MockState | null = null;
const loadMock = (id: string) => {
  const s = mockMemory ?? readMock();
  return s && s.id === id ? s : null;
};
const saveMock = (s: MockState) => {
  mockMemory = s;
  writeMock(s);
  return hydrateMock(s);
};

function mergeLines(state: MockState, lines: CartLineInput[]) {
  for (const input of lines) {
    const existing = state.lines.find((l) => l.merchandiseId === input.merchandiseId);
    if (existing) existing.quantity += input.quantity;
    else state.lines.push({ id: `mock-line-${input.merchandiseId}`, ...input });
  }
}

const mockCart: CartAdapter = {
  async get(cartId) {
    const s = loadMock(cartId);
    return s ? hydrateMock(s) : null;
  },
  async create(lines, address) {
    const state: MockState = { id: `mock-cart-${Date.now()}`, lines: [], address };
    mergeLines(state, lines);
    return saveMock(state);
  },
  async addLines(cartId, lines) {
    const state = loadMock(cartId) ?? { id: cartId, lines: [] };
    mergeLines(state, lines);
    return saveMock(state);
  },
  async updateLines(cartId, lines) {
    const state = loadMock(cartId) ?? { id: cartId, lines: [] };
    for (const u of lines) {
      const line = state.lines.find((l) => l.id === u.id);
      if (line) line.quantity = u.quantity;
    }
    state.lines = state.lines.filter((l) => l.quantity > 0);
    return saveMock(state);
  },
  async removeLines(cartId, lineIds) {
    const state = loadMock(cartId) ?? { id: cartId, lines: [] };
    state.lines = state.lines.filter((l) => !lineIds.includes(l.id));
    return saveMock(state);
  },
  async setDeliveryAddress(cartId, address) {
    const state = loadMock(cartId) ?? { id: cartId, lines: [] };
    state.address = address;
    return saveMock(state);
  },
};

export const cartAdapter: CartAdapter = isShopifyConnected ? shopifyCart : mockCart;
