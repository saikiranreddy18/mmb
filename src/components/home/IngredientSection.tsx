import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { type Ingredient, ingredients } from "@/content/brand";

/** Nuts are a little group: almond, pistachio, cashew — placed like a handful. */
const groupLayout = [
  "left-[9%] top-[20%] w-[27%] -rotate-12",
  "left-[27.5%] top-[42%] z-10 w-[45%]",
  "right-[7%] top-[14%] w-[37%] rotate-[16deg]",
];

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
          className={`ingredient-art absolute h-auto object-contain ${groupLayout[i] ?? ""}`}
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
            <span className="mb-2 inline-flex rounded-full border border-gold/50 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-gold">
              Unverified
            </span>
            <br />
            “Dates | Nuts | Seeds”, as printed on the pack in our process film. To be confirmed against the final product label.
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
