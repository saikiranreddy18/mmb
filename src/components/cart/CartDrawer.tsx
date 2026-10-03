"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "./CartProvider";
import { formatMoney } from "@/lib/commerce/money";
import { Button, ButtonLink, buttonClass } from "@/components/ui/Button";
import { MockNotice } from "@/components/ui/MockNotice";
import { useDialog } from "@/components/ui/useDialog";

export function CartDrawer() {
  const { cart, isOpen, close, isBusy, error, updateQuantity, removeLine } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  useDialog(isOpen, panelRef, close, "[data-cart-trigger]");

  const lines = cart?.lines ?? [];
  const isEmpty = lines.length === 0;

  // Keep the drawer out of the tab order and a11y tree when closed.
  useEffect(() => {
    const el = panelRef.current?.parentElement;
    if (el) el.inert = !isOpen;
  }, [isOpen]);

  return (
    <div className={`fixed inset-0 z-[60] overflow-hidden ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      <div
        onClick={close}
        className={`absolute inset-0 bg-green-900/40 backdrop-blur-[2px] transition-opacity duration-500 ease-brand ${isOpen ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        tabIndex={-1}
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-bg shadow-2xl transition-transform duration-500 ease-brand focus:outline-none ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 id="cart-title" className="eyebrow text-green">
            Your cart{cart?.totalQuantity ? ` · ${cart.totalQuantity}` : ""}
          </h2>
          <button
            onClick={close}
            className="-mr-2 grid size-11 place-items-center rounded-full text-ink hover:bg-cream"
            aria-label="Close cart"
          >
            <X className="size-5" aria-hidden />
          </button>
        </header>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <Image src="/assets/mascot/mascot-surprised.webp" alt="" width={160} height={160} className="size-36" />
            <p className="text-2xl font-extrabold uppercase tracking-tight text-green">
              Nothing here <span className="editorial normal-case">yet.</span>
            </p>
            <p className="text-sm text-ink-soft">A little piece of home is only a click away.</p>
            <ButtonLink href="/shop" onClick={close}>
              Shop Mumma's Bite
            </ButtonLink>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6" aria-busy={isBusy}>
              {lines.map((line) => {
                const img = line.merchandise.product.featuredImage;
                return (
                  <li key={line.id} className="flex gap-4 py-5">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-cream">
                      {img ? (
                        <Image src={img.url} alt={img.altText ?? ""} fill sizes="80px" className="object-cover" />
                      ) : (
                        <span className="absolute inset-0 grid place-items-center p-1 text-center text-[0.55rem] font-bold uppercase tracking-wider text-brown">
                          Asset required
                        </span>
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          href={`/shop/${line.merchandise.product.handle}`}
                          onClick={close}
                          className="font-bold leading-snug text-ink hover:text-green"
                        >
                          {line.merchandise.product.title}
                        </Link>
                        <span className="shrink-0 font-semibold">{formatMoney(line.cost.totalAmount)}</span>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-line">
                          <button
                            className="grid size-10 place-items-center rounded-full hover:bg-cream disabled:opacity-40"
                            onClick={() => updateQuantity(line.id, line.quantity - 1)}
                            disabled={isBusy}
                            aria-label={`Decrease quantity of ${line.merchandise.product.title}`}
                          >
                            <Minus className="size-4" aria-hidden />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
                            {line.quantity}
                          </span>
                          <button
                            className="grid size-10 place-items-center rounded-full hover:bg-cream disabled:opacity-40"
                            onClick={() => updateQuantity(line.id, line.quantity + 1)}
                            disabled={isBusy}
                            aria-label={`Increase quantity of ${line.merchandise.product.title}`}
                          >
                            <Plus className="size-4" aria-hidden />
                          </button>
                        </div>
                        <button
                          onClick={() => removeLine(line.id)}
                          disabled={isBusy}
                          className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-ink-soft hover:bg-cream hover:text-ink"
                        >
                          <Trash2 className="size-3.5" aria-hidden />
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <footer className="space-y-4 border-t border-line px-6 py-6">
              {error && (
                <p role="alert" className="text-sm text-brown">
                  {error}
                </p>
              )}
              <div className="flex items-baseline justify-between">
                <span className="eyebrow text-ink-soft">Subtotal</span>
                <span className="text-xl font-extrabold">{cart && formatMoney(cart.cost.subtotalAmount)}</span>
              </div>
              <p className="text-xs text-ink-soft">Shipping and taxes are calculated at checkout.</p>
              {cart?.checkoutUrl ? (
                <a href={cart.checkoutUrl} className={buttonClass("primary", "w-full")}>
                  Checkout
                </a>
              ) : (
                <>
                  <Button className="w-full" disabled aria-describedby="checkout-note">
                    Checkout
                  </Button>
                  <MockNotice>
                    <span id="checkout-note">
                      Mock cart. Checkout opens through Shopify once commerce is connected.
                    </span>
                  </MockNotice>
                </>
              )}
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
