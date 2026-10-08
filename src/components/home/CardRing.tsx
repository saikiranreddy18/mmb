"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { SOCIAL_CARDS } from "@/content/social-cards";
import { MQ } from "@/lib/motion/gsap";

/** Each card appears three times around the (large) ring so the arc is full edge to edge. */
const SLOTS = [...SOCIAL_CARDS, ...SOCIAL_CARDS, ...SOCIAL_CARDS];
const COUNT = SLOTS.length; // 21 → 17.14° apart
const STEP = 360 / COUNT;
const SPEED = 8; // degrees per second
const VISIBLE = 88; // cards beyond ±this angle (the back of the ring) are hidden

/**
 * Everyday bites — the social cards on one 3D cylinder, seen from the front.
 *
 * MOTION CONTRACT — Card arc
 * 21 slots (the 7 cards three times) evenly around one large ring (R ≥ 0.62 ×
 * page width, so the arc spans the full page), turning continuously at
 * 8°/s (requestAnimationFrame, frame-rate independent, never resets). For slot i:
 *   angle = i·STEP + phase · x = R·sin(angle) · z = R·(cos(angle) − 1)
 *   transform: translate3d(x, 0, z) rotateY(angle)
 * The front card is nearest and largest; the others curve away, smaller and
 * angled inward, ~7 in view at once (like a cover-flow arc). Cards fade out
 * past ±75° and hide past ±88°; farther cards are slightly dimmer. Only
 * transform/opacity change per frame. Runs only while on screen; Pause/Play
 * always available (WCAG 2.2.2). Reduced motion: a swipeable row.
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
    let R = 600;

    const size = () => {
      const w = el.querySelector<HTMLElement>(".ring-card")?.offsetWidth ?? 220;
      // Big ring: wide enough to span the whole page, and never so tight that cards overlap
      // (chord between neighbours ≥ 1.15 × card width). The arc runs off both page edges.
      R = Math.max(el.clientWidth * 0.62, (w * 1.15) / (2 * Math.sin((STEP * Math.PI) / 360)));
      el.style.perspective = `${Math.round(R * 2.2)}px`;
    };

    const place = () => {
      for (let i = 0; i < COUNT; i++) {
        const card = cards.current[i];
        if (!card) continue;
        let angle = (i * STEP + phase) % 360;
        if (angle > 180) angle -= 360;
        const r = (angle * Math.PI) / 180;
        const x = R * Math.sin(r);
        const z = R * (Math.cos(r) - 1);
        card.style.transform = `translate3d(${x.toFixed(2)}px, 0, ${z.toFixed(2)}px) rotateY(${angle.toFixed(3)}deg)`;
        const a = Math.abs(angle);
        const fade = a <= 75 ? 1 : Math.max(0, (VISIBLE - a) / (VISIBLE - 75));
        card.style.opacity = fade.toFixed(3);
        card.style.visibility = fade <= 0 ? "hidden" : "visible";
        const shade = shades.current[i];
        if (shade) shade.style.opacity = (0.32 * Math.min(1, a / 80)).toFixed(3); // farther = dimmer
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
          <div aria-hidden className="ring-floor pointer-events-none absolute left-1/2 top-1/2" />
          <ul className="absolute inset-0 [transform-style:preserve-3d]">
            {SLOTS.map((c, i) => (
              <li
                key={`${c.src}-${i}`}
                aria-hidden={i >= SOCIAL_CARDS.length || undefined}
                ref={(n) => {
                  cards.current[i] = n;
                }}
                className="ring-card absolute left-1/2 top-1/2 overflow-hidden rounded-[1.25rem] bg-cream shadow-[0_24px_60px_-20px_rgba(40,30,20,0.45)] [backface-visibility:hidden] [will-change:transform,opacity]"
              >
                <Image src={c.src} alt={i < SOCIAL_CARDS.length ? c.alt : ""} fill sizes="(min-width:768px) 15rem, 10rem" className="object-cover" />
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
        .ring-stage { perspective-origin: 50% 42%; }
        .ring-floor { width: 100vw; height: 120px; translate: -50% calc(var(--fh, 220px));
          border-radius: 50%; background: radial-gradient(closest-side, rgba(47,74,50,0.18), rgba(47,74,50,0.06) 60%, transparent);
          box-shadow: inset 0 0 0 1px rgba(199,160,74,0.25); }
        @media (max-width: 767px) { .ring-floor { --fh: 150px; height: 70px; } }
        .ring-card { --w: clamp(150px, 26vw, 240px); width: var(--w); height: calc(var(--w) * 16 / 9);
          margin-left: calc(var(--w) / -2); margin-top: calc(var(--w) * -8 / 9); }
      `}</style>
    </section>
  );
}
