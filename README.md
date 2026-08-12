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
- **Dark / light theme** — follows the system by default, toggle is remembered
- **Email chooser popup** — one row opens a glass modal listing every address
  (personal, work, press…), each with copy and compose buttons
- **Copy-to-clipboard** buttons with a toast
- **Share button** using the Web Share API, falling back to copying the URL
- **Fully responsive**, keyboard accessible, and respects
  `prefers-reduced-motion` and print styles

## Files

| File | What it's for |
| --- | --- |
| `config.js` | **Edit this.** Your name, avatar, links and colours. |
| `index.html` | Layout, styles and rendering logic. Rarely needs touching. |
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
`academic`, `donate`, `coffee`, `mail`, `globe`, `blog`, `rss`, `docs`, `resume`,
`calendar`, `music`, `store`, `chat`, `star`, `link`.
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

Pacing lives in the `typing` block (all times in milliseconds):

| Option | Default | What it does |
| --- | --- | --- |
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

`primary: true` gives a row the gradient icon and an accent border. Each row
has a copy button (the label flips to "Copied") and a compose button that
opens the visitor's mail app. The popup closes on Esc, on a backdrop click,
or via the close button, and returns focus to whatever opened it. Add as many
or as few addresses as you like — a single one works fine.

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

A few accent combinations that work well:

| Look | `accentFrom` → `accentTo` |
| --- | --- |
| Violet → cyan (default) | `#7c5cff` → `#22d3ee` |
| Sunset | `#f97316` → `#ec4899` |
| Mint | `#22c55e` → `#06b6d4` |
| Royal | `#6366f1` → `#a855f7` |

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
