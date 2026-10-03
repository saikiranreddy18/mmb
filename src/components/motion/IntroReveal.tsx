"use client";

import { type ReactNode, useRef } from "react";
import { EASE, MQ, gsap, useIsoLayoutEffect } from "@/lib/motion/gsap";

/**
 * Above-the-fold entrance — MOTION CONTRACT
 * Element: any descendant with data-hero-reveal="line" | "fade" | "clip".
 * Trigger: page load (hydration).
 * Initial: line → y 105% inside an overflow-hidden mask · fade → opacity 0, y 16 ·
 *          clip → inset(0 0 100% 0) (image reveals top-down).
 * Final: in place, fully visible.
 * Duration: 1.0s desktop / 0.7s mobile, 0.08s stagger, ease power3.out.
 * Reduced motion: `js-motion` is never set on <html>, so nothing is hidden and nothing animates.
 * Failsafe: CSS reveals content after 2.5s if JS never hydrates (globals.css).
 */
export function IntroReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.setAttribute("data-motion-ready", "");
    const mm = gsap.matchMedia();
    mm.add({ motion: MQ.motion, mobile: MQ.mobile }, (ctx) => {
      const { motion, mobile } = ctx.conditions as { motion: boolean; mobile: boolean };
      const items = Array.from(root.querySelectorAll<HTMLElement>("[data-hero-reveal]"));
      if (!motion) {
        gsap.set(items, { opacity: 1 });
        return;
      }
      const duration = mobile ? 0.7 : 1;
      const tl = gsap.timeline({ defaults: { ease: EASE, duration }, delay: 0.1 });
      items.forEach((item, i) => {
        const kind = item.dataset.heroReveal;
        const at = i * 0.08;
        if (kind === "line") tl.fromTo(item, { opacity: 1, yPercent: 105 }, { yPercent: 0 }, at);
        else if (kind === "clip")
          tl.fromTo(item, { opacity: 1, clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: duration * 1.3 }, at);
        else tl.fromTo(item, { opacity: 0, y: 16 }, { opacity: 1, y: 0 }, at + 0.15);
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
