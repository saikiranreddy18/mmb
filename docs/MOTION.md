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
| Hero — logo enters the hero | scroll through ~140vh (≈90vh mobile), Lenis-smoothed | the one SVG logo moves from large and centred over the video to its final place above the headline (translate + scale, power2.inOut, 0→0.7); centre glow out, reading wash in; copy rises in together (0.5→0.85) | scrub 1 / CSS sticky pin | dedicated composition, shorter move | no pin, no travel: logo in final place, copy visible |
| Hero video | load (motion allowed) | autoplay, muted, loop; never paused, faded or restarted by scroll | 10s loop | no / no | same | poster only, never autoplays · Pause/Play always available |
| (removed) "It started at home" thread | journey list from 70% → 60% viewport | scaleY 0 → 1 | linear | scrub 0.5 / no | same | fully drawn |
| Section text (`Reveal up`) | top hits 85% viewport, once | opacity 0, y 28 → visible | 0.9s | no | 0.6s, y 16 | static |
| Images (`Reveal clip`) | top hits 85% viewport, once | inset(100% 0 0 0) → inset(0) | 0.9s | no | 0.6s | static |
| Ingredient / product grid (`Reveal stagger`) | top hits 85%, once | opacity 0, y 28 → visible | 0.9s, 0.08–0.1s stagger | no | stagger ×0.6 | static |
| Process film (`ProcessFilm`) | ≥40% visible | plays muted loop; pauses off-screen | 10s film | no / no | same, `playsInline` | never autoplays (poster + Play) · always pausable |
| Process steps | video `timeupdate` | active step → green card | 300ms CSS | no | same | static (step 01) |
| Walking gang (Contact) | ≥ near view | transparent walking loop (WebGL) travels left → right across the page, loops, starts on screen | 1s stride loop · 36s desktop / 22s mobile travel | no / no | same | transparent still, centred · Pause/Play always available |
| Navbar background | scrollY > 24 | transparent → cream 90% + blur | 400ms CSS | no | same | instant |
| Cart drawer / mobile menu | open / close | translateX 100% → 0 / opacity | 500 / 300ms CSS | no | same | instant |
