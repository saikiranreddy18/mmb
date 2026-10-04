# Content & asset checklist

## SUPPLIED: from the process film (`public/assets/`)
The supplied 10s process film is an **illustrated / rendered animation**: its pack text is partly garbled and it carries a generator watermark. Stills from it are used as brand visuals and never as factual product evidence.

| File | Used for |
|---|---|
| `hero.webm` / `hero.mp4` + `hero-poster.jpg` | Home hero: dates, nuts and seeds falling into a wooden bowl (supplied hero film, rendered) |
| `process.webm` / `process.mp4` + `process-poster.jpg` | Home → "From dates to bar" process film |
| `pack.jpg` | Shop card, product page |
| `bar-pressed.jpg` | Home product preview, product page 2nd image, Story ch. 04 |
| `ingredients-bowl.jpg` | Spare. Not placed yet (ingredient story / social) |

Read off the rendered pack, and **all UNVERIFIED** until checked against the real label: name "Dry Fruit Bar", "Dates | Nuts | Seeds", 20 g, ₹30 each, "No Added Sugar", "No Preservatives". The protein figure on the pack is illegible, so it is **not used**. The tagline above "IN EVERY BITE" is cut off.

## SUPPLIED: product packs (`public/assets/dryfruit-*.jpg`, `multiseed-25g-*.jpg`)
Front and back cropped from the supplied pack artwork. Product page values are transcribed from the labels and stay **UNVERIFIED** until checked against the printed, approved packs:
- **Dry Fruit Bar**: 20 g · ₹30 · dates, almonds, cashews, walnuts, pistachios, pumpkin, sunflower and watermelon seeds · nutrition per 20 g · contains tree nuts.
- **Multi-Seed Energy Bar**: 25 g · ₹25 · peanuts, pumpkin, sunflower, watermelon, sesame and flax seeds, dates · nutrition per 25 g · contains peanuts and sesame.
- Both: FSSAI Lic. No. 20126052001147.

Please check: the Dry Fruit Bar's nutrition panel is identical, value for value, to the earlier 20 g Multi-Seed label, which may be a copy-paste on the artwork. The Dry Fruit Bar front shows a black mark in the veg-symbol box, while the Multi-Seed pack shows the green veg mark. Not used: the phone number and barcode, which look like placeholders. Storage and shelf life aren't on either label (content required).

## SUPPLIED: logo (`public/assets/logo/mummas-bite-logo.svg`, used unaltered)
Used in the menu bar, the home brand intro and the footer. On the dark footer it sits on a cream badge: the vector's texture is cut through, and the deep-brown "mumma's" needs a light background.

## SUPPLIED: ingredient illustrations (`public/assets/ingredients/`)
Supplied as JPGs with a painted-in checkerboard (no real transparency). The neutral background connected to the image edges was removed and the artwork itself was left unaltered. Exported as transparent WebP.

| File | Used for |
|---|---|
| `date.webp` | Ingredients → Dates |
| `almond.webp`, `pistachio.webp`, `cashew.webp` | Ingredients → Nuts (grouped) |
| `walnut.webp` | Ingredients → Nuts |
| `pumpkin-seed.webp`, `sunflower-seed.webp`, `seed-dark.webp` | Ingredients → Seeds (grouped) |

## SUPPLIED: walking gang film (`public/assets/gang-walk-packed.*`, `gang-walk-still.webp`)
From the supplied clip, only the steady wide walking shot is used (the talking and close-ups are removed, and so is the audio, which has spoken lines). The background is removed per frame with an AI segmentation model (BiRefNet), not brightness keying, so dark details (outlines, pupils, black legs and shoes, the dark seed, the shadowed back limbs) stay exactly as drawn and no background shows between legs or arms. The original frames loop on one full stride (frames 10–33) with no blending or retouching. The result ships as a "packed alpha" video (colour on top, transparency below; WebM ~0.38 MB, MP4 fallback) that a small WebGL shader draws straight onto the page. Reduced motion or no WebGL shows the transparent still.

## Generator watermark
The supplied films carried a visible generator "sparkle" in the bottom-right corner. It was removed from every film and still used on the site (hero, process, walking gang) by filling the small corner area from its surroundings.

## SUPPLIED: character set (`public/assets/mascot/`, used unaltered)
| File | Used for |
|---|---|
| `mascot-feeding.webp` (mother feeding her child) | Home "It started at home", Our Story opening |
| `mascot-laughing.webp` | Hero badge, Profile welcome card, Story ch. 05 "The brand" |
| `mascot-offering.webp` | Home closing "From our home to yours", empty orders |
| `mascot-surprised.webp` | Empty cart, 404 page |
| `mascot-tasting-black-bg.webp` | **Not used.** It has a solid black background. Please resend it as a transparent PNG |

## ASSET REQUIRED (`src/content/assets.ts`)
- [ ] **Real pack photographs** (front + back label) to replace the rendered pack
- [ ] Story images: idea, recipe, experiments, what comes next (4)
- [ ] **Contact form backend**: set `NEXT_PUBLIC_CONTACT_ENDPOINT` (e.g. a Formspree form URL). Until then the form says it is not connected
- [ ] Contact email / phone / address for the Contact section
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
