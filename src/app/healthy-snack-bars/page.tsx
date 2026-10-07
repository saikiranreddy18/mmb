import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { getProducts } from "@/lib/commerce/products";
import { FREE_DELIVERY_MIN, OFFER_TIERS } from "@/lib/commerce/offers";
import { lowestPerBarAcross, summarise, type ProductSummary } from "@/lib/seo/product-summary";
import { siteName, siteUrl } from "@/lib/seo/site";

/**
 * Answer-style guide for "affordable healthy snack bar" / "dry fruit bar"
 * searches, in search engines and AI assistants alike. Every number on this page
 * comes from the verified label data and live prices, so it stays true as
 * prices and labels change.
 */

const PATH = "/healthy-snack-bars";
const TITLE = "Affordable Healthy Snack Bars & Dry Fruit Bars in India";
const DESCRIPTION =
  "Affordable healthy snack bars and dry fruit bars from Mumma's Bite: price per bar, nutrition and FAQs. Dates, nuts and seeds, no added sugar.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: `${TITLE} | ${siteName}`, description: DESCRIPTION, url: PATH },
  twitter: { card: "summary_large_image", title: `${TITLE} | ${siteName}`, description: DESCRIPTION },
};

const maxPercent = Math.max(...OFFER_TIERS.map((t) => t.percent));
const firstOffer = OFFER_TIERS[0];
const maxOffer = OFFER_TIERS.find((t) => t.percent === maxPercent)!;
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function faq(s: ProductSummary[], from: string | null) {
  const dry = s.find((p) => /dry fruit/i.test(p.title));
  const seed = s.find((p) => /seed/i.test(p.title));
  const items: { q: string; a: string }[] = [
    {
      q: "What is an affordable healthy snack bar in India?",
      a: `Mumma's Bite makes dry fruit and multi-seed energy bars from dates, nuts and seeds, with no added sugar and no preservatives${from ? `, from ${from} per bar` : ""}. They are made in Visakhapatnam and delivered across India.`,
    },
    {
      q: "How much does a dry fruit bar cost?",
      a: dry?.perBar
        ? `A Mumma's Bite Dry Fruit Energy Bar costs from ${dry.perBar} per bar${dry.barWeight ? ` (${dry.barWeight})` : ""}, sold in packs. Bigger packs cost less per bar, and orders of ${inr(firstOffer.min)} or more get ${firstOffer.percent}% off.`
        : "Prices for each pack, and the price per bar, are shown on the product page.",
    },
    {
      q: "Are dry fruit bars healthy?",
      a: `They can be a wholesome snack when they are made from whole ingredients without added sugar. ${dry?.ingredients ? `The Mumma's Bite Dry Fruit bar is ${dry.ingredients.toLowerCase()}.` : ""} The sweetness comes from dates, so the bars contain the natural sugar of the fruit${dry?.totalSugars ? ` (${dry.totalSugars} per bar)` : ""}. Eat them as a snack, not a meal replacement.`,
    },
    {
      q: "Do these snack bars have added sugar?",
      a: "No. There is no added sugar, no jaggery or syrup, and no preservatives. Dates hold the bars together and sweeten them.",
    },
    {
      q: "Which bar has more protein?",
      a:
        dry?.protein && seed?.protein
          ? `Each Dry Fruit bar has ${dry.protein} of protein and each Multi-Seed bar has ${seed.protein}, from the nuts and seeds. They are a wholesome snack, not a high-protein supplement.`
          : "Both bars get their protein from nuts and seeds; see each product's nutrition table.",
    },
    {
      q: "Is there a nut-free option?",
      a: `No. ${[dry?.allergens && `Dry Fruit bar: ${dry.allergens}`, seed?.allergens && `Multi-Seed bar: ${seed.allergens}`].filter(Boolean).join(" ") || "Both bars contain nuts or seeds."} Please avoid them if you have these allergies.`,
    },
    {
      q: "Where can I buy healthy snack bars online in India?",
      a: `Order directly from mummasbite.com. Delivery is ₹79 anywhere in India, and free when your order total after offers is ${inr(FREE_DELIVERY_MIN)} or more. Payment is by UPI, card, net banking or wallet through Razorpay.`,
    },
  ];
  return items;
}

export default async function HealthySnackBarsPage() {
  const products = (await getProducts()).filter((p) => !p.isMock);
  const summaries = products.map(summarise);
  const from = lowestPerBarAcross(summaries);
  const questions = faq(summaries, from);
  const url = `${siteUrl}${PATH}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#page`,
        url,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "en-IN",
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#organization` },
        mainEntity: { "@id": `${url}#products` },
      },
      {
        "@type": "ItemList",
        "@id": `${url}#products`,
        name: "Mumma's Bite healthy snack bars",
        itemListElement: products.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${siteUrl}/shop/${p.handle}`,
          name: p.title,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: questions.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Healthy snack bars", item: url },
        ],
      },
    ],
  };

  const rows: { label: string; get: (s: ProductSummary) => string | null }[] = [
    { label: "Price per bar", get: (s) => (s.perBar ? `from ${s.perBar}` : null) },
    { label: "Bar size", get: (s) => s.barWeight },
    { label: "Calories", get: (s) => s.calories },
    { label: "Protein", get: (s) => s.protein },
    { label: "Fibre", get: (s) => s.fibre },
    { label: "Sugar", get: (s) => (s.totalSugars ? `${s.totalSugars} natural, ${s.addedSugars ?? "0 g"} added` : null) },
    { label: "Ingredients", get: (s) => s.ingredients },
    { label: "Allergens", get: (s) => s.allergens },
    { label: "Shelf life", get: (s) => s.shelfLife },
  ];

  return (
    <article className="pb-24 pt-32 md:pb-32 md:pt-44">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="shell max-w-4xl">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-soft">
          <Link href="/" className="hover:text-green hover:underline">
            Home
          </Link>{" "}
          / Healthy snack bars
        </nav>
        <h1 className="display text-[clamp(2.25rem,6vw,4.5rem)] text-green">
          Affordable healthy snack bars, <span className="editorial text-brown">made from dates, nuts and seeds.</span>
        </h1>
        <p className="mt-8 text-lg leading-relaxed text-ink">
          <strong>Mumma&apos;s Bite</strong> makes affordable, healthy snack bars in India: a{" "}
          <Link href="/shop/dry-fruit-energy-bar" className="font-semibold text-green underline underline-offset-4">
            Dry Fruit Energy Bar
          </Link>{" "}
          and a{" "}
          <Link href="/shop/multi-seed-energy-bar" className="font-semibold text-green underline underline-offset-4">
            Multi-Seed Energy Bar
          </Link>
          {from ? <>, from {from} per bar</> : null}. Both are made from whole dates, nuts and seeds, with{" "}
          <strong>no added sugar and no preservatives</strong>, in a home kitchen in Visakhapatnam, and delivered
          across India.
        </p>
      </header>

      <section aria-labelledby="compare-title" className="shell mt-16 max-w-4xl">
        <h2 id="compare-title" className="text-2xl font-bold text-green md:text-3xl">
          Dry fruit bar vs multi-seed bar
        </h2>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white/60">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="p-4 font-semibold text-ink-soft">
                  Per bar
                </th>
                {summaries.map((s) => (
                  <th key={s.handle} scope="col" className="p-4 font-bold text-green">
                    <Link href={`/shop/${s.handle}`} className="hover:underline">
                      {s.title}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows
                .filter((r) => summaries.some((s) => r.get(s)))
                .map((r) => (
                  <tr key={r.label}>
                    <th scope="row" className="p-4 align-top font-semibold text-ink">
                      {r.label}
                    </th>
                    {summaries.map((s) => (
                      <td key={s.handle} className="p-4 align-top leading-relaxed text-ink-soft">
                        {r.get(s) ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink-soft">Nutrition from the pack labels. "From" is the lowest price per bar across pack sizes; see each product for every pack.</p>
      </section>

      <section aria-labelledby="why-title" className="shell mt-16 grid max-w-4xl gap-10 md:grid-cols-2">
        <div>
          <h2 id="why-title" className="text-2xl font-bold text-green">
            What makes them a healthy snack
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-ink-soft">
            <li>Whole ingredients you can read: dates, nuts and seeds.</li>
            <li>No added sugar, jaggery or syrup. The sweetness comes from dates.</li>
            <li>No preservatives.</li>
            <li>Fibre and plant protein from nuts and seeds.</li>
            <li>FSSAI licensed (Lic. No. 20126052001147).</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-green">Why they&apos;re affordable</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-ink-soft">
            {from && <li>Bars start from {from} each.</li>}
            <li>Bigger packs cost less per bar.</li>
            <li>
              {firstOffer.percent}% off orders of {inr(firstOffer.min)} or more, and {maxOffer.percent}% off from{" "}
              {inr(maxOffer.min)}.
            </li>
            <li>Free delivery across India when your order is {inr(FREE_DELIVERY_MIN)} or more after offers.</li>
            <li>Sold directly by the people who make them, with no middlemen.</li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="for-title" className="shell mt-16 max-w-4xl">
        <h2 id="for-title" className="text-2xl font-bold text-green">
          Good for
        </h2>
        <p className="mt-4 leading-relaxed text-ink-soft">
          School tiffins, office desks, a pre- or post-workout bite, long drives and train journeys, and anyone who
          wants a sweet snack without added sugar. Each bar is about 4 × 5 cm, so it fits in a lunch box or a pocket.
        </p>
      </section>

      <section aria-labelledby="faq-title" className="shell mt-16 max-w-4xl">
        <h2 id="faq-title" className="text-2xl font-bold text-green md:text-3xl">
          Questions people ask
        </h2>
        <dl className="mt-6 divide-y divide-line border-y border-line">
          {questions.map(({ q, a }) => (
            <div key={q} className="py-5">
              <dt className="font-semibold text-ink">{q}</dt>
              <dd className="mt-2 leading-relaxed text-ink-soft">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="shell mt-14 flex max-w-4xl flex-col gap-3 sm:flex-row">
        <ButtonLink href="/shop">Shop the bars</ButtonLink>
        <ButtonLink href="/shop/dry-fruit-energy-bar" variant="secondary">
          Dry Fruit Energy Bar
        </ButtonLink>
        <ButtonLink href="/shop/multi-seed-energy-bar" variant="secondary">
          Multi-Seed Energy Bar
        </ButtonLink>
      </div>
    </article>
  );
}
