"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { cartAdapter } from "@/lib/commerce/cart-adapter";
import { isShopifyConnected } from "@/lib/commerce/config";
import type { Cart, DeliveryAddress } from "@/lib/commerce/types";
import type { PincodeLocation } from "@/lib/shipping/types";

const CART_ID_KEY = "mb-cart-id";
const LOCATION_KEY = "mb-delivery-location";

const toAddress = (l: PincodeLocation): DeliveryAddress => ({
  zip: l.pincode,
  city: l.city,
  provinceCode: l.provinceCode,
});

export type PincodeResult = "ok" | "invalid" | "unavailable";

type CartContextValue = {
  cart: Cart | null;
  isOpen: boolean;
  isBusy: boolean;
  error: string | null;
  open: () => void;
  close: () => void;
  addItem: (merchandiseId: string, quantity?: number) => Promise<void>;
  /** Make sure the cart is still valid on Shopify, then open its checkout. */
  checkout: () => Promise<void>;
  /** Skip the cart: go straight to Shopify checkout with just this item. */
  buyNow: (merchandiseId: string, quantity?: number) => Promise<void>;
  /** True while a Buy Now redirect to checkout is in flight. */
  isRedirecting: boolean;
  /** Where the shopper said they want delivery (from their PIN code). */
  location: PincodeLocation | null;
  /** Look up a PIN code and price delivery to it. */
  setPincode: (pincode: string) => Promise<PincodeResult>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

function storeId(id: string | null) {
  try {
    if (id) window.localStorage.setItem(CART_ID_KEY, id);
    else window.localStorage.removeItem(CART_ID_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Cart state. Only the cart id is persisted locally; the cart itself always
 * comes back from the adapter (Shopify when connected).
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setOpen] = useState(false);
  const [isBusy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setRedirecting] = useState(false);
  const [location, setLocation] = useState<PincodeLocation | null>(null);

  useEffect(() => {
    let id: string | null = null;
    let saved: PincodeLocation | null = null;
    try {
      const raw = window.localStorage.getItem(LOCATION_KEY);
      saved = raw ? (JSON.parse(raw) as PincodeLocation) : null;
      if (saved) setLocation(saved);
      id = window.localStorage.getItem(CART_ID_KEY);
    } catch {
      /* ignore */
    }
    if (!id) return;
    cartAdapter
      .get(id)
      // A cart from before the PIN code was entered gets it now, so rates show.
      .then((c) => (c && saved && !c.delivery.address ? cartAdapter.setDeliveryAddress(c.id, toAddress(saved)) : c))
      .then((c) => (c ? setCart(c) : storeId(null)))
      .catch(() => storeId(null));
  }, []);

  // Coming back from checkout with the browser's back button restores this
  // page from the back/forward cache; clear the "opening checkout" state.
  useEffect(() => {
    const reset = (e: PageTransitionEvent) => e.persisted && setRedirecting(false);
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  const run = useCallback(async (fn: () => Promise<Cart>) => {
    setBusy(true);
    setError(null);
    try {
      const next = await fn();
      setCart(next);
      storeId(next.id);
    } catch {
      // If the cart itself is gone (expired or already ordered), clear it rather than
      // leave the shopper stuck on a cart that can no longer change.
      const id = (() => {
        try {
          return window.localStorage.getItem(CART_ID_KEY);
        } catch {
          return null;
        }
      })();
      const stillThere = id ? await cartAdapter.get(id).catch(() => undefined) : undefined;
      if (stillThere === null) {
        setCart(null);
        storeId(null);
        setError("Your previous cart expired. Please add your items again.");
      } else {
        setError("We couldn't update your cart. Please check your connection and try again.");
      }
    } finally {
      setBusy(false);
    }
  }, []);

  const addItem = useCallback(
    async (merchandiseId: string, quantity = 1) => {
      const lines = [{ merchandiseId, quantity }];
      const fresh = () => cartAdapter.create(lines, location && toAddress(location));
      await run(async () => {
        if (!cart) return fresh();
        try {
          return await cartAdapter.addLines(cart.id, lines);
        } catch {
          // The saved cart may have expired or already been checked out: start a new one.
          return fresh();
        }
      });
      setOpen(true);
    },
    [cart, location, run],
  );

  const setPincode = useCallback(
    async (pincode: string): Promise<PincodeResult> => {
      let found: PincodeLocation;
      try {
        const res = await fetch(`/api/pincode/${encodeURIComponent(pincode)}`);
        if (res.status === 404) return "invalid";
        if (!res.ok) return "unavailable";
        found = (await res.json()) as PincodeLocation;
      } catch {
        return "unavailable";
      }
      setLocation(found);
      try {
        window.localStorage.setItem(LOCATION_KEY, JSON.stringify(found));
      } catch {
        /* ignore */
      }
      if (cart) await run(() => cartAdapter.setDeliveryAddress(cart.id, toAddress(found)));
      return "ok";
    },
    [cart, run],
  );

  const buyNow = useCallback(
    async (merchandiseId: string, quantity = 1) => {
      // Without Shopify there is no checkout: fall back to the cart drawer,
      // which offers the WhatsApp order flow.
      if (!isShopifyConnected) return addItem(merchandiseId, quantity);
      setRedirecting(true);
      setError(null);
      try {
        // A separate one-line Shopify cart, so the shopper's main cart is untouched.
        // Carry the PIN code across so checkout opens with it filled in.
        const checkoutCart = await cartAdapter.create([{ merchandiseId, quantity }], location && toAddress(location));
        if (!checkoutCart.checkoutUrl) throw new Error("Shopify returned no checkout URL");
        window.location.assign(checkoutCart.checkoutUrl);
      } catch {
        setRedirecting(false);
        setError("We couldn't open checkout. Please try again.");
        setOpen(true);
      }
    },
    [addItem, location],
  );

  const checkout = useCallback(async () => {
    if (!cart?.checkoutUrl) return;
    setRedirecting(true);
    setError(null);
    try {
      // A cart left open in a tab can expire or be completed in another tab;
      // rebuild it from what the shopper sees rather than send them to an empty checkout.
      // If the check itself fails (network), go ahead with the cart we have; only
      // rebuild when Shopify says the cart is gone or empty.
      let live = await cartAdapter.get(cart.id).catch(() => cart);
      if (!live || !live.lines.length || !live.checkoutUrl) {
        live = await cartAdapter.create(
          cart.lines.map((l) => ({ merchandiseId: l.merchandise.id, quantity: l.quantity })),
          location && toAddress(location),
        );
        setCart(live);
        storeId(live.id);
      }
      if (!live.checkoutUrl) throw new Error("No checkout URL");
      window.location.assign(live.checkoutUrl);
    } catch {
      setRedirecting(false);
      setError("We couldn't open checkout. Please check your connection and try again.");
    }
  }, [cart, location]);

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;
      await run(() =>
        quantity <= 0
          ? cartAdapter.removeLines(cart.id, [lineId])
          : cartAdapter.updateLines(cart.id, [{ id: lineId, quantity }]),
      );
    },
    [cart, run],
  );

  const removeLine = useCallback(
    async (lineId: string) => {
      if (!cart) return;
      await run(() => cartAdapter.removeLines(cart.id, [lineId]));
    },
    [cart, run],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      isOpen,
      isBusy,
      error,
      open,
      close,
      addItem,
      buyNow,
      checkout,
      isRedirecting,
      location,
      setPincode,
      updateQuantity,
      removeLine,
    }),
    [cart, isOpen, isBusy, error, open, close, addItem, buyNow, checkout, isRedirecting, location, setPincode, updateQuantity, removeLine],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
