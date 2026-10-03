"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/**
 * The ingredient gang — walnut, pumpkin seed, almond, sunflower seed, black seed,
 * date, pistachio and cashew — walking in together, hand in hand.
 *
 * The supplied illustration is used unaltered: each character is a window onto
 * the same image (background-position), so every character can take its own step.
 *
 * MOTION CONTRACT — Ingredient parade
 * Walk: each character bobs (translateY −7%) and sways (±3°) on a 0.55s step,
 *       neighbours in opposite phase, so the line marches. Origin: feet.
 * Travel: the whole line walks left → right across the band and loops
 *         (32s desktop / 16s mobile, linear).
 * Pauses when scrolled off-screen; Pause/Play button always available (WCAG 2.2.2).
 * Reduced motion: no walking, no travel — the line stands still, centred.
 */

const SRC = "/assets/mascot/ingredient-parade.webp";
const IMG_W = 2000;
const TOP = 92; // first painted row
const BOTTOM = 582; // just below the shoes
const CUTS = [10, 349, 599, 839, 1056, 1215, 1453, 1697, 1990];

export function IngredientParade() {
  const ref = useRef<HTMLDivElement>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = visible && !userPaused;

  return (
    <section aria-labelledby="parade-title" className="overflow-hidden pb-6 pt-14 md:pb-10 md:pt-20">
      <div className="shell mb-6 flex items-end justify-between gap-4 md:mb-8">
        <div>
          <p className="eyebrow mb-3 text-brown">Dates · Nuts · Seeds</p>
          <h2 id="parade-title" className="text-2xl font-extrabold uppercase tracking-tight text-green md:text-3xl">
            All in it <span className="editorial normal-case text-brown">together.</span>
          </h2>
        </div>
        <button
          onClick={() => setUserPaused((p) => !p)}
          aria-pressed={userPaused}
          className="parade-control inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-green/25 px-4 text-xs font-bold uppercase tracking-[0.14em] text-green transition-colors hover:border-green"
        >
          {userPaused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
          {userPaused ? "Play" : "Pause"}
          <span className="sr-only"> the walking ingredients</span>
        </button>
      </div>

      <div
        ref={ref}
        className="parade relative [container-type:inline-size]"
        data-running={running ? "true" : "false"}
        role="img"
        aria-label="Illustrated walnut, pumpkin seed, almond, sunflower seed, black seed, date, pistachio and cashew characters walking along hand in hand."
      >
        <div className="parade-track flex w-max items-end">
          {CUTS.slice(0, -1).map((x0, i) => {
            const w = CUTS[i + 1] - x0;
            return (
              <div
                key={x0}
                className="parade-step"
                style={
                  {
                    "--w": w,
                    "--x": x0,
                    animationDelay: i % 2 ? "-0.275s" : "0s",
                  } as React.CSSProperties
                }
              />
            );
          })}
        </div>
        {/* the ground they walk on */}
        <div aria-hidden className="mx-auto h-px w-full bg-line" />
      </div>

      <style>{`
        .parade { --h: 112px; }
        @media (min-width: 768px) { .parade { --h: 150px; } }
        .parade-step {
          --s: calc(var(--h) / ${BOTTOM - TOP});
          width: calc(var(--w) * var(--s));
          height: var(--h);
          background-image: url(${SRC});
          background-repeat: no-repeat;
          background-size: calc(${IMG_W} * var(--s)) auto;
          background-position: calc(var(--x) * var(--s) * -1) calc(${TOP} * var(--s) * -1);
          transform-origin: 50% 100%;
          animation: mb-walk 0.55s ease-in-out infinite alternate;
          animation-play-state: paused;
        }
        .parade-track {
          animation: mb-travel 32s linear infinite;
          animation-play-state: paused;
        }
        @media (max-width: 767px) { .parade-track { animation-duration: 16s; } }
        .parade[data-running="true"] .parade-step,
        .parade[data-running="true"] .parade-track { animation-play-state: running; }
        @keyframes mb-walk {
          from { transform: translateY(0) rotate(-3deg); }
          to   { transform: translateY(-7%) rotate(3deg); }
        }
        @keyframes mb-travel {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100cqw); }
        }
        @media (prefers-reduced-motion: reduce) {
          .parade-step, .parade-track { animation: none !important; }
          .parade-track { margin-inline: auto; max-width: 100%; overflow: hidden; }
          .parade-control { display: none; }
        }
      `}</style>
    </section>
  );
}
