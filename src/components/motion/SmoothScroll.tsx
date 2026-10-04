"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
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
 */
export function SmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia(MQ.motion).matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: { offset: -80 },
    });
    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
