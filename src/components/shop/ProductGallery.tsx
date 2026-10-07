"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronLeft, ChevronRight, Heart, Maximize2, Play, Share2, X } from "lucide-react";
import { useDialog } from "@/components/ui/useDialog";
import type { ShopifyImage } from "@/lib/commerce/types";
import type { ProductVideo } from "@/content/product-videos";
import { MQ } from "@/lib/motion/gsap";

/** A gallery slide: a product photo or the product film. */
type Item = { kind: "image"; key: string; img: ShopifyImage } | { kind: "video"; key: string; video: ProductVideo };

const thumbSrc = (it: Item) => (it.kind === "image" ? it.img.url : it.video.poster);
const itemAlt = (it: Item, title: string) => (it.kind === "image" ? (it.img.altText ?? title) : it.video.alt);

/** Muted looping film that plays only while its slide is showing (and motion is allowed). */
function FilmSlide({ video, playing, contain }: { video: ProductVideo; playing: boolean; contain?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);
  useEffect(() => setReduced(!window.matchMedia(MQ.motion).matches), []);
  useEffect(() => {
    const v = ref.current;
    if (!v || reduced) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing, reduced]);
  return (
    <video
      ref={ref}
      className={`absolute inset-0 h-full w-full ${contain ? "object-contain p-2 md:p-6" : "object-cover"}`}
      poster={video.poster}
      muted
      loop
      playsInline
      preload={playing ? "auto" : "none"}
      controls={reduced}
      aria-label={video.alt}
    >
      {video.webm && <source src={video.webm} type="video/webm" />}
      <source src={video.mp4} type="video/mp4" />
    </video>
  );
}

const MAX_THUMBS = 6;
const SAVED_KEY = "mb-saved";

function readSaved(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]");
  } catch {
    return [];
  }
}

/** Swipeable track of slides that follows `index` and reports swipes back. */
function useTrack(index: number, onSwipe: (i: number) => void) {
  const ref = useRef<HTMLDivElement>(null);
  const programmatic = useRef(false);
  const first = useRef(true);

  useEffect(() => {
    const el = ref.current;
    const instant = first.current;
    first.current = false;
    if (!el || Math.round(el.scrollLeft / el.clientWidth) === index) return;
    programmatic.current = true;
    el.scrollTo({ left: index * el.clientWidth, behavior: instant ? "instant" : "smooth" });
    const t = window.setTimeout(() => (programmatic.current = false), 600);
    return () => window.clearTimeout(t);
  }, [index]);

  const onScroll = () => {
    const el = ref.current;
    if (!el || programmatic.current) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) onSwipe(i);
  };

  return { ref, onScroll };
}

/**
 * Product gallery: thumbnail rail + large main image (swipe on touch), with
 * share / save buttons and a full-view lightbox.
 * Thumbnails select on hover (desktop) and click/tap. Lightbox: Esc closes,
 * ←/→ step through slides, focus is trapped and returned to the trigger.
 * A product film (if any) is the second slide: muted loop, plays only while shown;
 * reduced motion shows its poster with controls instead of autoplay.
 */
export function ProductGallery({
  images,
  title,
  handle,
  video,
}: {
  images: ShopifyImage[];
  title: string;
  handle: string;
  /** Optional product film, shown as the second slide. */
  video?: ProductVideo;
}) {
  const items: Item[] = images.map((img) => ({ kind: "image", key: img.url, img }));
  if (video) items.splice(Math.min(1, items.length), 0, { kind: "video", key: video.mp4, video });
  const [active, setActive] = useState(0);
  const [full, setFull] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const main = useTrack(active, setActive);

  useEffect(() => setSaved(readSaved().includes(handle)), [handle]);
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(t);
  }, [toast]);

  const step = useCallback((d: number) => setActive((i) => (i + d + items.length) % items.length), [items.length]);

  const toggleSaved = () => {
    const next = !saved;
    setSaved(next);
    try {
      const list = readSaved().filter((h) => h !== handle);
      localStorage.setItem(SAVED_KEY, JSON.stringify(next ? [...list, handle] : list));
    } catch {}
    setToast(next ? "Saved to your favourites" : "Removed from favourites");
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${title} · Mumma's Bite`, url });
      } catch {}
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setToast("Link copied");
    } catch {
      setToast("Couldn't copy the link");
    }
  };

  const shown = items.slice(0, MAX_THUMBS);
  const extra = items.length - shown.length;
  const iconBtn =
    "grid size-11 place-items-center rounded-full bg-bg/90 text-ink shadow-[0_2px_10px_rgba(40,30,20,0.15)] backdrop-blur transition-colors hover:text-green";

  return (
    <div className="grid gap-3 self-start sm:grid-cols-[4.5rem_1fr] sm:gap-4 lg:sticky lg:top-32" aria-label={`${title} images`} role="group">
      {/* Thumbnail rail */}
      <div className="order-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:order-1 sm:flex-col sm:overflow-visible sm:pb-0">
        {shown.map((it, i) => (
          <button
            key={it.key}
            type="button"
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            aria-label={it.kind === "video" ? `Play the product film (${i + 1} of ${items.length})` : `Show image ${i + 1} of ${items.length}`}
            aria-current={i === active}
            className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-cream transition-colors sm:w-full ${
              i === active ? "border-green" : "border-line hover:border-green/50"
            }`}
          >
            <Image src={thumbSrc(it)} alt="" fill sizes="72px" className="object-cover" />
            {it.kind === "video" && (
              <span aria-hidden className="absolute inset-0 grid place-items-center bg-ink/20">
                <span className="grid size-7 place-items-center rounded-full bg-bg/90 text-green">
                  <Play className="size-3.5 fill-current" />
                </span>
              </span>
            )}
          </button>
        ))}
        {extra > 0 && (
          <button
            type="button"
            onClick={() => {
              setActive(MAX_THUMBS);
              setFull(true);
            }}
            aria-label={`See ${extra} more images`}
            className="grid aspect-square w-16 shrink-0 place-items-center rounded-xl border-2 border-line text-sm font-bold text-ink-soft hover:border-green/50 sm:w-full"
          >
            {extra}+
          </button>
        )}
      </div>

      {/* Main image */}
      <div className="order-1 sm:order-2">
        <div data-hero-reveal="clip" className="relative overflow-hidden rounded-[2rem] bg-cream">
          <div
            ref={main.ref}
            onScroll={main.onScroll}
            className="flex aspect-[4/5] snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] sm:overflow-hidden"
          >
            {items.map((it, i) => (
              <button
                key={it.key}
                type="button"
                onClick={() => setFull(true)}
                tabIndex={i === active ? 0 : -1}
                aria-hidden={i !== active}
                aria-label={`Open full view of ${it.kind === "video" ? "the product film" : `image ${i + 1}`}`}
                className="relative h-full w-full shrink-0 snap-center cursor-zoom-in"
              >
                {it.kind === "video" ? (
                  <FilmSlide video={it.video} playing={i === active && !full} />
                ) : (
                  <Image
                    src={it.img.url}
                    alt={itemAlt(it, title)}
                    fill
                    priority={i === 0}
                    sizes="(min-width:1024px) 46vw, 100vw"
                    className="object-cover"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="absolute right-4 top-4 flex flex-col gap-2">
            <button type="button" onClick={share} aria-label={`Share ${title}`} className={iconBtn}>
              <Share2 className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={toggleSaved}
              aria-pressed={saved}
              aria-label={saved ? `Remove ${title} from favourites` : `Save ${title} to favourites`}
              className={iconBtn}
            >
              <Heart className={`size-5 ${saved ? "fill-brown text-brown" : ""}`} aria-hidden />
            </button>
          </div>

          {/* swipe dots (touch) */}
          <div aria-hidden className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5 sm:hidden">
            {items.map((it, i) => (
              <span key={it.key} className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-green" : "w-1.5 bg-ink/25"}`} />
            ))}
          </div>

          <p
            role="status"
            className={`pointer-events-none absolute left-1/2 top-4 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-green px-4 py-2 text-xs font-semibold text-cream transition-opacity ${
              toast ? "opacity-100" : "opacity-0"
            }`}
          >
            {toast && <Check className="size-4" aria-hidden />}
            {toast}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setFull(true)}
          className="mx-auto mt-3 flex min-h-11 items-center gap-2 text-sm font-semibold text-green underline-offset-4 hover:underline"
        >
          <Maximize2 className="size-4" aria-hidden />
          Click to see full view
        </button>
      </div>

      {full && <Lightbox items={items} title={title} index={active} setIndex={setActive} step={step} onClose={() => setFull(false)} />}
    </div>
  );
}

function Lightbox({
  items,
  title,
  index,
  setIndex,
  step,
  onClose,
}: {
  items: Item[];
  title: string;
  index: number;
  setIndex: (i: number) => void;
  step: (d: number) => void;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const track = useTrack(index, setIndex);
  useDialog(true, panel, onClose);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [step]);

  const navBtn =
    "absolute top-1/2 z-10 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-bg text-ink shadow-lg hover:text-green sm:grid";

  // Portal to <body>: ancestors with transforms (reveal motion, sticky) would
  // otherwise trap the fixed overlay inside the gallery column.
  return createPortal(
    <div
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label={`${title}: full view, ${index + 1} of ${items.length}`}
      tabIndex={-1}
      className="fixed inset-0 z-[70] flex flex-col bg-bg outline-none"
    >
      <div className="flex items-center justify-between px-5 py-3 md:px-8">
        <p className="text-sm font-semibold text-ink-soft">
          {title} · {index + 1} / {items.length}
        </p>
        <button type="button" onClick={onClose} aria-label="Close full view" className="grid size-11 place-items-center rounded-full hover:bg-cream">
          <X className="size-6" aria-hidden />
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        <div ref={track.ref} onScroll={track.onScroll} className="flex h-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]">
          {items.map((it, i) => (
            <div key={it.key} className="relative h-full w-full shrink-0 snap-center" aria-hidden={i !== index}>
              {it.kind === "video" ? (
                <FilmSlide video={it.video} playing={i === index} contain />
              ) : (
                <Image src={it.img.url} alt={itemAlt(it, title)} fill sizes="100vw" className="object-contain p-2 md:p-6" />
              )}
            </div>
          ))}
        </div>
        {items.length > 1 && (
          <>
            <button type="button" onClick={() => step(-1)} aria-label="Previous image" className={`${navBtn} left-4 md:left-8`}>
              <ChevronLeft className="size-6" aria-hidden />
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Next image" className={`${navBtn} right-4 md:right-8`}>
              <ChevronRight className="size-6" aria-hidden />
            </button>
          </>
        )}
      </div>

      <div className="flex justify-center gap-2 overflow-x-auto px-5 py-4 [scrollbar-width:none]">
        {items.map((it, i) => (
          <button
            key={it.key}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={it.kind === "video" ? "Play the product film" : `Show image ${i + 1}`}
            aria-current={i === index}
            className={`relative size-14 shrink-0 overflow-hidden rounded-lg border-2 bg-cream md:size-16 ${
              i === index ? "border-green" : "border-line"
            }`}
          >
            <Image src={thumbSrc(it)} alt="" fill sizes="64px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>,
    document.body,
  );
}
