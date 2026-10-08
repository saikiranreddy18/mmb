import type { Metadata } from "next";
import { ClosingInvite } from "@/components/home/ClosingInvite";
import { Hero } from "@/components/home/Hero";
import { IngredientSection } from "@/components/home/IngredientSection";
import { features } from "@/content/features";
import { PromiseQuotes } from "@/components/home/PromiseQuotes";
import { TalkingIngredients } from "@/components/home/TalkingIngredients";
import { ProcessFilm } from "@/components/home/ProcessFilm";
import { ShopShowcase } from "@/components/home/ShopShowcase";
import { getProducts } from "@/lib/commerce/products";
import { siteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const products = await getProducts(4);
  // The products, as a list search engines and AI assistants can read.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Mumma's Bite healthy snack bars",
    itemListElement: products
      .filter((p) => !p.isMock)
      .map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${siteUrl}/shop/${p.handle}`, name: p.title })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <ShopShowcase products={products} />
      <ProcessFilm />
      {features.ingredientIllustrations && <IngredientSection />}
      <ClosingInvite />
      <section aria-label="What goes in" className="pb-20 pt-14 md:pb-28 md:pt-20">
        <TalkingIngredients />
      </section>
      <PromiseQuotes />
    </>
  );
}
