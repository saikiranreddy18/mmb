"use client";

import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { assets } from "@/content/assets";
import { brand, storyPublished } from "@/content/brand";
import { MQ, gsap, useIsoLayoutEffect } from "@/lib/motion/gsap";

const LOGO = "/assets/logo/mummas-bite-logo.svg";

declare global {
  interface Window {
    __mbBooted?: boolean;
  }
}

/**
 * WORLD 01 — THE VIDEO LIVES INSIDE THE LOGO → SCROLL → ENTER THE WORLD
 *
 * Layers: 01 video (autoplay, muted, loop, brightened — no pause control, per brand),
 * clipped by a CSS mask = the supplied SVG logo + a circle · 02 reading wash ·
 * 03 hero copy · 04 navigation.
 *
 * MOTION CONTRACT — Logo knockout reveal
 * Start: light page; the hero video plays only *inside* the letters of
 *   "mumma's bite" (mask-image: logo SVG), big and centred. Eyebrow line bottom
 *   left, scroll cue bottom right (reference: knockout-word hero).
 * Scroll (Lenis-smoothed, scrub 1, CSS-sticky pin ~150vh / ~100vh mobile):
 *   0 → 0.75  logo mask grows ×1.6 while a circle mask opens from the centre to
 *             cover the viewport — the letters "open up" into the full video
 *   0.05→0.25 the intro line + cue fade away
 *   0.6 → 0.9 reading wash, hero logo and copy rise in as one group
 *   Reverse scroll reverses it. The video keeps its own time throughout.
 * Reduced motion / no JS: no mask, no pin — full video (poster) + finished copy.
 */
export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Mark the app as booted after this first paint, so later in-site visits skip the intro.
    const id = window.setTimeout(() => (window.__mbBooted = true), 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (v && window.matchMedia(MQ.motion).matches) v.play().catch(() => {});
  }, []);

  // Navbar logo steps aside while the hero is on screen (the hero shows the logo).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const html = document.documentElement;
    const io = new IntersectionObserver(([e]) => {
      html.dataset.heroLogo = e.isIntersecting ? "on" : "off";
    }, { rootMargin: "-80px 0px 0px 0px" });
    io.observe(root);
    return () => {
      io.disconnect();
      delete html.dataset.heroLogo;
    };
  }, []);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    const media = mediaRef.current;
    if (!root || !media) return;
    // The intro is for arriving at the site (first load / reload) only. Coming
    // back to Home from inside the site shows the finished hero straight away.
    if (window.__mbBooted) {
      root.setAttribute("data-skip-intro", "");
      return;
    }
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    mm.add({ motion: MQ.motion, mobile: MQ.mobile }, (ctx) => {
      const { motion, mobile } = ctx.conditions as { motion: boolean; mobile: boolean };
      if (!motion) return;

      const vw = () => media.clientWidth;
      const vh = () => media.clientHeight;
      const logoStart = () => (mobile ? Math.min(vw() * 0.92, 560) : Math.min(vw() * 0.78, 1240));
      const coverR = () => Math.hypot(vw(), vh()) / 2 + 2;

      const s = { lw: logoStart(), r: 0 };
      const apply = () => {
        media.style.setProperty("--lw", `${s.lw}px`);
        media.style.setProperty("--r", `${s.r}px`);
      };
      apply();
      media.classList.add("is-masked");

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true },
      });
      tl.fromTo(
        s,
        { lw: () => logoStart(), r: 0 },
        { lw: () => logoStart() * 1.6, r: () => coverR(), duration: 0.75, ease: "power2.in", onUpdate: apply },
        0,
      )
        .fromTo(q(".hero-intro"), { opacity: 1 }, { opacity: 0, duration: 0.2 }, 0.05)
        .fromTo(q(".hero-wash"), { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.72)
        .fromTo(q(".hero-copy"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, 0.74);

      return () => {
        media.classList.remove("is-masked");
        media.style.removeProperty("--lw");
        media.style.removeProperty("--r");
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} aria-labelledby="hero-title" className="hero-root relative">
      <div className="sticky top-0 h-[100svh] min-h-[600px] overflow-hidden bg-bg">
        {/* LAYER 01 — video, seen through the logo */}
        <div ref={mediaRef} className="hero-media absolute inset-0">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover [filter:brightness(1.18)_saturate(1.08)_contrast(1.03)]"
            poster={assets.heroPoster.src ?? undefined}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
            tabIndex={-1}
          >
            <source src="/assets/hero.webm" type="video/webm" />
            <source src="/assets/hero.mp4" type="video/mp4" />
          </video>
          <div
            aria-hidden
            className="hero-wash pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(251,247,239,0.97)_0%,rgba(251,247,239,0.88)_46%,rgba(251,247,239,0)_78%)] md:bg-[linear-gradient(90deg,rgba(251,247,239,0.95)_0%,rgba(251,247,239,0.82)_34%,rgba(251,247,239,0)_66%)]"
          />
        </div>

        {/* Opening composition — line bottom-left, cue bottom-right */}
        <div className="hero-intro pointer-events-none absolute inset-x-0 bottom-0 pb-8 md:pb-12">
          <div className="shell flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div>
              <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-soft">
                Dry fruit &amp; seed energy bars <span aria-hidden className="hidden h-px w-6 bg-ink-soft/40 sm:block md:w-8" /> Made at home
              </p>
              <p className="mt-3 max-w-md text-2xl leading-snug text-ink-soft md:text-3xl">{brand.promise.value}</p>
            </div>
            <div className="pointer-events-auto flex shrink-0 items-center gap-5">
              <a href="#shop-preview" className="eyebrow hidden items-center gap-2 text-ink-soft hover:text-green lg:inline-flex">
                Scroll <ArrowDown className="size-3.5" aria-hidden />
              </a>
              <ButtonLink href="/shop">Shop the bars</ButtonLink>
            </div>
          </div>
        </div>

        {/* Hero copy — arrives once the letters open into the full video */}
        <div className="hero-copy absolute inset-0 flex items-end pb-12 pt-32 md:items-center md:pb-0">
          <div className="shell">
            <div className="max-w-xl">
              {/* eslint-disable-next-line @next/next/no-img-element -- supplied SVG logo, used unaltered */}
              <img src={LOGO} alt="Mumma's Bite" width={1455} height={583} className="block h-auto w-[min(62vw,260px)] md:w-[min(30vw,380px)]" />
              <h1 id="hero-title" className="mt-6 text-green md:mt-8">
                <span className="display block text-[clamp(2.4rem,5.2vw,4.75rem)]">Made with</span>
                <span className="editorial block text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.95] text-brown">
                  a mother&apos;s love.
                </span>
              </h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft md:mt-6 md:text-lg">{brand.supporting.value}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-8">
                <ButtonLink href="/shop">Shop Mumma&apos;s Bite</ButtonLink>
                {storyPublished && (
                  <ButtonLink href="/our-story" variant="secondary" className="bg-bg/60 backdrop-blur-sm">
                    Our story
                  </ButtonLink>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
