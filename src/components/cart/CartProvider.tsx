"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { cartAdapter } from "@/lib/commerce/cart-adapter";
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
      updateQuantity,
      removeLine,
    }),
    [cart, isOpen, isBusy, error, open, close, addItem, updateQuantity, removeLine],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
