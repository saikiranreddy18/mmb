/** Instant feedback while a product page loads. */
export default function Loading() {
  return (
    <div className="shell pb-24 pt-32 md:pt-36" aria-busy="true" aria-label="Loading product">
      <div className="grid animate-pulse gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div className="aspect-[4/5] rounded-[2rem] bg-cream" />
        <div className="space-y-5 pt-6">
          <div className="h-4 w-32 rounded bg-cream" />
          <div className="h-14 w-4/5 rounded bg-cream" />
          <div className="h-24 w-full rounded bg-cream" />
          <div className="h-12 w-60 rounded-full bg-cream" />
        </div>
      </div>
    </div>
  );
}
