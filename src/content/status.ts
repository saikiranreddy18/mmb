/**
 * CONTENT CONTRACT
 *
 * Every piece of brand/product information is tagged so nothing unknown can
 * silently become a "fact" on the site.
 *
 *   verified     confirmed brand / product information
 *   unverified   supplied or suggested, needs confirmation
 *   unknown      not currently available (renders "CONTENT REQUIRED")
 *   placeholder  temporary layout content
 *   assumption   only if unavoidable, always visibly marked
 */
export type ContentStatus =
  | "verified"
  | "unverified"
  | "unknown"
  | "placeholder"
  | "assumption";

export type ContentField = {
  status: ContentStatus;
  value: string | null;
};

export const verified = (value: string): ContentField => ({ status: "verified", value });
export const unverified = (value: string): ContentField => ({ status: "unverified", value });
export const unknown = (): ContentField => ({ status: "unknown", value: null });

export const statusLabel: Record<ContentStatus, string> = {
  verified: "Verified",
  unverified: "Unverified",
  unknown: "Content required",
  placeholder: "Placeholder",
  assumption: "Assumption",
};
