import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Store } from "lucide-react";
import { Wordmark } from "@/components/ui/Wordmark";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { storyPublished } from "@/content/brand";
import { ACCOUNT_URL, ADDRESS, SUPPORT_EMAIL, whatsappLink } from "@/content/contact";
import { POLICY_LINKS } from "@/content/policies";
import { mockProducts } from "@/lib/commerce/mock/products";

type FooterLink = { href: string; label: string; external?: boolean };

const QUICK_LINKS: FooterLink[] = [
  { href: "/", label: "Home" },
  ...(storyPublished ? [{ href: "/our-story", label: "Our Story" }] : []),
  { href: "/shop", label: "Shop" },
  { href: "/shop#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact Us" },
  // Shopify customer accounts: order history and tracking.
  { href: ACCOUNT_URL, label: "Track Order", external: true },
  { href: ACCOUNT_URL, label: "My Account", external: true },
];

const SHOP_LINKS: FooterLink[] = [
  ...mockProducts.map((p) => ({ href: `/shop/${p.handle}`, label: p.title })),
  { href: "/healthy-snack-bars", label: "Healthy Snack Bars Guide" },
  { href: "/shop", label: "All Products" },
];

const INFO_LINKS: FooterLink[] = POLICY_LINKS.map((l) => ({
  href: `/policies/${l.slug}`,
  label: {
    "shipping-policy": "Shipping Policy",
    "refund-policy": "Refund & Cancellation Policy",
    "terms-of-service": "Terms of Service",
    "privacy-policy": "Privacy Policy",
    "contact-information": "Contact Information",
  }[l.slug],
}));

const linkClass = "-my-1.5 inline-flex min-h-11 items-center text-[0.95rem] text-ink-soft transition-colors hover:text-green hover:underline underline-offset-4";
const iconCircle =
  "grid size-11 place-items-center rounded-full border border-ink/25 text-ink transition-colors hover:border-green hover:bg-green hover:text-cream";

function LinkColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="mb-5 text-xl font-bold text-ink">{title}</h2>
      <ul className="space-y-1">
        {links.map((l) => (
          <li key={l.label}>
            {l.external ? (
              <a href={l.href} className={linkClass}>
                {l.label}
              </a>
            ) : (
              <Link href={l.href} className={linkClass}>
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-green-100 text-ink">
      <div className="shell grid gap-12 py-16 sm:grid-cols-2 md:py-20 lg:grid-cols-[1.35fr_1fr_1fr_1.1fr] lg:gap-10">
        <div>
          <h2 className="mb-5 text-xl font-bold">Contact Us</h2>
          <address className="space-y-4 text-[0.95rem] not-italic leading-relaxed text-ink-soft">
            <p className="flex items-center gap-4">
              <Store className="size-6 shrink-0 text-green" strokeWidth={1.5} aria-hidden />
              <span className="font-semibold text-ink">Mumma&apos;s Bite</span>
            </p>
            <p className="flex gap-4">
              <MapPin className="mt-0.5 size-6 shrink-0 text-green" strokeWidth={1.5} aria-hidden />
              <span>
                {ADDRESS.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </span>
            </p>
            <p className="flex items-center gap-4">
              <WhatsAppIcon className="size-6 shrink-0 text-green" />
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="-my-2 inline-flex min-h-11 items-center font-semibold text-ink underline-offset-4 hover:text-green hover:underline"
              >
                Chat on WhatsApp
              </a>
            </p>
            <p className="flex items-center gap-4">
              <Mail className="size-6 shrink-0 text-green" strokeWidth={1.5} aria-hidden />
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="-my-2 inline-flex min-h-11 items-center break-all font-semibold text-ink underline-offset-4 hover:text-green hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
            </p>
          </address>
          <div className="mt-6 flex gap-3">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp" className={iconCircle}>
              <WhatsAppIcon />
            </a>
            <a href={`mailto:${SUPPORT_EMAIL}`} aria-label={`Email us at ${SUPPORT_EMAIL}`} className={iconCircle}>
              <Mail className="size-5" aria-hidden />
            </a>
          </div>
        </div>
        <LinkColumn title="Quick Links" links={QUICK_LINKS} />
        <LinkColumn title="Shop" links={SHOP_LINKS} />
        <LinkColumn title="Information" links={INFO_LINKS} />
      </div>
      <div className="border-t border-ink/10">
        <div className="shell flex flex-col items-start gap-5 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <Wordmark className="!h-10" />
            {/* Official FSSAI mark shown with the licence number (white tile keeps its colours true) */}
            <div className="inline-flex items-center gap-3 rounded-lg bg-white px-3 py-2">
              <Image src="/assets/fssai-logo.png" alt="FSSAI" width={480} height={267} className="h-7 w-auto" />
              <span className="text-xs font-semibold leading-tight text-ink">
                <span className="block text-[0.6rem] font-bold uppercase tracking-[0.14em] text-ink-soft">Lic. No.</span>
                20126052001147
              </span>
            </div>
          </div>
          <p className="text-xs text-ink-soft">
            © {new Date().getFullYear()} Mumma&apos;s Bite · Made with a mother&apos;s love.
          </p>
        </div>
      </div>
    </footer>
  );
}
