# TAH Solutions

Static marketing site for TAH Solutions, an EMS clinical infrastructure
consulting practice. Built with [Astro](https://astro.build/) and deployed to
GitHub Pages at [tahsolutions.com](https://tahsolutions.com).

## Stack

- **Astro 6** (static output, no SSR, no framework integrations)
- **TypeScript** (strict mode)
- **Vanilla CSS** (design tokens + BEM-ish classes, no framework)
- **Vanilla JS** in `<script>` blocks (no client-side framework)
- **Google Forms** (contact / checklist / waitlist submissions, no backend)
- **Google Calendar** (appointment schedule, opens in new tab)
- **GitHub Pages** (hosting, custom domain `tahsolutions.com` and `www.tahsolutions.com`)

## Project Structure

```
src/
├── components/        Reusable .astro components
│                       (Hero, Footer, MiniNav, MenuOverlay, MenuTrigger,
│                        ContactForm, ChecklistForm, WaitlistForm, FloatingCTA,
│                        CalendarEmbed, FeaturesList, CTABlock, Button)
├── content/           Markdown content collections (legal/terms.md, privacy.md)
├── layouts/           BaseLayout.astro wraps every page
├── pages/             File-based routing (.astro pages)
│                       index, services, about, contact, checklist, waitlist, 404
│                       terms, privacy (use content collection)
├── scripts/           Shared TypeScript modules
│                       form-validation.ts (sanitize + validate + show errors)
├── styles/            CSS architecture
│   ├── global.css         Entry: @imports tokens, base, animations, components
│   ├── tokens.css         Design tokens (colors, type, spacing, motion, shadows)
│   ├── base.css           Reset + element defaults + .container + .reveal
│   ├── animations.css     Reveal, logoFloat, scrollBounce, pulse-heart, etc.
│   └── components/        7 module partials (all ≤ ~330 lines each)
│       ├── menu.css       Menu overlay + mini-nav + X animation
│       ├── hero.css       All hero variants (home/services/about/contact/...)
│       ├── buttons.css    Buttons + calendar-booking + floating CTA
│       ├── sections.css   Statement, values, services, stats, contact-grid, ...
│       ├── forms.css      Landing form, inputs, validation, spinner
│       ├── footer.css     Footer 4-tier hierarchy + grain texture
│       └── effects.css    Section watermarks, back-to-top, reveal-stagger, 404
├── consts.ts          Site config (SITE, NAV, SERVICES, STATS, GOOGLE_FORMS, CALENDAR)
└── env.d.ts           Astro type ambient declarations

public/                Static files copied to dist/ as-is
├── images/            Hero backgrounds (WebP) + logo (WebP) + texas.svg
├── CNAME              Custom domain file (tahsolutions.com)
├── .nojekyll          Disable Jekyll processing on GitHub Pages
├── favicon.ico
├── llms.txt           LLM discovery file
├── robots.txt
└── sitemap.xml        Generated at build time

.github/workflows/
└── deploy.yml         GitHub Actions: Node 22 → npm ci → npm run build → upload → deploy
```

## Commands

All commands are run from the project root. Requires **Node 22+** (Astro 6 requirement).

| Command              | Action                                                  |
|----------------------|---------------------------------------------------------|
| `npm install`        | Install dependencies                                    |
| `npm run dev`        | Start dev server at `http://localhost:4321`             |
| `npm run build`      | Build production site to `./dist`                       |
| `npm run preview`    | Preview the production build locally (serves `./dist`)  |
| `npm run check`      | TypeScript and Astro type checking (`astro check`)      |
| `npm run astro`      | Run Astro CLI commands (e.g., `astro add`, `astro info`)|

## Deployment

Pushes to `main` that touch `src/`, `public/`, `astro.config.mjs`, `package.json`,
`tsconfig.json`, or the workflow itself trigger the GitHub Actions deploy.
The build output (`./dist`) is uploaded as a Pages artifact and deployed to
GitHub Pages at `https://malinowski-consulting-llc.github.io/TAH-Solutions/`.

The custom domains `tahsolutions.com` and `www.tahsolutions.com` are served via the `public/CNAME` file.

**One-time GitHub + GoDaddy config required:**

1. **GitHub repo settings** → Pages → Source = "GitHub Actions"
2. **GitHub repo settings** → Pages → Custom domain = `tahsolutions.com`
3. **GitHub repo settings** → Pages → Enforce HTTPS = enabled
4. **GoDaddy DNS** → 4× A records pointing to GitHub Pages IPs:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
5. **Astro**: update `astro.config.mjs` to `site: 'https://tahsolutions.com'`
   and remove the `base: '/TAH-Solutions'` line once the apex domain is live.

## Forms

Three forms post to Google Forms via a hidden iframe target, so submissions land
in a Google Sheet without redirecting the user away from the site:

- **Contact form** (`/contact`), general inquiries with service of interest
- **Checklist form** (`/checklist`), gates the 20-question PDF download
- **Waitlist form** (`/waitlist`), course waitlist signup

All forms share `src/scripts/form-validation.ts` for client-side validation:
sanitize input (strip control chars, collapse whitespace, lowercase email), then
validate per-field rules (required, min/max length, pattern), then show inline
`aria-invalid` errors with a red `!` badge, summary banner, and a shake
animation. Submit button shows a spinner and disables during submission.

**Required Google Workspace config:**

- **DKIM** must be enabled for `tahsolutions.com` in Google Workspace Admin
  (Gmail → Authenticate email) before emails from auto-responders will pass
  DMARC alignment.
- Each form's `entry.XXXXXXX` field IDs are wired in `src/consts.ts` under
  `GOOGLE_FORMS` (one section per form).

## Design System

- **Colors**: gold secondary (#c9a84c / #d4ba6a / #a68b3c) on navy primary
  (#0f172a), with warm gray scale (#fafaf7 → #0f172a) for surfaces and text
- **Type**: Inter (sans, body) + Playfair Display (serif, headings + em)
- **Spacing**: 8-step scale from `--tah-spacing-xs` (4px) to
  `--tah-spacing-xxxl` (80px), plus a fluid `--tah-spacing-section` clamp
- **Motion**: `cubic-bezier(0.16, 1, 0.3, 1)` ease-out, all infinite
  animations disabled via `@media (prefers-reduced-motion: reduce)`
- **Effects**: grain texture (SVG `feTurbulence` at 4% opacity) on dark surfaces,
  shimmer sweep on `.btn--accent`, breathing logo glow, pulse-ring on floating CTA

All tokens live in `src/styles/tokens.css`. Component styles are split across
7 module files in `src/styles/components/`.

## Architecture Notes

- **Astro 6 + vanilla JS only**: no React, Vue, Svelte, or other framework
  integrations. Interactivity (menu, mini-nav scroll, reveal observer, stats
  count-up, form validation) lives in `<script>` blocks inside `BaseLayout.astro`
  and the form components.
- **Image format**: all hero images and the logo are WebP at quality 80
  (roughly a 95% size reduction from the PNG originals). The `texas.svg`
  icon stays as SVG.
- **Base path handling**: all internal links use the
  `${import.meta.env.BASE_URL}/path/` pattern so the same build works for both
  `tahsolutions.com` and the GitHub Pages project URL.
- **Accessibility**: skip-to-content link, focus-visible rings, `aria-invalid` on
  invalid form fields, `aria-hidden` on decorative elements, focus trap in
  menu overlay, `prefers-reduced-motion` respected throughout.
- **CSS organization**: 7 component partials, each under 350 lines, imported
  via `src/styles/components.css` so the cascade order is deterministic.
