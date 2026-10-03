"use client";

import { type ElementType, type ReactNode, useRef } from "react";
import { EASE, MQ, gsap, useIsoLayoutEffect } from "@/lib/motion/gsap";

type Props = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** "up": fade + rise. "clip": image unmasks from the bottom. */
  variant?: "up" | "clip";
  /** Animate direct children one after another instead of the wrapper. */
  stagger?: number;
  delay?: number;
};

/**
 * Scroll reveal — MOTION CONTRACT
 * Trigger: element top reaches 85% of viewport (fires once).
 * Initial: up → opacity 0, y 28px (16px mobile) · clip → inset(100% 0 0 0).
 * Final: fully visible, in place. Duration 0.9s desktop / 0.6s mobile. Ease power3.out.
 * Reduced motion: nothing runs — content is rendered static and visible.
 * No-JS: content is visible (initial state is only applied by JS).
 */
export function Reveal({ children, className, as: Tag = "div", variant = "up", stagger = 0, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add({ motion: MQ.motion, mobile: MQ.mobile }, (ctx) => {
      const { motion, mobile } = ctx.conditions as { motion: boolean; mobile: boolean };
      if (!motion) return;
      const targets = stagger ? Array.from(el.children) : el;
      const base = {
        duration: mobile ? 0.6 : 0.9,
        ease: EASE,
        delay,
        stagger: stagger ? (mobile ? stagger * 0.6 : stagger) : 0,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      };
      if (variant === "clip") {
        gsap.fromTo(targets, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ...base });
      } else {
        gsap.fromTo(targets, { opacity: 0, y: mobile ? 16 : 28 }, { opacity: 1, y: 0, ...base });
      }
    });
    return () => mm.revert();
  }, [variant, stagger, delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
