"use client";

import { useRef, useState } from "react";
import { Flag, Home } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { BrandImage } from "@/components/ui/BrandImage";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { assets, storyAssetFor } from "@/content/assets";
import type { StoryChapter } from "@/content/brand";
import { MQ, ScrollTrigger, gsap, useIsoLayoutEffect } from "@/lib/motion/gsap";

type Pt = { x: number; y: number };

/** A winding road through every stop: S-curves that swing left and right between pins. */
function roadPath(pts: Pt[], amp: number) {
  if (!pts.length) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const dy = b.y - a.y;
    const s = i % 2 ? amp : -amp;
    d += ` C ${a.x + s} ${a.y + dy * 0.35}, ${b.x + s} ${b.y - dy * 0.35}, ${b.x} ${b.y}`;
  }
  return d;
}

/**
 * Our Story as a journey map.
 *
 * MOTION CONTRACT — Journey map
 * A dashed road winds down the page through one numbered stop per chapter, from
 * "Where it began" (start) to "The road ahead" (finish).
 * Scroll (scrubbed, top 65% → bottom 65%): a solid gold route draws along the
 *   road and a traveller dot rides its tip; each stop lights up (green pin, gold
 *   ring) as the traveller reaches it. Cards rise in as they enter the viewport.
 * Layout: desktop — road in the centre, cards alternate left/right, curves swing
 *   ±72px. Mobile — road runs down the left edge, cards to the right, gentle ±14px.
 * Reduced motion: whole route drawn, every stop lit, no traveller.
 */
export function JourneyMap({ chapters }: { chapters: StoryChapter[] }) {
  const root = useRef<HTMLDivElement>(null);
  const route = useRef<SVGPathElement>(null);
  const traveller = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<{ w: number; h: number; d: string } | null>(null);

  // Measure the pins and build the road through them.
  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const measure = () => {
      const box = el.getBoundingClientRect();
      const pins = Array.from(el.querySelectorAll<HTMLElement>("[data-pin]"));
      const pts = pins.map((p) => {
        const r = p.getBoundingClientRect();
        return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
      });
      const amp = window.matchMedia("(min-width: 768px)").matches ? 72 : 14;
      setGeo({ w: box.width, h: box.height, d: roadPath(pts, amp) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Scroll-driven route + traveller + stops lighting up.
  useIsoLayoutEffect(() => {
    const el = root.current;
    const path = route.current;
    const dot = traveller.current;
    if (!el || !path || !dot || !geo) return;
    const stops = Array.from(el.querySelectorAll<HTMLElement>("[data-stop]"));
    const top = el.getBoundingClientRect().top;
    const pinY = stops.map((s) => {
      const r = s.querySelector<HTMLElement>("[data-pin]")!.getBoundingClientRect();
      return r.top + r.height / 2 - top;
    });
    const len = path.getTotalLength();
    const light = (y: number) => stops.forEach((s, i) => (s.dataset.reached = String(y >= pinY[i] - 4)));

    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 65%",
        end: "bottom 65%",
        scrub: 0.6,
        onUpdate: ({ progress }) => {
          path.style.strokeDashoffset = String(1 - progress);
          const pt = path.getPointAtLength(progress * len);
          dot.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
          dot.style.opacity = progress > 0 && progress < 1 ? "1" : "0";
          light(pt.y);
        },
      });
      path.style.strokeDashoffset = "1";
      light(-1);
      st.refresh();
      return () => st.kill();
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      path.style.strokeDashoffset = "0";
      dot.style.opacity = "0";
      light(Infinity);
    });
    return () => mm.revert();
  }, [geo]);

  return (
    <div ref={root} className="relative py-10 md:py-16">
      {/* the road */}
      {geo && (
        <svg aria-hidden className="pointer-events-none absolute inset-0" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`}>
          <path d={geo.d} fill="none" stroke="var(--mb-line)" strokeWidth={10} strokeLinecap="round" />
          <path d={geo.d} fill="none" stroke="var(--mb-bg)" strokeWidth={2} strokeDasharray="10 12" strokeLinecap="round" />
          <path
            ref={route}
            d={geo.d}
            fill="none"
            stroke="var(--mb-gold)"
            strokeWidth={4}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            style={{ strokeDashoffset: 1 }}
          />
        </svg>
      )}
      <div
        ref={traveller}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 opacity-0 transition-opacity duration-300"
      >
        <span className="absolute -left-3 -top-3 block size-6 rounded-full bg-green shadow-[0_0_0_5px_rgba(255,255,255,0.9),0_0_0_7px_var(--mb-gold)]" />
        <span className="absolute -left-3 -top-3 block size-6 animate-ping rounded-full bg-gold/50" />
      </div>

      <ol className="relative space-y-6 md:space-y-0">
        {/* start */}
        <li data-stop className="group grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-4 md:grid-cols-[1fr_9rem_1fr] md:gap-0">
          <span data-pin className="relative z-10 grid size-12 place-items-center rounded-full border-2 border-gold bg-bg text-brown md:col-start-2 md:mx-auto">
            <Home className="size-5" aria-hidden />
          </span>
          <p className="eyebrow text-brown md:col-start-3 md:pl-6">Where it began</p>
        </li>

        {chapters.map((c, i) => {
          const asset = assets[storyAssetFor[c.id]];
          const left = i % 2 === 0;
          const unknownBody = c.body.status === "unknown" || !c.body.value;
          return (
            <li
              key={c.id}
              data-stop
              className={`group grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-4 md:grid-cols-[1fr_9rem_1fr] md:gap-0 md:py-8 ${i ? "lg:-mt-28" : ""}`}
            >
              <span
                data-pin
                className="relative z-10 grid size-12 place-items-center self-start rounded-full border-2 border-line bg-bg text-xl  text-ink-soft transition-all duration-500 group-data-[reached=true]:scale-110 group-data-[reached=true]:border-gold group-data-[reached=true]:bg-green group-data-[reached=true]:text-gold md:col-start-2 md:row-start-1 md:mx-auto md:self-center md:size-16 md:text-2xl"
              >
                {c.index}
              </span>
              <p
                aria-hidden
                className={`hidden text-[clamp(5rem,9vw,8.5rem)]  leading-none text-gold/25 transition-colors duration-700 group-data-[reached=true]:text-gold md:row-start-1 md:block ${
                  left ? "md:col-start-3 md:pl-10" : "md:col-start-1 md:pr-10 md:text-right"
                }`}
              >
                {c.index}
              </p>
              <Reveal
                className={`min-w-0 md:row-start-1 ${left ? "md:col-start-1 md:pr-6" : "md:col-start-3 md:pl-6"}`}
              >
                <article
                  aria-labelledby={`chapter-${c.id}`}
                  className="overflow-hidden rounded-[1.75rem] border border-line bg-bg shadow-[0_10px_40px_-20px_rgba(60,40,20,0.25)] transition-[border-color,box-shadow] duration-500 group-data-[reached=true]:border-gold/60 group-data-[reached=true]:shadow-[0_18px_50px_-22px_rgba(60,40,20,0.4)]"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-cream">
                    <BrandImage asset={{ ...asset, alt: asset.alt || c.title }} sizes="(min-width:768px) 40vw, 80vw" />
                  </div>
                  <div className="p-6 md:p-8">
                    <p className="eyebrow text-gold">Stop {c.index}</p>
                    <h2 id={`chapter-${c.id}`} className="display mt-2 text-[clamp(1.5rem,7vw,1.9rem)] text-green md:text-[clamp(1.9rem,3.4vw,2.75rem)]">
                      {c.title}
                    </h2>
                    {unknownBody ? (
                      <div className="mt-4 space-y-3">
                        <StatusBadge status="unknown" />
                        <p className="text-base  leading-relaxed text-ink-soft">{c.needs}</p>
                      </div>
                    ) : (
                      <p className="mt-4 text-lg leading-relaxed text-ink-soft">{c.body.value}</p>
                    )}
                  </div>
                </article>
              </Reveal>
            </li>
          );
        })}

        {/* finish */}
        <li data-stop className="group grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-4 md:grid-cols-[1fr_9rem_1fr] md:gap-0">
          <span
            data-pin
            className="relative z-10 grid size-12 place-items-center rounded-full border-2 border-line bg-bg text-ink-soft transition-colors duration-500 group-data-[reached=true]:border-gold group-data-[reached=true]:bg-gold group-data-[reached=true]:text-green md:col-start-2 md:row-start-1 md:mx-auto"
          >
            <Flag className="size-5" aria-hidden />
          </span>
          <p className="eyebrow text-brown md:col-start-1 md:row-start-1 md:pr-6 md:text-right">The road ahead</p>
        </li>
      </ol>
    </div>
  );
}
