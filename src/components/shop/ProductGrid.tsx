import { Reveal } from "@/components/motion/Reveal";
import type { Product } from "@/lib/commerce/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return <p className="py-20 text-center text-ink-soft">No products are available right now.</p>;
  }
  return (
    <Reveal as="ul" stagger={0.1} className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
      {products.map((p, i) => (
        <li key={p.id}>
          <ProductCard product={p} priority={i < 2} offset={(i % 2) * 1500} />
        </li>
      ))}
    </Reveal>
  );
}
