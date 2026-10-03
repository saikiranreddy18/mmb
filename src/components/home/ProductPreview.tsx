import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { BrandImage } from "@/components/ui/BrandImage";
import { ProductFacts } from "@/components/ui/ProductFacts";
import { MockBadge } from "@/components/ui/StatusBadge";
import { assets } from "@/content/assets";
import { formatMoney } from "@/lib/commerce/money";
import type { Product } from "@/lib/commerce/types";
import Image from "next/image";

/** WORLD 03 — Discover the product. */
export function ProductPreview({ product }: { product: Product | null }) {
  const img = product?.featuredImage;
  return (
    <section aria-labelledby="product-preview-title" className="py-20 md:py-32">
      <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal variant="clip" className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-t-full bg-cream lg:max-w-none">
          {img ? (
            <Image src={img.url} alt={img.altText ?? product.title} fill sizes="(min-width:1024px) 45vw, 90vw" className="object-cover" />
          ) : (
            <BrandImage asset={assets.productPack} sizes="(min-width:1024px) 45vw, 90vw" />
          )}
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow mb-6 text-brown">The product</p>
            <h2 id="product-preview-title" className="display text-[clamp(2.5rem,6vw,4.75rem)] text-green">
              A little bite. <span className="editorial block text-brown">A lot of care.</span>
            </h2>
          </Reveal>

          {product ? (
            <Reveal className="mt-10">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-2xl font-extrabold text-ink">{product.title}</h3>
                {product.isMock && <MockBadge />}
              </div>
              <p className="mt-3 max-w-md leading-relaxed text-ink-soft">{product.shortDescription}</p>
              <ProductFacts details={product.details} only={["netQuantity", "ingredients", "shelfLife"]} className="mt-8" />
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <p className="text-2xl font-extrabold text-green">{formatMoney(product.priceRange.minVariantPrice)}</p>
                <ButtonLink href={`/shop/${product.handle}`}>View product</ButtonLink>
                <Link href="/shop" className="group inline-flex min-h-11 items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-green">
                  Shop all
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
              </div>
            </Reveal>
          ) : (
            <p className="mt-10 text-ink-soft">Products will appear here once the catalogue is connected.</p>
          )}
        </div>
      </div>
    </section>
  );
}
