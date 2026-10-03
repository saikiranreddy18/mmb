"use client";

import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { IntroReveal } from "@/components/motion/IntroReveal";
import { ButtonLink } from "@/components/ui/Button";
import { BrandImage } from "@/components/ui/BrandImage";
import { assets } from "@/content/assets";
import { brand } from "@/content/brand";
import { MQ, gsap, useIsoLayoutEffect } from "@/lib/motion/gsap";

/**
 * WORLD 01 — Enter Mumma's Bite.
 * Motion: IntroReveal (typography line reveal + arch image unmask) and a
 * subtle desktop-only parallax on the arch (yPercent 0 → -8, scrubbed to scroll).
 * Reduced motion / mobile: no parallax.
 */
export function Hero() {
  const archRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = archRef.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(`${MQ.motion} and ${MQ.desktop}`, () => {
      gsap.to(el, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top+=80", end: "bottom top", scrub: 0.6 },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-24 md:pt-28">
      <IntroReveal className="shell grid items-center gap-12 pb-20 lg:min-h-[calc(100svh-7rem)] lg:grid-cols-[1.15fr_1fr] lg:gap-8 lg:pb-16">
        <div className="relative z-10 max-w-2xl">
          <p data-hero-reveal="fade" className="eyebrow mb-6 flex items-center gap-3 text-brown md:mb-8">
            <span aria-hidden className="h-px w-8 bg-gold" />
            {brand.name}
          </p>
          <h1 id="hero-title" className="text-green">
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-hero-reveal="line" className="display block whitespace-nowrap text-[clamp(2.9rem,7.2vw,6.75rem)]">
                Made with
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <span data-hero-reveal="line" className="editorial block text-[clamp(3.1rem,7.8vw,7.25rem)] leading-[0.95] text-brown">
                a mother&apos;s love.
              </span>
            </span>
          </h1>
          <p data-hero-reveal="fade" className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft md:mt-8 md:text-xl">
            {brand.supporting.value}
          </p>
          <div data-hero-reveal="fade" className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-10">
            <ButtonLink href="/shop">Shop Mumma's Bite</ButtonLink>
            <ButtonLink href="/our-story" variant="secondary">
              Our story
            </ButtonLink>
          </div>
        </div>

        <div ref={archRef} className="relative mx-auto w-full max-w-[22rem] sm:max-w-sm lg:max-w-[30rem]">
          {/* The arch — a doorway home. Recurring frame for imagery across the site. */}
          <div aria-hidden className="absolute -inset-x-6 -bottom-6 top-10 rounded-t-full bg-cream lg:-inset-x-10" />
          <div
            data-hero-reveal="clip"
            className="relative aspect-[4/5] overflow-hidden rounded-t-full"
          >
            {/* The supplied mother-and-child character takes this spot once provided; until then, the pack. */}
            <BrandImage
              asset={assets.mascot.src ? assets.mascot : assets.productPack}
              priority
              sizes="(min-width:1024px) 30rem, 80vw"
              className="rounded-t-full"
            />
          </div>
          <span aria-hidden className="absolute -left-3 top-1/3 size-6 rounded-full bg-gold/80 lg:-left-8 lg:size-8" />
        </div>
      </IntroReveal>

      <a
        href="#from-home"
        className="eyebrow absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full px-3 py-2 text-ink-soft transition-colors hover:text-green lg:inline-flex"
      >
        It started at home <ArrowDown className="size-3.5" aria-hidden />
      </a>
    </section>
  );
}
