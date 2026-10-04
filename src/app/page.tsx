import { ClosingInvite } from "@/components/home/ClosingInvite";
import { Hero } from "@/components/home/Hero";
import { IngredientParade } from "@/components/home/IngredientParade";
import { IngredientSection } from "@/components/home/IngredientSection";
import { ProcessFilm } from "@/components/home/ProcessFilm";
import { ShopShowcase } from "@/components/home/ShopShowcase";
import { getProducts } from "@/lib/commerce/products";

export default async function HomePage() {
  const products = await getProducts(4);
  return (
    <>
      <Hero />
      <ShopShowcase products={products} />
      <ProcessFilm />
      <IngredientSection />
      <IngredientParade />
      <ClosingInvite />
    </>
  );
}
