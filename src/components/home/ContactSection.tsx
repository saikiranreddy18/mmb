"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Mail, MapPin } from "lucide-react";
import { ADDRESS, SUPPORT_EMAIL, whatsappLink } from "@/content/contact";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { TalkingIngredients } from "./TalkingIngredients";

/**
 * Where submissions go. Set NEXT_PUBLIC_CONTACT_ENDPOINT to any form backend that
 * accepts a POSTed FormData body (e.g. Formspree, Basin, or a Shopify-app
 * endpoint). Until then the form opens the visitor's email app with the message
 * addressed to support, and says so — it never pretends a message was sent.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "";

type Status = "idle" | "sending" | "sent" | "error" | "mail-app";

/**
 * Contact — the end of the journey. The ingredients say what they bring
 * (see TalkingIngredients), then the form.
 */
export function ContactSection() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!ENDPOINT) {
      // No form service connected: hand the message to the visitor's email app,
      // addressed to support, rather than pretend it was sent.
      const d = new FormData(form);
      const body = [`Name: ${d.get("name") ?? ""}`, `Email: ${d.get("email") ?? ""}`, d.get("phone") ? `Phone: ${d.get("phone")}` : null, "", String(d.get("message") ?? "")]
        .filter((l) => l !== null)
        .join("\n");
      window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Message from mummasbite.com")}&body=${encodeURIComponent(body)}`;
      setStatus("mail-app");
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
      {/* The ingredients, taking turns to talk */}
      <TalkingIngredients />

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
            <WhatsAppIcon />
            Chat on WhatsApp
          </a>
          <p className="mt-3 text-sm text-ink-soft">Opens WhatsApp with a message to us. Usually the quickest way to reach us.</p>
          <address className="mt-8 space-y-3 text-base not-italic leading-relaxed text-ink-soft">
            <p className="flex items-center gap-3">
              <Mail className="size-5 shrink-0 text-green" aria-hidden />
              <a href={`mailto:${SUPPORT_EMAIL}`} className="-my-2 inline-flex min-h-11 items-center font-semibold text-green underline-offset-4 hover:underline">
                {SUPPORT_EMAIL}
              </a>
            </p>
            <p className="flex gap-3">
              <MapPin className="mt-1 size-5 shrink-0 text-green" aria-hidden />
              <span>
                {ADDRESS.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </span>
            </p>
          </address>
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
                {status === "mail-app" && (
                  <span className="text-ink-soft">
                    Your email app should open with your message to {SUPPORT_EMAIL}; press Send there. Nothing opened? Email us at{" "}
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-green underline">
                      {SUPPORT_EMAIL}
                    </a>{" "}
                    or chat on WhatsApp.
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
