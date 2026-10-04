"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Pause, Play, Send } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { MockNotice } from "@/components/ui/MockNotice";
import { MQ } from "@/lib/motion/gsap";

/**
 * Where submissions go. Set NEXT_PUBLIC_CONTACT_ENDPOINT to any form backend that
 * accepts a POSTed FormData body (e.g. Formspree, Basin, or a Shopify-app
 * endpoint). Until then the form validates but clearly says it isn't connected —
 * it never pretends a message was sent.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "";

type Status = "idle" | "sending" | "sent" | "error" | "not-connected";

/**
 * Contact — the end of the journey.
 *
 * MOTION CONTRACT — Walking gang film
 * Element: supplied clip, trimmed to the walking part only (0–4.95s; the talking
 *   that follows is removed), audio stripped, cropped to a cinematic strip.
 * Trigger: plays muted on loop only while ≥30% visible; pauses off-screen.
 * Pause/Play button always available (WCAG 2.2.2).
 * Reduced motion: never autoplays — poster frame + Play button.
 */
export function ContactSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const autoplay = window.matchMedia(MQ.motion).matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && autoplay && !userPaused.current) v.play().catch(() => {});
        else if (!e.isIntersecting) v.pause();
      },
      { threshold: 0.3 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!ENDPOINT) {
      setStatus("not-connected");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const field =
    "mt-2 block w-full rounded-2xl border border-line bg-white/70 px-4 py-3 text-base text-ink placeholder:text-ink-soft/60 transition-colors focus:border-green focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green";

  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20 pb-24 pt-6 md:pb-32">
      {/* The gang, walking in */}
      <div className="shell">
        <Reveal variant="clip" className="relative overflow-hidden rounded-[1.5rem] bg-black md:rounded-[2.5rem]">
          <video
            ref={videoRef}
            className="block aspect-[8/3] w-full object-cover"
            poster="/assets/gang-walk-poster.jpg"
            muted
            loop
            playsInline
            preload="none"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            aria-label="The walnut, pumpkin seed, almond, sunflower seed, black seed, date, pistachio and cashew characters walking along hand in hand."
          >
            <source src="/assets/gang-walk.webm" type="video/webm" />
            <source src="/assets/gang-walk.mp4" type="video/mp4" />
          </video>
          <button
            onClick={toggle}
            className="on-dark m-2 inline-flex min-h-11 items-center gap-2 rounded-full bg-white/15 px-4 text-xs font-bold uppercase tracking-[0.14em] text-cream backdrop-blur transition-colors hover:bg-white/25 md:absolute md:bottom-5 md:left-5 md:m-0"
            aria-label={playing ? "Pause the walking ingredients" : "Play the walking ingredients"}
          >
            {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
            {playing ? "Pause" : "Play"}
          </button>
        </Reveal>
      </div>

      <div className="shell mt-14 grid gap-12 md:mt-20 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow mb-6 text-brown">Contact</p>
          <h2 id="contact-title" className="display text-[clamp(2.5rem,6vw,4.75rem)] text-green">
            Say <span className="editorial text-brown">hello.</span>
          </h2>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-ink-soft">
            Questions about an order, a bulk request, or just want to tell us how your bite was? Write to us.
          </p>
          <MockNotice className="mt-8 max-w-sm">
            Email, phone and address: content required. They&apos;ll appear here once confirmed.
          </MockNotice>
        </Reveal>

        <Reveal>
          <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2" noValidate={false}>
            <label className="text-sm font-semibold text-ink">
              Name
              <input name="name" type="text" required autoComplete="name" className={field} />
            </label>
            <label className="text-sm font-semibold text-ink">
              Email
              <input name="email" type="email" required autoComplete="email" className={field} />
            </label>
            <label className="text-sm font-semibold text-ink sm:col-span-2">
              Phone <span className="font-normal text-ink-soft">(optional)</span>
              <input name="phone" type="tel" autoComplete="tel" inputMode="tel" className={field} />
            </label>
            <label className="text-sm font-semibold text-ink sm:col-span-2">
              Message
              <textarea name="message" required rows={5} className={`${field} resize-y`} />
            </label>
            {/* honeypot for form backends that support it */}
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

            <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
              <Button type="submit" disabled={status === "sending"} className="sm:w-auto">
                <Send className="size-4" aria-hidden />
                {status === "sending" ? "Sending…" : "Send message"}
              </Button>
              <p role="status" aria-live="polite" className="text-sm text-ink-soft">
                {status === "sent" && <span className="font-semibold text-green">Thank you — we&apos;ll get back to you soon.</span>}
                {status === "error" && <span className="text-brown">Something went wrong. Please try again.</span>}
                {status === "not-connected" && (
                  <span className="text-brown">
                    The contact form isn&apos;t connected yet, so this message was not sent.
                  </span>
                )}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
