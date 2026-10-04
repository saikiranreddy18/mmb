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
| Brand intro — entrance | load | wordmark rises in (yPercent 30 → 0, fade), then Mumma fades in | 0.9s / 0.8s, power3.out | no / no | same | static finished hero |
| Brand intro — zoom into hero | scroll through 280vh (220vh mobile), Lenis-smoothed | window clip-path: small arch → full screen; film scale 1.18 → 1; wordmark scale 1 → 1.6 + fade; scrim + hero copy rise in from 60% | power2.inOut | scrub 0.8 / CSS sticky pin | wider starting window, shorter scroll | no pin, no zoom: finished hero |
| Hero film | intro progress ≥ 70% | video fades in over the still and plays once, rests on full bowl | 10s, no loop | no / no | same | never autoplays · Pause/Replay always available |
| (removed) "It started at home" thread | journey list from 70% → 60% viewport | scaleY 0 → 1 | linear | scrub 0.5 / no | same | fully drawn |
| Section text (`Reveal up`) | top hits 85% viewport, once | opacity 0, y 28 → visible | 0.9s | no | 0.6s, y 16 | static |
| Images (`Reveal clip`) | top hits 85% viewport, once | inset(100% 0 0 0) → inset(0) | 0.9s | no | 0.6s | static |
| Ingredient / product grid (`Reveal stagger`) | top hits 85%, once | opacity 0, y 28 → visible | 0.9s, 0.08–0.1s stagger | no | stagger ×0.6 | static |
| Process film (`ProcessFilm`) | ≥40% visible | plays muted loop; pauses off-screen | 10s film | no / no | same, `playsInline` | never autoplays (poster + Play) · always pausable |
| Process steps | video `timeupdate` | active step → green card | 300ms CSS | no | same | static (step 01) |
| Walking gang film (Contact) | ≥30% visible | muted loop of the walking-only clip; pauses off-screen | 4.95s loop | no / no | same, control sits below the strip | never autoplays (poster + Play) · Pause/Play always available |
| Navbar background | scrollY > 24 | transparent → cream 90% + blur | 400ms CSS | no | same | instant |
| Cart drawer / mobile menu | open / close | translateX 100% → 0 / opacity | 500 / 300ms CSS | no | same | instant |
