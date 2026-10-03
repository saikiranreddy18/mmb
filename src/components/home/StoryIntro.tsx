"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { brand, homeJourney } from "@/content/brand";
import { MQ, gsap, useIsoLayoutEffect } from "@/lib/motion/gsap";

/**
 * WORLD 02 — Discover the story.
 * Home → Mother → Recipe → Experimentation → Product → Brand.
 * Motion: a vertical thread draws down the journey as you scroll
 * (scaleY 0 → 1, scrubbed). Reduced motion: thread is fully drawn.
 */
export function StoryIntro() {
  const listRef = useRef<HTMLOListElement>(null);
  const threadRef = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    if (!listRef.current || !threadRef.current) return;
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.fromTo(
        threadRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: listRef.current, start: "top 70%", end: "bottom 60%", scrub: 0.5 },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      id="from-home"
      aria-labelledby="from-home-title"
      className="relative scroll-mt-16 rounded-t-[2.5rem] bg-cream py-20 md:rounded-t-[4rem] md:py-32"
    >
      <div className="shell grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <p className="eyebrow mb-6 text-brown">From home</p>
            <h2 id="from-home-title" className="display text-[clamp(2.75rem,7vw,5.5rem)] text-green">
              It started <span className="editorial block text-brown">at home.</span>
            </h2>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-ink-soft">{brand.idea.value}</p>
            <Link
              href="/our-story"
              className="group mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-green"
            >
              Read our story
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </Link>
          </Reveal>
        </div>

        <ol ref={listRef} className="relative">
          <span aria-hidden className="absolute bottom-6 left-[1.1rem] top-6 w-px bg-brown/15" />
          <span
            ref={threadRef}
            aria-hidden
            className="absolute bottom-6 left-[1.1rem] top-6 w-px origin-top bg-green"
          />
          {homeJourney.map((beat, i) => (
            <li key={beat.id} className="relative pb-12 pl-14 last:pb-0 md:pb-16">
              <span className="absolute left-0 top-1 grid size-9 place-items-center rounded-full border border-green/25 bg-cream text-xs font-bold text-green">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Reveal>
                <h3 className="text-3xl font-extrabold uppercase tracking-tight text-green md:text-4xl">{beat.label}</h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-ink-soft">
                  <StatusBadge status="unknown" /> <span className="italic">{beat.needs}</span>
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
