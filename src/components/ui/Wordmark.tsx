/**
 * Typographic wordmark. A supplied logo file has not been provided yet —
 * replace with the real logo asset when available (see content/assets.ts).
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-extrabold uppercase tracking-[0.2em] ${className}`}>
      Mummas<span className="editorial ml-1.5 tracking-normal normal-case">Bite</span>
    </span>
  );
}
