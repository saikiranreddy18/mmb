"use client";

import { useState, type FormEvent } from "react";
import { MapPin, Truck } from "lucide-react";
import { useCart } from "./CartProvider";
import { formatMoney } from "@/lib/commerce/money";
import { applyOffers } from "@/lib/commerce/offers";
import { PINCODE_PATTERN } from "@/lib/shipping/types";
import type { Cart } from "@/lib/commerce/types";

const MESSAGES = {
  invalid: "That PIN code doesn't look right. Please check it.",
  unavailable: "We couldn't check that PIN code just now. Please try again.",
} as const;

/**
 * PIN code → delivery rates. With Shopify connected the rates are the ones
 * Shopify checkout will charge: they come from Shopify's shipping settings or
 * the courier app connected to it (e.g. Shiprocket).
 */
export function DeliveryEstimate({ cart }: { cart: Cart }) {
  const { location, setPincode, isBusy } = useCart();
  const [editing, setEditing] = useState(!location);
  const [value, setValue] = useState(location?.pincode ?? "");
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const freeDelivery = applyOffers(cart.cost.subtotalAmount).freeDelivery;
  const { options } = cart.delivery;

  async function submit(e: FormEvent) {
    e.preventDefault();
    const pin = value.trim();
    if (!PINCODE_PATTERN.test(pin)) return setMessage(MESSAGES.invalid);
    setChecking(true);
    setMessage(null);
    const result = await setPincode(pin);
    setChecking(false);
    if (result === "ok") setEditing(false);
    else setMessage(MESSAGES[result]);
  }

  if (editing || !location) {
    return (
      <form onSubmit={submit} className="space-y-1.5">
        <label htmlFor="cart-pincode" className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
          <Truck className="size-3.5" aria-hidden />
          Delivery charge for your PIN code
        </label>
        <div className="flex gap-2">
          <input
            id="cart-pincode"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
            placeholder="6-digit PIN code"
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/\D/g, ""))}
            className="min-h-10 w-full flex-1 rounded-full border border-line bg-white px-4 text-sm outline-none focus:border-green"
            aria-describedby={message ? "cart-pincode-msg" : undefined}
          />
          <button
            type="submit"
            disabled={checking || isBusy}
            className="min-h-10 rounded-full border border-green/30 px-4 text-xs font-bold uppercase tracking-[0.12em] text-green hover:bg-green hover:text-cream disabled:opacity-50"
          >
            {checking ? "Checking…" : "Check"}
          </button>
        </div>
        {message && (
          <p id="cart-pincode-msg" role="alert" className="text-xs text-brown">
            {message}
          </p>
        )}
      </form>
    );
  }

  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="flex items-start gap-1.5 text-ink-soft">
          <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <span>
            Delivering to{" "}
            <strong className="text-ink">
              {location.city}, {location.state} {location.pincode}
            </strong>
          </span>
        </p>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="shrink-0 text-xs font-semibold text-green underline underline-offset-2"
        >
          Change
        </button>
      </div>
      {cart.isMock ? (
        <p className="text-xs text-ink-soft">
          {freeDelivery ? "Your order ships free." : "We'll confirm the delivery charge with your order on WhatsApp."}
        </p>
      ) : isBusy ? (
        <p className="text-xs text-ink-soft">Getting delivery rates…</p>
      ) : options.length ? (
        <ul className="space-y-1" aria-label="Delivery options">
          {options.map((o) => (
            <li key={o.handle} className="flex justify-between text-xs">
              <span className="text-ink-soft">{o.title}</span>
              <span className="font-semibold">
                {freeDelivery ? (
                  <>
                    <s className="mr-1.5 font-normal text-ink-soft">{formatMoney(o.cost)}</s>
                    <span className="text-green">Free</span>
                  </>
                ) : Number(o.cost.amount) === 0 ? (
                  <span className="text-green">Free</span>
                ) : (
                  formatMoney(o.cost)
                )}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-brown">
          We couldn't find a delivery option for this PIN code. Message us on WhatsApp and we'll sort it out.
        </p>
      )}
    </div>
  );
}
