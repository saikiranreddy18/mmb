import { ClosingInvite } from "@/components/home/ClosingInvite";
import { Hero } from "@/components/home/Hero";
import { IngredientSection } from "@/components/home/IngredientSection";
import { ProductPreview } from "@/components/home/ProductPreview";
import { StoryIntro } from "@/components/home/StoryIntro";
import { getProducts } from "@/lib/commerce/products";

export default async function HomePage() {
  const [featured = null] = await getProducts(1);
  return (
    <>
      <Hero />
      <StoryIntro />
      <ProductPreview product={featured} />
      <IngredientSection />
      <ClosingInvite />
    </>
  );
}
