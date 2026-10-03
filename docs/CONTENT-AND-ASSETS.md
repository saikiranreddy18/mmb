# Content & asset checklist

## SUPPLIED: from the process film (`public/assets/`)
The supplied 10s process film is an **illustrated / rendered animation**: its pack text is partly garbled and it carries a generator watermark. Stills from it are used as brand visuals and never as factual product evidence.

| File | Used for |
|---|---|
| `hero.webm` / `hero.mp4` + `hero-poster.jpg` | Home hero: dates, nuts and seeds falling into a wooden bowl (supplied hero film, rendered) |
| `ingredient-seeds.jpg` | Ingredients section (from the hero film) |
| `process.webm` / `process.mp4` + `process-poster.jpg` | Home → "From dates to bar" process film |
| `pack.jpg` | Shop card, product page |
| `bar-pressed.jpg` | Home product preview, product page 2nd image, Story ch. 04 |
| `ingredients-bowl.jpg` | Spare. Not placed yet (ingredient story / social) |
| `ingredient-dates.jpg`, `ingredient-nuts.jpg` | Ingredients section |

Read off the rendered pack, and **all UNVERIFIED** until checked against the real label: name "Dry Fruit Bar", "Dates | Nuts | Seeds", 20 g, ₹30 each, "No Added Sugar", "No Preservatives". The protein figure on the pack is illegible, so it is **not used**. The tagline above "IN EVERY BITE" is cut off.

## SUPPLIED: character set (`public/assets/mascot/`, used unaltered)
| File | Used for |
|---|---|
| `mascot-feeding.webp` (mother feeding her child) | Home "It started at home", Our Story opening |
| `mascot-laughing.webp` | Hero badge, Profile welcome card, Story ch. 05 "The brand" |
| `mascot-offering.webp` | Home closing "From our home to yours", empty orders |
| `mascot-surprised.webp` | Empty cart, 404 page |
| `ingredient-parade.webp` | Home "All in it together": the 8 ingredient characters walking hand in hand |
| `mascot-tasting-black-bg.webp` | **Not used.** It has a solid black background. Please resend it as a transparent PNG |

## ASSET REQUIRED (`src/content/assets.ts`)
- [ ] **Logo file** (PNG/SVG). Until then an interim typographic wordmark in the logo colours is used (`components/ui/Wordmark.tsx`)
- [ ] **Real pack photographs** (front + back label) to replace the rendered pack
- [ ] Story images: idea, recipe, experiments, what comes next (4)
- [ ] Ingredient illustrations (date, cashew, pistachio, almond, walnut, seeds) were shared in chat only. Send them as files, with real transparency
- [ ] Open Graph share image (1200×630)

## CONTENT REQUIRED
- [ ] The real founding story: 6 chapters (`content/brand.ts → story`) and 6 home beats (`homeJourney`)
- [ ] Confirm every on-pack value listed above, then enter it in Shopify metafields: net quantity, claims, ingredients, nutrition, allergens, storage, shelf life, FSSAI
- [ ] Brand spelling: the site now uses **"Mumma's Bite"** (as on the logo and pack); the brief said "MUMMAS BITE"
- [ ] Contact, legal pages and FSSAI licence details for the footer
- [ ] Production domain → `NEXT_PUBLIC_SITE_URL`

## VERIFIED (from the brief)
- Promise: "Made with a mother's love."
- Supporting line: "Simple ingredients. Honest nourishment. A little piece of home in every bite."
- Brand idea: a modern food brand inspired by the food a mother makes at home
