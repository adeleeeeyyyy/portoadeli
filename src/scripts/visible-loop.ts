import type { WebGLRenderer } from 'three';

// Stop GPU work when the canvas is offscreen or the tab is hidden.
export function visibleLoop(renderer: WebGLRenderer, canvas: HTMLCanvasElement, draw: () => void) {
  let visible = false;
  const sync = () => renderer.setAnimationLoop(visible && !document.hidden ? draw : null);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }).observe(canvas);
  document.addEventListener('visibilitychange', sync);
}
