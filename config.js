/* ------------------------------------------------------------------
 * config.js — this is the ONLY file you need to edit.
 *
 * Change your name, tagline, avatar and links below, then reload the
 * page. Everything else (layout, animation, theming) takes care of
 * itself.
 *
 * Available `icon` values:
 *   github, linkedin, x, instagram, youtube, telegram, medium, devto,
 *   dribbble, mastodon, mail, globe, blog, rss, docs, resume, calendar,
 *   music, store, chat, star, link
 * Anything unrecognised falls back to a generic link icon.
 * ------------------------------------------------------------------ */

window.LINKTREE_CONFIG = {
  /* ---------------------------------------------------------------- */
  profile: {
    name: "Kiarash",
    handle: "@KiarashS",
    tagline: "Software engineer · builder of things for the web.",
    // Any image URL. This one is pulled straight from your GitHub avatar.
    avatar: "https://avatars.githubusercontent.com/u/1054134?v=4",
    // Shown while the avatar loads, or if it fails to load.
    initials: "K",
    // Small pill under your name. Set to "" to hide.
    status: "Available for interesting work",
    location: "",
  },

  /* Accent colours for the glow, gradients and highlights.
     Try: ["#7c5cff", "#22d3ee"] violet→cyan  ·  ["#f97316", "#ec4899"] orange→pink
          ["#22c55e", "#06b6d4"] green→teal   ·  ["#6366f1", "#a855f7"] indigo→purple */
  theme: {
    accentFrom: "#7c5cff",
    accentTo: "#22d3ee",
    // "auto" follows the visitor's system setting. Or force "dark" / "light".
    default: "auto",
  },

  /* ---------------------------------------------------------------- */
  /* The main stack of buttons. Order here is the order on the page.   */
  /* `featured: true` gives a link the animated gradient border.       */
  /* `copy: "..."` adds a small copy-to-clipboard button on the right. */
  links: [
    {
      label: "My Website",
      description: "Portfolio, projects and everything else",
      url: "https://example.com",
      icon: "globe",
      featured: true,
    },
    {
      label: "Blog",
      description: "Writing about code, tools and ideas",
      url: "https://example.com/blog",
      icon: "blog",
    },
    {
      label: "GitHub",
      description: "Open source work and side projects",
      url: "https://github.com/KiarashS",
      icon: "github",
    },
    {
      label: "LinkedIn",
      description: "Experience and professional profile",
      url: "https://www.linkedin.com/in/your-handle",
      icon: "linkedin",
    },
    {
      label: "Email me",
      description: "Pick the right inbox — personal, work or press",
      // `action: "emails"` opens the email chooser below instead of
      // navigating anywhere. No `url` needed.
      action: "emails",
      icon: "mail",
    },
    {
      label: "Résumé",
      description: "The one-page version (PDF)",
      url: "https://example.com/resume.pdf",
      icon: "resume",
    },
  ],

  /* ---------------------------------------------------------------- */
  /* The email chooser. Any link or social with `action: "emails"`      */
  /* opens this list in a popup. Add or remove rows freely — one        */
  /* address works just as well as five.                                */
  /*                                                                    */
  /*   primary: true  → highlighted row, shown with a gradient icon     */
  /*   note           → the small grey line under the address           */
  emailer: {
    title: "Say hello",
    subtitle: "Tap an address to copy it, or open it in your mail app.",
    addresses: [
      {
        label: "Personal",
        address: "goudarzi.mit@gmail.com",
        note: "Anything and everything — I read all of it",
        primary: true,
      },
      {
        label: "Work",
        address: "you@yourcompany.com",
        note: "Consulting, contracts and collaborations",
      },
      {
        label: "Press",
        address: "press@example.com",
        note: "Talks, interviews and quotes",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Small round icon buttons under your name. Keep this list short.   */
  socials: [
    { label: "GitHub", url: "https://github.com/KiarashS", icon: "github" },
    { label: "X", url: "https://x.com/your-handle", icon: "x" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/your-handle", icon: "linkedin" },
    { label: "Telegram", url: "https://t.me/your-handle", icon: "telegram" },
    { label: "Email", action: "emails", icon: "mail" },
  ],

  /* ---------------------------------------------------------------- */
  footer: {
    text: "Made with care",
    // Shown next to the year. Set to "" to hide the link.
    linkLabel: "source on GitHub",
    linkUrl: "https://github.com/KiarashS/LinkTree",
  },
};
