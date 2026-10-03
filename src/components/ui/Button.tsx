import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "light" | "ghost-light";

const base =
  "group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.8rem] font-bold uppercase tracking-[0.14em] transition-[background-color,color,border-color,transform] duration-300 ease-brand active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-green text-cream hover:bg-green-800",
  secondary: "border border-green/30 text-green hover:border-green hover:bg-green hover:text-cream",
  light: "on-dark bg-cream text-green-900 hover:bg-white",
  "ghost-light": "on-dark border border-cream/40 text-cream hover:border-cream hover:bg-cream hover:text-green-900",
};

export function buttonClass(variant: Variant = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

type LinkProps = { href: string; variant?: Variant; className?: string; children: ReactNode } & Omit<
  ComponentProps<typeof Link>,
  "href" | "className"
>;

export function ButtonLink({ href, variant = "primary", className = "", children, ...rest }: LinkProps) {
  return (
    <Link href={href} className={buttonClass(variant, className)} {...rest}>
      {children}
    </Link>
  );
}

type BtnProps = { variant?: Variant } & ComponentProps<"button">;

export function Button({ variant = "primary", className = "", type = "button", ...rest }: BtnProps) {
  return <button type={type} className={buttonClass(variant, className)} {...rest} />;
}
