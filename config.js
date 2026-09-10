/* ------------------------------------------------------------------
 * config.js — this is the ONLY file you need to edit.
 *
 * Change your name, tagline, avatar and links below, then reload the
 * page. Everything else (layout, animation, theming) takes care of
 * itself.
 *
 * Available `icon` values:
 *   github, linkedin, x, facebook, instagram, youtube, telegram,
 *   whatsapp, medium, devto, dribbble, mastodon, scholar, academic,
 *   donate, coffee, arxiv, researchgate, mail, globe, blog, rss, docs,
 *   resume, calendar, music, store, chat, star, home, link
 * Anything unrecognised falls back to a generic link icon.
 * ------------------------------------------------------------------ */

window.LINKTREE_CONFIG = {
  /* ---------------------------------------------------------------- */
  profile: {
    name: "Kiarash Soleimanzadeh",
    // The part of your name that gets the animated gradient treatment.
    // Must appear in `name` above. Omit it and the first word is used;
    // set it to "" to render the whole name plain.
    nameHighlight: "Kiarash",
    handle: "@KiarashS",

    // A single string shows as static text. A LIST types itself out one
    // phrase at a time, holds, backspaces and moves to the next, forever.
    tagline: [
      "Researcher",
      "ML/AI Enthusiast",
      "Senior Software Engineer",
      "Blogger",
    ],
    // Any image URL. This one is pulled straight from your GitHub avatar.
    avatar: "avatar.jpg",
    // Shown while the avatar loads, or if it fails to load.
    initials: "K",
    // Small pill under your name. Set to "" to hide.
    status: "Available for interesting work",
    location: "",
  },

  /* Pacing for the typed tagline above. All times are milliseconds.
     `smartBackspace` keeps the shared opening of two consecutive phrases
     instead of deleting and retyping it. */
  typing: {
    // Static lead-in shown before the typed phrase, in a muted colour.
    // Set to "" for none. Only applies when `tagline` is a list.
    prefix: "I'm a ",
    typeSpeed: 90,
    backSpeed: 45,
    holdDelay: 1800,     // pause once a phrase is fully typed
    startDelay: 500,
    cursor: "|",
    smartBackspace: true,
    loop: true,
  },

  /* Accent colours for the glow, gradients and highlights.
     Try: ["#7c5cff", "#22d3ee"] violet→cyan  ·  ["#f97316", "#ec4899"] orange→pink
          ["#22c55e", "#06b6d4"] green→teal   ·  ["#6366f1", "#a855f7"] indigo→purple */
  theme: {
    accentFrom: "#7c5cff",
    accentTo: "#22d3ee",
    // Starting mode for a first-time visitor: "auto" follows their system
    // setting. The toggle cycles System -> Light -> Dark, and whatever they
    // pick is remembered — including "auto", so they can hand control back.
    default: "auto",
  },

  /* ---------------------------------------------------------------- */
  /* The main stack of buttons. Order here is the order on the page.   */
  /* `featured: true` gives a link the animated gradient border.       */
  /* `copy: "..."` adds a small copy-to-clipboard button on the right. */
  links: [
    {
      label: "Website",
      description: "Home base — about me, writing and projects",
      url: "https://kiarashs.ir/",
      // "home" matches the house your own site uses; "globe" is the alternative.
      icon: "home",
      featured: true,
    },
    {
      label: "Profile",
      description: "Research interests, education and publications",
      url: "https://profile.kiarashs.ir/",
      icon: "academic",
    },
    {
      label: "Blog",
      description: "Writing on ML/AI, engineering and ideas",
      url: "https://kiarashs.ir/blog",
      icon: "blog",
    },
    /*{
      label: "Google Scholar",
      description: "Papers, citations and co-authors",
      url: "https://go.kiarashs.ir/scholar",
      icon: "scholar",
    },*/
    {
      label: "GitHub",
      description: "Open-source work and side projects",
      url: "https://go.kiarashs.ir/github",
      icon: "github",
    },
    {
      label: "Directory",
      description: "An index of the sites and resources I maintain",
      url: "https://directory.kiarashs.ir/",
      icon: "docs",
    },
    {
      label: "Emails",
      description: "Four inboxes — pick whichever fits",
      // `action: "emails"` opens the email chooser below instead of
      // navigating anywhere. No `url` needed.
      action: "emails",
      icon: "mail",
    },
    /*{
      label: "Buy Me a Coffee",
      description: "Support my work if something here helped you",
      url: "https://go.kiarashs.ir/donate",
      // "coffee" is the cup; "donate" is a heart, if you'd rather have that.
      icon: "coffee",
    },*/
  ],

  /* ---------------------------------------------------------------- */
  /* The email chooser. Any link or social with `action: "emails"`      */
  /* opens this list in a popup. Add or remove rows freely — one        */
  /* address works just as well as five.                                */
  /*                                                                    */
  /*   primary: true  → highlighted row, shown with a gradient icon     */
  /*   note           → the small grey line under the address           */
  /*                                                                    */
  /* Addresses are split into `user` + `domain` and joined at render     */
  /* time, so no plain user@domain string sits in the source for a       */
  /* harvester to regex out. `address: "..."` still works if you would   */
  /* rather not bother.                                                  */
  emailer: {
    title: "Say hello",
    subtitle: "Tap an address to copy it, or open it in your mail app.",
    addresses: [
      {
        label: "Work",
        user: "kiarash.smz", domain: "gmail.com",
        note: "The one I read first",
        primary: false,
      },
      {
        label: "Work",
        user: "kiarash.s", domain: "hotmail.com",
        note: "Teams, Outlook and Microsoft services",
      },
      {
        label: "Personal",
        user: "kiarash.sz", domain: "icloud.com",
        note: "For Apple services",
      },
      {
        label: "Personal",
        user: "hello", domain: "kiarashs.ir",
        note: "Anything to do with kiarashs.ir",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Small round icon buttons under your name. Keep this list short.   */
  socials: [
    { label: "GitHub", url: "https://go.kiarashs.ir/github", icon: "github" },
    /*{ label: "LinkedIn", url: "https://go.kiarashs.ir/linkedin", icon: "linkedin" },
    { label: "X", url: "https://go.kiarashs.ir/twitter", icon: "x" },
    { label: "YouTube", url: "https://go.kiarashs.ir/youtube", icon: "youtube" },*/
    // TODO: go.kiarashs.ir/facebook currently redirects to facebook.com with
    // no profile path — point this at your real page, or delete the row.
    /*{ label: "Facebook", url: "https://go.kiarashs.ir/facebook", icon: "facebook" },*/
    // TODO: there is no go.kiarashs.ir/whatsapp shortlink yet. wa.me needs
    // your number in full international form, digits only, e.g. 447700900123.
    /*{ label: "WhatsApp", url: "https://wa.me/YOUR-NUMBER", icon: "whatsapp" },*/
    { label: "Email", action: "emails", icon: "mail" },
  ],

  /* ---------------------------------------------------------------- */
  /* Structured data, so search engines can tie your profiles together.  */
  /* `sameAs` wants canonical destinations, not redirectors — these are  */
  /* where the go.kiarashs.ir shortlinks actually land.                  */
  seo: {
    url: "https://links.kiarashs.ir/",
    jobTitle: "Researcher, Senior Software Engineer",
    sameAs: [
      "https://github.com/KiarashS",
      "https://scholar.google.com/citations?hl=en&user=PlzgVJMAAAAJ",
      "https://linkedin.com/in/thekiarash",
      "https://twitter.com/ItIsKiarash",
      "https://www.youtube.com/c/KiarashS",
      "https://kiarashs.ir/",
    ],
  },

  /* ---------------------------------------------------------------- */
  footer: {
    text: "Made with Love",
    // Shown next to the year. Set to "" to hide the link.
    linkLabel: "kiarashs.ir",
    linkUrl: "https://www.kiarashs.ir/",
  },
};
