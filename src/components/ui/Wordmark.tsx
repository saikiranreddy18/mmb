/**
 * The supplied Mumma's Bite logo (vector, transparent background), used unaltered.
 * Size it with a width or height class. On dark surfaces there is no box —
 * a soft cream halo keeps the deep-brown "mumma's" legible.
 */
export function Wordmark({ className = "", onDark = false }: { className?: string; onDark?: boolean }) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- SVG logo, no optimisation needed
    <img
      src="/assets/logo/mummas-bite-logo.svg"
      alt="Mumma's Bite"
      width={1455}
      height={583}
      className={onDark ? "block h-full w-auto" : `block h-auto w-auto ${className}`}
      decoding="async"
    />
  );
  if (!onDark) return img;
  return (
    <span className={`inline-flex [filter:drop-shadow(0_0_0.6px_rgba(251,247,239,0.9))_drop-shadow(0_0_0.6px_rgba(251,247,239,0.9))] ${className}`}>
      {img}
    </span>
  );
}
