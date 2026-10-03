import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[70svh] flex-col items-start justify-center pb-20 pt-32">
      <Image src="/assets/mascot/mascot-surprised.webp" alt="The Mumma's Bite mother looking surprised" width={220} height={220} className="mb-6 size-44" />
      <p className="eyebrow mb-6 text-brown">404</p>
      <h1 className="display text-[clamp(2.75rem,8vw,6rem)] text-green">
        This page <span className="editorial block text-brown">wandered off.</span>
      </h1>
      <ButtonLink href="/" className="mt-10">
        Back home
      </ButtonLink>
    </section>
  );
}
