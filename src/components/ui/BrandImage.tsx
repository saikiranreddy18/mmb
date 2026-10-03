import Image from "next/image";
import { ImageOff } from "lucide-react";
import type { BrandAsset } from "@/content/assets";

type Props = {
  asset: BrandAsset;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Visual tone of the ASSET REQUIRED frame. */
  tone?: "cream" | "green" | "light";
  /** Decorative images get empty alt text. */
  decorative?: boolean;
};

const tones = {
  cream: "bg-cream text-brown border-brown/25",
  green: "bg-green-800 text-cream/80 border-cream/25",
  light: "bg-white/60 text-ink-soft border-ink/15",
};

/**
 * Renders a supplied brand asset, or an explicit ASSET REQUIRED frame.
 * Never substitutes a generated or stock image for a missing asset.
 */
export function BrandImage({ asset, className = "", sizes = "100vw", priority, tone = "cream", decorative }: Props) {
  if (asset.src) {
    return (
      <Image
        src={asset.src}
        alt={decorative ? "" : asset.alt}
        width={asset.width}
        height={asset.height}
        sizes={sizes}
        priority={priority}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`Image placeholder: ${asset.required}`}
      className={`flex h-full w-full flex-col items-center justify-center gap-3 border border-dashed p-6 text-center ${tones[tone]} ${className}`}
    >
      <ImageOff aria-hidden className="size-6 opacity-70" strokeWidth={1.5} />
      <span className="eyebrow">Asset required</span>
      <span className="max-w-[26ch] text-xs leading-relaxed opacity-80">{asset.required}</span>
    </div>
  );
}
