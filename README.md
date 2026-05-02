# Fernando Kanashiro — Landing Page

Personal portfolio and landing page for [kanasha.com.br](https://kanasha.com.br), hosted on GitHub Pages.

## Stack

- Single-file HTML/CSS/JS (`index.html`) — no build step, no bundler
- All styles and scripts inline; Google Fonts loaded via `<link>`
- Served via GitHub Pages with custom domain (`CNAME: kanasha.com.br`)
- Nginx container available for local header testing

## Local Development

Open directly in a browser — no server required:

```bash
open index.html
```

Or run with Docker to test nginx headers and gzip:

```bash
docker compose up
# http://localhost:8080
```

## Tests

Playwright covers desktop, tablet (768px), and mobile (375px) viewports. Tests expect the dev server on port `8888` — run `npx serve . -p 8888` (or `npx serve .` and adjust `baseURL` in `playwright.config.ts`).

```bash
npm install
npx serve . -p 8888 &
npx playwright test
```

```bash
npm run test:report   # open HTML report
```

## Deployment

Push to `master` — GitHub Pages deploys automatically from the root of this branch.

Custom domain is set in **Settings → Pages → Custom domain** and enforced by the `CNAME` file at the repo root. The `.nojekyll` file disables Jekyll processing.

## SEO

- `sitemap.xml` — submitted to Google Search Console
- `robots.txt` — allows all crawlers, references the sitemap
- Structured data: `Person` and `LocalBusiness` schemas inline in `index.html`
- Open Graph and Twitter Card meta tags configured
