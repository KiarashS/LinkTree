# 🌳 LinkTree

A modern, animated, single-page link-in-bio site. No build step, no
dependencies, no tracking — just three files you can drop on any static host.

![Static site](https://img.shields.io/badge/static-no%20build%20step-7c5cff)
![Dependencies](https://img.shields.io/badge/dependencies-0-22d3ee)

## What's in it

- **Liquid-glass material** in the spirit of macOS Tahoe — transparent,
  heavily saturated panes with a bright specular top edge, soft inner glow,
  capsule controls and springy presses
- **Typed tagline** that cycles through as many phrases as you like, with a
  blinking cursor and smart backspacing
- **Animated backdrop** — drifting aurora blobs, a faint grid and film grain
- **Spinning gradient ring** around your avatar
- **Staggered entrance** animation for every element
- **Cursor-following spotlight** and a sheen sweep on each link
- **Featured links** with an animated gradient border
- **Theme follows the system** by default; the control cycles System → Light →
  Dark, so a visitor can always hand control back
- **Email chooser popup** — one row opens a glass modal listing every address
  (personal, work, press…), each with copy and compose buttons
- **Latest posts** read live from your blog's Atom/RSS feed, newest first
- **QR panel** behind a toolbar button, for handing the page over in person
- **vCard download** built from the same config, so there's no second copy of
  your details to keep in sync
- **Glass tooltips** replacing the browser's `title=` popup, with the macOS
  timing: a delay before the first, instant while you keep moving
- **Copy-to-clipboard** buttons with a toast
- **Share button** using the Web Share API, falling back to copying the URL
- **Fully responsive**, keyboard accessible, and respects
  `prefers-reduced-motion` and print styles

## Files

| File | What it's for |
| --- | --- |
| `config.js` | **Edit this.** Your name, avatar, links and colours. |
| `index.html` | Layout, styles and rendering logic. Rarely needs touching. |
| `avatar.jpg` | Your photo, served from here rather than a third party. |
| `favicons/` | Tab icon, shared with blog.kiarashs.ir. |
| `og.jpg` | 1200×630 social preview card. |
| `qr.svg` | QR code for the site, shown in the toolbar's QR panel. |
| `CNAME` | Custom domain for GitHub Pages. |
| `scripts/checks.js` | Optional dev tooling — see [Checks](#checks). |
| `README.md` | This file. |

## Getting started

1. Open `config.js` and replace the placeholder URLs (`https://example.com`,
   `your-handle`) with your own.
2. Open `index.html` in a browser — that's it, it works straight from disk.

### Adding a link

```js
{
  label: "Newsletter",
  description: "One email a month, no spam",
  url: "https://example.com/newsletter",
  icon: "mail",       // see the icon list at the top of config.js
  featured: true,     // optional — animated gradient border
  copy: "hi@you.com", // optional — adds a copy-to-clipboard button
}
```

Built-in icons: `github`, `linkedin`, `x`, `facebook`, `instagram`, `youtube`,
`telegram`, `whatsapp`, `medium`, `devto`, `dribbble`, `mastodon`, `scholar`,
`academic`, `arxiv`, `researchgate`, `donate`, `coffee`, `mail`, `globe`, `blog`,
`rss`, `docs`, `resume`,
`calendar`, `music`, `store`, `chat`, `star`, `home`, `link`.
Anything else falls back to a generic link icon.

### Highlighting part of your name

`nameHighlight` picks the slice of `name` that gets the animated accent
gradient and its soft bloom; the rest stays plain:

```js
name: "Kiarash Soleimanzadeh",
nameHighlight: "Kiarash",
```

Omit `nameHighlight` and the first word is used. Set it to `""` to render the
whole name plain. If the string doesn't appear in `name`, the name renders
plain rather than breaking.

The gradient uses `--accent-ink-from` / `--accent-ink-to`, which are your
accent colours darkened for the light theme — raw cyan on a white card is
about 1.9:1, well under any legibility bar. Both ends clear 4.5:1 in both
themes at every point of the sweep, and they're derived with `color-mix`, so
changing `accentFrom` / `accentTo` still flows through.

### The typed tagline

Give `tagline` a **list** and it types each phrase out, holds, backspaces and
moves to the next, forever:

```js
tagline: [
  "Researcher",
  "ML/AI Enthusiast",
  "Senior Software Engineer",
  "Blogger",
],
```

Give it a **plain string** instead and it renders as static text, no animation:

```js
tagline: "Software engineer · builder of things for the web.",
```

Pacing and the lead-in live in the `typing` block (times in milliseconds):

| Option | Default | What it does |
| --- | --- | --- |
| `prefix` | `"I'm a "` | Static muted text before the typed phrase. `""` for none |
| `typeSpeed` | `90` | Delay between typed characters |
| `backSpeed` | `45` | Delay between deleted characters |
| `holdDelay` | `1800` | Pause once a phrase is complete |
| `startDelay` | `500` | Wait before the first character |
| `cursor` | `"\|"` | The blinking character. `""` hides it |
| `smartBackspace` | `true` | Keep the shared opening of adjacent phrases |
| `loop` | `true` | `false` stops on the last phrase |

`smartBackspace` only deletes back to the last character two neighbouring
phrases share — so `"Blogger"` → `"Blogging"` rewrites just the tail rather
than retyping the whole word. Order your phrases with that in mind.

`prefix` renders in the muted text colour so the typed phrase stays the
emphasis, and it only applies when `tagline` is a list. The article lives in
each phrase rather than the prefix — `"I'm "` plus `"an ML/AI Enthusiast"` —
because a fixed `"I'm a "` reads wrong before a vowel *sound*.

Two things worth knowing: typed phrases **don't wrap**, because a word hopping
to a second line mid-keystroke reads as a glitch — so keep them short. And
visitors who ask their system for reduced motion get the first phrase as plain
static text with no cursor. The full list is always exposed to screen readers
as ordinary sentences, so nothing is lost to assistive tech.

### Several email addresses

Rather than one `mailto:` row, the page can open a popup listing every inbox
you want to publish. Any link or social with `action: "emails"` opens it:

```js
{ label: "Email me", description: "Pick the right inbox", action: "emails", icon: "mail" }
```

The addresses themselves live in one place, so a link and a social icon can
share the same list:

```js
emailer: {
  title: "Say hello",
  subtitle: "Tap an address to copy it, or open it in your mail app.",
  addresses: [
    { label: "Personal", address: "you@gmail.com",  note: "Anything and everything", primary: true },
    { label: "Work",     address: "you@company.com", note: "Consulting and contracts" },
  ],
}
```

Addresses are stored split, so no `user@domain` string sits in the source for
a harvester to lift with a regex:

```js
{ label: "Work", user: "you", domain: "gmail.com", note: "…" }
```

The page joins them at render time. `address: "you@gmail.com"` still works if
you'd rather not bother. This stops naive scrapers, not ones that run
JavaScript — the same limit any client-side obfuscation has, including the
HTML entities it replaced.

`primary: true` gives a row the gradient icon and an accent border. Each row
has a copy button (the label flips to "Copied") and a compose button that
opens the visitor's mail app. The popup closes on Esc, on a backdrop click,
or via the close button, and returns focus to whatever opened it. Add as many
or as few addresses as you like — a single one works fine.

### Latest posts from your blog

Point `blog.feed` at an Atom or RSS feed and the page lists your newest posts
under the links:

```js
blog: {
  feed: "https://blog.kiarashs.ir/feed.xml",
  heading: "Latest writing",
  count: 3,
}
```

Three details worth knowing:

- Each post shows its publication day, formatted in the **visitor's** locale —
  "16 Feb 2026" or "Feb 16, 2026" — with the ISO date in a `<time datetime>`
  for anything reading the page rather than looking at it. Below 430px the
  date moves under the title instead of disappearing.
- Posts are sorted by **published** date, not last-modified. Fixing a typo in
  a 2020 post shouldn't push it back to the top of "latest". RSS only carries
  `pubDate`, and some Atom feeds omit `published`, so `updated` is the
  fallback rather than the first choice.
- The fetch is **deferred to idle** (`requestIdleCallback`, 2.5s timeout) so a
  slow feed can't hold up first paint. The section appears when it arrives.
- Any failure — feed down, no CORS header, malformed XML — leaves the section
  **absent**, silently. There's no error state to design around, and nothing
  shifts once the page has settled. Your feed does need to allow
  cross-origin reads (`access-control-allow-origin`), which most static hosts
  send for free; if yours doesn't, drop `feed` and the section goes away.

Remove the `blog` block entirely to turn the feature off.

### QR code

The toolbar's QR button opens a panel with `qr.image` in it — useful when
someone's standing in front of you:

```js
qr: {
  title: "Scan to open",
  subtitle: "Point a camera at the code.",
  image: "qr.svg",
  url: "https://links.kiarashs.ir/",
}
```

`url` is the address the code encodes. It isn't read at runtime — the image is
a static file — so **regenerate `qr.svg` whenever the URL changes**; `url` is
there to record what the shipped image actually points at. Any QR generator
will do, at medium error correction or better.

The code is drawn dark-on-white on its own white tile regardless of theme.
Letting it go transparent over dark glass would look better and scan worse,
and a code that doesn't scan has no reason to exist.

### vCard

A link with `action: "vcard"` builds a contact card from the config you've
already written and downloads it:

```js
{ label: "Save my contact", description: "Downloads a vCard with my details", action: "vcard", icon: "contact" }
```

Name, job title, every address the email chooser offers, and the URL of every
link and social on the page all come from the existing blocks, so there's no
separate `.vcf` to keep up to date. It's vCard 3.0, which is what Contacts on
iOS/macOS, Android and Outlook all read without complaint.

Each address keeps its `label`: `Work` becomes `TYPE=WORK` and `Personal`
becomes `TYPE=HOME`, so they import filed rather than as a pile of untyped
addresses. Any other label goes in untyped rather than being forced into a
category it doesn't fit. The row you mark `primary: true` gets `TYPE=PREF` —
the inbox a contact app replies to — and if no row is marked, the first one
does. Duplicates are dropped.

The URLs come from `links` and `socials` — **not** from `seo.sameAs`.
`sameAs` is a search-engine signal and deliberately lists canonical profiles
whether or not the page links to them, so building the card from it put rows
you'd commented out into people's address books. Comment a link out of
`config.js` and it leaves the card too.

One consequence: the card carries your links exactly as written, so a
`go.kiarashs.ir/…` shortlink goes in as the shortlink. That's the same URL a
visitor would get by tapping the row. If you'd rather a contact stored the
canonical destination, put the canonical URL on the link itself — `sameAs`
won't do it for you.

### Changing the colours

Everything is driven by two accent colours in `config.js`:

```js
theme: {
  accentFrom: "#7c5cff",
  accentTo:   "#22d3ee",
  default:    "auto",   // or "dark" / "light" to force one
}
```

The glass itself is tuned by a second set of tokens at the top of
`index.html` — `--glass-blur`, `--rim-top`, `--rim-side`, `--rim-bottom`,
`--inner-glow` and `--spec`. Raise `--rim-top` and `--spec` for a glassier,
more reflective surface; lower them for something flatter and calmer. Each is
defined once per theme.

Two tokens control how much of the background reaches your text. `--pane` is
the card's own fill — unlike `--surface` it *occludes*, so the aurora reads
around the card rather than through the words. `--blob-opacity` sets how
strong the drifting colour is. Lowering `--pane`'s alpha or raising
`--blob-opacity` makes the page more atmospheric and less readable; the
shipped values keep every row above 4.5:1 in both themes.

### Why the rows look like glass

A pane only reads as glass when something uneven shows through it, and the
link rows sit on the **card**, not on the page — so the page's own texture
never reaches them. `--pane` occludes it on purpose, and a `backdrop-filter`
on a row is a no-op, because an ancestor that already has one is a *backdrop
root*: the row would be blurring the card's flat fill. Measured, it changed 0
of 378,000 pixels.

So the structure lives inside the card instead, as `.card__field`: two slow
accent washes that give the interior a luminance gradient, plus mid-frequency
noise at ~70px — the scale that survives being seen through a translucent
fill, where film grain just averages to a flat tone. `--field-opacity` sets
how strong it is and `--field-noise` the mottle within it. The rows are then
thin enough (`--surface-2`) to let it through, which is what makes them read
as frosted panes rather than white paint.

Both tokens trade directly against legibility, and not evenly across the
card: a wash peaking under the last row costs that row far more than the
others. `scripts/checks.js` measures the colour each piece of muted text
actually sits on — it hides the ink and samples the pixel underneath — in
both themes, so raising either value will tell you when you've gone too far.

A few accent combinations that work well:

| Look | `accentFrom` → `accentTo` |
| --- | --- |
| Violet → cyan (default) | `#7c5cff` → `#22d3ee` |
| Sunset | `#f97316` → `#ec4899` |
| Mint | `#22c55e` → `#06b6d4` |
| Royal | `#6366f1` → `#a855f7` |

### Search engines

The `seo` block feeds a JSON-LD `Person` record, built from config at render
time so it can't drift from what the page actually links to:

```js
seo: {
  url: "https://links.kiarashs.ir/",
  jobTitle: "Researcher, Senior Software Engineer",
  sameAs: ["https://github.com/…", "https://scholar.google.com/…"],
}
```

Give `sameAs` the **canonical destinations**, not shortlinks that redirect —
a redirector is a weaker signal for tying your profiles together.

The social card is `og.jpg` at 1200×630 with `twitter:card:
summary_large_image`, so shared links render as a full-width preview rather
than a thumbnail. Regenerate it however you like; only the dimensions and the
filename matter.

## Checks

`scripts/checks.js` guards the things that are easy to break by editing
`config.js` and hard to spot by eye: text contrast in both themes, overflow at
four widths, placeholder URLs left behind, plain email addresses leaking into
the source, the popup opening, the vCard matching the page link-for-link and
address-for-address, the no-JS fallback still reaching a link, feed ordering,
and the JSON-LD parsing.

The contrast check measures **rendered pixels**, not computed CSS: the rows
are translucent over a wash, so the number that matters is the colour painted
behind the glyphs. It hides the ink, screenshots, and samples where the text
was — decorative glyphs (`aria-hidden`) are left out, since a contrast floor
is about text people have to read.

```bash
npm i -D playwright pngjs && npx playwright install chromium
node scripts/checks.js
```

Set `CHROMIUM_PATH` to use a browser you already have instead of Playwright's
own download.

The feed test runs against a **stub**, so the suite passes offline and a feed
outage can't turn CI red — console errors coming from the feed host are
ignored for the same reason. It exits non-zero on failure, so CI can use it
unchanged. The site itself stays dependency-free; nothing here ships to
visitors.

## Deploying to GitHub Pages

1. Push to the `main` branch of this repository.
2. **Settings → Pages → Source: Deploy from a branch**, pick `main` and `/ (root)`.
3. Your page goes live at `https://<username>.github.io/LinkTree/`.

It's plain static HTML, so Netlify, Vercel, Cloudflare Pages or any web host
works exactly the same way — no build command, publish the repository root.

## Notes

- The social preview image and `<title>` live in the `<head>` of `index.html`;
  update them when you change your name or avatar.
- Your email address is public on the page by design. If you'd rather not
  publish it, remove the email entry from `links` and `socials` in `config.js`
  and point people at a contact form instead.

## License

MIT — do whatever you like with it.
