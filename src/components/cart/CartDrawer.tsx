"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Lock, Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "./CartProvider";
import { formatMoney, multiplyMoney, wasPrice } from "@/lib/commerce/money";
import { ButtonLink, buttonClass } from "@/components/ui/Button";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/content/contact";
import type { Cart } from "@/lib/commerce/types";
import { useDialog } from "@/components/ui/useDialog";
import { applyOffers } from "@/lib/commerce/offers";
import { DeliveryEstimate } from "./DeliveryEstimate";
import { TrustBadges } from "@/components/ui/TrustBadges";

/** Cheapest delivery rate for the cart, or null when it isn't known yet. Free-delivery offers zero it. */
function deliveryCost(cart: Cart) {
  const cheapest = cart.delivery.options[0]?.cost;
  if (!cheapest) return null;
  return applyOffers(cart.cost.subtotalAmount).freeDelivery ? 0 : Number(cheapest.amount);
}

function orderMessage(cart: Cart, location: { city: string; state: string; pincode: string } | null) {
  const o = applyOffers(cart.cost.subtotalAmount);
  const lines = cart.lines.map(
    (l) => `• ${l.merchandise.product.title} (${l.merchandise.title}) × ${l.quantity} = ${formatMoney(l.cost.totalAmount)}`,
  );
  return [
    "Hi Mumma's Bite! I'd like to order:",
    ...lines,
    `Subtotal: ${formatMoney(cart.cost.subtotalAmount)}`,
    o.percent ? `Offer (${o.percent}%): −${formatMoney(o.discount)}` : null,
    `Estimated total: ${formatMoney(o.total)}${o.freeDelivery ? " + free delivery" : ""}`,
    location ? `Deliver to: ${location.city}, ${location.state} ${location.pincode}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function CartTotals({ cart }: { cart: Cart }) {
  const subtotal = cart.cost.subtotalAmount;
  const o = applyOffers(subtotal);
  const delivery = deliveryCost(cart);
  const total = { amount: (Number(o.total.amount) + (delivery ?? 0)).toFixed(2), currencyCode: subtotal.currencyCode };
  return (
    <div className="space-y-2 text-sm">
      {o.next && (
        <p className="rounded-xl bg-cream px-3 py-2 text-brown">
          Add <strong>{formatMoney({ amount: String(o.next.amountNeeded), currencyCode: subtotal.currencyCode })}</strong> more for{" "}
          <strong>{o.next.label}</strong>.
        </p>
      )}
      <div className="flex justify-between">
        <span className="text-ink-soft">Subtotal</span>
        <span className="font-semibold">{formatMoney(subtotal)}</span>
      </div>
      {o.percent > 0 && (
        <div className="flex justify-between text-green">
          <span>Offer discount ({o.percent}%)</span>
          <span className="font-semibold">−{formatMoney(o.discount)}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-ink-soft">Delivery</span>
        <span className="font-semibold">
          {o.freeDelivery || delivery === 0 ? (
            <span className="text-green">Free</span>
          ) : delivery !== null ? (
            formatMoney({ amount: delivery.toFixed(2), currencyCode: subtotal.currencyCode })
          ) : cart.isMock ? (
            "Confirmed on WhatsApp"
          ) : cart.delivery.address ? (
            "Calculated at checkout"
          ) : (
            "Enter PIN code"
          )}
        </span>
      </div>
      <div className="flex items-baseline justify-between border-t border-line pt-2">
        <span className="eyebrow text-ink-soft">Estimated total</span>
        <span className="text-xl font-extrabold">{formatMoney(total)}</span>
      </div>
      <p className="text-xs text-ink-soft">Taxes and final offers are confirmed at checkout.</p>
    </div>
  );
}

export function CartDrawer() {
  const { cart, isOpen, close, isBusy, error, location, updateQuantity, removeLine, checkout, isRedirecting } = useCart();
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
            {error && (
              <p role="alert" className="text-sm text-brown">
                {error}
              </p>
            )}
            <ButtonLink href="/shop" onClick={close}>
              Shop Mumma's Bite
            </ButtonLink>
          </div>
        ) : (
          <>
            <ul data-lenis-prevent className="flex-1 divide-y divide-line overflow-y-auto px-6" aria-busy={isBusy}>
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
                          <span className="block text-xs font-medium text-ink-soft">{line.merchandise.title}</span>
                        </Link>
                        <span className="flex shrink-0 flex-col items-end">
                          {wasPrice(line.merchandise.price, line.merchandise.compareAtPrice) && (
                            <del className="text-xs font-semibold text-ink-soft/70">
                              <span className="sr-only">Regular price </span>
                              {formatMoney(multiplyMoney(line.merchandise.compareAtPrice!, line.quantity))}
                            </del>
                          )}
                          <span className="font-semibold">{formatMoney(line.cost.totalAmount)}</span>
                        </span>
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
              {cart && <DeliveryEstimate cart={cart} />}
              {cart && <CartTotals cart={cart} />}
              {cart?.checkoutUrl ? (
                <>
                  <a
                    href={cart.checkoutUrl}
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isBusy && !isRedirecting) checkout();
                    }}
                    aria-disabled={isBusy || isRedirecting}
                    className={buttonClass("primary", `w-full ${isBusy || isRedirecting ? "pointer-events-none opacity-60" : ""}`)}
                  >
                    <Lock className="size-4" aria-hidden />
                    {isRedirecting ? "Opening secure checkout…" : "Secure checkout"}
                  </a>
                  <TrustBadges compact />
                </>
              ) : (
                <>
                  <a
                    href={cart ? whatsappLink(orderMessage(cart, location)) : whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClass("primary", "w-full")}
                  >
                    <MessageCircle className="size-4" aria-hidden />
                    Order on WhatsApp
                  </a>
                  <p className="text-center text-xs text-ink-soft">
                    Sends your order to us on WhatsApp. Online payment is coming soon.
                  </p>
                </>
              )}
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
