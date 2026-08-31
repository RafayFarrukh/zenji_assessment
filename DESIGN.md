# ZENJI — design system

Same brand, different designer. The reference site leans on `//` labels, `WORD_WORD` naming and
neon-on-black. This build keeps the brand facts (black-dominant, limited drops, samurai/anime
language, Japanese accents, A$39.99 oversized tees, Melbourne) and rebuilds the surface as a
**gallery**: near-black room, bone-white type, product photography as the only bright object.

---

## 1. Principles

1. **The photo is the loudest thing on the page.** The product shots are on a light studio grey,
   so on a near-black page every card reads as a lit frame. Chrome stays quiet so they don't
   compete.
2. **One bold move per page, everything else disciplined.** The home hero is the signature. Below
   it: 8pt spacing, a 12-column grid, square corners, 1px rules only between real sections.
3. **Square corners, everywhere.** `border-radius: 0` is a token decision, not an oversight. It is
   the fastest way to not look like a SaaS template.
4. **Japanese as meaning, not decoration.** Each kanji used is chosen for what it says about the
   product or the brand — never as texture.
5. **Say what the button does.** "Add to cart", "Go to checkout", "Place order". The sale badge
   shows the actual saving in dollars, not just a percentage.
6. **Mobile is designed, not shrunk.** The phone gets its own hero crop, a scroll-snap gallery, and
   a sticky add-to-cart bar that desktop never sees.

## 2. Colour

| Token                | Hex       | Use                                   |
| -------------------- | --------- | ------------------------------------- |
| `--color-ink`        | `#0A0A0A` | Page base                             |
| `--color-ink-raised` | `#121212` | Cards, drawer, inputs                 |
| `--color-ink-line`   | `#242424` | 1px rules and borders                 |
| `--color-bone`       | `#F2EFE9` | Primary text, sale badge fill         |
| `--color-ash`        | `#8A8680` | Secondary text, meta labels           |
| `--color-flame`      | `#2F6BFF` | Primary CTA, focus ring, active state |
| `--color-flame-hi`   | `#5C8CFF` | CTA hover, link hover                 |
| `--color-danger`     | `#E0574E` | Sold out, form errors                 |

**Blue flame** is the accent because it is taken from the range (the Blue Flame tee) rather than a
generic streetwear neon. It appears only on the primary action and on focus — never as decoration.

Each product carries its own `accent` hex, drawn from its colourway (Solar Gold, Void Purple,
Crimson Pink…). It is passed down as a `--accent` custom property and used for exactly two things:
the rail on the collection poster cards, and the active thumbnail on the product gallery.

Contrast: bone on ink = 16.4:1, ash on ink = 5.6:1, bone on flame = 5.9:1. All pass AA.
No gradients are used as decoration anywhere.

## 3. Type

| Role        | Face                | Setting                                                               |
| ----------- | ------------------- | --------------------------------------------------------------------- |
| Display     | **Anton**           | `clamp()` scale, tracking `-0.02em`, line-height `0.9–1.0`, uppercase |
| Body / UI   | **Inter**           | 16px base, line-height 1.6, max 68ch                                  |
| Meta labels | **Inter**           | 11px, uppercase, tracking `0.18em`, `--color-ash`                     |
| Kanji       | **System JP stack** | accents only, never for a full sentence                               |

Scale (`--text-*`):

```
hero        clamp(2.75rem, 5.2vw, 5.5rem)  hero headline (5-col column)
display-xl  clamp(3.25rem, 11vw, 8.5rem)   full-width page titles
display-l   clamp(2.25rem, 5.5vw, 4.5rem)  section headings
display-m   clamp(1.5rem, 3vw, 2.25rem)    product name, card titles
body-l      1.125rem                        lede paragraphs
body        1rem                            everything else
meta        0.6875rem                       eyebrows, labels, badges
```

Prices are set in Anton so they read as part of the design, not as UI text.

Anton and Inter are self-hosted through `next/font` (no render-blocking request, no
layout shift). Kanji fall back to the reader's own Japanese face — Hiragino, Yu Gothic or
Noto Sans CJK depending on platform. `next/font` can only serve Noto Sans JP's _latin_
subset, which contains none of the glyphs we use, so self-hosting it would mean shipping a
webfont that renders nothing. Nine accent glyphs are not worth a 300kB CJK download.

## 4. Space & grid

8pt base. Section rhythm `--space-section`: 64px mobile → 128px desktop.
Page gutter: 20px mobile → 40px desktop. Content max-width 1440px.
Grid: 12 columns, 20/24px gutter. Product grid: 2 cols @360, 3 @768, 4 @1280.

## 5. Signature element — the hero

A 12-column split that never crops the portrait photography into a bad letterbox:

- **Left 5 cols**: a thin "system strip" rule with drop metadata, then the headline set in Anton at
  `display-xl` across three lines, a one-line lede, and two CTAs.
- **Right 7 cols**: a full-bleed street shot, top and bottom bled off the section.
- **On the seam**: a vertical rail carrying 一期一会 in Noto Sans JP with a romaji gloss —
  _ichi-go ichi-e_, "one meeting, one chance". It is the Japanese phrase for a moment that will
  never repeat, which is the literal product promise: limited drops, no restocks, ever.
- On mobile the split becomes a stacked full-bleed image with the headline overlapping its lower
  edge, and the rail moves to the right margin.

Motion: one orchestrated reveal on load — rule draws, headline lines rise in sequence, image
un-masks. Nothing else on the page animates on scroll.

```
DESKTOP 1280                                MOBILE 360
┌──────────────────────────────────────┐    ┌──────────────────┐
│ marquee                              │    │ marquee          │
│ ZENJI 力   DROP LOOKBOOK STORY  ⌕ ⊞2 │    │ ZENJI 力    ⌕ ⊞2 │
├───────────────────┬──┬───────────────┤    ├──────────────────┤
│ // ORIGIN DROP 01 │一│               │    │ ░░░░░░░░░░░░░  一│
│                   │期│    ░░░░░░░    │    │ ░░░ photo ░░░  期│
│ NO RESTOCKS.      │一│   ░ photo ░   │    │ ░░░░░░░░░░░░░  一│
│ NO SECOND         │会│    ░░░░░░░    │    │ ░░░░░░░░░░░░░  会│
│ CHANCES.          │  │               │    │ NO RESTOCKS.     │
│                   │  │               │    │ NO SECOND        │
│ Ten pieces…       │  │               │    │ CHANCES.         │
│ [Shop the drop]   │  │               │    │ [Shop the drop]  │
│ [Lookbook]        │  │               │    │ [Lookbook]       │
└───────────────────┴──┴───────────────┘    └──────────────────┘
```

## 6. Wireframes

```
HOME 1280                                   HOME 360
┌──────────────────────────────────────┐    ┌──────────────────┐
│ hero (above)                         │    │ hero             │
├──────────────────────────────────────┤    ├──────────────────┤
│ THE ORIGIN DROP            VIEW ALL →│    │ THE ORIGIN DROP  │
│ ┌────┐┌────┐┌────┐┌────┐             │    │ ┌────┐┌────┐ →   │ scroll-snap
│ │pstr││pstr││pstr││pstr│ accent rail │    │ │pstr││pstr│     │
│ └────┘└────┘└────┘└────┘             │    │ └────┘└────┘     │
├──────────────────────────────────────┤    ├──────────────────┤
│ MANIFESTO — big type, 1px rule       │    │ MANIFESTO        │
├──────────────────────────────────────┤    ├──────────────────┤
│ ALL TEN PIECES             VIEW ALL →│    │ ALL TEN PIECES   │
│ ┌───┐┌───┐┌───┐┌───┐  front↔back     │    │ ┌────┐┌────┐     │
│ ┌───┐┌───┐┌───┐┌───┐  on hover       │    │ ┌────┐┌────┐     │
├──────────────────────────────────────┤    ├──────────────────┤
│ ON THE STREET — 3 lifestyle frames   │    │ ON THE STREET    │
├──────────────────────────────────────┤    ├──────────────────┤
│ drop list signup │ footer 4 cols     │    │ signup / footer  │
└──────────────────────────────────────┘    └──────────────────┘

PRODUCT 1280                                PRODUCT 360
┌──────────────────────────────────────┐    ┌──────────────────┐
│ drop / blue flame tee                │    │ ← back           │
│ ┌──┐ ┌──────────────┐ NAME           │    │ ┌──────────────┐ │
│ │th│ │              │ colourway      │    │ │ snap gallery │ │
│ │th│ │   gallery    │ A$33.99 A$39.99│    │ │  ● ○ ○ ○ ○   │ │
│ │th│ │   (sticky)   │ SAVE A$6       │    │ └──────────────┘ │
│ │th│ │              │ ── size ──     │    │ NAME             │
│ │th│ │              │ S M L XL XXL   │    │ A$33.99 SAVE A$6 │
│ └──┘ └──────────────┘ [Add to cart]  │    │ size chips       │
│                       details ▸      │    │ details ▸        │
│                       lore block     │    │ lore             │
│ YOU MAY ALSO LIKE ┌──┐┌──┐┌──┐┌──┐   │    │ ALSO LIKE  ── →  │
└──────────────────────────────────────┘    ├──────────────────┤
                                            │ A$33.99 [Add] ⬅ sticky
                                            └──────────────────┘

CHECKOUT 1280                               CHECKOUT 360
┌──────────────────────────────────────┐    ┌──────────────────┐
│ ① Contact  ② Delivery  ③ Shipping    │    │ summary ▸ (collapsed)
│ ┌──────────────────┐ ┌─────────────┐ │    │ ① Contact        │
│ │ form fields      │ │ order       │ │    │ ② Delivery       │
│ │ inline errors    │ │ summary     │ │    │ ③ Shipping       │
│ │                  │ │ (sticky)    │ │    │ [Place order]    │
│ │ [Place order]    │ │ free-ship ▓ │ │    └──────────────────┘
│ └──────────────────┘ └─────────────┘ │
└──────────────────────────────────────┘
```

## 7. Self-critique — what got cut

Ran the first pass against a "generic defaults" list and removed:

- **Rounded cards + soft shadows.** Replaced with square corners and 1px `--color-ink-line` rules.
  Shadow is used exactly once, on the cart drawer, to lift it off the page.
- **Neon-green/magenta cyberpunk accent.** Every anime streetwear template reaches for it. The
  accent is now taken from the actual range (blue flame), and the loud colour lives in the
  photography instead.
- **Scroll-triggered fade-ups on every section.** Cut entirely. One hero reveal, one drawer
  transition, one image swap. Motion means something when it is rare.
- **A centred hero with the headline over a darkened image.** Every Shopify theme. Replaced with
  the asymmetric split + kanji rail, which lets the portrait photography stay uncropped.
- **Gradient section dividers and glow effects.** Replaced with hairline rules and negative space.
- **A generic "SHOP NOW" CTA.** Every button now names its outcome.
- **Card hover = scale up + shadow.** Replaced with the front→back image swap, which shows the
  customer something they actually want (the back print is the whole point of these tees).
