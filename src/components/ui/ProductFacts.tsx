import type { ProductDetails } from "@/lib/commerce/types";
import { ContentValue } from "./ContentValue";

const LABELS: { key: keyof ProductDetails; label: string }[] = [
  { key: "netQuantity", label: "Net quantity" },
  { key: "claims", label: "On the pack" },
  { key: "ingredients", label: "Ingredients" },
  { key: "nutrition", label: "Nutrition" },
  { key: "allergens", label: "Allergens" },
  { key: "storage", label: "Storage" },
  { key: "shelfLife", label: "Shelf life" },
  { key: "fssai", label: "FSSAI" },
];

/** All product facts visible at once — nothing essential behind interactions. */
export function ProductFacts({
  details,
  only,
  className = "",
}: {
  details: ProductDetails;
  only?: (keyof ProductDetails)[];
  className?: string;
}) {
  const rows = only ? LABELS.filter((r) => only.includes(r.key)) : LABELS;
  return (
    <dl className={`divide-y divide-line border-y border-line ${className}`}>
      {rows.map(({ key, label }) => (
        <div key={key} className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
          <dt className="eyebrow pt-1 text-ink-soft">{label}</dt>
          <dd className="leading-relaxed text-ink">
            <ContentValue field={details[key]} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
