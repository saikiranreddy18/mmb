import type { ProductDetails } from "@/lib/commerce/types";
import { ContentValue } from "./ContentValue";
import { StatusBadge } from "./StatusBadge";
import type { ContentField } from "@/content/status";

/** Multi-line "Label: value" text (e.g. a nutrition panel) rendered as a small table. */
function FactTable({ field }: { field: ContentField }) {
  const lines = (field.value ?? "").split("\n").filter(Boolean);
  const [caption, ...rows] = lines[0]?.includes(":") ? ["", ...lines] : lines;
  const indent = /^(total sugars|added sugars|saturated fat|trans fat)/i;
  return (
    <div>
      {field.status !== "verified" && <StatusBadge status={field.status} />}
      <table className="mt-2 w-full max-w-sm text-sm">
        {caption && <caption className="mb-1 text-left text-xs text-ink-soft">{caption}</caption>}
        <tbody className="divide-y divide-line">
          {rows.map((r) => {
            const [label, ...rest] = r.split(":");
            return (
              <tr key={r}>
                <th scope="row" className={`py-1.5 text-left font-normal ${indent.test(label.trim()) ? "pl-4 text-ink-soft" : ""}`}>
                  {label.trim()}
                </th>
                <td className="py-1.5 text-right font-semibold tabular-nums">{rest.join(":").trim()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

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
            {details[key].value?.includes("\n") ? <FactTable field={details[key]} /> : <ContentValue field={details[key]} />}
          </dd>
        </div>
      ))}
    </dl>
  );
}
