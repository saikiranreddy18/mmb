"use client";

import { useEffect, useRef, useState } from "react";

/** The brand's own words on packaging, pricing and quality. */
const QUOTES = [
  { lead: "We don't spend on fancy packaging.", rest: "So you never pay for it." },
  { lead: "Every rupee goes into what's inside.", rest: "Quality ingredients, nothing less." },
  { lead: "Simple pack. Food-grade safe.", rest: "Honest packing that protects every bite." },
  { lead: "Compare the price.", rest: "Then compare the quality and the quantity. Save the money." },
  { lead: "Started in a home kitchen.", rest: "On our way to becoming a global brand." },
];

const INTERVAL = 4500;

/**
 * "Simple pack. Honest price." — quotes slide in one after another.
 *
 * MOTION CONTRACT — Promise quotes
 * Every 4.5s the current line slides up and out while the next slides up and in
 * (700ms, ease-brand). Pauses on hover / keyboard focus and while off-screen.
 * Dots let visitors jump to any line. Reduced motion: no auto-advance — all
 * lines are listed.
 */
export function PromiseQuotes() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || paused || !visible) return;
    const t = window.setTimeout(() => setI((n) => (n + 1) % QUOTES.length), INTERVAL);
    return () => window.clearTimeout(t);
  }, [i, paused, visible, reduced]);

  return (
    <section
      ref={ref}
      aria-labelledby="promise-title"
      className="on-dark bg-green py-20 text-cream md:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="shell">
        <p className="eyebrow mb-4 text-gold">Why our pack is simple</p>
        <h2 id="promise-title" className="display text-[clamp(2.2rem,5vw,4rem)]">
          Simple pack. <span className="editorial text-gold">Honest price.</span>
        </h2>

        {reduced ? (
          <ul className="mt-12 grid gap-8 md:grid-cols-2">
            {QUOTES.map((q) => (
              <li key={q.lead}>
                <p className="text-2xl font-extrabold leading-tight">{q.lead}</p>
                <p className="mt-2 text-lg text-cream/75">{q.rest}</p>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <div className="relative mt-12 h-[11rem] overflow-hidden sm:h-[10rem] md:mt-16 md:h-[11rem]" aria-live="polite">
              {QUOTES.map((q, n) => {
                const state = n === i ? "now" : n === (i - 1 + QUOTES.length) % QUOTES.length ? "past" : "next";
                return (
                  <blockquote
                    key={q.lead}
                    aria-hidden={n !== i}
                    className={`absolute inset-0 transition-[transform,opacity] duration-700 ease-brand ${
                      state === "now"
                        ? "translate-y-0 opacity-100"
                        : state === "past"
                          ? "-translate-y-10 opacity-0"
                          : "translate-y-10 opacity-0"
                    }`}
                  >
                    <p className="text-[clamp(1.8rem,4.4vw,3.6rem)] font-extrabold leading-[1.05] tracking-tight">
                      <span className="text-gold">“</span>
                      {q.lead}
                    </p>
                    <p className="mt-3 max-w-2xl text-[clamp(1.3rem,2.4vw,2rem)]  leading-snug text-cream/80">
                      {q.rest}
                      <span className="text-gold">”</span>
                    </p>
                  </blockquote>
                );
              })}
            </div>
            <div className="mt-8 flex items-center gap-3">
              {QUOTES.map((q, n) => (
                <button
                  key={q.lead}
                  onClick={() => setI(n)}
                  aria-label={`Show: ${q.lead}`}
                  aria-current={n === i}
                  className="group grid h-11 w-8 place-items-center"
                >
                  <span
                    className={`h-1 rounded-full transition-all duration-500 ${n === i ? "w-8 bg-gold" : "w-4 bg-cream/30 group-hover:bg-cream/60"}`}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
