"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronLeft, ChevronRight, Heart, Maximize2, Share2, X } from "lucide-react";
import { useDialog } from "@/components/ui/useDialog";
import type { ShopifyImage } from "@/lib/commerce/types";

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
 * ←/→ step through images, focus is trapped and returned to the trigger.
 */
export function ProductGallery({ images, title, handle }: { images: ShopifyImage[]; title: string; handle: string }) {
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

  const step = useCallback((d: number) => setActive((i) => (i + d + images.length) % images.length), [images.length]);

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

  const shown = images.slice(0, MAX_THUMBS);
  const extra = images.length - shown.length;
  const iconBtn =
    "grid size-11 place-items-center rounded-full bg-bg/90 text-ink shadow-[0_2px_10px_rgba(40,30,20,0.15)] backdrop-blur transition-colors hover:text-green";

  return (
    <div className="grid gap-3 self-start sm:grid-cols-[4.5rem_1fr] sm:gap-4 lg:sticky lg:top-32" aria-label={`${title} images`} role="group">
      {/* Thumbnail rail */}
      <div className="order-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:order-1 sm:flex-col sm:overflow-visible sm:pb-0">
        {shown.map((img, i) => (
          <button
            key={img.url}
            type="button"
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            aria-label={`Show image ${i + 1} of ${images.length}`}
            aria-current={i === active}
            className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-cream transition-colors sm:w-full ${
              i === active ? "border-green" : "border-line hover:border-green/50"
            }`}
          >
            <Image src={img.url} alt="" fill sizes="72px" className="object-cover" />
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
            {images.map((img, i) => (
              <button
                key={img.url}
                type="button"
                onClick={() => setFull(true)}
                tabIndex={i === active ? 0 : -1}
                aria-hidden={i !== active}
                aria-label={`Open full view of image ${i + 1}`}
                className="relative h-full w-full shrink-0 snap-center cursor-zoom-in"
              >
                <Image
                  src={img.url}
                  alt={img.altText ?? title}
                  fill
                  priority={i === 0}
                  sizes="(min-width:1024px) 46vw, 100vw"
                  className="object-cover"
                />
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
            {images.map((img, i) => (
              <span key={img.url} className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-green" : "w-1.5 bg-ink/25"}`} />
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

      {full && <Lightbox images={images} title={title} index={active} setIndex={setActive} step={step} onClose={() => setFull(false)} />}
    </div>
  );
}

function Lightbox({
  images,
  title,
  index,
  setIndex,
  step,
  onClose,
}: {
  images: ShopifyImage[];
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
      aria-label={`${title}: full view, image ${index + 1} of ${images.length}`}
      tabIndex={-1}
      className="fixed inset-0 z-[70] flex flex-col bg-bg outline-none"
    >
      <div className="flex items-center justify-between px-5 py-3 md:px-8">
        <p className="text-sm font-semibold text-ink-soft">
          {title} · {index + 1} / {images.length}
        </p>
        <button type="button" onClick={onClose} aria-label="Close full view" className="grid size-11 place-items-center rounded-full hover:bg-cream">
          <X className="size-6" aria-hidden />
        </button>
      </div>

      <div className="relative min-h-0 flex-1">
        <div ref={track.ref} onScroll={track.onScroll} className="flex h-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]">
          {images.map((img, i) => (
            <div key={img.url} className="relative h-full w-full shrink-0 snap-center" aria-hidden={i !== index}>
              <Image src={img.url} alt={img.altText ?? title} fill sizes="100vw" className="object-contain p-2 md:p-6" />
            </div>
          ))}
        </div>
        {images.length > 1 && (
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
        {images.map((img, i) => (
          <button
            key={img.url}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show image ${i + 1}`}
            aria-current={i === index}
            className={`relative size-14 shrink-0 overflow-hidden rounded-lg border-2 bg-cream md:size-16 ${
              i === index ? "border-green" : "border-line"
            }`}
          >
            <Image src={img.url} alt="" fill sizes="64px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>,
    document.body,
  );
}
