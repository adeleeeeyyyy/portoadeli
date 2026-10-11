---
name: astro-tailwind-motion-stack
description: Scaffold an Astro 7 + Tailwind v4 site with Lenis smooth scroll, GSAP ScrollTrigger, and Three.js — includes the create-astro pitfall, Lenis↔GSAP wiring, clean-edge 3D hardware modeling (EdgesGeometry, drag-rotate, spinning fans, wavy airflow), parametric multi-server racks with GSAP camera fly-to, canvas-texture cyber HUD labels, and leader-line/tube annotations
source: auto-skill
extracted_at: '2026-09-03T02:24:52.615Z'
---

# Astro 7 + Tailwind v4 + Lenis/GSAP/Three.js site

Procedure validated building a portfolio site (2026-08). Key gotchas and wiring, in order.

## 1. Scaffold — the non-empty-directory pitfall

`npm create astro@latest . -- --template minimal --install --no-git --yes` **fails when `.` contains anything** (even a hidden `.qwen/` dir). create-astro then silently scaffolds into a random-named subfolder (e.g. `./virtual-visual/`) and exits 1 on dependency install. Recovery:

```bash
mv <subfolder>/{.vscode,public,src,.gitignore,package.json,astro.config.mjs,tsconfig.json,README.md} .
rmdir <subfolder>
npm install
```

Verify with `list_directory` on the project root before proceeding — `run_shell_command` output was empty/unreliable for `ls` in this environment; the list_directory tool was the reliable check.

## 2. Tailwind v4 (no config file, no PostCSS)

Astro 7 + Tailwind v4 uses the Vite plugin, not `@astrojs/tailwind`:

```bash
npm install tailwindcss @tailwindcss/vite
```

```js
// astro.config.mjs
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ vite: { plugins: [tailwindcss()] } });
```

Design tokens go in CSS, not a JS config — use `@theme` in the global stylesheet:

```css
@import 'tailwindcss';
@theme {
  --color-paper: #faf7f2;      /* usable as bg-paper, text-paper, … */
  --font-display: 'Fraunces', serif;
}
```

Then `@apply bg-paper font-body` works in the same file. Fonts: `@fontsource/<face>/<weight>.css` imports in the Layout frontmatter.

## 3. Lenis + GSAP ScrollTrigger wiring (the part everyone gets wrong)

In a single `<script>` (Astro processes it, TS allowed):

```js
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);        // keep triggers in sync
  gsap.ticker.add((t) => lenis?.raf(t * 1000));    // drive Lenis from GSAP's rAF
  gsap.ticker.lagSmoothing(0);                     // required with ScrollTrigger
}
// anchor scroll handler: lenis.scrollTo(sel, { offset: -headerH }) if lenis,
// else el.scrollIntoView()
```

Also set `html { scroll-behavior: auto; }` — CSS smooth scroll fights Lenis.

## 4. Reveal animations, reduced-motion-safe

Mark elements `data-reveal`, start them at `opacity: 0` in CSS, then:

```js
if (!reduced) {
  gsap.utils.toArray('[data-reveal]').forEach((el) =>
    gsap.fromTo(el, { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' } }));
}
```

CSS fallback for reduced motion:
```css
@media (prefers-reduced-motion: reduce) {
  [data-reveal] { opacity: 1 !important; transform: none !important; }
}
```

## 5. Three.js scenes

Plain `<script>` with `import * as THREE from 'three'`; guard the whole block with the same `reduced` check. Keep it cheap: `WebGLRenderer({ canvas, alpha: true })`, `setPixelRatio(min(dpr, 2))`, wireframe `MeshBasicMaterial` (no lights needed), resize handler that also repositions/rescales the group at a breakpoint (e.g. `w >= 768`), pointer parallax via lerped rotation in `renderer.setAnimationLoop`.

### 5a. Clean edges — never `wireframe: true` for boxy objects

`MeshBasicMaterial({ wireframe: true })` on a `BoxGeometry` draws the triangulation diagonals (an X across every face). For hardware/architectural models use `EdgesGeometry` + `LineSegments` — outline edges only:

```js
const line = (opacity: number) =>
  new THREE.LineBasicMaterial({ color: 0x1c1917, transparent: true, opacity });
const edge = (w, h, d, mat) =>
  new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), mat);
```

Note: closing a timeline tween must animate the *material* (`gsap.to(wireInner, { opacity: ... })`), not child positions. Users notice the X-diagonals immediately — this was an explicit correction request.

### 5b. Modeling recognizable hardware from primitives (validated: Dell R630)

A recognizable server needs real proportions and the model's signature layout, not generic boxes:
- **Get the chassis ratio right first** — 1U = 19″ × 1.75″, so `BoxGeometry(2.4, 0.24, 2.2)`. A wrong height (e.g. 0.62 = 2U-ish) reads as "generic box" and got corrected to the R630.
- Signature front layout: 10× 2.5″ bays (2 rows × 5, left ~60% of face), LCD strip + USB + LEDs right of bays, rack ears, twin rear PSUs.
- LEDs are the one place for a solid accent: `MeshBasicMaterial({ color: accent })`, tiny boxes.
- Group parts into `front` / `rear` / `internals` subgroups from the start — enables the open-case animation later at zero cost.

### 5c. Internals reveal — two validated modes

**Always-visible (preferred, final choice):** no button; render internals permanently and drop the chassis shell to ~0.22 opacity so the guts read through it. Simpler than a toggle and the user explicitly removed the open/close button after trying it.

**Toggle mode (if asked):** internals built with the same 0.5-opacity material *inside* a full-brightness chassis wireframe are effectively invisible — the user asked "where's the RAM/fans?" even though they existed. When opening, **dim the shell and brighten the guts**:

```js
gsap.timeline({ defaults: { duration: 0.6, ease: 'power2.inOut' } })
  .to(front.position, { x: open ? 0.9 : 0 }, 0)   // slide assemblies apart
  .to(rear.position,  { x: open ? -0.9 : 0 }, 0)
  .to(wire,       { opacity: open ? 0.1 : 0.45 }, 0)      // dim shell
  .to(wireInner,  { opacity: open ? 1 : 0, duration: 0.5 }, open ? 0 : 0.25)
  .add(() => { if (!open) internals.visible = false; });
```

Internals don't need detail to read well: motherboard plate, 2 CPU blocks, 8 thin RAM sticks, fan wall, backplane, riser — all `edge()` boxes.

### 5d. Drag-to-rotate alongside Lenis

Canvas drag conflicts with Lenis smooth scroll. Use pointer capture so drags stay on the canvas:

```js
canvas.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', (e) => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; server.rotation.y += dx * 0.011; velY = dx * 0.011; });
// momentum: apply velY each frame, decay velY *= 0.94; skip auto-spin while dragging
```

`cursor-grab active:cursor-grabbing` + a "drag to inspect" caption tells users it's interactive.

### 5e. Fan wall — orientation took 3 corrections, get it right the first time

Real-server fan placement (validated on the R630 after two user corrections):
- **Position:** a row of fans across the chassis *width*, just **behind the drive backplane** (mid-front), NOT mid-chassis and NOT along the side wall. Airflow path: front bays → backplane → fans → motherboard/PSUs.
- **Orientation:** fans face FRONT — spin axis runs front-to-back (the chassis-depth axis). Concretely (x = depth): fans at `position.x = FAN_X` (behind backplane), spread along z; rotor group gets `rotation.y = π/2` so local z (spin axis) aligns with world x.
- **Blade bug:** blades made from a flat `ShapeGeometry` must NOT get `rotation.x = π/2` — that rotates them 90° out of the rotor plane so the flat face points sideways ("fan nya kebalik"). The shape already lies in the spin plane; only fan out with `rotation.z = (b/N) * 2π`.

```js
const blade = new THREE.Shape();
blade.moveTo(0, 0.02);
blade.quadraticCurveTo(0.09, 0.06, 0.1, 0);
blade.quadraticCurveTo(0.09, -0.06, 0, -0.02);
const bladeGeo = new THREE.ShapeGeometry(blade, 6);
// per fan: hub = CylinderGeometry rotated x=π/2 (accent color), 5 blades,
// whole rotor in a Group with rotation.y = π/2; spin via rotor.rotation.z += 0.35
```

### 5f. Wavy airflow lines (animated sine streams)

Per fan, one `THREE.Line` with a preallocated N-point `BufferAttribute`; rewrite positions each frame with `setXYZ` + `pos.needsUpdate = true`. The wave must **start at the fan intake (front) and stream toward the rear** — direction matters to the user:

```js
// per point i, along the depth axis x:
const x = FAN_FRONT - (i / (N - 1)) * LENGTH;  // fan front → rear
pos.setXYZ(i, x,
  Math.sin(phase + t * 3 - i * 0.6) * 0.03,    // minus sign = travels rearward
  Math.cos(phase + t * 2.4 - i * 0.6) * 0.03);
```

Give each line a random `phase` so they undulate independently; drive with `new THREE.Clock().getElapsedTime()` in the render loop; skip entirely under reduced motion.

### 5g. Hero terminal typing

Type lines char-by-char into a `<pre><code>`: create one `<span>` per line (commands full opacity, output ~70%), append chars to `body.lastElementChild`. **Bug to avoid:** only create the span for command lines (or both, consistently) — appending a text node after a span makes later lines land inside the previous span. Skip the blinking cursor block unless asked; it drew an explicit removal request.

## 6. Anti-AI-slop design rules that were enforced

Write a `DESIGN.md` with tokens and reference them only via CSS vars / Tailwind theme. Hard rules: no default indigo accent, no hero gradient, no emoji icons (1.6px-stroke monoline SVG with `currentColor`), display h1/h2 must use `var(--font-display)` (serif when the design binds one), no rounded card + colored left border, no invented metrics, no lorem ipsum, `data-od-id` on every section, ≤2 visible accent uses per screen. "Soul" comes from ~20% distinctive choices: microcopy in the user's domain vocabulary, one micro-interaction (e.g. a `c` keyboard shortcut with a kbd hint), one detail only a real user would add (e.g. `exit code 0` footer for a sysadmin portfolio).

## 7. Slide carousel (no library needed)

A card grid converts to a carousel with ~30 lines of GSAP: absolutely-positioned slides in a relative container (`inset-x-7 inset-y-10`), non-first slides `display: none; opacity: 0` at init, then a timeline per transition — fade/slide out, `set` swap, fade/slide in — with an `animating` flag to debounce rapid clicks, a `01 / 03` counter, prev/next buttons, and `aria-hidden` toggling on the outgoing/incoming slide. Pair with a 3D panel (`grid md:grid-cols-2`) so one canvas serves all slides; stack with `order-1/order-2` on mobile.

**Position every step in the transition timeline explicitly.** A `.set()` without a position parameter inherits `defaults`, and `defaults.duration` shifts it off zero:

```js
// BUG: the `1.6`-s set lands at t=1.6, so the reveal tween targets already-finished
// values and the incoming slide stays stuck at opacity 0 / x 24 (text vanishes on next click)
.set(inc, { display: 'flex', opacity: 0, x: 24 })
// FIX: pin it to t=0 like the outgoing tween
.set(inc, { display: 'flex', opacity: 0, x: 24 }, 0)
```

The kicker: the outgoing slide's `.set(out, {display:'none'})` (also no position, but it *precedes* the misplaced set in child order) still lands correctly — so the symptom is asymmetric and easy to misread as a CSS/opacity problem. Confirm by sampling computed styles every 100ms after a click; a correct swap shows exactly one slide at `opacity 1`.

## 8. 3D-outline monogram hover (org "logos" without assets)

When the user asks for logos but no brand assets exist, derive monograms from org names (`split(/[\s-]+/).map(w => w[0]).join('').slice(0,2).toUpperCase()`) and render them as outlined display type with a 3D flip on hover — validated on the experience timeline, user asked for exactly this ("logo instansi ... 3d style outline"):

```css
.exp-item { perspective: 900px; }
.exp-logo {
  position: absolute; right: 0.5rem; top: 50%;
  transform: translateY(-50%) rotateY(75deg) scale(0.8);
  transform-style: preserve-3d; opacity: 0; pointer-events: none;
  transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.3, 1), opacity 0.45s ease;
  font-family: var(--font-display); font-style: italic; font-weight: 700;
  font-size: 4rem; color: transparent;
  -webkit-text-stroke: 1.5px var(--color-accent); /* the outline */
  user-select: none;
}
.exp-item:hover .exp-logo, .exp-item:focus-within .exp-logo {
  opacity: 0.85; transform: translateY(-50%) rotateY(-12deg) scale(1);
}
```

Add `relative` to the item, an `aria-hidden` span for the monogram, and a `prefers-reduced-motion` block that drops the rotation (plain fade). The accent-colored outline counts as one of the ≤2 accent uses per screen, so keep the rest of the section ink-only.

## 9. Timeline divider spacing — never zero first/last padding

A `divide-y` list whose items use `first:pt-0 last:pb-0` produces uneven visual rhythm: the outer `border-y` lines sit flush against the first/last entries while inter-item gaps are `py-10`+`py-10`. The user flags it as "jaraknya tidak sama". Fix: uniform `py-10` on every item (the extra outer whitespace is fine) — or use `space-y` + per-item borders instead.

## 10. Multi-server rack + GSAP camera fly-to (validated: 7U rack, project carousel sync)

When a section pairs a 3D rack with a project carousel (one project per server):

**Parametric rack** — spec array drives everything; never hand-place servers:

```js
const specs = [
  { vendor: 'Dell', model: 'R620', cols: 4, org: 'ID-Networkers', face: 'dell-lcd' },
  { vendor: 'HP', model: 'DL360p G8', cols: 4, org: 'ID-Networkers', face: 'hp' },
  // ... one entry per server, order = rack position top→bottom
];
const SH = 0.34, GAP = 0.16;        // taller-than-1U + visible gap (user asked for both)
const U = SH + GAP;                 // pitch
const H = specs.length * U + 0.12;
// server i sits at y = H/2 - U/2 - 0.06 - i*U
```

Drive-bay count varies per model (`2 rows × cols`); LCD/LED column shifts right of the bays (`lcdZ = -0.8 + cols*pitch + 0.22`).

**Per-family front faces** (user asked for "detail unik tiap server"): a `face` key on each spec switches the area right of the bays — `dell-lcd` (13G+): LCD frame + glowing blue screen (`0x38bdf8`, opacity 0.35) + 2 buttons; `hp`: logo zone + slim info display + blue UID button; `fujitsu`: wide status strip + stacked USBs; `dell-old` (R610): no LCD — 2 diagnostic LEDs + VGA. The vendor string also feeds the HUD label (`${vendor} ${model}` typed out), since "nama vendornya bukan cuma serinya" was requested.

**Camera fly-to that survives drag-rotation** — the rack group rotates (drag), so view positions must be rotated into rack space. Tween both camera position AND a lookAt target vector:

```js
const setView = (pos, target) => {
  const p = pos.clone().applyAxisAngle(UP, rack.rotation.y);   // UP = (0,1,0)
  const t = target.clone().applyAxisAngle(UP, rack.rotation.y);
  gsap.to(camera.position, { ...p, duration: 1.0, ease: 'power2.inOut' });
  gsap.to(camTarget, { ...t, duration: 1.0, ease: 'power2.inOut',
    onUpdate: () => camera.lookAt(camTarget) });
};
// idle:  setView(new Vector3(5.4, 0.9, 6.4), origin)  — whole rack, pull back generously
// focus: setView(new Vector3(3.0, y, 1.4), new Vector3(1.1, y, -0.2))  — face of server i
```

Call `focusServer(next)` inside the carousel's `show()` so slide swap and camera fly are one gesture. Reduced motion: copy position/target instantly, no tweens.

**Declaration order bug (TDZ):** if an init call like `showRack()` runs mid-script and the functions it touches use a `let` declared *later* (e.g. `let focused`), the whole script throws `ReferenceError` at load — scene, drag, carousel all die silently. Hoist shared `let`s (clock, focused, flags) above the first function that reads them.

## 11. Canvas-texture HUD labels (cyber panels, no font assets)

For "label with model + workplace, cyber animation": draw on a 2D canvas, use as a `THREE.Sprite` with `CanvasTexture`, redraw per frame while visible (`tex.needsUpdate = true`), keep `visible: false` until selected. Panel recipe (all in one `draw(t)`):

- dark plate `rgba(28,25,23,0.92)` + thin border + accent **corner brackets** (4 short L-strokes)
- model name **typed** char-by-char (`t * 18` chars/s) with a blinking block cursor
- `@ org` line at ~65% opacity below
- accent **scanline** sweeping via `createLinearGradient` on `((t*90) % 210) - 25`
- only redraw the *focused* panel in the render loop — one canvas upload, not seven

**Sprite sizing — corrected twice by the user ("kegedean"):** a 512×160-texture sprite wants ~0.62 × 0.19 world units next to a 2.4-wide chassis (≈¼ of chassis width). 1.7 and even 1.15 were both flagged too big. Set `(sprite.material as SpriteMaterial).opacity` to 0 at init so it can fade in.

**Sprite placement vs FOV — label "hilang" bug:** a label moved "beside the rack" (z≈1.5, past the ear) on a 35° FOV camera sat ~27° off the view axis and rendered off-canvas — user reported it simply vanished. Keep HUD sprites within ~15° of the view axis: (1.4, 0.06, 1.0) off the chassis's front-right corner works, with the camera at (3.8, y, 2.0) targeting (1.05, y, -0.1). When a label "disappears", check the frustum before the animation logic.

**Reveal/hide sequencing** (smooth transitions between focused servers):
1. collapse old panel: `gsap.to(scale, {x:0.4, y:0.125, dur:0.3, power2.in})` + fade material & leader to 0, then `visible = false` via `gsap.delayedCall(0.3, ...)`
2. camera flies (1.0s) — reveal the new panel only **after landing**: `gsap.delayedCall(1.0, reveal)`
3. reveal: scale from 0.4→full with `back.out(1.7)` overshoot + opacity fade; leader line fades in at +0.15s
4. every hide path must `gsap.killTweensOf([sprite.scale, material, leader])` first or killed-delayed-calls leave half-tweened zombies

### 11a. `new THREE.Line(pointsArray, mat)` THROWS on three ≥ r180 — wrap in BufferGeometry

Passing a raw `Vector3[]` straight to a Line-family constructor used to work; on modern three it throws at construction: `TypeError: Cannot convert undefined or null to object` from `Line.updateMorphTargets()` (`Object.keys(this.geometry)` where `geometry` is an array). Inside `WebGLRenderer`-less code this kills the **whole scene script**, so the canvas silently stays 300×150 (never sized) and nothing else in that component mounts.

```js
// BAD  (three 0.185): whole script dies, canvas never renders
new THREE.Line(new THREE.CatmullRomCurve3(pts).getPoints(20), mat);
// GOOD
new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(20)), mat);
```

Both forms here already used the safe pattern except one leader line — so when one 3D scene on a page dies while a sibling renders, **compare the two scenes' constructor calls** instead of assuming a context/WebGL problem. Verify with `node`: `new THREE.Line(pts, mat)` vs `new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat)` — only the first throws.

## 12. Leader lines: orthogonal elbow LineSegments, NOT tubes

Evolution of this feature (all three stages user-reviewed): a straight 1px `Line` was "kurang terlihat" (too faint); a bent `TubeGeometry` (CatmullRom, radius 0.008) was visible but "keliatan aneh" (looked weird); the final validated form is a **clean orthogonal elbow** made of `LineSegments`:

```js
const leader = new THREE.LineSegments(
  new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(1.38, 0.02, 0.85), // panel edge
    new THREE.Vector3(1.19, 0.02, 0.7),  // onto the face plane
    new THREE.Vector3(1.19, 0.02, -0.3), // ends on the drive-bay area
  ]),
  new THREE.LineBasicMaterial({ color: 0xe4572e, transparent: true, opacity: 0 }),
);
```

`setFromPoints` on 3 points gives 2 connected segments (pairs of consecutive points, no duplication needed). Why it reads better than the tube: axis-aligned runs + one bend look like a technical callout; smooth splines through 3D space read as noodles. If 1px is still too faint, raise the accent opacity to 0.9 and/or shorten the line rather than thickening it into geometry. Add the leader to the server group (not the scene) so it moves with the rack; fade opacity 0→0.9 after the panel appears.

## 13. Verify

`npm run build` must pass; then check `dist/index.html` contains every section id and that JS/font bundles exist in `dist/_astro/`. Content (name, socials, jobs) belongs in one `src/data/*.ts` file so the user swaps identity in a single place.
