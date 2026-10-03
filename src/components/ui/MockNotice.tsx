import { Info } from "lucide-react";

export function MockNotice({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      role="note"
      className={`flex items-start gap-3 rounded-2xl border border-brown/20 bg-cream/70 px-4 py-3 text-sm leading-relaxed text-brown ${className}`}
    >
      <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}
