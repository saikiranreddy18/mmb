import type { MetadataRoute } from "next";
import { siteName } from "@/lib/seo/site";

/** Web app manifest: name, colours and icons for "Add to home screen" and search/AI tools. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: siteName,
    description: "Healthy dry fruit, seed, peanut and sesame energy bars. No added sugar, no preservatives.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf7ef",
    theme_color: "#2f4a32",
    lang: "en-IN",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
