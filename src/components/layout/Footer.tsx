import Image from "next/image";
import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { brand } from "@/content/brand";
import { navItems } from "./nav";
import { Mail, MapPin } from "lucide-react";
import { ADDRESS, SUPPORT_EMAIL, whatsappLink } from "@/content/contact";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { POLICY_LINKS } from "@/content/policies";

export function Footer() {
  return (
    <footer className="on-dark bg-green-900 text-cream">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr] md:py-20">
        <div className="space-y-6">
          <Wordmark onDark className="h-20" />
          <p className="max-w-[18ch] text-4xl font-extrabold uppercase leading-[0.95] tracking-tight md:text-5xl">
            Made with <span className="editorial block text-gold">a mother&apos;s love.</span>
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-cream/80">{brand.supporting.value}</p>
          {/* Official FSSAI mark shown with the licence number (white tile keeps its colours true) */}
          <div className="inline-flex items-center gap-4 rounded-xl bg-white px-4 py-3">
            <Image src="/assets/fssai-logo.png" alt="FSSAI" width={480} height={267} className="h-11 w-auto" />
            <span className="h-8 w-px bg-ink/15" aria-hidden />
            <span className="text-sm font-semibold leading-tight text-ink">
              <span className="block text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ink-soft">Lic. No.</span>
              20126052001147
            </span>
          </div>
          <address className="space-y-2 text-sm not-italic leading-relaxed text-cream/80">
            <p className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
              <span>
                {ADDRESS.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </span>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-gold" aria-hidden />
              <a href={`mailto:${SUPPORT_EMAIL}`} className="-my-2 inline-flex min-h-11 items-center underline-offset-4 hover:text-gold hover:underline">
                {SUPPORT_EMAIL}
              </a>
            </p>
          </address>
        </div>
        <nav aria-label="Footer" className="md:justify-self-end">
          <p className="eyebrow mb-5 text-cream/60">Explore</p>
          <ul className="space-y-1">
            {[...navItems, { href: "/#contact", label: "Contact" }].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center text-lg font-semibold text-cream/90 transition-colors hover:text-gold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-cream/10">
        <div className="shell flex flex-col gap-2 py-6 text-xs text-cream/60 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Mumma's Bite</p>
          <nav aria-label="Policies">
            <ul className="flex flex-wrap gap-x-4">
              {POLICY_LINKS.map((l) => (
                <li key={l.slug}>
                  <Link href={`/policies/${l.slug}`} className="-my-2 inline-flex min-h-11 items-center hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-1">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp"
              className="grid size-11 place-items-center rounded-full text-cream/80 transition-colors hover:bg-cream/10 hover:text-gold"
            >
              <WhatsAppIcon />
            </a>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              aria-label={`Email us at ${SUPPORT_EMAIL}`}
              className="grid size-11 place-items-center rounded-full text-cream/80 transition-colors hover:bg-cream/10 hover:text-gold"
            >
              <Mail className="size-5" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
