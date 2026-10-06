import type { Metadata } from "next";
import { ClosingInvite } from "@/components/home/ClosingInvite";
import { ContactSection } from "@/components/home/ContactSection";
import { Hero } from "@/components/home/Hero";
import { IngredientSection } from "@/components/home/IngredientSection";
import { features } from "@/content/features";
import { PromiseQuotes } from "@/components/home/PromiseQuotes";
import { ProcessFilm } from "@/components/home/ProcessFilm";
import { ShopShowcase } from "@/components/home/ShopShowcase";
import { getProducts } from "@/lib/commerce/products";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const products = await getProducts(4);
  return (
    <>
      <Hero />
      <ShopShowcase products={products} />
      <PromiseQuotes />
      <ProcessFilm />
      {features.ingredientIllustrations && <IngredientSection />}
      <ClosingInvite />
      <ContactSection />
    </>
  );
}
