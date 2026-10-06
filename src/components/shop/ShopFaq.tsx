import { FAQ } from "@/content/faq";

export function ShopFaq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  return (
    <section aria-labelledby="shop-faq-title" className="shell mt-20 max-w-3xl md:mt-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h2 id="shop-faq-title" className="display text-[clamp(2rem,5vw,3.25rem)] text-green">
        Good to <span className="editorial text-brown">know.</span>
      </h2>
      <div className="mt-8 divide-y divide-line border-y border-line">
        {FAQ.map(({ q, a }) => (
          <details key={q} className="group py-5">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-ink">
              {q}
              <span aria-hidden className="text-2xl leading-none text-green transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 leading-relaxed text-ink-soft">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
