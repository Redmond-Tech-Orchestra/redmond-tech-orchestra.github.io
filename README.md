# Redmond Tech Orchestra — Website

The official site for the Redmond Tech Orchestra, deployed to
[redmondtechorchestra.org](https://redmondtechorchestra.org) via GitHub Pages.

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
    Contact.tsx       # /contact (mailto-based form)
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

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the site and publishes it to GitHub Pages. The custom domain `redmondtechorchestra.org` is configured via [`public/CNAME`](public/CNAME).

In the repo settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

## Telling an AI to update the site

Because content and presentation are separated, you can give an AI assistant narrowly-scoped instructions:

- **Content edits** ("add a new concert", "fix a typo on the about page", "update the next concert's date") → restrict the AI to `src/content/*.json`.
- **Styling / layout edits** ("make the hero darker", "stack the concert cards differently on mobile") → restrict the AI to `src/styles.css` and `src/components/`.

Each side has a clear contract via [`src/content/types.ts`](src/content/types.ts), so changes to one don't accidentally break the other.
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
