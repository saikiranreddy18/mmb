import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/cart/CartProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ADDRESS, SUPPORT_EMAIL } from "@/content/contact";
import { defaultDescription, defaultTitle, keywords, siteName, siteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: defaultTitle, template: "%s | Mumma's Bite" },
  description: defaultDescription,
  keywords,
  applicationName: siteName,
  category: "food",
  openGraph: {
    type: "website",
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    url: "/",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: defaultTitle, description: defaultDescription },
};

export const viewport: Viewport = {
  themeColor: "#fbf7ef",
  width: "device-width",
  initialScale: 1,
};

/** Runs before paint: opt into motion only if the visitor hasn't asked for reduced motion. */
const motionScript = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-motion')}catch(e){}`;

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/assets/logo/mummas-bite-logo.svg`,
      slogan: "Made with a mother's love.",
      email: SUPPORT_EMAIL,
      address: {
        "@type": "PostalAddress",
        streetAddress: ADDRESS.lines[0],
        addressLocality: ADDRESS.locality,
        addressRegion: ADDRESS.region,
        postalCode: ADDRESS.postalCode,
        addressCountry: ADDRESS.country,
      },
      contactPoint: {
        "@type": "ContactPoint",
        email: SUPPORT_EMAIL,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["en"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteName,
      url: siteUrl,
      inLanguage: "en-IN",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>
        <SmoothScroll />
        <CartProvider>
          <Navbar />
          <main id="main" tabIndex={-1} className="focus:outline-none">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
