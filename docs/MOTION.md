# Motion contract

Principle: motion only where it helps understanding, navigation or feeling. One easing (`power3.out`). No 3D, WebGL, particles or cursor effects. The only videos are the short supplied films (hero: plays once; process: explains the product; walking gang: a short loop at the Contact section), which explains the product, is not a background, and loads only when it is about to play. The mascot is never animated beyond its image reveal.

**Lenis is used** (requested). It drives the brand-intro zoom, with Lenis running on the GSAP ticker so ScrollTrigger stays in sync. It is not started under reduced motion, it pauses while the cart or menu is open, and scrollable panels opt out with `data-lenis-prevent`.

Global rules:
- `js-motion` goes on `<html>` before paint, and only when `prefers-reduced-motion` is not `reduce`. Without it, every element is static and visible.
- Initial (hidden) states are applied by JS or by `.js-motion` CSS only. A CSS failsafe reveals hero content after 2.5s if JS never hydrates.
- Every animation is registered through `gsap.matchMedia()` and reverted on unmount.

| Element | Trigger | Initial → Final | Duration / ease | Scrub / pin | Mobile | Reduced motion |
|---|---|---|---|---|---|---|
| Hero & page-intro headline (`IntroReveal`, `line`) | load | yPercent 105 inside a mask → 0 | 1.0s, 0.08s stagger, power3.out | no / no | 0.7s | static |
| Intro supporting text / CTAs (`fade`) | load | opacity 0, y 16 → visible | 1.0s (+0.15s offset) | no | 0.7s | static |
| Hero arch / PDP image (`clip`) | load | inset(0 0 100% 0) → inset(0) | 1.3s | no | 0.9s | static |
| Hero intro: plays only on arrival (first load / reload); in-site navigation to Home shows the finished hero (`window.__mbBooted`) |  |  |  |  |  |  |
| Hero — video inside the logo | scroll through ~150vh (~100vh mobile), Lenis-smoothed | start: light page, video visible only through the logo letters (CSS mask = SVG logo); then logo mask grows ×1.6 while a circle mask opens from centre to full screen (power2.in, 0→0.75); intro line fades; wash + hero logo + copy rise in together (0.72→1) | scrub 1 / CSS sticky pin | same, logo sized to 92vw | no mask, no pin: full video poster + finished copy |
| Hero video | load (motion allowed) | autoplay, muted, loop; never paused, faded or restarted by scroll | 10s loop | no / no | same | poster only, never autoplays · Pause/Play always available |
| (removed) "It started at home" thread | journey list from 70% → 60% viewport | scaleY 0 → 1 | linear | scrub 0.5 / no | same | fully drawn |
| Section text (`Reveal up`) | top hits 85% viewport, once | opacity 0, y 28 → visible | 0.9s | no | 0.6s, y 16 | static |
| Images (`Reveal clip`) | top hits 85% viewport, once | inset(100% 0 0 0) → inset(0) | 0.9s | no | 0.6s | static |
| Ingredient / product grid (`Reveal stagger`) | top hits 85%, once | opacity 0, y 28 → visible | 0.9s, 0.08–0.1s stagger | no | stagger ×0.6 | static |
| Process film (`ProcessFilm`) | on screen | full-bleed background loop, no controls (brand request); captions Gathered → Pressed → Packed crossfade on the film in sync with playback (500ms) | 10s loop | no / no | same | poster + all three steps listed, no autoplay |
| Walking gang (Contact) | ≥ near view | transparent walking loop (WebGL) travels left → right across the page, loops, starts on screen | 1s stride loop · 36s desktop / 22s mobile travel | no / no | same | transparent still, centred · Pause/Play always available |
| Navbar background | scrollY > 24 | transparent → cream 90% + blur | 400ms CSS | no | same | instant |
| Cart drawer / mobile menu | open / close | translateX 100% → 0 / opacity | 500 / 300ms CSS | no | same | instant |

## Product gallery (`components/shop/ProductGallery.tsx`)
Thumbnail rail (left on tablet/desktop, row below on phones) + large main image.
Thumbnails select on hover and click; the main image slides (smooth scroll) to the
chosen photo and can be swiped on touch, with dots. Share (native share sheet,
else copy link) and Save (heart, remembered in this browser) sit on the image.
"Click to see full view" opens a full-screen lightbox: ←/→ and arrows step,
Esc closes, focus is trapped and returned. Gallery is sticky beside the details
on desktop.

## Our Story journey map (`components/story/JourneyMap.tsx`)
A dashed road winds down the page through a stop per chapter (start: "Where it
began", finish: "The road ahead"). Scrubbed on scroll (top 65% → bottom 65%), a
gold route draws along the road with a traveller dot at its tip; each stop's pin
turns green with a gold ring and its big numeral fills in when the traveller
reaches it. Desktop: road centred, cards alternate sides, curves swing ±72px.
Mobile: road down the left edge. Reduced motion: route fully drawn, all stops lit.

### Process film loading
`process.webm/.mp4` (1280×720, ~0.9 MB) on tablet/desktop, `process-480.*` (854×480,
~0.45 MB) on phones. The file is fetched whole about 1200px before the section and
looped from a blob URL, so playback never waits on the network.
