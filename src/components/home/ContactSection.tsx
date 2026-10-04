"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_DISPLAY, whatsappLink } from "@/content/contact";
import { WalkingGang } from "./WalkingGang";

/**
 * Where submissions go. Set NEXT_PUBLIC_CONTACT_ENDPOINT to any form backend that
 * accepts a POSTed FormData body (e.g. Formspree, Basin, or a Shopify-app
 * endpoint). Until then the form validates but clearly says it isn't connected —
 * it never pretends a message was sent.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "";

type Status = "idle" | "sending" | "sent" | "error" | "not-connected";

/**
 * Contact — the end of the journey. The ingredient gang walks across the top
 * of the section (see WalkingGang), then the form.
 */
export function ContactSection() {
  const [status, setStatus] = useState<Status>("idle");

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
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20 pb-24 pt-14 md:pb-32 md:pt-20">
      {/* The gang, walking in across the page */}
      <WalkingGang />

      <div className="shell mt-14 grid gap-12 md:mt-20 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow mb-6 text-brown">Contact</p>
          <h2 id="contact-title" className="display text-[clamp(2.5rem,6vw,4.75rem)] text-green">
            Say <span className="editorial text-brown">hello.</span>
          </h2>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-ink-soft">
            Questions about an order, a bulk request, or just want to tell us how your bite was? Write to us.
          </p>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#1f8f4e] px-6 text-sm font-bold text-white transition-colors hover:bg-[#177a41]"
          >
            <MessageCircle className="size-5" aria-hidden />
            Chat on WhatsApp
            <span className="font-semibold opacity-85">{WHATSAPP_DISPLAY}</span>
          </a>
          <p className="mt-3 text-sm text-ink-soft">Opens WhatsApp with a message to us. Usually the quickest way to reach us.</p>
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
