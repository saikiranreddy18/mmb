/**
 * Interim typographic wordmark echoing the supplied logo's colours
 * ("mumma's" in deep brown, "bite" in caramel). Swap for the real logo
 * file once it is supplied as an asset (see content/assets.ts).
 */
export function Wordmark({ className = "", onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <span className={`inline-flex items-baseline gap-[0.3em] font-extrabold lowercase tracking-[-0.02em] ${className}`}>
      <span className={onDark ? "text-cream" : "text-brown"}>mumma&apos;s</span>
      <span className="text-caramel">bite</span>
    </span>
  );
}
