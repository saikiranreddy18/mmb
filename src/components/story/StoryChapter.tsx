import { Reveal } from "@/components/motion/Reveal";
import { BrandImage } from "@/components/ui/BrandImage";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { assets, storyAssetFor } from "@/content/assets";
import type { StoryChapter as Chapter } from "@/content/brand";

/**
 * One beat of the story, told like a page turning:
 * large index, image unmasking from the bottom, text rising in after it.
 */
export function StoryChapter({ chapter, flip }: { chapter: Chapter; flip: boolean }) {
  const asset = assets[storyAssetFor[chapter.id]];
  return (
    <article
      aria-labelledby={`chapter-${chapter.id}`}
      className="grid items-center gap-10 py-16 md:grid-cols-2 md:gap-16 md:py-24 lg:gap-24"
    >
      <Reveal
        variant="clip"
        className={`aspect-[4/5] w-full overflow-hidden rounded-[2rem] ${flip ? "md:order-2 md:rounded-t-full" : "md:rounded-t-full"}`}
      >
        <BrandImage asset={{ ...asset, alt: asset.alt || chapter.title }} sizes="(min-width:768px) 45vw, 90vw" />
      </Reveal>
      <Reveal className={flip ? "md:order-1" : ""}>
        <p className="font-serif text-7xl italic leading-none text-gold md:text-8xl">{chapter.index}</p>
        <h2 id={`chapter-${chapter.id}`} className="display mt-4 text-[clamp(2.25rem,5vw,4rem)] text-green">
          {chapter.title}
        </h2>
        {chapter.body.status === "unknown" || !chapter.body.value ? (
          <div className="mt-6 max-w-md space-y-3">
            <StatusBadge status="unknown" />
            <p className="text-lg italic leading-relaxed text-ink-soft">{chapter.needs}</p>
          </div>
        ) : (
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">{chapter.body.value}</p>
        )}
      </Reveal>
    </article>
  );
}
