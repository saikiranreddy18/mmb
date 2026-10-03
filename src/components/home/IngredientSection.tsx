import { Reveal } from "@/components/motion/Reveal";
import { BrandImage } from "@/components/ui/BrandImage";
import { assets } from "@/content/assets";
import { ingredients } from "@/content/brand";

/**
 * Ingredient story — scroll → reveal → understand.
 * Desktop: one horizontal row. Mobile: a simple vertical list.
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

        <Reveal as="ol" stagger={0.08} className="mt-14 grid gap-6 sm:grid-cols-3 md:mt-20 lg:grid-cols-3 lg:gap-8">
          {ingredients.map((ing, i) => (
            <li key={ing.id} className="flex items-center gap-5 sm:flex-col sm:items-start">
              <div className="aspect-square w-24 shrink-0 overflow-hidden rounded-full sm:w-full lg:w-4/5">
                <BrandImage asset={assets[ing.assetKey]} tone="green" sizes="(min-width:1024px) 28vw, 112px" className="rounded-full !p-3 [&>span:last-child]:hidden lg:[&>span:last-child]:block" />
              </div>
              <div>
                <p className="text-xs font-bold tabular-nums text-gold">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 text-xl font-extrabold uppercase tracking-tight">{ing.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-cream/75">{ing.note}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
