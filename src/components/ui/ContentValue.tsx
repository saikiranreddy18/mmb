import type { ContentField } from "@/content/status";
import { StatusBadge } from "./StatusBadge";

/**
 * Prints a content field honestly: verified values plainly, unverified values
 * with a flag, unknown values as CONTENT REQUIRED.
 */
export function ContentValue({ field, className = "" }: { field: ContentField; className?: string }) {
  if (field.status === "unknown" || !field.value) {
    return (
      <span className={`inline-flex items-center gap-2 text-ink-soft ${className}`}>
        <StatusBadge status="unknown" />
      </span>
    );
  }
  return (
    <span className={className}>
      {field.value}
      {field.status !== "verified" && (
        <>
          {" "}
          <StatusBadge status={field.status} />
        </>
      )}
    </span>
  );
}
