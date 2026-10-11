const assert = require('node:assert/strict');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']});
  try {
    for (const width of [360, 390, 800, 1440]) {
      const page = await browser.newPage({viewport: {width, height: 900}});
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.addInitScript(() => {
        window.draws = {};
        const proto = WebGL2RenderingContext.prototype;
        for (const method of ['drawElements', 'drawArrays']) {
          const original = proto[method];
          proto[method] = function(...args) {
            const id = this.canvas.id;
            window.draws[id] = (window.draws[id] || 0) + 1;
            return original.apply(this, args);
          };
        }
      });
      await page.goto(process.env.BASE_URL || 'http://127.0.0.1:8765');
      await page.waitForTimeout(1500);
      assert.match(await page.title(), /Adly Fahreza.*System Administrator.*Sysadmin/);
      const person = await page.locator('script[type="application/ld+json"]').textContent();
      for (const alias of ['adly', 'fahreza', 'adeleeeeyyyy', 'adeli', 'adley']) assert(JSON.parse(person).alternateName.includes(alias));
      assert(await page.evaluate(() => window.draws['hero-canvas'] > 0), 'hero renders');
      const overflow = async () => assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow ${width}`);
      await overflow();
      await page.locator('nav a[href="#contact"]:visible').click();
      await page.waitForTimeout(1600);
      assert(await page.locator('#contact').evaluate(e => e.getBoundingClientRect().top < innerHeight), 'nav contact scroll');
      await page.locator('#proj-next').scrollIntoViewIfNeeded();
      await page.waitForTimeout(1200);
      const count = await page.locator('.proj-slide').count();
      for (let i = 0; i < count; i++) {
        await page.locator('#proj-next').click();
        await page.waitForFunction(() => +getComputedStyle(document.querySelector('.proj-slide[aria-hidden="false"]')).opacity === 1);
        assert.equal(await page.locator('.proj-slide[aria-hidden="false"]').count(), 1);
        const state = await page.evaluate(() => {
          const slide = document.querySelector('.proj-slide[aria-hidden="false"]');
          const controls = document.querySelector('.project-controls');
          return {opacity: +getComputedStyle(slide).opacity, bottom: slide.getBoundingClientRect().bottom, top: controls.getBoundingClientRect().top};
        });
        assert.equal(state.opacity, 1);
        assert(state.bottom <= state.top, `project overlaps controls ${width}`);
        await overflow();
      }
      assert.match(await page.locator('#proj-counter').textContent(), /^01/);
      await page.locator('#proj-prev').click();
      await page.waitForTimeout(600);
      assert.match(await page.locator('#proj-counter').textContent(), new RegExp(`^0${count}`));
      assert(await page.evaluate(() => window.draws['server-canvas'] > 0), 'project renders');
      const before = await page.evaluate(() => window.draws['hero-canvas']);
      await page.waitForTimeout(400);
      assert.equal(await page.evaluate(() => window.draws['hero-canvas']), before, 'hero pauses offscreen');
      await page.locator('#proj-next').focus();
      await page.keyboard.press('Tab');
      assert(await page.evaluate(() => parseFloat(getComputedStyle(document.activeElement).outlineWidth) > 0), 'keyboard focus ring');
      await page.evaluate(() => document.documentElement.style.fontSize = '200%');
      await page.waitForTimeout(500);
      await overflow();
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}: SEO, nav click, all ${count} carousel slides + previous, no overlap/overflow (also 200% text), both WebGL draw calls, offscreen pause, focus, zero JS errors`);
      await page.close();
    }
    const plain = await browser.newPage({javaScriptEnabled: false, viewport: {width: 360, height: 900}});
    await plain.goto(process.env.BASE_URL || 'http://127.0.0.1:8765');
    assert.equal(await plain.locator('.proj-slide:visible').count(), 7);
    assert.match(await plain.locator('#terminal-body').textContent(), /system administrator/);
    assert.equal(await plain.locator('#proj-next:visible').count(), 0);
    assert(await plain.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    const boxes = await plain.locator('.proj-slide').evaluateAll(es => es.map(e => ({top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom})));
    boxes.slice(1).forEach((box, i) => assert(box.top >= boxes[i].bottom));
    console.log('PASS no-JS: all 7 project descriptions visible without overlap, terminal content, controls hidden, no overflow at 360');
    await plain.close();
    const reduced = await browser.newPage({reducedMotion: 'reduce', viewport: {width: 390, height: 900}});
    await reduced.goto(process.env.BASE_URL || 'http://127.0.0.1:8765');
    await reduced.locator('#proj-next').click();
    await reduced.waitForFunction(() => document.querySelector('#proj-counter').textContent.startsWith('02'));
    assert.equal(await reduced.locator('.proj-slide[aria-hidden="false"]').getAttribute('data-index'), '1');
    console.log('PASS reduced-motion: next project works');
    await reduced.close();
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
