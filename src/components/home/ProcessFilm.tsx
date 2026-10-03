"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { assets } from "@/content/assets";
import { MQ } from "@/lib/motion/gsap";

/** Beats of the supplied process film, keyed to where they start (seconds). */
const steps = [
  { at: 0, title: "Gathered", text: "Dates, nuts and seeds come together in one bowl." },
  { at: 3.2, title: "Pressed", text: "The mix is pressed into a dense, chewy bar." },
  { at: 5.6, title: "Wrapped", text: "Each bar is sealed in its own wrapper." },
  { at: 8.0, title: "Packed", text: "Into the pouch, ready to travel." },
];

/**
 * WORLD 02 → 03 bridge: how the bar is made.
 *
 * MOTION CONTRACT — Process film
 * Element: 10s muted loop (1280×720; WebM ~0.6–0.9 MB, MP4 fallback), preload="none".
 * Trigger: plays only while ≥40% visible; pauses when scrolled away.
 * Steps highlight in sync with playback; clicking a step seeks to it.
 * Reduced motion: never autoplays — poster frame + Play button.
 * Always pausable (WCAG 2.2.2).
 */
export function ProcessFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState(0);
  const userPaused = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const allowAutoplay = window.matchMedia(MQ.motion).matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && allowAutoplay && !userPaused.current) {
          video.play().catch(() => {});
        } else if (!entry.isIntersecting) {
          video.pause();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  const onTime = () => {
    const t = videoRef.current?.currentTime ?? 0;
    let i = 0;
    steps.forEach((s, idx) => {
      if (t >= s.at) i = idx;
    });
    setActive(i);
  };

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  const seek = (i: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = steps[i].at + 0.05;
    setActive(i);
  };

  return (
    <section aria-labelledby="process-title" className="py-20 md:py-32">
      <div className="shell">
        <Reveal className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-6 text-brown">How it&apos;s made</p>
            <h2 id="process-title" className="display text-[clamp(2.5rem,6vw,4.75rem)] text-green">
              From dates <span className="editorial block text-brown">to bar.</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
            Four simple steps, from the bowl to the pouch in your hand.
          </p>
        </Reveal>

        <Reveal variant="clip" className="relative overflow-hidden rounded-[1.5rem] bg-cream md:rounded-[2.5rem]">
          <video
            ref={videoRef}
            className="block aspect-video w-full object-cover"
            poster={assets.processPoster.src ?? undefined}
            muted
            loop
            playsInline
            preload="none"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={onTime}
            aria-label="Process film: ingredients are gathered, pressed into a bar, wrapped and packed into a Mumma's Bite pouch."
          >
            <source src="/assets/process.webm" type="video/webm" />
            <source src="/assets/process.mp4" type="video/mp4" />
          </video>
          <button
            onClick={toggle}
            className="on-dark absolute bottom-4 left-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-green-900/80 px-4 text-xs font-bold uppercase tracking-[0.14em] text-cream backdrop-blur transition-colors hover:bg-green-900 md:bottom-6 md:left-6"
            aria-label={playing ? "Pause process film" : "Play process film"}
          >
            {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
            {playing ? "Pause" : "Play"}
          </button>
        </Reveal>

        <ol className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-10 lg:grid-cols-4 lg:gap-5">
          {steps.map((s, i) => (
            <li key={s.title}>
              <button
                onClick={() => seek(i)}
                aria-current={active === i ? "step" : undefined}
                className={`group flex h-full w-full flex-col items-start rounded-2xl border p-5 text-left transition-colors duration-300 ${
                  active === i ? "border-green bg-green text-cream" : "border-line hover:border-green/40"
                }`}
              >
                <span className={`text-xs font-bold tabular-nums ${active === i ? "text-gold" : "text-gold-ink"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-1 text-xl font-extrabold uppercase tracking-tight">{s.title}</span>
                <span className={`mt-1 text-sm leading-relaxed ${active === i ? "text-cream/80" : "text-ink-soft"}`}>
                  {s.text}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
