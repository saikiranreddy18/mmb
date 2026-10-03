"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect } from "react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/** One easing language for the whole site: calm, decelerating. */
export const EASE = "power3.out";

/** Media conditions shared by every animation (see docs/MOTION.md). */
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 767px)",
  desktop: "(min-width: 1024px)",
} as const;

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export { gsap, ScrollTrigger };
