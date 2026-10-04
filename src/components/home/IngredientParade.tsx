"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Pause, Play } from "lucide-react";

/**
 * The ingredient gang — walnut, pumpkin seed, almond, sunflower seed, black seed,
 * date, pistachio and cashew — walking in together, hand in hand.
 *
 * The supplied illustration is used unaltered. Each character is rigged from
 * windows onto that one image: a body layer and two leg layers (back / front)
 * measured from the artwork's alpha (hip line and feet positions).
 *
 * MOTION CONTRACT — Ingredient parade
 * Stride (0.8s, ease-in-out, infinite): back and front legs swing from the hip
 *   in opposite phase (−18° ↔ +14°); the whole character bobs up twice per stride
 *   (−3.5%) and leans ±1.5° with each step. Neighbours are offset by 0.05s.
 * Travel: the line walks left → right and loops, starting already on screen; speed
 *   matched to stride length so feet don't slide (42s desktop / 24s mobile, linear).
 * Pauses off-screen; Pause/Play button always available (WCAG 2.2.2).
 * Reduced motion: no stride, no travel — the line stands still, centred.
 */

const SRC = "/assets/mascot/ingredient-parade.webp";
const IMG_W = 2000;
const TOP = 92; // first painted row of the artwork
const BOTTOM = 582; // just below the shoes

type Rig = {
  name: string;
  body: [number, number]; // x range of the body window
  hip: number; // y where legs begin
  back: [number, number]; // x range of the back leg window
  front: [number, number]; // x range of the front leg window
};

// Measured from the supplied artwork (alpha coverage per column / row).
const RIGS: Rig[] = [
  { name: "walnut", body: [10, 349], hip: 468, back: [96, 208], front: [208, 339] },
  { name: "pumpkin seed", body: [349, 599], hip: 450, back: [393, 492], front: [492, 604] },
  { name: "almond", body: [599, 839], hip: 459, back: [624, 730], front: [730, 844] },
  { name: "sunflower seed", body: [839, 1056], hip: 458, back: [868, 967], front: [967, 1061] },
  { name: "black seed", body: [1056, 1215], hip: 484, back: [1079, 1165], front: [1165, 1258] },
  { name: "date", body: [1215, 1453], hip: 466, back: [1269, 1369], front: [1369, 1458] },
  { name: "pistachio", body: [1453, 1697], hip: 453, back: [1502, 1604], front: [1604, 1702] },
  { name: "cashew", body: [1697, 1990], hip: 465, back: [1748, 1854], front: [1854, 1974] },
];

const px = (n: number) => `calc(${n} * var(--s))`;

/** A window onto the artwork: image-space box (x0..x1, y0..y1) placed inside a character box starting at cx. */
function windowStyle(x0: number, x1: number, y0: number, y1: number, cx: number): CSSProperties {
  return {
    left: px(x0 - cx),
    top: px(y0 - TOP),
    width: px(x1 - x0),
    height: px(y1 - y0),
    backgroundImage: `url(${SRC})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: `${px(IMG_W)} auto`,
    backgroundPosition: `calc(${-x0} * var(--s)) calc(${-y0} * var(--s))`,
  };
}

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
  const lineW = RIGS[RIGS.length - 1].body[1] - RIGS[0].body[0];

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
        <div className="parade-track relative" style={{ width: px(lineW), height: px(BOTTOM - TOP) }}>
          {RIGS.map((r, i) => {
            const cx0 = Math.min(r.body[0], r.back[0]);
            const cx1 = Math.max(r.body[1], r.front[1]);
            return (
              <div
                key={r.name}
                className="parade-char absolute top-0"
                style={
                  {
                    left: px(cx0 - RIGS[0].body[0]),
                    width: px(cx1 - cx0),
                    height: px(BOTTOM - TOP),
                    "--d": `${-i * 0.05}s`,
                  } as CSSProperties
                }
              >
                <div
                  className="parade-leg parade-leg--back absolute"
                  style={{ ...windowStyle(r.back[0], r.back[1], r.hip - 6, BOTTOM, cx0), transformOrigin: "85% 0" }}
                />
                <div
                  className="parade-leg parade-leg--front absolute"
                  style={{ ...windowStyle(r.front[0], r.front[1], r.hip - 6, BOTTOM, cx0), transformOrigin: "15% 0" }}
                />
                <div className="absolute" style={windowStyle(r.body[0], r.body[1], TOP, r.hip + 24, cx0)} />
              </div>
            );
          })}
        </div>
        {/* the ground they walk on */}
        <div aria-hidden className="h-px w-full bg-line" />
      </div>

      <style>{`
        .parade { --h: 112px; --s: calc(var(--h) / ${BOTTOM - TOP}); --stride: 0.8s; }
        @media (min-width: 768px) { .parade { --h: 150px; } }

        /* negative delay: the gang is already on screen when you arrive */
        .parade-track { animation: mb-travel 42s linear -17s infinite; animation-play-state: paused; }
        @media (max-width: 767px) { .parade-track { animation-duration: 24s; animation-delay: -10s; } }

        .parade-char {
          transform-origin: 50% 100%;
          animation: mb-bob var(--stride) ease-in-out infinite;
          animation-delay: var(--d);
          animation-play-state: paused;
        }
        .parade-leg {
          animation: mb-leg var(--stride) ease-in-out infinite;
          animation-play-state: paused;
        }
        .parade-leg--back { animation-delay: var(--d); }
        .parade-leg--front { animation-delay: calc(var(--d) - var(--stride) / 2); }

        .parade[data-running="true"] .parade-track,
        .parade[data-running="true"] .parade-char,
        .parade[data-running="true"] .parade-leg { animation-play-state: running; }

        @keyframes mb-leg {
          0%, 100% { transform: rotate(-18deg); }
          50%      { transform: rotate(14deg); }
        }
        @keyframes mb-bob {
          0%, 50%, 100% { transform: translateY(0) rotate(0deg); }
          25%           { transform: translateY(-3.5%) rotate(-1.5deg); }
          75%           { transform: translateY(-3.5%) rotate(1.5deg); }
        }
        @keyframes mb-travel {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100cqw); }
        }
        @media (prefers-reduced-motion: reduce) {
          .parade-track, .parade-char, .parade-leg { animation: none !important; }
          .parade-track { margin-inline: auto; }
          .parade-control { display: none; }
        }
      `}</style>
    </section>
  );
}
