# Adly Fahreza portfolio

Astro static portfolio with Three.js, GSAP and Lenis. No deployment domain is assumed.

## Build and preview

- `npm install`, then `npm run build` (Node >=22.12).
- Development: `npm run astro -- dev --background`; manage with `npm run astro -- dev status`, `dev logs`, `dev stop`.
- Production preview: `python -m http.server 8765 --bind 127.0.0.1 --directory dist`.
- Set `SITE_URL` to your real public HTTPS URL at build time to enable canonical and Open Graph URL metadata. Without it these are intentionally omitted. Supply the domain before deployment; no deployment was performed.

## Regression check

No test dependency is added to the app. Install the browser test tool separately:

```sh
npm install --prefix "$HOME/.hermes/cache/scratch/portfolio-browser" playwright
"$HOME/.hermes/cache/scratch/portfolio-browser/node_modules/.bin/playwright" install chromium
NODE_PATH="$HOME/.hermes/cache/scratch/portfolio-browser/node_modules" node scripts/check.cjs
```

Run against the built preview above. Override `BASE_URL` if needed. Scratch installations can expire; repeat installation when absent.

Verified in Chromium with software WebGL:
- 360, 390, 800, 1440px: no document horizontal overflow, including 200% text sizing.
- Contact navigation click, all seven next-project transitions and previous wraparound; exactly one active slide, full opacity, project text above controls.
- Both Three.js canvases issue real WebGL draw calls; hero GPU drawing stops offscreen.
- Visible keyboard focus and zero uncaught JavaScript errors at all four widths.
- JavaScript disabled at 360px: all seven projects readable without overlap, terminal content present, inactive controls hidden, no overflow.
- Reduced motion at 390px: carousel next works.
- SEO title and Person JSON-LD aliases checked in browser.
- `npm run build` passes. Vite still reports the shared Three.js bundle above 500kB; no Lighthouse score or production Core Web Vitals is claimed.

## Changes

- Retained Latin-only self-hosted fonts, title/description, OG/Twitter and Person structured data from the interrupted SEO pass.
- Completed missing `src/scripts/visible-loop.ts`: both WebGL render loops pause offscreen and when the document is hidden.
- CSS grid sizes the project area using the tallest slide, preventing fixed-height mobile overlaps without measuring layout in JavaScript. Hidden slides are inert.
- Shrinkable grid/flex children and long-token wrapping support narrow screens and enlarged text. Carousel controls and repository links have 44px targets.
- Preserved the existing design, Three.js leader geometry fix and incoming GSAP set at timeline position zero.

Remaining manual checks: real-device Safari/Firefox and touch dragging, tab-hidden lifecycle, screenshot/design review, complete contrast audit, production performance and indexing. Existing project repository URLs were not reverified or rewritten. No application dependencies added, no commits, no deployment.
