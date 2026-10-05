import { OFFER_LINES } from "@/lib/commerce/offers";

/**
 * Offers ribbon above the navigation. A slow, seamless marquee (40s loop);
 * static and wrapped under reduced motion. Hover pauses it.
 */
export function OfferRibbon() {
  const items = [...OFFER_LINES, ...OFFER_LINES];
  return (
    <div className="offer-ribbon on-dark relative overflow-hidden bg-green text-cream" role="region" aria-label="Offers">
      <p className="sr-only">{OFFER_LINES.join(". ")}.</p>
      <div aria-hidden className="offer-track flex w-max items-center py-3 md:py-3.5">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center whitespace-nowrap px-7 text-[0.8rem] font-bold md:text-[0.9rem] uppercase tracking-[0.16em]">
            <span className="mr-7 text-gold">✦</span>
            {t}
          </span>
        ))}
      </div>
      <style>{`
        .offer-track { animation: mb-offer 40s linear infinite; }
        .offer-ribbon:hover .offer-track { animation-play-state: paused; }
        @keyframes mb-offer { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) {
          .offer-track { animation: none; width: auto; flex-wrap: wrap; justify-content: center; }
          .offer-track > span:nth-child(n+4) { display: none; }
        }
      `}</style>
    </div>
  );
}
