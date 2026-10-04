"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, Pause, Play } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { assets } from "@/content/assets";
import { brand } from "@/content/brand";
import { EASE, MQ, gsap, useIsoLayoutEffect } from "@/lib/motion/gsap";

const LOGO = "/assets/logo/mummas-bite-logo.svg";

/** Distance of `el` from the top-left of `ancestor`, ignoring CSS transforms. */
function offsetWithin(el: HTMLElement, ancestor: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

/**
 * WORLD 01 — LOGO + VIDEO → SCROLL → LOGO SETTLES → HERO
 *
 * Layers: 01 video (autoplay, muted, loop — never paused, faded or restarted by
 * scroll) · 02 soft cream glow / wash (no boxes) · 03 the transparent SVG logo
 * (one element, always visible) · 04 hero copy · 05 navigation.
 *
 * MOTION CONTRACT — Logo enters the hero
 * Start: the logo is large and centred over the playing video (its real, final
 *   DOM position is inside the hero copy; the start is a measured transform).
 * Scroll (Lenis-smoothed, scrub 1, CSS-sticky pin ~140vh desktop / ~90vh mobile):
 *   0 → 0.7   logo translate + scale into its final place (power2.inOut);
 *             the centre glow eases out while the reading wash eases in
 *   0.5 → 0.85 headline, line and CTAs arrive together (opacity + 30px rise)
 *   Reverse scroll reverses everything. The video keeps its own time throughout.
 * Load: the logo fades in at its start position (0.8s) — no separate intro screen.
 * Mobile: dedicated composition — final block sits low; shorter movement.
 * Reduced motion: no pin and no logo travel — logo in final place, all copy
 *   visible; the video shows its poster and never autoplays.
 */
export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // Video: autoplay only when motion is welcome; it then simply loops.
  useEffect(() => {
    const v = videoRef.current;
    if (v && window.matchMedia(MQ.motion).matches) v.play().catch(() => {});
  }, []);

  // While the hero logo is on screen, the navbar logo steps aside (no duplicate logo).
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
    const stage = stageRef.current;
    const logo = logoRef.current;
    if (!root || !stage || !logo) return;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    mm.add({ motion: MQ.motion, mobile: MQ.mobile }, (ctx) => {
      const { motion, mobile } = ctx.conditions as { motion: boolean; mobile: boolean };
      if (!motion) return;

      // Start = logo centred in the viewport at a large width; end = its real place.
      const start = () => {
        const { x, y } = offsetWithin(logo, stage);
        const w = logo.offsetWidth;
        const h = logo.offsetHeight;
        const vw = stage.clientWidth;
        const vh = stage.clientHeight;
        const startW = mobile ? Math.min(vw * 0.86, 560) : Math.min(vw * 0.6, 920);
        return {
          x: vw / 2 - (x + w / 2),
          y: vh * (mobile ? 0.44 : 0.46) - (y + h / 2),
          scale: startW / w,
        };
      };

      gsap.set(logo, { transformOrigin: "50% 50%" });
      gsap.fromTo(logo, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: EASE, delay: 0.1 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo(
        logo,
        { x: () => start().x, y: () => start().y, scale: () => start().scale },
        { x: 0, y: 0, scale: 1, duration: 0.7, ease: "power2.inOut" },
        0,
      )
        .fromTo(q(".hero-cue"), { opacity: 1 }, { opacity: 0, duration: 0.1 }, 0)
        .fromTo(q(".hero-glow"), { opacity: 1 }, { opacity: 0, duration: 0.5 }, 0.1)
        .fromTo(q(".hero-wash"), { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.2)
        .fromTo(q(".hero-copy"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 0.5);
    });

    return () => mm.revert();
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <section ref={rootRef} aria-labelledby="hero-title" className="hero-root relative">
      <div ref={stageRef} className="sticky top-0 h-[100svh] min-h-[600px] overflow-hidden bg-green-900">
        {/* LAYER 01 — video */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster={assets.heroPoster.src ?? undefined}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          tabIndex={-1}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src="/assets/hero.webm" type="video/webm" />
          <source src="/assets/hero.mp4" type="video/mp4" />
        </video>

        {/* LAYER 02 — soft light: a glow behind the big logo, then a reading wash */}
        <div aria-hidden className="hero-glow pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_46%_32%_at_50%_45%,rgba(251,247,239,0.78)_0%,rgba(251,247,239,0.45)_45%,rgba(251,247,239,0)_100%)]" />
        <div aria-hidden className="hero-wash pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(251,247,239,0.97)_0%,rgba(251,247,239,0.88)_46%,rgba(251,247,239,0)_78%)] md:bg-[linear-gradient(90deg,rgba(251,247,239,0.95)_0%,rgba(251,247,239,0.82)_34%,rgba(251,247,239,0)_66%)]" />

        {/* LAYERS 03 + 04 — logo (final position) and hero copy */}
        <div className="absolute inset-0 flex items-end pb-12 pt-24 md:items-center md:pb-0">
          <div className="shell">
            <div className="max-w-xl">
              <div ref={logoRef} className="hero-logo w-[min(62vw,260px)] will-change-transform md:w-[min(30vw,400px)]">
                {/* eslint-disable-next-line @next/next/no-img-element -- supplied SVG logo, used unaltered */}
                <img src={LOGO} alt="Mumma's Bite" width={1455} height={583} className="block h-auto w-full" />
              </div>
              <div className="hero-copy mt-6 md:mt-8">
                <h1 id="hero-title" className="text-green">
                  <span className="display block text-[clamp(2.4rem,5.2vw,4.75rem)]">Made with</span>
                  <span className="editorial block text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.95] text-brown">
                    a mother&apos;s love.
                  </span>
                </h1>
                <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft md:mt-6 md:text-lg">{brand.supporting.value}</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-8">
                  <ButtonLink href="/shop">Shop Mumma&apos;s Bite</ButtonLink>
                  <ButtonLink href="/our-story" variant="secondary" className="bg-bg/60 backdrop-blur-sm">
                    Our story
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <a
          href="#shop-preview"
          className="hero-cue eyebrow absolute bottom-5 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-bg/80 px-4 py-2 text-ink-soft backdrop-blur"
        >
          Scroll <ArrowDown className="size-3.5" aria-hidden />
        </a>

        <button
          onClick={toggle}
          className="absolute right-4 top-20 z-10 inline-flex min-h-11 items-center gap-2 rounded-full bg-green-900/55 px-4 text-xs font-bold uppercase tracking-[0.14em] text-cream backdrop-blur transition-colors hover:bg-green-900 md:bottom-8 md:right-8 md:top-auto"
          aria-label={playing ? "Pause the background video" : "Play the background video"}
        >
          {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
          {playing ? "Pause" : "Play"}
        </button>
      </div>
    </section>
  );
}
