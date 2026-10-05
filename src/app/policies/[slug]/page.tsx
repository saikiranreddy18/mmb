import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POLICIES, POLICY_LINKS, type PolicySlug } from "@/content/policies";
import { getPolicy } from "@/lib/commerce/policies";

type Params = { params: Promise<{ slug: string }> };

const isSlug = (s: string): s is PolicySlug => s in POLICIES;

export function generateStaticParams() {
  return Object.keys(POLICIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  if (!isSlug(slug)) return {};
  const p = POLICIES[slug];
  return { title: p.title, description: p.description, alternates: { canonical: `/policies/${slug}` } };
}

export default async function PolicyPage({ params }: Params) {
  const { slug } = await params;
  if (!isSlug(slug)) notFound();
  const policy = await getPolicy(slug);

  return (
    <article className="shell max-w-3xl pb-24 pt-32 md:pb-32 md:pt-44">
      <p className="eyebrow mb-4 text-brown">Policies</p>
      <h1 className="display text-[clamp(2.25rem,6vw,4rem)] text-green">{policy.title}</h1>
      {/* Merchant-authored policy HTML (Shopify Admin or src/content/policies.ts). */}
      <div
        className="mt-10 space-y-4 text-base leading-relaxed text-ink-soft [&_h3]:mt-10 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-ink [&_ul]:space-y-1"
        dangerouslySetInnerHTML={{ __html: policy.body }}
      />
      <nav aria-label="Other policies" className="mt-16 border-t border-line pt-8">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {POLICY_LINKS.filter((l) => l.slug !== slug).map((l) => (
            <li key={l.slug}>
              <Link href={`/policies/${l.slug}`} className="inline-flex min-h-11 items-center text-sm font-semibold text-green underline-offset-4 hover:underline">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}
