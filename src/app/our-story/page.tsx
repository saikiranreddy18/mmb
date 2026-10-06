import type { Metadata } from "next";
import { IntroReveal } from "@/components/motion/IntroReveal";
import { Reveal } from "@/components/motion/Reveal";
import { JourneyMap } from "@/components/story/JourneyMap";
import { ButtonLink } from "@/components/ui/Button";
import { MockNotice } from "@/components/ui/MockNotice";
import { BrandImage } from "@/components/ui/BrandImage";
import { assets } from "@/content/assets";
import { brand, story, storyPublished } from "@/content/brand";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "How Rajeswari turned her family's date, nut and seed laddus into Mumma's Bite energy bars: natural ingredients, no added sugar, made with a mother's love.",
  alternates: { canonical: "/our-story" },
  // Kept out of search until the real story is published.
  robots: storyPublished ? undefined : { index: false, follow: true },
};

export default function OurStoryPage() {
  return (
    <>
      <section aria-labelledby="story-title" className="pb-16 pt-32 md:pb-24 md:pt-44">
        <IntroReveal className="shell grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
          <p data-hero-reveal="fade" className="eyebrow mb-8 flex items-center gap-3 text-brown">
            <span aria-hidden className="h-px w-8 bg-gold" />
            Our story
          </p>
          <h1 id="story-title" className="text-green">
            <span className="block overflow-hidden">
              <span data-hero-reveal="line" className="display block text-[clamp(2.75rem,9vw,7.5rem)]">
                It started with
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <span data-hero-reveal="line" className="editorial block text-[clamp(3rem,10vw,8rem)] leading-[0.95] text-brown">
                something simple.
              </span>
            </span>
          </h1>
          <p data-hero-reveal="fade" className="mt-8 max-w-xl text-xl leading-relaxed text-ink-soft">
            {brand.idea.value}
          </p>
          {!storyPublished && (
          <div data-hero-reveal="fade" className="mt-10 max-w-xl">
            <MockNotice>
              The real Mumma's Bite story hasn&apos;t been supplied yet. Each chapter below shows what it needs — nothing
              here has been invented.
            </MockNotice>
          </div>
          )}
          </div>
          <div data-hero-reveal="fade" className="mx-auto aspect-[1312/1199] w-full max-w-sm lg:max-w-none">
            <BrandImage asset={assets.mascot} priority sizes="(min-width:1024px) 34vw, 80vw" />
          </div>
        </IntroReveal>
      </section>

      <section aria-label="Our journey" className="shell border-t border-line">
        <JourneyMap chapters={story.chapters} />
      </section>

      <section aria-labelledby="story-cta" className="on-dark mt-10 bg-green py-20 text-cream md:py-28">
        <Reveal className="shell flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <h2 id="story-cta" className="display text-[clamp(2.5rem,6vw,4.75rem)]">
            Taste the <span className="editorial text-gold">story.</span>
          </h2>
          <ButtonLink href="/shop" variant="light">
            Shop Mumma's Bite
          </ButtonLink>
        </Reveal>
      </section>
    </>
  );
}
