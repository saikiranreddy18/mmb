import { type ContentStatus, statusLabel } from "@/content/status";

const styles: Record<ContentStatus, string> = {
  verified: "border-green/30 text-green",
  unverified: "border-gold-ink/40 text-gold-ink",
  unknown: "border-brown/35 text-brown",
  placeholder: "border-brown/35 text-brown",
  assumption: "border-gold-ink/40 text-gold-ink",
};

export function StatusBadge({ status, label }: { status: ContentStatus; label?: string }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 align-middle text-[0.62rem] font-bold uppercase tracking-[0.14em] ${styles[status]}`}
    >
      {label ?? statusLabel[status]}
    </span>
  );
}

export function MockBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-brown px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-cream">
      Mock data
    </span>
  );
}
