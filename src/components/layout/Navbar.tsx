"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { Wordmark } from "@/components/ui/Wordmark";
import { useDialog } from "@/components/ui/useDialog";
import { isActive, navItems } from "./nav";

/**
 * Navigation — transparent over the page top, settles into a solid
 * cream bar once the visitor scrolls (CSS transition, 400ms).
 */
export function Navbar() {
  const pathname = usePathname();
  const { cart, open: openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeMenu = useRef(() => setMenuOpen(false)).current;
  useDialog(menuOpen, menuRef, closeMenu, "[aria-controls='mobile-menu']");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const count = cart?.totalQuantity ?? 0;

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[80] rounded-full bg-green px-4 py-2 text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-400 ease-brand ${
          scrolled || menuOpen ? "bg-bg/90 shadow-[0_1px_0_var(--mb-line)] backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <nav aria-label="Main" className="shell flex h-16 items-center justify-between md:h-20">
          <Link href="/" className="relative z-10 -ml-1 rounded-md px-1 py-2 text-xl md:text-2xl" aria-label="Mumma's Bite — home">
            <Wordmark />
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative inline-flex min-h-11 items-center px-4 text-[0.78rem] font-bold uppercase tracking-[0.14em] transition-colors ${
                      active ? "text-green" : "text-ink-soft hover:text-green"
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={`absolute inset-x-4 bottom-2 h-px origin-left bg-green transition-transform duration-300 ease-brand ${
                        active ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="relative z-10 flex items-center gap-1">
            <button
              onClick={openCart}
              data-cart-trigger
              className="relative grid size-11 place-items-center rounded-full text-green transition-colors hover:bg-cream"
              aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
            >
              <ShoppingBag className="size-5" strokeWidth={1.75} aria-hidden />
              {count > 0 && (
                <span className="absolute right-1 top-1 grid min-w-[1.15rem] place-items-center rounded-full bg-green px-1 text-[0.65rem] font-bold leading-[1.15rem] text-cream">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="grid size-11 place-items-center rounded-full text-green hover:bg-cream md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        ref={menuRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!menuOpen}
        className={`fixed inset-0 z-40 flex flex-col bg-bg px-5 pb-10 pt-24 transition-[opacity,visibility] duration-300 ease-brand focus:outline-none md:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <ul className="flex flex-col">
          {navItems.map((item, i) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={closeMenu}
                  className={`flex min-h-16 items-center justify-between py-3 text-3xl font-extrabold uppercase tracking-tight ${
                    active ? "text-green" : "text-ink"
                  }`}
                >
                  {item.label}
                  <span className="eyebrow text-ink-soft">0{i + 1}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-auto font-serif text-2xl italic text-green">Made with a mother&apos;s love.</p>
      </div>
    </>
  );
}
