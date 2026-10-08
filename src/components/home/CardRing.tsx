"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { SOCIAL_CARDS } from "@/content/social-cards";
import { MQ } from "@/lib/motion/gsap";

const COUNT = 7;
const STEP = 360 / COUNT; // 51.4286°
const RADIUS = 700; // px at full size; scaled down on narrow screens
const SPEED = 12; // degrees per second

/**
 * Everyday bites — 7 social cards on one horizontal 3D ring.
 *
 * MOTION CONTRACT — Card ring
 * One cylinder of 7 cards, 51.43° apart, turning continuously at 12°/s
 * (requestAnimationFrame, frame-rate independent, never resets). For card i:
 *   angle = i·STEP + phase · x = R·sin(angle) · z = R·(1 − cos(angle))
 *   transform: translate3d(x, 0, z) rotateY(−angle)
 * The camera sits inside the ring (CSS perspective ≈ 1.55·R): the card at
 * angle 0 is farthest and dimmest, its neighbours swing past closer and larger,
 * and cards that would reach the camera fade out and hide. Only transform and
 * opacity change per frame (GPU-friendly). Runs only while on screen; Pause/Play
 * always available (WCAG 2.2.2). Reduced motion: no ring, a swipeable row.
 */
export function CardRing() {
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const shades = useRef<(HTMLSpanElement | null)[]>([]);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const pausedRef = useRef(false);
  pausedRef.current = paused;

  useEffect(() => setReduced(!window.matchMedia(MQ.motion).matches), []);

  useEffect(() => {
    const el = stage.current;
    if (!el || reduced) return;
    let raf = 0;
    let last = 0;
    let phase = 0;
    let visible = false;
    let R = RADIUS;
    let P = RADIUS * 1.55;

    const size = () => {
      R = Math.min(RADIUS, el.clientWidth * 0.62);
      P = R * 1.55;
      el.style.perspective = `${P}px`;
    };

    const place = () => {
      const hideZ = P * 0.62; // beyond this a card is too close to / behind the camera
      for (let i = 0; i < COUNT; i++) {
        const card = cards.current[i];
        if (!card) continue;
        const angle = i * STEP + phase;
        const r = (angle * Math.PI) / 180;
        const x = R * Math.sin(r);
        const z = R * (1 - Math.cos(r));
        card.style.transform = `translate3d(${x.toFixed(2)}px, 0, ${z.toFixed(2)}px) rotateY(${(-angle).toFixed(3)}deg)`;
        const fade = Math.min(1, Math.max(0, (hideZ - z) / (R * 0.22)));
        card.style.opacity = fade.toFixed(3);
        card.style.visibility = fade <= 0 ? "hidden" : "visible";
        const shade = shades.current[i];
        if (shade) shade.style.opacity = (0.28 * (1 - Math.min(1, z / hideZ))).toFixed(3); // farther = dimmer
      }
    };

    const tick = (t: number) => {
      if (last) {
        const dt = Math.min(0.1, (t - last) / 1000);
        if (!pausedRef.current) phase = (phase + SPEED * dt) % 360; // wraps seamlessly: angles are periodic
      }
      last = t;
      place();
      raf = visible ? requestAnimationFrame(tick) : 0;
    };

    size();
    place();
    const ro = new ResizeObserver(() => {
      size();
      place();
    });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [reduced]);

  return (
    <section aria-labelledby="everyday-title" className="overflow-hidden bg-bg py-20 md:py-28">
      <div className="shell flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-6 text-brown">Everyday bites</p>
          <h2 id="everyday-title" className="display text-[clamp(2.5rem,6vw,4.75rem)] text-green">
            Made for your <span className="editorial block text-brown">every day.</span>
          </h2>
        </div>
        {!reduced && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-green/25 px-4 text-xs font-bold uppercase tracking-[0.14em] text-green transition-colors hover:border-green md:self-auto"
          >
            {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
            {paused ? "Play" : "Pause"}
            <span className="sr-only"> the card carousel</span>
          </button>
        )}
      </div>

      {reduced ? (
        <ul className="shell mt-12 flex snap-x gap-4 overflow-x-auto pb-4 [scrollbar-width:none]">
          {SOCIAL_CARDS.map((c) => (
            <li key={c.src} className="relative aspect-[9/16] w-56 shrink-0 snap-center overflow-hidden rounded-[1.5rem] bg-cream shadow-lg">
              <Image src={c.src} alt={c.alt} fill sizes="14rem" className="object-cover" />
            </li>
          ))}
        </ul>
      ) : (
        <div ref={stage} className="ring-stage relative mt-6 h-[clamp(440px,72vh,680px)] md:mt-10">
          <ul className="absolute inset-0 [transform-style:preserve-3d]">
            {SOCIAL_CARDS.slice(0, COUNT).map((c, i) => (
              <li
                key={c.src}
                ref={(n) => {
                  cards.current[i] = n;
                }}
                className="ring-card absolute left-1/2 top-1/2 overflow-hidden rounded-[1.25rem] bg-cream shadow-[0_24px_60px_-20px_rgba(40,30,20,0.45)] [backface-visibility:hidden] [will-change:transform,opacity]"
              >
                <Image src={c.src} alt={c.alt} fill sizes="(min-width:768px) 15rem, 10rem" className="object-cover" />
                <span
                  aria-hidden
                  ref={(n) => {
                    shades.current[i] = n;
                  }}
                  className="pointer-events-none absolute inset-0 bg-ink"
                  style={{ opacity: 0 }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      <style>{`
        .ring-stage { perspective-origin: 50% 50%; }
        .ring-card { --w: clamp(150px, 26vw, 240px); width: var(--w); height: calc(var(--w) * 16 / 9);
          margin-left: calc(var(--w) / -2); margin-top: calc(var(--w) * -8 / 9); }
      `}</style>
    </section>
  );
}
