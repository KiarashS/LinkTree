/* ------------------------------------------------------------------
 * scripts/checks.js — optional development tooling.
 *
 * The site itself has no dependencies; this file is the exception, and
 * nothing in it ships to visitors. It guards the properties that are
 * easy to break by editing config.js and hard to notice by eye.
 *
 *   npm i -D playwright && npx playwright install chromium
 *   node scripts/checks.js
 *
 * Exits non-zero if anything fails, so CI can use it as-is.
 * ------------------------------------------------------------------ */

const { chromium } = require('playwright');
const path = require('path');

const PAGE = 'file://' + path.resolve(__dirname, '..', 'index.html');
const WIDTHS = [320, 390, 430, 900];
const MIN_CONTRAST = 4.5;          // WCAG AA for normal-size text
const PLACEHOLDERS = [/example\.com/i, /your-handle/i, /YOUR-NUMBER/i, /^#$/];

let failures = 0;
const ok = (m) => console.log('  ✓ ' + m);
const bad = (m) => { failures++; console.log('  ✗ ' + m); };

/* --- relative luminance, per WCAG --- */
const chan = (v) => {
  v /= 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};
const lum = (c) => 0.2126 * chan(c[0]) + 0.7152 * chan(c[1]) + 0.0722 * chan(c[2]);
const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return +((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(2);
};

(async () => {
  const browser = await chromium.launch();

  /* ---- 1. Text stays legible in both themes ----------------------
     Sampled from a screenshot rather than computed from CSS: the rows
     are translucent over a gradient, so the value that matters is the
     pixel actually painted behind the text.                          */
  const { PNG } = (() => { try { return require('pngjs'); } catch (e) { return {}; } })();
  for (const scheme of ['dark', 'light']) {
    console.log(`\ncontrast — ${scheme}`);
    const page = await browser.newPage({ viewport: { width: 900, height: 1400 }, colorScheme: scheme });
    await page.goto(PAGE);
    await page.waitForTimeout(2200);

    if (!PNG) { console.log('  ! pngjs not installed, skipping'); await page.close(); continue; }

    const ink = await page.evaluate(() => {
      const el = document.querySelector('.link__desc');
      return el ? getComputedStyle(el).color.match(/\d+/g).slice(0, 3).map(Number) : null;
    });
    const spots = await page.evaluate(() =>
      [...document.querySelectorAll('.link__desc')].map((el, i) => {
        const r = el.getBoundingClientRect();
        return { row: i + 1, x: Math.round(r.right + 14), y: Math.round(r.top + r.height / 2) };
      }));
    const png = PNG.sync.read(await page.screenshot());
    let worst = { row: null, value: 99 };
    for (const s of spots) {
      const i = (png.width * s.y + s.x) << 2;
      const c = contrast(ink, [png.data[i], png.data[i + 1], png.data[i + 2]]);
      if (c < worst.value) worst = { row: s.row, value: c };
    }
    worst.value >= MIN_CONTRAST
      ? ok(`secondary text ≥ ${MIN_CONTRAST}:1 on every row (worst ${worst.value}:1)`)
      : bad(`row ${worst.row} secondary text is ${worst.value}:1, below ${MIN_CONTRAST}:1`);
    await page.close();
  }

  /* ---- 2. Nothing overflows, at any width ---- */
  console.log('\nlayout');
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(PAGE);
    await page.waitForTimeout(1500);
    const bleeds = await page.evaluate(() => {
      const w = document.documentElement.clientWidth;
      const out = [];
      document.querySelectorAll('.link, .mail, .tagline--typed, .name').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.right > w + 1 || r.left < -1) out.push(el.className);
      });
      return { out, scrollsX: document.documentElement.scrollWidth > w };
    });
    !bleeds.scrollsX && !bleeds.out.length
      ? ok(`${width}px — no overflow`)
      : bad(`${width}px — ${bleeds.scrollsX ? 'page scrolls sideways; ' : ''}${bleeds.out.join(', ')}`);
    await page.close();
  }

  /* ---- 3. Links are real, and the page is quiet ---- */
  console.log('\ncontent');
  const page = await browser.newPage({ viewport: { width: 900, height: 1400 } });
  const noise = [];
  page.on('pageerror', (e) => noise.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') noise.push('console: ' + m.text()); });
  await page.goto(PAGE);
  await page.waitForTimeout(2200);

  const hrefs = await page.evaluate(() =>
    [...document.querySelectorAll('.link__body[href], .social[href]')]
      .map((a) => ({ label: (a.textContent || a.getAttribute('aria-label') || '').trim().split('\n')[0],
                     href: a.getAttribute('href') })));
  hrefs.length ? ok(`${hrefs.length} link targets found`) : bad('no links rendered');
  for (const { label, href } of hrefs) {
    const hit = PLACEHOLDERS.find((re) => re.test(href));
    if (hit) bad(`"${label}" still points at a placeholder: ${href}`);
  }
  if (!hrefs.some(({ href }) => PLACEHOLDERS.some((re) => re.test(href)))) ok('no placeholder URLs');

  /* No plain address in the served source — the anti-harvesting split. */
  const fs = require('fs');
  const sources = ['config.js', 'index.html']
    .map((f) => fs.readFileSync(path.resolve(__dirname, '..', f), 'utf8')).join('\n');
  const leaked = sources.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || [];
  const real = leaked.filter((a) => !a.endsWith('anthropic.com') && !a.includes('example'));
  real.length ? bad('plain address in source: ' + real.join(', '))
              : ok('no plain email address in the source');

  /* Email popup opens and lists every configured address. */
  const rows = await page.evaluate(async () => {
    const btn = document.querySelector('[data-open-emails]');
    if (!btn) return -1;
    btn.click();
    await new Promise((r) => setTimeout(r, 700));
    return document.querySelectorAll('.mail').length;
  });
  rows > 0 ? ok(`email popup lists ${rows} address${rows === 1 ? '' : 'es'}`)
           : bad('email popup did not open');

  /* Structured data is present and parses. */
  const ld = await page.evaluate(() => {
    const el = document.querySelector('script[type="application/ld+json"]');
    return el ? el.textContent : null;
  });
  try {
    const parsed = JSON.parse(ld);
    parsed && parsed.name ? ok(`JSON-LD Person: ${parsed.name}, ${(parsed.sameAs || []).length} profiles`)
                          : bad('JSON-LD present but has no name');
  } catch (e) { bad('JSON-LD missing or not valid JSON'); }

  noise.length ? bad('console/page errors: ' + noise.join(' | ')) : ok('no console or page errors');
  await page.close();

  await browser.close();
  console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed');
  process.exit(failures ? 1 : 0);
})();
