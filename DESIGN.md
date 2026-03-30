# Design System: LiveHero

## 1. Visual Theme & Atmosphere
A highly engineered, premium interface with liquid glass refraction, cinematic typography, and perpetual micro-interactions. The atmosphere is like an expensive, private digital gallery—dark, deeply atmospheric, and effortlessly elegant. Wait times are replaced with staggered spring-physics reveals. We do not do generic standard UI.

- **Density:** 3/10 (Art Gallery) — Generous spacing; components breathe in their asymmetric layouts.
- **Variance:** 8/10 (Asymmetric Whitespace) — No predictable 3-column rows. Off-grid balancing and cinematic split-pages.
- **Motion:** 7/10 (Fluid Spring) — Magnetic cursors, staggered cascade fades, and floating components. Hardware acceleration on all transforms.

## 2. Color Palette & Roles
- **Canvas Edge** (`#09090b` / `zinc-950`) — Deep, expensive dark background.
- **Surface Elevation** (`#18181b` / `zinc-900`) — Cards, dropdowns, sticky navs.
- **Heroic Spark** (`#0ea5e9` / `sky-500` desaturated to taste) — Primary discrete accent for focus states or CTA hover halos.
- **Text Primary** (`#fafafa` / `zinc-50`) — Clean main copy.
- **Text Muted** (`#a1a1aa` / `zinc-400`) — Subtext, captions, invisible boundaries.
- **Liquid Glass** `rgba(255, 255, 255, 0.05)` with `1px inset border rgba(255, 255, 255, 0.1)` and `backdrop-blur(12px)`.

*(No pure #000000 black, no oversaturated neons, no purple glows)*.

## 3. Typography Architecture
- **Display (H1-H2):** `Instrument Serif` (or `Geist` applied elegantly). Track-tight, controlled scale. Beautiful contrast between bold and italic accents.
- **Body & Labels:** `Satoshi` or `Geist`. Relaxed leading (1.6), `max-w-[65ch]`. Extremely legible.
- **Monospace:** `Geist Mono` — Only for technical pricing or developer metadata.
*(Inter and generic serif fonts like Times New Roman are explicitly BANNED)*.

## 4. Component Stylings
- **The CTA Button:** Symmetrical pill (`rounded-full`), ghosted or filled, translating `-1px` on active click (tactile feedback). Magnetic hover simulation via Framer Motion.
- **Navbar:** True Frosted Glass with an inner refractor border to simulate actual wet glass depth.
- **Cards (If any):** Diffused "whisper" shadow. High-density cards dropped in favor of clean 1px borders (`border-t`).

## 5. Layout Principles
- No overlapping components unless explicitly layered with Z-index control (e.g., Navbar over Hero video).
- CSS Grid always over Flexbox fraction math.
- Single-column collapse strictly prioritized on viewports below 768px (`md:`). No horizontal bleeding.

## 6. Motion & Interaction (GSAP & Framer)
- **Framer Motion:** Handles all UI scale hovers, magnetism, and micro-loops. Set to: `type: "spring", stiffness: 100, damping: 20`.
- **GSAP:** Handles full-section scrub scrolls and staggered cinematic reveals. 
- *Crucial Rule:* Never animate `width/height` or `top/left` — Animate ONLY `transform` and `opacity`.

## 7. Anti-Patterns (BANNED Elements)
- NO emojis anywhere in the markup or UI.
- NO AI clichés ("Elevate", "Next-Gen", "Seamless", "Unleash").
- NO 3-column equal-card startup grids.
- NO floating placeholder words ("Scroll to explore", spinning mouse icons).
- NO generic circular loading spinners (We use skeleton shimmers).
