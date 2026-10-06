import { BadgeCheck, Mail, ShieldCheck, Truck } from "lucide-react";
import { SUPPORT_EMAIL, whatsappLink } from "@/content/contact";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { FREE_DELIVERY_MIN } from "@/lib/commerce/offers";

const FSSAI_LICENCE = "20126052001147";
const freeDeliveryFrom = FREE_DELIVERY_MIN;

/** Payment methods offered at checkout (Razorpay). */
const PAYMENT_METHODS = ["UPI", "Visa", "Mastercard", "RuPay", "Net banking"];

function PaymentMethods() {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Accepted payment methods">
      {PAYMENT_METHODS.map((m) => (
        <li key={m} className="rounded-md border border-line bg-white px-2 py-0.5 text-[0.7rem] font-bold text-ink-soft">
          {m}
        </li>
      ))}
    </ul>
  );
}

/**
 * Reassurance next to the buy buttons: how payment is secured, who licenses
 * the food, where it ships and how to reach a person. Every line is a fact the
 * store actually has in place (Razorpay checkout, FSSAI licence, Shopify
 * shipping rates, WhatsApp support).
 */
export function TrustBadges({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="space-y-2">
        <p className="flex items-center justify-center gap-1.5 text-xs text-ink-soft">
          <ShieldCheck className="size-3.5 text-green" aria-hidden />
          Secure payment by Razorpay · UPI, cards, net banking
        </p>
      </div>
    );
  }

  const items = [
    {
      icon: ShieldCheck,
      title: "Secure checkout",
      body: "Encrypted payment by Razorpay",
    },
    {
      icon: BadgeCheck,
      title: "FSSAI licensed",
      body: `Lic. No. ${FSSAI_LICENCE}`,
    },
    {
      icon: Truck,
      title: "Ships across India",
      body: freeDeliveryFrom ? `Free delivery on ₹${freeDeliveryFrom.toLocaleString("en-IN")}+ orders` : "Tracked delivery",
    },
  ];

  return (
    <div className="mt-6 max-w-md space-y-4">
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {items.map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex items-start gap-2.5 rounded-2xl border border-line bg-white/60 p-3 sm:flex-col sm:gap-1.5">
            <Icon className="size-5 shrink-0 text-green" strokeWidth={1.75} aria-hidden />
            <span>
              <span className="block text-sm font-bold text-ink">{title}</span>
              <span className="block text-xs leading-snug text-ink-soft">{body}</span>
            </span>
          </li>
        ))}
      </ul>
      <PaymentMethods />
      <div className="flex flex-wrap items-center gap-x-5">
        <span className="text-sm text-ink-soft">Questions?</span>
        <a
          href={whatsappLink("Hi Mumma's Bite! I have a question before ordering.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-green underline-offset-4 hover:underline"
        >
          <WhatsAppIcon className="size-4" />
          WhatsApp us
        </a>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-green underline-offset-4 hover:underline"
        >
          <Mail className="size-4" aria-hidden />
          {SUPPORT_EMAIL}
        </a>
      </div>
    </div>
  );
}
