# ZENJI storefront

Next.js 15 App Router + TypeScript (strict) + Tailwind v4. Package manager: pnpm.

## Rules

- Server Components by default. Add `"use client"` only for cart, drawer, forms, search, motion.
- All images through `next/image` with `fill` + `sizes` inside a fixed-aspect container, or explicit
  width/height. No `<img>`.
- Product data lives in `src/data/products.ts`. Never hardcode products in components.
- Prices are AUD numbers. Format only via `formatAud()`. Never do money math in a component —
  use `cartTotals()` in `src/lib/pricing.ts`.
- Tailwind only. No CSS modules. No inline styles except dynamic accent colours passed as CSS
  custom properties (`style={{ '--accent': product.accent }}`).
- Motion follows "the pass" — see `DESIGN.md` §8. Prefer CSS; reach for Framer Motion only
  where a value has to be read at runtime (scroll position, pointer position, springs).
  Transform / opacity / `clip-path` only — never animate a property that shifts layout.
  Anything that carries meaning must survive a paused `requestAnimationFrame` and a missing
  bundle. Always respect `prefers-reduced-motion`, and never leave content hidden when the
  animation will not play.
- Every interactive element is keyboard reachable and shows a visible focus ring
  (`focus-visible:ring-2 focus-visible:ring-flame`).
- Before finishing any task: `pnpm typecheck && pnpm lint && pnpm build` must pass.
- Don't add dependencies without saying why.

## Design

Read `DESIGN.md` before touching UI. Don't introduce colours, fonts, or radii outside the tokens
in `src/app/globals.css`. Radius is always 0 — this brand has no rounded corners.

Own design, ZENJI voice — never copy zenji.shop layouts or copy verbatim.
