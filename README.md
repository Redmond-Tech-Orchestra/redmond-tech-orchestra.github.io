# Redmond Tech Orchestra — Website

The official site for the Redmond Tech Orchestra, deployed to
[redmondtechorchestra.org](https://redmondtechorchestra.org) via GitHub Pages.

For how the website fits into the broader orchestra infrastructure (preview
environment, server, deploy flows, request diagrams), see the
[infra repo](https://github.com/Redmond-Tech-Orchestra/infra).

## Stack

- **Vite + React + TypeScript** — fast dev, simple build, no framework lock-in
- **React Router (HashRouter)** — multi-page routing that works on GitHub Pages without any server-side rewrites
- **Plain CSS** — single stylesheet at [src/styles.css](src/styles.css). No Tailwind, no CSS-in-JS, no preprocessor

## Two systems: content vs. presentation

The site is intentionally split so a non-developer (or an AI helper) can update either side without touching the other.

### 1. Content layer — [src/content/](src/content/)

All site copy and data lives in JSON files. Edit these to update the website without touching any React code:

| File | What it controls |
| --- | --- |
| [`site.json`](src/content/site.json) | Org name, tagline, nav links, donate URL, social links, footer copy |
| [`about.json`](src/content/about.json) | About page intro paragraphs and "highlights" cards |
| [`concerts.json`](src/content/concerts.json) | All concerts (upcoming + past) with date, venue, program, ticket/recording links |

The shape of each JSON file is described in [src/content/types.ts](src/content/types.ts).

To add a new concert, append an entry to `concerts.json`. To move a concert to the past, change its `status` from `"upcoming"` to `"past"`.

### 2. Presentation layer — [src/components/](src/components/) and [src/pages/](src/pages/)

React components that read from the content layer and render the site. Styling lives in a single global stylesheet, [src/styles.css](src/styles.css), using CSS custom properties for theming (see the `:root` block).

```
src/
  components/
    Header.tsx        # site nav
    Footer.tsx        # footer
    PageHero.tsx      # blue page-title banner
    ConcertCard.tsx   # one concert in the listing
  pages/
    Home.tsx          # /
    Concerts.tsx      # /concerts
    About.tsx         # /about
    Contact.tsx       # /contact (Formspree-powered form)
    Donate.tsx        # /donate
    NotFound.tsx
  App.tsx             # layout shell (header + outlet + footer)
  main.tsx            # router setup
  styles.css          # all styles
```

## Local development

Requires Node.js 20+.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # produces ./dist
npm run preview  # preview the production build locally
```

## Deployment

### Production

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the site and publishes it to GitHub Pages. The custom domain
`redmondtechorchestra.org` is configured via [`public/CNAME`](public/CNAME).

In the repo settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

### PR previews

Opening or updating a pull request triggers
[`.github/workflows/preview.yml`](.github/workflows/preview.yml). The workflow
builds the site and rsyncs it over SSH to `/var/www/preview/` on the orchestra
server, where nginx serves it at
[preview.redmondtechorchestra.org](https://preview.redmondtechorchestra.org).
A sticky comment is posted on the PR with the URL.

The preview environment is **shared** — the most recent PR push wins. The site
is served with `X-Robots-Tag: noindex` and a `Disallow: /` robots.txt so
search engines never index it. Server-side configuration (nginx vhost, TLS,
firewall) lives in the [infra repo](https://github.com/Redmond-Tech-Orchestra/infra).

Required GitHub Actions secrets for the preview workflow:

| Secret | Purpose |
| --- | --- |
| `SSH_HOST` | hostname of the preview server (currently `schemes.me`) |
| `SSH_USER` | SSH user (currently `peter`) |
| `SSH_PRIVATE_KEY` | private half of a deploy key whose public half lives in the server's `~/.ssh/authorized_keys` |

## Telling an AI to update the site

Because content and presentation are separated, you can give an AI assistant narrowly-scoped instructions:

- **Content edits** ("add a new concert", "fix a typo on the about page", "update the next concert's date") → restrict the AI to `src/content/*.json`.
- **Styling / layout edits** ("make the hero darker", "stack the concert cards differently on mobile") → restrict the AI to `src/styles.css` and `src/components/`.

Each side has a clear contract via [`src/content/types.ts`](src/content/types.ts), so changes to one don't accidentally break the other.
