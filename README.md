# Mumma's Bite: Web Experience v1

**Made with a mother's love.** A simple, premium, Shopify-ready site for Mumma's Bite.

Scope (v1): **Home · Shop · Product · Cart drawer · Our Story · Profile**. Nothing else.

## Run

```bash
npm install
cp .env.example .env.local   # optional: leave Shopify vars empty to use mock data
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
npm run typecheck
```

Stack: Next.js (App Router) · React · TypeScript · Tailwind CSS v4 with CSS-variable tokens · GSAP + ScrollTrigger · Lenis · Lucide · self-hosted fonts (Manrope + Instrument Serif). Works on Vercel as-is.

## Architecture

```
src/
  app/                    routes: /, /shop, /shop/[handle], /our-story, /profile, sitemap, robots
  components/
    layout/               Navbar (mobile menu), Footer
    home/                 Hero (brand intro zoom), ShopShowcase, ProcessFilm, IngredientSection, ClosingInvite, ContactSection
    story/                StoryChapter
    shop/                 ProductCard, ProductGrid, ProductDetail, AddToCartButton
    cart/                 CartProvider (state), CartDrawer
    profile/              Profile, OrderHistory
    motion/               Reveal, IntroReveal (all motion lives here + lib/motion)
    ui/                   Button, BrandImage, ContentValue, StatusBadge, ProductFacts, …
  content/
    brand.ts              copy, story beats, ingredients (each tagged with a content status)
    assets.ts             registry of every brand image (null = ASSET REQUIRED)
    status.ts             content contract: verified / unverified / unknown / placeholder / assumption
  lib/commerce/           the Shopify boundary (see below)
```

## Shopify boundary

The UI depends only on `lib/commerce`. The types mirror the Storefront API.

| Concern | Now | When Shopify is connected |
|---|---|---|
| Products | `mock/products.ts` (**MOCK DATA: REPLACE WITH SHOPIFY DATA**) | `products.ts` → Storefront `products` / `product(handle)` |
| Product facts | mock: `unknown` / `unverified` | metafields `mummas.{net_quantity, ingredients, nutrition, allergens, storage, shelf_life, fssai, short_description}` |
| Cart | mock adapter (localStorage), same `CartAdapter` interface | Storefront `cartCreate` / `cartLinesAdd/Update/Remove`; only the cart id is stored locally |
| Checkout | cart drawer offers "Order on WhatsApp"; Buy Now adds to cart | cart drawer **Checkout** → `cart.checkoutUrl`; product page **Buy now** creates a one-line Shopify cart and redirects straight to Shopify checkout (payment, shipping, order confirmation all happen on Shopify) |
| Customer / orders / addresses | `customer.ts` returns `not-connected` | implement Customer Account API (OAuth + PKCE) in `getCustomerSession()` |

To connect: set `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` and `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`, then create the `mummas.*` product metafield definitions and expose them to the Storefront API.

### Shopify store setup (h2w8qc-az.myshopify.com)

Already done in Shopify Admin:
- Products **Dry Fruit Energy Bar** (₹300) and **Multi-Seed Energy Bar** (₹250) with images, the same handles as the site, and every `mummas.*` metafield filled in.
- The `mummas.*` metafield definitions, with Storefront read access.
- Both products published to the Online Store.

Still to do in Shopify Admin:
1. **Install the Headless sales channel** (Shopify App Store → "Headless"). Create a storefront and copy its **public access token**.
2. Make both products available on the **Headless** channel (Product → Publishing).
3. Set the env vars on Vercel (Production + Preview) and redeploy:
   `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=h2w8qc-az.myshopify.com`, `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=<public token>`.
4. **Payments**: Settings → Payments, activate a provider (Shopify Payments where available, or Razorpay / PayU / Cashfree for India).
5. **Shipping**: Settings → Shipping and delivery, add India delivery rates.
6. **Offers**: create automatic discounts matching `lib/commerce/offers.ts` (5% off ≥ ₹799, 10% off ≥ ₹2000, free shipping ≥ ₹1299; let the free shipping one combine with order discounts). Without them, checkout won't apply the offers that the cart shows.
7. Remove the store password (Online Store → Preferences) when you're ready to take real orders, because checkout won't open while it's set. Mock products are `noindex`, they're kept out of the sitemap, and they never get Product structured data.

## Content & assets

- Nothing unknown is ever shown as fact. Unknown values render as **CONTENT REQUIRED**; unverified ones carry an **UNVERIFIED** badge.
- Missing images render as an **ASSET REQUIRED** frame. To add one, put the file in `public/assets/`, then set `src`, `width` and `height` in `src/content/assets.ts`.
- What's still outstanding is listed in [`docs/CONTENT-AND-ASSETS.md`](docs/CONTENT-AND-ASSETS.md). The motion contract is in [`docs/MOTION.md`](docs/MOTION.md).
