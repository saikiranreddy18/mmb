import type { Metadata } from "next";
import { IntroReveal } from "@/components/motion/IntroReveal";
import { Reveal } from "@/components/motion/Reveal";
import { StoryChapter } from "@/components/story/StoryChapter";
import { ButtonLink } from "@/components/ui/Button";
import { MockNotice } from "@/components/ui/MockNotice";
import { brand, story } from "@/content/brand";

export const metadata: Metadata = {
  title: "Our Story",
  description: "How Mummas Bite began — a modern food brand inspired by the food a mother makes at home.",
  alternates: { canonical: "/our-story" },
};

export default function OurStoryPage() {
  return (
    <>
      <section aria-labelledby="story-title" className="pb-16 pt-32 md:pb-24 md:pt-44">
        <IntroReveal className="shell">
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
          <div data-hero-reveal="fade" className="mt-10 max-w-xl">
            <MockNotice>
              The real Mummas Bite story hasn&apos;t been supplied yet. Each chapter below shows what it needs — nothing
              here has been invented.
            </MockNotice>
          </div>
        </IntroReveal>
      </section>

      <div className="shell divide-y divide-line border-t border-line">
        {story.chapters.map((chapter, i) => (
          <StoryChapter key={chapter.id} chapter={chapter} flip={i % 2 === 1} />
        ))}
      </div>

      <section aria-labelledby="story-cta" className="on-dark mt-10 bg-green py-20 text-cream md:py-28">
        <Reveal className="shell flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <h2 id="story-cta" className="display text-[clamp(2.5rem,6vw,4.75rem)]">
            Taste the <span className="editorial text-gold">story.</span>
          </h2>
          <ButtonLink href="/shop" variant="light">
            Shop Mummas Bite
          </ButtonLink>
        </Reveal>
      </section>
    </>
  );
}
