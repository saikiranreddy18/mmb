"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { talkingIngredients } from "@/content/brand";
import { MQ } from "@/lib/motion/gsap";

const SPEAK_EVERY = 3200;
const SPEAK_FOR = 2600;

/** Which way a bubble leans so it never runs off the edge. */
const align = (i: number, n: number, cols: number) => {
  const col = i % cols;
  if (cols === n) return i < 2 ? "start" : i > n - 3 ? "end" : "center";
  return col === 0 ? "start" : col === cols - 1 ? "end" : "center";
};

/**
 * The ingredients, talking — the supplied 3D ingredient illustrations float in
 * a row and take turns saying what they bring to the bar.
 *
 * MOTION CONTRACT — Talking ingredients
 * Idle: each object bobs (4.2s, ease-in-out, ±6px with a slight 3D tilt),
 *   staggered so the row breathes rather than marching in step.
 * Talk: every 3.2s, in order, one object lifts (−10px, ×1.08) and "chatters"
 *   (tiny ±3° wobble) while a speech bubble pops from its head (220ms), held
 *   2.6s. One bubble at a time. Runs only while on screen.
 * Layout: one row of nine on desktop; 3 × 3 on phones.
 * Reduced motion: no bob/lift/wobble; bubbles still take turns, fading only.
 * Every line is also in a visually hidden list for screen readers.
 */
export function TalkingIngredients() {
  const ref = useRef<HTMLDivElement>(null);
  const [talking, setTalking] = useState(-1);
  const [visible, setVisible] = useState(false);
  const n = talkingIngredients.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) {
      setTalking(-1);
      return;
    }
    let next = 0;
    let hide = 0;
    const speak = () => {
      setTalking(next);
      next = (next + 1) % n;
      hide = window.setTimeout(() => setTalking(-1), SPEAK_FOR);
    };
    const first = window.setTimeout(speak, window.matchMedia(MQ.motion).matches ? 600 : 0);
    const timer = window.setInterval(speak, SPEAK_EVERY);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(hide);
      window.clearInterval(timer);
    };
  }, [visible, n]);

  return (
    <div ref={ref} className="shell">
      <ul className="sr-only">
        {talkingIngredients.map((t) => (
          <li key={t.id}>
            {t.name}: {t.line}
          </li>
        ))}
      </ul>
      <p className="eyebrow text-center text-brown">What goes in, in their own words</p>
      <div aria-hidden className="talk-row grid grid-cols-3 gap-x-4 gap-y-20 pt-24 md:grid-cols-9 md:gap-x-3 md:pt-24">
        {talkingIngredients.map((t, i) => (
          <div
            key={t.id}
            className="talk-item relative flex flex-col items-center"
            data-on={i === talking ? "true" : "false"}
            data-malign={align(i, n, 3)}
            data-dalign={align(i, n, n)}
            style={{ animationDelay: `${-(i * 0.47).toFixed(2)}s` }}
          >
            <div className="talk-bubble">
              <span className="block text-[0.65rem] font-bold uppercase tracking-[0.12em] text-gold-ink">{t.name}</span>
              {t.line}
            </div>
            <div className="talk-body relative h-20 w-full md:h-24">
              <Image
                src={t.art.src}
                alt=""
                width={t.art.width}
                height={t.art.height}
                sizes="(min-width:768px) 10vw, 28vw"
                className="talk-art h-full w-full object-contain"
              />
            </div>
            <span className="talk-shadow mt-2 block h-2 w-3/5 rounded-[50%] bg-ink/15 blur-[3px]" />
            <span className="mt-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink-soft">{t.name}</span>
          </div>
        ))}
      </div>

      <style>{`
        .talk-body { animation: mb-bob 4.2s ease-in-out infinite; animation-delay: inherit; transform-style: preserve-3d; perspective: 400px; }
        .talk-item { animation-delay: inherit; }
        .talk-art { filter: drop-shadow(0 10px 12px rgba(74,36,14,0.22)); transition: transform 300ms var(--mb-ease); }
        .talk-shadow { animation: mb-bob-shadow 4.2s ease-in-out infinite; animation-delay: inherit; }
        .talk-item[data-on="true"] .talk-art { transform: translateY(-10px) scale(1.08); animation: mb-chatter 0.36s ease-in-out 6; }
        @keyframes mb-bob { 0%,100% { transform: translateY(0) rotateY(-8deg) rotate(-2deg); } 50% { transform: translateY(-6px) rotateY(8deg) rotate(2deg); } }
        @keyframes mb-bob-shadow { 0%,100% { transform: scaleX(1); opacity: .9; } 50% { transform: scaleX(.82); opacity: .55; } }
        @keyframes mb-chatter { 0%,100% { rotate: 0deg; } 25% { rotate: -3deg; } 75% { rotate: 3deg; } }

        .talk-bubble { position: absolute; bottom: calc(100% + 0.5rem); z-index: 5; width: max-content; max-width: 10.5rem;
          padding: 0.5rem 0.75rem; border-radius: 1rem; background: var(--mb-bg); border: 1px solid var(--mb-line);
          color: var(--mb-ink); font-size: 0.75rem; line-height: 1.3; font-weight: 600; text-align: center;
          box-shadow: 0 10px 24px -12px rgba(60,40,20,0.35); pointer-events: none;
          opacity: 0; transform: scale(0.7) translateY(6px); transition: opacity 220ms ease, transform 220ms var(--mb-ease); }
        .talk-bubble::after { content: ""; position: absolute; bottom: -6px; width: 11px; height: 11px; rotate: 45deg;
          background: var(--mb-bg); border-right: 1px solid var(--mb-line); border-bottom: 1px solid var(--mb-line); }
        .talk-item[data-on="true"] .talk-bubble { opacity: 1; transform: none; }

        .talk-item[data-malign="center"] .talk-bubble { left: 50%; translate: -50% 0; transform-origin: 50% 100%; }
        .talk-item[data-malign="center"] .talk-bubble::after { left: 50%; translate: -50% 0; }
        .talk-item[data-malign="start"] .talk-bubble { left: 0; translate: none; transform-origin: 2rem 100%; }
        .talk-item[data-malign="start"] .talk-bubble::after { left: 2rem; translate: none; }
        .talk-item[data-malign="end"] .talk-bubble { right: 0; left: auto; translate: none; transform-origin: calc(100% - 2rem) 100%; }
        .talk-item[data-malign="end"] .talk-bubble::after { right: 2rem; left: auto; translate: none; }
        @media (min-width: 768px) {
          .talk-bubble { max-width: 13rem; font-size: 0.85rem; padding: 0.6rem 0.9rem; }
          .talk-item[data-dalign="center"] .talk-bubble { left: 50%; right: auto; translate: -50% 0; transform-origin: 50% 100%; }
          .talk-item[data-dalign="center"] .talk-bubble::after { left: 50%; right: auto; translate: -50% 0; }
          .talk-item[data-dalign="start"] .talk-bubble { left: 0; right: auto; translate: none; transform-origin: 2rem 100%; }
          .talk-item[data-dalign="start"] .talk-bubble::after { left: 2rem; right: auto; translate: none; }
          .talk-item[data-dalign="end"] .talk-bubble { right: 0; left: auto; translate: none; transform-origin: calc(100% - 2rem) 100%; }
          .talk-item[data-dalign="end"] .talk-bubble::after { right: 2rem; left: auto; translate: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .talk-body, .talk-shadow { animation: none; }
          .talk-item[data-on="true"] .talk-art { transform: none; animation: none; }
          .talk-bubble { transform: none; transition: opacity 220ms ease; }
        }
      `}</style>
    </div>
  );
}
