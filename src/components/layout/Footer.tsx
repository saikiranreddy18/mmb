import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { brand } from "@/content/brand";
import { navItems } from "./nav";
import { WHATSAPP_DISPLAY, whatsappLink } from "@/content/contact";

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
          <div className="inline-flex items-center gap-3 rounded-xl border border-cream/20 px-4 py-3">
            <span className="text-lg font-black italic tracking-tight text-cream">fssai</span>
            <span className="h-6 w-px bg-cream/25" aria-hidden />
            <span className="text-sm leading-tight text-cream/85">
              <span className="block text-[0.65rem] font-bold uppercase tracking-[0.16em] text-cream/60">FSSAI Lic. No.</span>
              20126052001147
            </span>
          </div>
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
          <p>
            WhatsApp:{" "}
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="underline hover:text-gold">
              {WHATSAPP_DISPLAY}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
