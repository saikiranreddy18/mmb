import { IdCard, LogOut, MapPin, Package, Settings, UserRound, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { IntroReveal } from "@/components/motion/IntroReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink, buttonClass } from "@/components/ui/Button";
import { BrandImage } from "@/components/ui/BrandImage";
import { assets } from "@/content/assets";
import type { Customer, CustomerSession, MailingAddress } from "@/lib/commerce/types";
import { OrderHistory } from "./OrderHistory";

const sections = [
  { id: "my-profile", label: "My Profile", icon: UserRound },
  { id: "my-orders", label: "My Orders", icon: Package },
  { id: "saved-details", label: "Saved Details", icon: IdCard },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "account-settings", label: "Account Settings", icon: Settings },
] as const;

function Card({ id, label, icon: Icon, children }: { id: string; label: string; icon: LucideIcon; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 rounded-[1.75rem] border border-line bg-white/60 p-6 md:p-8">
      <h2 id={`${id}-title`} className="eyebrow mb-5 flex items-center gap-2.5 text-green">
        <Icon className="size-4" strokeWidth={2} aria-hidden />
        {label}
      </h2>
      {children}
    </section>
  );
}

const Pending = ({ children }: { children: ReactNode }) => (
  <p className="leading-relaxed text-ink-soft">{children}</p>
);

function formatAddress(a: MailingAddress) {
  return [a.address1, a.address2, a.city, a.province, a.zip, a.country].filter(Boolean).join(", ");
}

/**
 * Customer profile. Renders three honest states:
 *   not-connected — Shopify customer accounts not enabled yet (current)
 *   signed-out    — prompt to sign in via Shopify
 *   signed-in     — real Shopify customer data
 */
export function Profile({ session }: { session: CustomerSession }) {
  const customer: Customer | null = session.status === "signed-in" ? session.customer : null;
  const name = customer ? [customer.firstName, customer.lastName].filter(Boolean).join(" ") : null;

  return (
    <div className="pb-24 pt-28 md:pb-32 md:pt-40">
      <IntroReveal className="shell">
        <p data-hero-reveal="fade" className="eyebrow mb-6 text-brown">
          Profile
        </p>
        <h1 className="overflow-hidden pb-[0.1em] text-green">
          <span data-hero-reveal="line" className="display block text-[clamp(2.75rem,8vw,6rem)]">
            {name ? (
              <>
                Hello, <span className="editorial text-brown">{customer?.firstName}.</span>
              </>
            ) : (
              <>
                Your <span className="editorial text-brown">account.</span>
              </>
            )}
          </span>
        </h1>

        {session.status !== "signed-in" && (
          <div
            data-hero-reveal="fade"
            className="mt-10 grid items-center gap-8 overflow-hidden rounded-[2rem] bg-cream p-6 md:grid-cols-[auto_1fr] md:p-10"
          >
            <div className="mx-auto aspect-[4/5] w-36 overflow-hidden rounded-t-full md:w-44">
              <BrandImage asset={assets.mascot} tone="light" decorative sizes="11rem" className="!gap-1 !p-3 [&>span:last-child]:text-[0.6rem]" />
            </div>
            <div>
              {session.status === "not-connected" ? (
                <>
                  <p className="text-2xl font-extrabold uppercase tracking-tight text-green md:text-3xl">
                    Almost ready <span className="editorial normal-case text-brown">for you.</span>
                  </p>
                  <p className="mt-3 max-w-lg leading-relaxed text-ink-soft">
                    Your account will connect to Shopify when commerce is enabled. Sign-in, orders and saved addresses
                    will appear here — nothing on this page is stored yet.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-extrabold uppercase tracking-tight text-green md:text-3xl">Welcome back.</p>
                  <p className="mt-3 max-w-lg leading-relaxed text-ink-soft">Sign in to see your orders and details.</p>
                  <a href={session.loginUrl} className={buttonClass("primary", "mt-6")}>
                    Sign in
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </IntroReveal>

      <div className="shell mt-12 grid gap-10 md:mt-16 lg:grid-cols-[14rem_1fr] lg:gap-16">
        <nav aria-label="Account sections" className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 lg:flex-col lg:gap-1 lg:overflow-visible">
            {sections.map((s) => (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  className="flex min-h-11 items-center gap-2.5 whitespace-nowrap rounded-full border border-line px-4 text-sm font-semibold text-ink-soft transition-colors hover:border-green hover:text-green lg:border-transparent lg:px-3"
                >
                  <s.icon className="size-4" aria-hidden /> {s.label}
                </a>
              </li>
            ))}
            <li className="shrink-0 lg:mt-4 lg:border-t lg:border-line lg:pt-4">
              {session.status === "signed-in" ? (
                <a href={session.logoutUrl} className="flex min-h-11 items-center gap-2.5 rounded-full px-4 text-sm font-semibold text-brown hover:bg-cream lg:px-3">
                  <LogOut className="size-4" aria-hidden /> Logout
                </a>
              ) : (
                <button
                  disabled
                  aria-describedby="logout-note"
                  className="relative flex min-h-11 cursor-not-allowed items-center gap-2.5 rounded-full px-4 text-sm font-semibold text-ink-soft/60 lg:px-3"
                >
                  <LogOut className="size-4" aria-hidden /> Logout
                  <span id="logout-note" className="sr-only">
                    Not available until accounts are connected
                  </span>
                </button>
              )}
            </li>
          </ul>
        </nav>

        <Reveal stagger={0.08} className="grid min-w-0 gap-6">
          <Card {...sections[0]}>
            {customer ? (
              <dl className="grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="eyebrow text-ink-soft">Name</dt>
                  <dd className="mt-2 font-semibold">{name || "—"}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-ink-soft">Email</dt>
                  <dd className="mt-2 break-all font-semibold">{customer.email ?? "—"}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-ink-soft">Account status</dt>
                  <dd className="mt-2 font-semibold text-green">Active</dd>
                </div>
              </dl>
            ) : (
              <dl className="grid gap-4 sm:grid-cols-3">
                {["Name", "Email", "Account status"].map((label) => (
                  <div key={label}>
                    <dt className="eyebrow text-ink-soft">{label}</dt>
                    <dd className="mt-2 text-ink-soft">{label === "Account status" ? "Not connected" : "—"}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Card>

          <Card {...sections[1]}>
            <OrderHistory orders={customer?.orders ?? []} />
          </Card>

          <Card {...sections[2]}>
            {customer ? (
              <p className="font-semibold">{customer.phone ?? "No phone number saved."}</p>
            ) : (
              <Pending>Saved contact details will come from your Shopify account.</Pending>
            )}
          </Card>

          <Card {...sections[3]}>
            {customer?.addresses.length ? (
              <ul className="grid gap-4 sm:grid-cols-2">
                {customer.addresses.map((a) => (
                  <li key={a.id} className="rounded-2xl bg-cream/60 p-4 text-sm leading-relaxed">
                    {a.id === customer.defaultAddress?.id && <p className="eyebrow mb-2 text-green">Default</p>}
                    {formatAddress(a)}
                  </li>
                ))}
              </ul>
            ) : (
              <Pending>{customer ? "No saved addresses yet." : "Addresses you save at checkout will appear here."}</Pending>
            )}
          </Card>

          <Card {...sections[4]}>
            <Pending>
              {customer
                ? "Manage your password and preferences in your Shopify account."
                : "Account settings become available once Shopify customer accounts are enabled."}
            </Pending>
            {!customer && (
              <ButtonLink href="/shop" variant="secondary" className="mt-6">
                Continue shopping
              </ButtonLink>
            )}
          </Card>
        </Reveal>
      </div>
    </div>
  );
}
