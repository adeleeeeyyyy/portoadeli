# DESIGN.md

Design tokens and visual language for the portfolio. The tokens defined here
are the single source of truth — reference them via CSS custom properties,
never hardcode raw hex values outside `:root`.

## Concept

"Clean light ops paper." A warm, paper-white portfolio for a Linux systems
administrator. Ink typography with a serif display face, monospace metadata
that borrows the vocabulary of terminals and status pages, and one bold
vermilion accent used sparingly (status dot, key link, one highlight per
screen at most).

## Tokens

| Token             | Value     | Usage                                    |
| ----------------- | --------- | ---------------------------------------- |
| `--paper`         | `#FAF7F2` | Page background                          |
| `--paper-2`       | `#F1EDE5` | Raised surfaces, code blocks             |
| `--ink`           | `#1C1917` | Body text, headings                      |
| `--ink-2`         | `#57534E` | Secondary text, captions                 |
| `--line`          | `#E2DCD0` | Hairline rules, borders                  |
| `--accent`        | `#E4572E` | Vermilion — status dot, links, highlight |
| `--font-display`  | Fraunces  | h1/h2 display type (serif)               |
| `--font-body`     | Space Grotesk | Body, UI                             |
| `--font-mono`     | JetBrains Mono | Terminal text, labels, metadata     |

## Rules

- Display text (h1/h2) always uses `var(--font-display)`.
- `--accent` appears at most twice per screen. Everything else is ink on paper.
- No gradients on the hero, no rounded card with colored left border,
  no emoji icons. Icons are 1.6px-stroke monoline SVGs in `currentColor`.
- No invented metrics. Experience numbers come from the content data file or
  are clearly labelled placeholders.
- Three.js scene: ink-colored wireframe geometry on paper, slow rotation,
  mouse parallax, disabled for `prefers-reduced-motion`.
