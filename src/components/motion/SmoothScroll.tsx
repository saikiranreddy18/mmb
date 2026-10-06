"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { MQ, ScrollTrigger, gsap } from "@/lib/motion/gsap";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger scenes
 * (the brand intro zoom) stay perfectly in sync with the eased scroll.
 * Not started for visitors who prefer reduced motion — native scrolling then.
 * Touch devices keep native scrolling (Lenis leaves touch alone by default).
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.matchMedia(MQ.motion).matches) return;

    const lenis = new Lenis({
      // Follows the wheel closely (lerp) rather than over a fixed duration, so it
      // feels smooth without lagging behind the hand.
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
      anchors: { offset: -80 },
    });
    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Images and video change the page height after first paint.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  // A new page starts at the top, not at the previous page's scroll position.
  useEffect(() => {
    if (window.location.hash) return;
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
