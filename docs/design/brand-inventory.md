# Brand inventory — Chira Sweets  [DESIGN]
Status: draft, pending approval by @ciprik13. Source of truth for raw brand assets until design-system/ exists.

## Logo files (`design/brand/`)
- round/: chira-sweets-round-{black,brown,cream,gold,white,wine}.{svg,png 6000px} + round-gold-foil.svg (gradient)
- horizontal/: chira-sweets-logo-{gold,cream}.svg + 6000px PNGs, logo-goldfoil.png (raster only, no SVG)
- source/: IG profile pic, 2 existing banners (vertical "Deserturi la comandă", horizontal "Intră pentru o cafea")
- All SVGs are single-path vector (no embedded fonts) — safe to inline, recolorable via `fill`.

## Colors found in the files (not yet a palette)
| Role (proposed) | Hex | Where |
|---|---|---|
| Wine (primary bg) | #6B151E | round-wine.svg, IG profile bg |
| Gold flat A | #B8945C | horizontal logo-gold.svg |
| Gold flat B | #C9A76E | round-gold.svg |
| Gold foil gradient | #A8741A → #F6D77A (7 stops) | round-gold-foil.svg |
| Cream A | #F6ECDF | horizontal logo-cream.svg |
| Cream B | #F1E6D6 | round-cream.svg |
| Brown | #5A2A1E | round-brown.svg |
| Near-black | #1A1A1A | round-black.svg |

Banners use other wines (#67141C, #2F0008) — not canonical.

## Inconsistencies to resolve
1. Two flat golds (#B8945C vs #C9A76E) and two creams (#F6ECDF vs #F1E6D6).
2. Banner wine shades differ from logo wine #6B151E.

## Contrast (WCAG 2.2, computed)
- Cream #F6ECDF on wine: 10.7:1 — OK for all text.
- Gold #B8945C on wine: 4.43:1 — large text only (fails 4.5 body).
- Gold #B8945C on white: 2.83:1 / on cream: 2.42:1 — decorative only, never text or UI boundaries.
- Brighter gold #D8A854 on wine: 5.76:1 — candidate for gold text on dark.
- Accessible dark gold for light bg needs ~#8A6A36 (5.0:1 on white) — to validate.

## Typography
- Wordmark: geometric sans, uppercase, wide tracking (Futura-like). Exact typeface unknown.
- Monogram "CS": custom script, part of the logo — not a web font.

## Open questions
- Font file/name used for the wordmark and its license.
- Logo source files (AI/Figma)?
- Banner product photos: real Chira Sweets products or AI/stock?
