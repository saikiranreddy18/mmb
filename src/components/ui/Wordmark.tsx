import "@fontsource/baloo-2/800.css";

/**
 * Wordmark modelled on the supplied Mumma's Bite logo: stacked, rounded heavy
 * lettering — "mumma's" in deep brown, "bite" in orange, both softly graded.
 * Interim CSS recreation; swap for the original logo file (SVG/PNG) once supplied.
 */
export function Wordmark({ className = "", onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <span
      className={`mb-wordmark inline-flex flex-col items-center leading-[0.78] ${onDark ? "mb-wordmark--dark" : ""} ${className}`}
    >
      <span className="mb-wordmark__top">mumma&apos;s</span>
      <span className="mb-wordmark__bottom">bite</span>
    </span>
  );
}
