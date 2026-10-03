import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { BrandImage } from "@/components/ui/BrandImage";
import { assets } from "@/content/assets";

/** WORLD 04 — the door into the shop. */
export function ClosingInvite() {
  return (
    <section aria-labelledby="closing-title" className="py-20 md:py-32">
      <div className="shell grid items-center gap-10 md:grid-cols-[1fr_auto] md:gap-16">
        <Reveal>
          <p className="eyebrow mb-6 text-brown">From our home to yours</p>
          <h2 id="closing-title" className="display text-[clamp(2.5rem,6.5vw,5.25rem)] text-green">
            A little piece <span className="editorial block text-brown">of home in every bite.</span>
          </h2>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/shop">Shop Mumma's Bite</ButtonLink>
            <ButtonLink href="/our-story" variant="secondary">
              Our story
            </ButtonLink>
          </div>
        </Reveal>
        <Reveal variant="clip" className="mx-auto aspect-[4/5] w-48 overflow-hidden rounded-t-full md:w-64">
          <BrandImage asset={assets.mascot} sizes="16rem" decorative className="!p-4 [&>span:last-child]:text-[0.65rem]" />
        </Reveal>
      </div>
    </section>
  );
}
