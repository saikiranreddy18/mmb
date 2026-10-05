import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { type Ingredient, ingredients } from "@/content/brand";

/** Groups are arranged like a small handful (positions as % of the tile). */
const groupLayouts: Record<string, string[]> = {
  seeds: [
    "left-[8%] top-[10%] w-[28%] -rotate-12", // pumpkin seed
    "left-[8%] top-[54%] z-10 w-[44%] -rotate-6", // sunflower seed
    "right-[8%] top-[12%] w-[32%] rotate-12", // watermelon seed
    "right-[6%] top-[58%] w-[42%]", // sesame
  ],
  nuts: [
    "left-[8%] top-[10%] w-[34%]", // walnut
    "left-[10%] top-[52%] w-[20%] -rotate-[20deg]", // almond
    "left-[34%] top-[46%] z-10 w-[40%]", // pistachio
    "right-[6%] top-[14%] w-[36%] rotate-[16deg]", // cashew
  ],
};

function IngredientArtwork({ ing }: { ing: Ingredient }) {
  if (ing.art.length === 1) {
    const a = ing.art[0];
    return (
      <Image
        src={a.src}
        alt={a.alt}
        width={a.width}
        height={a.height}
        sizes="(min-width:1024px) 18vw, (min-width:640px) 25vw, 40vw"
        className="ingredient-art absolute inset-[16%] m-auto h-[68%] w-auto max-w-[68%] object-contain"
      />
    );
  }
  return (
    <>
      {ing.art.map((a, i) => (
        <Image
          key={a.src}
          src={a.src}
          alt={a.alt}
          width={a.width}
          height={a.height}
          sizes="(min-width:1024px) 10vw, 20vw"
          className={`ingredient-art absolute h-auto object-contain ${groupLayouts[ing.id]?.[i] ?? ""}`}
        />
      ))}
    </>
  );
}

/**
 * Ingredient story — scroll → reveal → understand.
 * Desktop: three cards in a row. Mobile: stacked, image beside text.
 * Motion: cards rise in with a stagger (Reveal); on hover the illustration lifts
 * slightly (CSS, 400ms). Reduced motion: static.
 */
export function IngredientSection() {
  return (
    <section aria-labelledby="ingredients-title" className="on-dark bg-green py-20 text-cream md:py-32">
      <div className="shell">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-6 text-gold">What goes in</p>
            <h2 id="ingredients-title" className="display text-[clamp(2.5rem,6vw,4.75rem)]">
              Simple <span className="editorial text-gold">ingredients.</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-cream/75">
            Dates, nuts and seeds, with no added sugar and no preservatives. That&apos;s it.
          </p>
        </Reveal>

        <Reveal as="ol" stagger={0.1} className="mt-14 grid gap-5 sm:grid-cols-3 md:mt-20 lg:gap-8">
          {ingredients.map((ing, i) => (
            <li
              key={ing.id}
              className="group flex items-center gap-5 rounded-[1.75rem] bg-green-800/60 p-4 sm:flex-col sm:items-stretch sm:p-5"
            >
              <div className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-[1.25rem] bg-cream sm:w-full">
                <IngredientArtwork ing={ing} />
              </div>
              <div className="sm:px-1 sm:pb-1">
                <p className="text-xs font-bold tabular-nums text-gold">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 text-xl font-extrabold uppercase tracking-tight md:text-2xl">{ing.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-cream/75">{ing.note}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </div>
      <style>{`
        .ingredient-art { transition: translate 400ms var(--mb-ease); filter: drop-shadow(0 10px 14px rgba(74,36,14,0.18)); }
        @media (hover: hover) { li:hover .ingredient-art { translate: 0 -6px; } }
        @media (prefers-reduced-motion: reduce) { .ingredient-art { transition: none; } li:hover .ingredient-art { translate: none; } }
      `}</style>
    </section>
  );
}
