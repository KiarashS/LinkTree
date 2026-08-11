# 🌳 LinkTree

A modern, animated, single-page link-in-bio site. No build step, no
dependencies, no tracking — just three files you can drop on any static host.

![Static site](https://img.shields.io/badge/static-no%20build%20step-7c5cff)
![Dependencies](https://img.shields.io/badge/dependencies-0-22d3ee)

## What's in it

- **Animated backdrop** — drifting aurora blobs, a faint grid and film grain
- **Glassmorphism card** with a spinning gradient ring around your avatar
- **Staggered entrance** animation for every element
- **Cursor-following spotlight** and a sheen sweep on each link
- **Featured links** with an animated gradient border
- **Dark / light theme** — follows the system by default, toggle is remembered
- **Copy-to-clipboard** buttons (great for your email address) with a toast
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

Built-in icons: `github`, `linkedin`, `x`, `instagram`, `youtube`, `telegram`,
`medium`, `devto`, `dribbble`, `mastodon`, `mail`, `globe`, `blog`, `rss`,
`docs`, `resume`, `calendar`, `music`, `store`, `chat`, `star`, `link`.
Anything else falls back to a generic link icon.

### Changing the colours

Everything is driven by two accent colours in `config.js`:

```js
theme: {
  accentFrom: "#7c5cff",
  accentTo:   "#22d3ee",
  default:    "auto",   // or "dark" / "light" to force one
}
```

A few combinations that work well:

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
