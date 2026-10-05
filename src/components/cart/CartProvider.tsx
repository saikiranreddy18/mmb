"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { cartAdapter } from "@/lib/commerce/cart-adapter";
import { isShopifyConnected } from "@/lib/commerce/config";
import type { Cart } from "@/lib/commerce/types";

const CART_ID_KEY = "mb-cart-id";

type CartContextValue = {
  cart: Cart | null;
  isOpen: boolean;
  isBusy: boolean;
  error: string | null;
  open: () => void;
  close: () => void;
  addItem: (merchandiseId: string, quantity?: number) => Promise<void>;
  /** Skip the cart: go straight to Shopify checkout with just this item. */
  buyNow: (merchandiseId: string, quantity?: number) => Promise<void>;
  /** True while a Buy Now redirect to checkout is in flight. */
  isRedirecting: boolean;
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

  useEffect(() => {
    let id: string | null = null;
    try {
      id = window.localStorage.getItem(CART_ID_KEY);
    } catch {
      /* ignore */
    }
    if (!id) return;
    cartAdapter
      .get(id)
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
      setError("Something went wrong updating your cart. Please try again.");
    } finally {
      setBusy(false);
    }
  }, []);

  const addItem = useCallback(
    async (merchandiseId: string, quantity = 1) => {
      const lines = [{ merchandiseId, quantity }];
      await run(() => (cart ? cartAdapter.addLines(cart.id, lines) : cartAdapter.create(lines)));
      setOpen(true);
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
        const checkoutCart = await cartAdapter.create([{ merchandiseId, quantity }]);
        if (!checkoutCart.checkoutUrl) throw new Error("Shopify returned no checkout URL");
        window.location.assign(checkoutCart.checkoutUrl);
      } catch {
        setRedirecting(false);
        setError("We couldn't open checkout. Please try again.");
        setOpen(true);
      }
    },
    [addItem],
  );

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
      isRedirecting,
      updateQuantity,
      removeLine,
    }),
    [cart, isOpen, isBusy, error, open, close, addItem, buyNow, isRedirecting, updateQuantity, removeLine],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
