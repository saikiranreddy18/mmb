"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, Pause, Play, RotateCcw } from "lucide-react";
import { IntroReveal } from "@/components/motion/IntroReveal";
import { ButtonLink } from "@/components/ui/Button";
import { assets } from "@/content/assets";
import { brand } from "@/content/brand";
import { MQ, gsap, useIsoLayoutEffect } from "@/lib/motion/gsap";

type FilmState = "idle" | "playing" | "paused" | "ended";

/**
 * WORLD 01 — Enter Mumma's Bite.
 *
 * MOTION CONTRACT — Hero film
 * Element: supplied 10s slow-motion film — dates, nuts, then seeds fill a wooden bowl.
 * Initial: the final frame (full bowl) renders immediately as an optimised, priority
 *          image, so the hero is complete before any video loads (good LCP, no blank box).
 * Trigger: plays ONCE after load, muted, inline; then rests on the full bowl. No loop —
 *          a calm hero, not a moving wallpaper. Pause / Replay control always available.
 * Mobile: same film (1280×720, ~1 MB WebM / MP4 fallback), framed 5:4.
 * Reduced motion: never autoplays; shows the still frame with a Play control.
 * Also: typography line reveal + frame unmask (IntroReveal), and a subtle desktop-only
 *       parallax on the frame (yPercent 0 → -6, scrubbed). No parallax on mobile.
 */
export function Hero() {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [film, setFilm] = useState<FilmState>("idle");

  useIsoLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
      gsap.to(el, {
        yPercent: -6,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top+=80", end: "bottom top", scrub: 0.6 },
      });
    });
    return () => mm.revert();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !window.matchMedia(MQ.motion).matches) return;
    // Let the entrance reveal land first, then start the film.
    const t = window.setTimeout(() => v.play().catch(() => {}), 600);
    return () => window.clearTimeout(t);
  }, []);

  const control = () => {
    const v = videoRef.current;
    if (!v) return;
    if (film === "playing") v.pause();
    else {
      if (film === "ended") v.currentTime = 0;
      v.play().catch(() => {});
    }
  };

  const showVideo = film !== "idle";
  const label =
    film === "playing" ? "Pause" : film === "ended" ? "Replay" : "Play";
  const Icon = film === "playing" ? Pause : film === "ended" ? RotateCcw : Play;

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-24 md:pt-28">
      <IntroReveal className="shell grid items-center gap-10 pb-16 lg:min-h-[calc(100svh-7rem)] lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:pb-14">
        <div className="relative z-10 max-w-xl">
          <p data-hero-reveal="fade" className="eyebrow mb-6 flex items-center gap-3 text-brown md:mb-8">
            <span aria-hidden className="h-px w-8 bg-gold" />
            {brand.name}
          </p>
          <h1 id="hero-title" className="text-green">
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-hero-reveal="line" className="display block whitespace-nowrap text-[clamp(2.9rem,6.4vw,6rem)]">
                Made with
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <span data-hero-reveal="line" className="editorial block whitespace-nowrap text-[clamp(2.9rem,5.6vw,5.4rem)] leading-[0.95] text-brown">
                a mother&apos;s love.
              </span>
            </span>
          </h1>
          <p data-hero-reveal="fade" className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft md:mt-8 md:text-xl">
            {brand.supporting.value}
          </p>
          <div data-hero-reveal="fade" className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-10">
            <ButtonLink href="/shop">Shop Mumma&apos;s Bite</ButtonLink>
            <ButtonLink href="/our-story" variant="secondary">
              Our story
            </ButtonLink>
          </div>
        </div>

        <div ref={frameRef} className="relative">
          {/* Elliptical arch — the "doorway home" motif, widened for a landscape film. */}
          <div
            data-hero-reveal="clip"
            className="relative aspect-[5/4] overflow-hidden rounded-b-[1.75rem] rounded-t-[50%_28%] bg-cream md:rounded-b-[2.5rem]"
          >
            <Image
              src={assets.heroPoster.src!}
              alt={assets.heroPoster.alt}
              fill
              priority
              sizes="(min-width:1024px) 55vw, 100vw"
              className="object-cover"
            />
            <video
              ref={videoRef}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-brand ${
                showVideo ? "opacity-100" : "opacity-0"
              }`}
              muted
              playsInline
              preload="metadata"
              aria-hidden
              tabIndex={-1}
              onPlay={() => setFilm("playing")}
              onPause={(e) => setFilm(e.currentTarget.ended ? "ended" : "paused")}
              onEnded={() => setFilm("ended")}
            >
              <source src="/assets/hero.webm" type="video/webm" />
              <source src="/assets/hero.mp4" type="video/mp4" />
            </video>
            <button
              onClick={control}
              className="on-dark absolute bottom-4 left-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-green-900/70 px-4 text-xs font-bold uppercase tracking-[0.14em] text-cream backdrop-blur transition-colors hover:bg-green-900 md:bottom-6 md:left-6"
              aria-label={`${label} the hero film: dates, nuts and seeds falling into a wooden bowl`}
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </button>
          </div>

          {/* Mumma herself — a static brand moment, never animated beyond the entrance. */}
          <div
            data-hero-reveal="fade"
            className="absolute -bottom-7 right-3 aspect-square w-24 overflow-hidden rounded-full border-4 border-bg bg-cream shadow-[0_12px_30px_-12px_rgba(31,42,32,0.45)] md:w-32 lg:-right-6 lg:w-40"
          >
            <Image
              src={assets.mascotLaughing.src!}
              alt={assets.mascotLaughing.alt}
              fill
              sizes="(min-width:1024px) 10rem, 8rem"
              className="translate-y-[6%] scale-110 object-cover"
            />
          </div>
          <span aria-hidden className="absolute right-3 top-[18%] size-5 md:size-6 rounded-full bg-gold/80 lg:-right-5 lg:size-8" />
        </div>
      </IntroReveal>

      <a
        href="#from-home"
        className="eyebrow absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full px-3 py-2 text-ink-soft transition-colors hover:text-green lg:inline-flex"
      >
        It started at home <ArrowDown className="size-3.5" aria-hidden />
      </a>
    </section>
  );
}
