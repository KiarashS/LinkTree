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
const fs = require('fs');
const os = require('os');

const PAGE = 'file://' + path.resolve(__dirname, '..', 'index.html');
const WIDTHS = [320, 390, 430, 900];
const MIN_CONTRAST = 4.5;          // WCAG AA for normal-size text
/* Everything painted in the muted ink. They sit on different surfaces — a
   link row, a post row, the card itself — so each needs its own reading. */
/* aria-hidden ones are decoration — the separator dots and the footer heart —
   and a contrast floor is about text people have to read. */
const SECONDARY = ['.link__desc', '.handle', '.post__date', '.posts__head', '.foot span']
  .map((s) => s + ':not([aria-hidden="true"])');
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
  /* CHROMIUM_PATH lets you point at a browser you already have rather than
     letting Playwright download its own — handy in a sandbox or on CI. */
  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});

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

    /* Every surface the muted ink lands on, not just the link rows: the card
       carries an accent wash behind the rows (.card__field), so text sitting
       directly on the card is a different measurement from text on a row. */
    /* Sampling beside the text used to be close enough, but with the card
       carrying a wash the pixel 14px to the right can belong to a different
       surface — or to a neighbour's glyphs. So read the colour the glyphs
       actually sit on: hide the ink, then sample where it was. */
    const spots = await page.evaluate((sel) =>
      [...document.querySelectorAll(sel)].flatMap((el) => {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return [];
        const spot = {
          what: el.className.split(' ')[0] || el.tagName.toLowerCase(),
          ink: getComputedStyle(el).color.match(/\d+/g).slice(0, 3).map(Number),
          x: Math.round(r.left + r.width / 2),
          y: Math.round(r.top + r.height / 2),
        };
        el.style.color = 'transparent';
        return [spot];
      }), SECONDARY.join(','));
    const png = PNG.sync.read(await page.screenshot());
    let worst = { what: null, value: 99 };
    for (const s of spots) {
      if (s.x >= png.width || s.y >= png.height) continue;
      const i = (png.width * s.y + s.x) << 2;
      const c = contrast(s.ink, [png.data[i], png.data[i + 1], png.data[i + 2]]);
      if (c < worst.value) worst = { what: s.what, value: c };
    }
    worst.value >= MIN_CONTRAST
      ? ok(`muted text ≥ ${MIN_CONTRAST}:1 on all ${spots.length} spots (worst ${worst.value}:1)`)
      : bad(`.${worst.what} is ${worst.value}:1, below ${MIN_CONTRAST}:1`);
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
  /* The blog feed is optional by design — the section just stays absent if it
     fails — so a feed outage must not fail this run. Everything else counts. */
  const cfgSrc = fs.readFileSync(path.resolve(__dirname, '..', 'config.js'), 'utf8');
  const feedMatch = cfgSrc.match(/feed:\s*["']([^"']+)["']/);
  const feedHost = feedMatch ? new URL(feedMatch[1]).host : null;
  /* A failed fetch reports the host in the message sometimes and only in the
     console location others ("Failed to load resource: net::ERR_…"), so check
     both before deciding a message is ours. */
  const external = (m) => {
    if (!feedHost) return false;
    const where = (m.location && m.location() && m.location().url) || '';
    return m.text().includes(feedHost) || where.includes(feedHost);
  };

  const noise = [];
  page.on('pageerror', (e) => noise.push('pageerror: ' + e.message));
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    if (external(m)) return;                     // feed unreachable: tolerated
    noise.push('console: ' + m.text());
  });
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

  /* The vCard may only carry destinations the page is actually offering.
     It used to be built from seo.sameAs, which lists canonical profiles
     whether or not they are linked — so commenting a row out of config.js
     left it in people's address books. */
  if (await page.locator('[data-vcard]').count()) {
    const vctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 900, height: 1400 } });
    const vp = await vctx.newPage();
    await vp.goto(PAGE);
    await vp.waitForTimeout(2200);
    const [dl] = await Promise.all([
      vp.waitForEvent('download'),
      vp.click('[data-vcard]'),
    ]);
    const file = path.join(os.tmpdir(), 'checks-contact.vcf');
    await dl.saveAs(file);
    const card = fs.readFileSync(file, 'utf8');
    fs.unlinkSync(file);

    /* Everything the page links to, plus its own canonical URL. */
    const offered = new Set(await vp.evaluate(() => {
      const u = [...document.querySelectorAll('.link__body[href], .social[href]')]
        .map((a) => a.getAttribute('href'));
      const seo = (window.LINKTREE_CONFIG || {}).seo || {};
      if (seo.url) u.push(seo.url);
      return u;
    }));
    const carried = (card.match(/^URL:(.*)$/gm) || []).map((l) => l.slice(4).trim());
    const stray = carried.filter((u) => !offered.has(u));

    carried.length ? ok(`vCard carries ${carried.length} URLs`) : bad('vCard carries no URLs');
    stray.length
      ? bad(`vCard offers links the page does not: ${stray.join(', ')}`)
      : ok('every vCard URL is a link the page actually offers');
    /* CRLF is not cosmetic — some address books reject LF-only cards. */
    /\r\n/.test(card) && !/[^\r]\n/.test(card)
      ? ok('vCard uses CRLF line endings')
      : bad('vCard has bare LF line endings');
    await vctx.close();
  }

  /* The page renders from JS, so the no-JS path must still reach a link. */
  const fb = await browser.newContext({ javaScriptEnabled: false });
  const fbPage = await fb.newPage();
  await fbPage.goto(PAGE);
  await fbPage.waitForTimeout(500);
  const fbLinks = await fbPage.locator('noscript a[href]').count()
                || await fbPage.locator('a[href]').count();
  fbLinks > 0 ? ok(`no-JS fallback offers ${fbLinks} link${fbLinks === 1 ? '' : 's'}`)
              : bad('no-JS fallback has no links — the page is blank without JavaScript');
  await fb.close();

  /* Feed parsing, against a stub: newest-by-published first, count respected.
     The live feed is not used here — this must pass offline. */
  if (feedMatch) {
    const stub = `<?xml version="1.0" encoding="utf-8"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <entry><title>Older but edited yesterday</title>
          <link href="https://example.com/a"/>
          <published>2020-01-01T00:00:00Z</published><updated>2030-01-01T00:00:00Z</updated></entry>
        <entry><title>Newest post</title>
          <link href="https://example.com/b"/>
          <published>2026-05-05T00:00:00Z</published><updated>2026-05-05T00:00:00Z</updated></entry>
        <entry><title>Middle post</title>
          <link href="https://example.com/c"/>
          <published>2023-03-03T00:00:00Z</published><updated>2023-03-03T00:00:00Z</updated></entry>
      </feed>`;
    const fp = await browser.newPage({ viewport: { width: 900, height: 1700 } });
    await fp.route('**/feed*', (r) => r.fulfill({
      body: stub, contentType: 'application/xml',
      headers: { 'access-control-allow-origin': '*' } }));
    await fp.goto(PAGE);
    await fp.waitForTimeout(3000);
    const titles = await fp.evaluate(() =>
      [...document.querySelectorAll('.post__title')].map((e) => e.textContent));
    titles.length
      ? ok(`feed renders ${titles.length} posts`)
      : bad('feed parsed to nothing');
    titles[0] === 'Newest post'
      ? ok('posts ordered by published date, not last edit')
      : bad(`newest post should lead, got "${titles[0]}"`);
    await fp.close();
  }

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
