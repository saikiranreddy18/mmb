import { ButtonLink } from "@/components/ui/Button";
import { BrandImage } from "@/components/ui/BrandImage";
import { assets } from "@/content/assets";
import { formatMoney } from "@/lib/commerce/money";
import type { Order } from "@/lib/commerce/types";

/** Renders real Shopify orders only. With none, a warm empty state — never fake history. */
export function OrderHistory({ orders }: { orders: Order[] }) {
  if (!orders.length) {
    return (
      <div className="flex flex-col items-center gap-6 py-6 text-center sm:flex-row sm:text-left">
        <div className="aspect-[4/5] w-28 shrink-0 overflow-hidden rounded-t-full">
          <BrandImage asset={assets.mascot} decorative sizes="7rem" className="!gap-1 !p-2 [&>span:last-child]:hidden" />
        </div>
        <div>
          <p className="text-2xl font-extrabold uppercase tracking-tight text-green">
            Your first Mummas Bite <span className="editorial normal-case text-brown">is waiting.</span>
          </p>
          <ButtonLink href="/shop" className="mt-5">
            Shop now
          </ButtonLink>
        </div>
      </div>
    );
  }
  return (
    <ul className="divide-y divide-line">
      {orders.map((o) => (
        <li key={o.id} className="flex flex-wrap items-baseline justify-between gap-2 py-4">
          <div>
            <p className="font-bold">{o.name}</p>
            <p className="text-sm text-ink-soft">
              {new Date(o.processedAt).toLocaleDateString("en-IN", { dateStyle: "medium" })} ·{" "}
              {o.lineItems.reduce((n, l) => n + l.quantity, 0)} items
              {o.fulfillmentStatus ? ` · ${o.fulfillmentStatus.toLowerCase()}` : ""}
            </p>
          </div>
          <p className="font-bold text-green">{formatMoney(o.totalPrice)}</p>
        </li>
      ))}
    </ul>
  );
}
