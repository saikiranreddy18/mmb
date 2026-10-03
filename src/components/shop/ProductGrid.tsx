import { Reveal } from "@/components/motion/Reveal";
import type { Product } from "@/lib/commerce/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return <p className="py-20 text-center text-ink-soft">No products are available right now.</p>;
  }
  return (
    <Reveal as="ul" stagger={0.1} className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
      {products.map((p, i) => (
        <li key={p.id}>
          <ProductCard product={p} priority={i < 2} />
        </li>
      ))}
    </Reveal>
  );
}
