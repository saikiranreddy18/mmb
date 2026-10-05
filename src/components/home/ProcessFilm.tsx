"use client";

import { useEffect, useRef, useState } from "react";
import { assets } from "@/content/assets";
import { MQ } from "@/lib/motion/gsap";

/** Beats of the supplied process film, keyed to where they start (seconds). */
const steps = [
  { at: 0, title: "Gathered", text: "Dates, nuts and seeds come together in one bowl." },
  { at: 3.2, title: "Pressed", text: "The mix is pressed into a dense, chewy bar." },
  { at: 5.6, title: "Packed", text: "Each bar is wrapped and packed, ready to travel." },
];

/**
 * How it's made — the process film runs in the background as the section itself.
 *
 * MOTION CONTRACT — Process film
 * Element: 10s muted loop, full-bleed section background (1280×720 desktop,
 *   854×480 phones). The whole file is fetched ~1200px before the section and
 *   played from memory, so it never buffers mid-loop; plays continuously (no
 *   pause control, per brand) and only decodes while on screen.
 * Captions: Gathered → Pressed → Packed sit on the film and crossfade in sync
 *   with playback (400ms opacity + 8px rise).
 * Reduced motion: no autoplay — poster frame, all three steps listed.
 */
export function ProcessFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const allow = window.matchMedia(MQ.motion).matches;
    setReduced(!allow);
    if (!allow) return;

    // Download the whole (small) loop before the section arrives, then play it
    // from memory — no mid-loop buffering stalls on slow connections.
    const small = window.matchMedia("(max-width: 767px)").matches;
    const webm = video.canPlayType('video/webm; codecs="vp9"') !== "";
    const file = `/assets/process${small ? "-480" : ""}.${webm ? "webm" : "mp4"}`;
    let url: string | null = null;
    let ready = false;
    let onScreen = false;
    let started = false;
    const ctrl = new AbortController();
    const sync = () => {
      if (ready && onScreen) video.play().catch(() => {});
      else video.pause();
    };
    const load = () => {
      if (started) return;
      started = true;
      fetch(file, { signal: ctrl.signal })
        .then((r) => (r.ok ? r.blob() : Promise.reject()))
        .then((b) => (url = URL.createObjectURL(b)))
        .catch(() => (ctrl.signal.aborted ? null : file)) // fall back to streaming
        .then((src) => {
          if (!src) return;
          video.src = src;
          video.addEventListener("canplay", () => ((ready = true), sync()), { once: true });
          video.load();
        });
    };

    const near = new IntersectionObserver(([e]) => e.isIntersecting && load(), { rootMargin: "1200px 0px" });
    const seen = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        sync();
      },
      { threshold: 0.15 },
    );
    near.observe(video);
    seen.observe(video);
    return () => {
      ctrl.abort();
      near.disconnect();
      seen.disconnect();
      if (url) URL.revokeObjectURL(url);
    };
  }, []);

  const onTime = () => {
    const t = videoRef.current?.currentTime ?? 0;
    let i = 0;
    steps.forEach((s, idx) => {
      if (t >= s.at) i = idx;
    });
    if (i !== active) setActive(i);
  };

  return (
    <section aria-labelledby="process-title" className="relative isolate overflow-hidden">
      <div className="relative h-[78svh] min-h-[520px] md:h-[88svh]">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster={assets.processPoster.src ?? undefined}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          tabIndex={-1}
          onTimeUpdate={onTime}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,46,32,0.72)_0%,rgba(28,46,32,0.2)_32%,rgba(28,46,32,0)_50%,rgba(28,46,32,0.8)_100%)]"
        />

        <div className="on-dark relative flex h-full flex-col justify-between py-10 text-cream md:py-14">
          <div className="shell">
            <p className="eyebrow mb-4 text-gold">How it&apos;s made</p>
            <h2 id="process-title" className="display text-[clamp(2.5rem,6vw,4.75rem)]">
              From dates <span className="editorial text-gold">to bar.</span>
            </h2>
          </div>

          <div className="shell">
            {reduced ? (
              <ol className="grid gap-4 sm:grid-cols-3">
                {steps.map((s, i) => (
                  <li key={s.title}>
                    <p className="text-xs font-bold tabular-nums text-gold">{String(i + 1).padStart(2, "0")}</p>
                    <p className="text-2xl font-extrabold uppercase tracking-tight">{s.title}</p>
                    <p className="text-sm text-cream/85">{s.text}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div className="relative min-h-[7.5rem] w-full max-w-md" aria-live="polite">
                  {steps.map((s, i) => (
                    <div
                      key={s.title}
                      className={`absolute inset-x-0 bottom-0 transition-[opacity,transform] duration-500 ease-brand ${
                        i === active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
                      }`}
                      aria-hidden={i !== active}
                    >
                      <p className="text-xs font-bold tabular-nums text-gold">
                        {String(i + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                      </p>
                      <p className="mt-1 text-[clamp(2rem,4vw,3rem)] font-extrabold uppercase leading-none tracking-tight">
                        {s.title}
                      </p>
                      <p className="mt-2 text-base text-cream/85">{s.text}</p>
                    </div>
                  ))}
                </div>
                {/* progress ticks */}
                <div aria-hidden className="flex gap-2">
                  {steps.map((s, i) => (
                    <span
                      key={s.title}
                      className={`h-1 w-10 rounded-full transition-colors duration-500 ${i === active ? "bg-gold" : "bg-cream/30"}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
