/**
 * The supplied Mumma's Bite logo (vector, transparent background), used unaltered.
 * Size it with a width or height class. On dark surfaces it sits on a cream
 * badge: the vector's texture is cut-through, and the deep-brown "mumma's"
 * needs a light ground to read.
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
  return <span className={`inline-flex rounded-2xl bg-cream px-4 py-3 ${className}`}>{img}</span>;
}
