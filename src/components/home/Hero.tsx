"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowDown, Pause, Play, RotateCcw } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Wordmark } from "@/components/ui/Wordmark";
import { assets } from "@/content/assets";
import { brand } from "@/content/brand";
import { EASE, MQ, gsap, useIsoLayoutEffect } from "@/lib/motion/gsap";

type FilmState = "idle" | "playing" | "paused" | "ended";

/**
 * WORLD 01 — Enter Mumma's Bite. Brand intro that zooms into the hero.
 *
 * MOTION CONTRACT — Brand intro zoom (Lenis-smoothed, GSAP ScrollTrigger)
 * Stage A (load): the Mumma's Bite wordmark fills the screen; Mumma peeks over a
 *   small arched window that frames the hero film. Entrance: wordmark rises in
 *   (0.9s, power3.out), then Mumma fades in.
 * Scroll (pinned via CSS sticky, scrub 0.8, 280vh desktop / 220vh mobile):
 *   0 → 0.15  Mumma and the scroll cue fade away
 *   0 → 0.65  the window's clip-path opens from a small arch to full screen while
 *             the film scales 1.18 → 1 (the zoom into the hero); the wordmark
 *             scales 1 → 1.6 and fades out
 *   0.6 → 1   a soft scrim and the hero copy (headline, line, CTAs) rise in
 *   At 70% the film plays once and rests on the full bowl (Pause/Replay control).
 * Reduced motion / no JS: no pin, no zoom — the finished hero (full film frame +
 *   copy) renders immediately and the film never autoplays. Mobile: same scene,
 *   shorter scroll, wider starting window.
 */
export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const started = useRef(false);
  const [film, setFilm] = useState<FilmState>("idle");

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    mm.add({ motion: MQ.motion, mobile: MQ.mobile }, (ctx) => {
      const { motion, mobile } = ctx.conditions as { motion: boolean; mobile: boolean };
      if (!motion) return;

      const startClip = mobile
        ? "inset(50% 9% 9% 9% round 50% 50% 6% 6% / 22% 22% 6% 6%)"
        : "inset(47% 33% 7% 33% round 50% 50% 4% 4% / 30% 30% 4% 4%)";
      const endClip = "inset(0% 0% 0% 0% round 0% 0% 0% 0% / 0% 0% 0% 0%)";

      gsap.fromTo(q(".intro-word"), { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: EASE, delay: 0.1, stagger: 0.08 });
      gsap.fromTo(q(".intro-peek-in"), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: EASE, delay: 0.55 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          onUpdate: (self) => {
            if (!started.current && self.progress > 0.7) {
              started.current = true;
              videoRef.current?.play().catch(() => {});
            }
          },
        },
      });
      tl.fromTo(q(".intro-peek, .intro-cue"), { opacity: 1 }, { opacity: 0, duration: 0.15 }, 0)
        .fromTo(q(".intro-media"), { clipPath: startClip }, { clipPath: endClip, duration: 0.65, ease: "power2.inOut" }, 0)
        .fromTo(q(".intro-film"), { scale: 1.18 }, { scale: 1, duration: 0.65, ease: "power2.inOut" }, 0)
        .fromTo(q(".intro-brand"), { scale: 1, opacity: 1 }, { scale: 1.6, opacity: 0, duration: 0.5, ease: "power1.in" }, 0.05)
        .fromTo(q(".intro-scrim"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.6)
        .fromTo(q(".intro-copy"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 0.65);
    });

    return () => mm.revert();
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
  const label = film === "playing" ? "Pause" : film === "ended" ? "Replay" : "Play";
  const Icon = film === "playing" ? Pause : film === "ended" ? RotateCcw : Play;

  return (
    <section ref={rootRef} aria-labelledby="hero-title" className="intro-root relative">
      <div className="intro-stage sticky top-0 h-[100svh] min-h-[560px] overflow-hidden bg-bg">
        {/* Stage A — the brand, before the zoom */}
        <div className="intro-brand absolute inset-x-0 top-[13%] flex flex-col items-center px-5 md:top-[10%]">
          <p className="intro-word eyebrow mb-4 text-brown md:mb-6">{brand.promise.value}</p>
          <div className="intro-word">
            <Wordmark className="!w-[min(84vw,24rem)] md:!w-[min(46vw,38rem)]" />
          </div>
        </div>

        {/* Mumma peeking over the window — sits behind it so the window rim hides her lower edge */}
        <div className="intro-peek pointer-events-none absolute left-1/2 top-[41%] w-24 -translate-x-1/2 md:left-[66%] md:top-[41%] md:w-36">
          <div className="intro-peek-in [mask-image:linear-gradient(to_bottom,black_72%,transparent_98%)]">
            <Image src={assets.mascotLaughing.src!} alt="" width={288} height={288} className="h-auto w-full" />
          </div>
        </div>

        {/* The hero film — starts as a small arched window, opens to full screen */}
        <div className="intro-media absolute inset-0">
          <div className="intro-film absolute inset-0">
            <Image src={assets.heroPoster.src!} alt={assets.heroPoster.alt} fill priority sizes="100vw" className="object-cover" />
            <video
              ref={videoRef}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-brand ${
                film === "idle" ? "opacity-0" : "opacity-100"
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
          </div>
          <div className="intro-scrim pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(28,46,32,0.85)_0%,rgba(28,46,32,0.5)_40%,rgba(28,46,32,0)_72%)] md:bg-[linear-gradient(100deg,rgba(28,46,32,0.8)_0%,rgba(28,46,32,0.4)_45%,rgba(28,46,32,0)_72%)]" />
        </div>

        <a
          href="#shop-preview"
          className="intro-cue eyebrow absolute bottom-5 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-bg/85 px-4 py-2 text-ink-soft backdrop-blur"
        >
          Scroll <ArrowDown className="size-3.5" aria-hidden />
        </a>

        {/* Stage B — the hero, after the zoom */}
        <div className="intro-copy on-dark absolute inset-0 flex items-end pb-20 md:items-center md:pb-0">
          <div className="shell">
            <div className="max-w-xl text-cream">
              <h1 id="hero-title">
                <span className="display block whitespace-nowrap text-[clamp(2.7rem,6.4vw,6rem)]">Made with</span>
                <span className="editorial block whitespace-nowrap text-[clamp(2.8rem,5.8vw,5.6rem)] leading-[0.95] text-gold">
                  a mother&apos;s love.
                </span>
              </h1>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-cream/90 md:mt-7 md:text-xl">{brand.supporting.value}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row md:mt-9">
                <ButtonLink href="/shop" variant="light">
                  Shop Mumma&apos;s Bite
                </ButtonLink>
                <ButtonLink href="/our-story" variant="ghost-light">
                  Our story
                </ButtonLink>
              </div>
            </div>
          </div>
          <button
            onClick={control}
            className="absolute bottom-5 right-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-green-900/60 px-4 text-xs font-bold uppercase tracking-[0.14em] text-cream backdrop-blur transition-colors hover:bg-green-900 md:bottom-8 md:right-8"
            aria-label={`${label} the hero film: dates, nuts and seeds falling into a wooden bowl`}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </button>
        </div>
      </div>
    </section>
  );
}
