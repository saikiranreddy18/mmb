"use client";

export function SaleVideoBanner() {
  return (
    <section aria-label="Mumma's Bite sale video" className="shell py-8 md:py-12">
      <div className="overflow-hidden rounded-2xl bg-green-900">
        <video
          className="block h-auto max-h-[70vh] w-full object-contain"
          src="/assets/dryfruit-bar.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Mumma's Bite dry fruit bar offer"
        />
      </div>
    </section>
  );
}
