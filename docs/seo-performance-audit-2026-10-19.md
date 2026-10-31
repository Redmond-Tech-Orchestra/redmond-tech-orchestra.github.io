# Website SEO, Lighthouse, and image-tooling audit

Audited **2026-10-19 UTC** (October 18 Pacific), against the live production site.

Related work:
[audit #114](https://github.com/Redmond-Tech-Orchestra/redmond-tech-orchestra.github.io/issues/114),
[Astro migration #125](https://github.com/Redmond-Tech-Orchestra/redmond-tech-orchestra.github.io/issues/125),
and [image optimization #76](https://github.com/Redmond-Tech-Orchestra/redmond-tech-orchestra.github.io/issues/76).

## Decision

**Proceed with Astro static output for #125, and explicitly include a build-time
image pipeline in that migration to support #76.** Astro addresses the observed
HTTP routing and initial-HTML problems while providing image resizing, modern
formats, responsive sources, and image dimensions without a runtime server.
Keep GitHub Pages and hydrate React only for interactions.

This is not a recommendation to migrate just to compress images. A Sharp-based
build step could address #76 in the current Vite site. Astro is preferable here
because static page generation is independently justified by #125, and using
its existing image tools avoids maintaining a parallel custom pipeline.

**Installing Astro alone will not fix the images.** The current images are
public URL strings consumed by React `<img>` tags and CSS backgrounds. Those
paths must be deliberately connected to Astro's asset processing. Image work
should not wait for the full migration if its delivery slips.

No application code, dependencies, hosting configuration, or GitHub issues were
changed by this audit. These are findings and an implementation recommendation,
not a completed migration or completed image optimization.

## Scope and method

- Live HTTP checks for all eight public routes, an intentionally missing URL,
  robots.txt, sitemap.xml, canonical-domain redirects, and preview exclusions.
- Lighthouse **13.5.0**, headless Chrome **155**, Node **24.19.0** on Windows.
  Mobile runs used Lighthouse's simulated mobile defaults: 412 x 823 viewport,
  4x CPU slowdown, 150 ms network RTT, and 1,638.4 Kbps throughput.
  Desktop used `--preset=desktop`.
- One run per URL/profile, not a median or a longitudinal field measurement.
  Scores and timings fluctuate; payload sizes and HTTP failures are stronger
  evidence than small score differences.
- Production `main` was `2cc572a909b2b942c53ed36d12b713a25d587bb7`.
  Local HEAD was `f10d95b6e5ca727b122c2b818837e4cf3835294c`; its Git tree
  exactly matched `origin/main` at audit time. Live HTML referenced
  `index-BK1zR4o_.js` and `index-Haj5Igma.css`.
- Source review covered routing, metadata, structured data, image consumers,
  content JSON, date-dependent recognition, and build/deployment workflows.
  A local check found no missing literal image/PDF/font paths referenced by
  source. This was not a full external-link crawl, form submission test, manual
  accessibility certification, or security review.
- Google Search Console, analytics, and CrUX field data were not available.
  Actual indexing coverage, search positions, backlinks, field Core Web Vitals,
  and ranking changes are **not established** by this audit. There is no public
  Google PageRank score to report; Lighthouse SEO is not search rank.

## Measured Lighthouse results

### Normal public entry URLs

Transfer sizes are decimal MB and include resources requested during the run,
not the entire image library or every image loaded after scrolling.

| Page / profile | Performance | Accessibility | Best practices | SEO | LCP | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `/`, mobile | 80 | 98 | 100 | 100 | 5.0 s | 5.84 MB |
| `/`, desktop | 97 | 98 | 100 | 100 | 1.2 s | 5.86 MB |
| `/concerts`, mobile | 64 | 100 | 96 | 100 | 6.5 s | 6.47 MB |
| `/community`, mobile | 63 | 98 | 96 | 100 | 43.8 s | 17.48 MB |
| `/sponsors`, mobile | 67 | 98 | 96 | 100 | 6.2 s | 1.25 MB |

**Important measurement caveat:** the three non-home direct runs triggered
Lighthouse warnings about the custom 404 redirect to `/?/route`. Lighthouse
also logged trace-engine `LanternError` messages, and their LCP insight audits
reported `no navigation metrics`. Their headline metrics were populated, but
these redirect-affected results are directional, not clean baselines.
The console error audit recorded the initial network 404; it does not establish
a separate application exception.

### Content-only mobile runs, bypassing the initial 404

To separate content problems from that measurement artifact, each non-home
page was also tested at `https://redmondtechorchestra.org/?/route`. The existing
decoder restores `/route` in the browser. These runs had no Lighthouse
`runWarnings` or runtime errors, but **do not test successful HTTP delivery of
the normal public URL**.

| Restored route | Performance | Accessibility | Best practices | SEO | LCP | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `/about` | 64 | 98 | 100 | 100 | 7.0 s | 1.53 MB |
| `/concerts` | 75 | 100 | 100 | 100 | 6.5 s | 6.47 MB |
| `/community` | 73 | 98 | 100 | 100 | 43.0 s | 17.48 MB |
| `/contact` | 97 | 98 | 100 | 100 | 2.3 s | 0.25 MB |
| `/donate` | 89 | 98 | 100 | 100 | 2.1 s | 0.25 MB |
| `/sponsor` | 98 | 98 | 100 | 100 | 2.0 s | 1.37 MB |
| `/sponsors` | 76 | 98 | 100 | 100 | 6.1 s | 1.25 MB |

The homepage mobile run had FCP 2.0 s, TBT 40 ms, and CLS 0. The clean
community run had FCP 2.0 s, TBT 40 ms, and CLS 0: image delivery, not heavy
main-thread blocking, is the dominant observed problem there. Donate recorded
CLS **0.186**, with the footer identified as the shifted element. The cause
needs further tracing; the shifted element alone does not prove the cause.

## Findings and priority

### P1: Direct public routes return 404

`/` returned 200. All seven non-home public routes returned **404**:
`/about`, `/concerts`, `/community`, `/contact`, `/donate`, `/sponsor`, and
`/sponsors`. The deliberately missing `/audit-missing-20261019` also returned
404, as it should.

[public/404.html](../public/404.html) performs a JavaScript `location.replace`
through the homepage, and [index.html](../index.html) decodes that URL for
[BrowserRouter](../src/main.tsx). Browser recovery is not an HTTP 200 response
for the original page. It adds navigation overhead and is unreliable for
non-JavaScript crawlers and preview fetchers.

Generate HTML for every intended route. Preserve existing URLs, allowing
normal trailing-slash redirects, and retain a genuine missing-page 404.
Do not consolidate `/sponsor` and `/sponsors` without a team decision: they
currently serve solicitation and recognition respectively.

### P1: Initial HTML lacks page content and route-specific metadata

The live homepage's body contains an empty `<div id="root"></div>`.
The default head contains homepage metadata; page-specific titles,
descriptions, canonical URLs, OG/Twitter metadata, and much of the structured
data are supplied by React and
[usePageMeta](../src/hooks/usePageTitle.ts) after JavaScript executes.

Google can render JavaScript, so this is **not proof of failed indexing**.
It is nevertheless a material crawl/render dependency and a poor basis for
social previews. A Lighthouse SEO score of 100 on the rendered page does not
validate initial HTML, all route statuses, social previews, or index coverage.

Render meaningful content and unique metadata in initial HTML through a shared
Astro layout. Emit organization and event structured data during the build too.

### P1: Oversized images dominate network cost

The local public library contains **55 image files totaling 62,870,481 bytes
(62.87 MB)**, including program images and icons. **13 images exceed 1 MB** and
account for 50.51 MB. This inventory is not a claim that each page downloads
62.87 MB.

| Image / role | Source bytes | Evidence / action |
| --- | ---: | --- |
| `community/community_outreach_2.png`, community hero | 7,968,032 | Actual LCP element; resize and encode first |
| `concerts/origins-of-modern-music.png`, next-concert poster | 4,798,096 | Loaded on home and concerts; 4636 x 6000 source, approximately 373 x 484 CSS pixels in the inspected desktop browser |
| `community/Korean_National_Day.png`, carousel | 3,755,413 | Loaded during community audit; generate display-sized variants |
| `community/LWHS_Prep_Orchestra_Camp_2026.png`, carousel | 2,279,195 | Loaded during community audit |
| `community/20260905_RedmondArtsInThePark_carousel.webp`, carousel | 1,478,240 | Already WebP; format conversion alone is insufficient |
| `concerts/MOOSE-Aug-2026-V3.png`, library asset | 11,291,259 | Largest source image; review archived/display use, not an observed homepage transfer |

Image consumers include [ConcertCard](../src/components/ConcertCard.tsx),
[Community](../src/pages/Community.tsx), [About](../src/pages/About.tsx),
[Sponsors](../src/pages/Sponsors.tsx), and
[Sponsorship](../src/pages/Sponsorship.tsx).
Their plain image elements do not provide responsive `srcset`/`sizes`;
many also omit intrinsic dimensions.

Lighthouse estimates **4,652 KiB** of homepage mobile image-delivery savings
and **15,182 KiB** on the clean community run. These are diagnostic estimates,
not achieved savings or promises. Most homepage savings come from right-sizing
the poster, not just changing PNG to WebP.

Keep a larger image available on lightbox open, but do not preload the print
master as the card thumbnail. Preserve linked originals where needed.

### P2: Critical hero images are discovered late

The homepage hero is a CSS background in [styles.css](../src/styles.css);
other hero backgrounds are assigned by [PageHero](../src/components/PageHero.tsx).
Lighthouse identifies the home and community heroes as LCP elements, not the
homepage poster. Their requests are not discoverable in initial HTML and lack
a high-priority hint.

Use a build-optimized, eagerly loaded hero image/picture with appropriate
priority, retaining the current crop and overlays. If backgrounds remain, use
processed URLs and a matching preload; avoid fetching duplicate variants.
Lazy-load below-fold images, not the actual LCP hero.

### P2: Accessibility and layout stability follow-ups

The recurring heading-order failure points to the first `<h4>` in
[Footer](../src/components/Footer.tsx). Give footer section headings a sensible
hierarchy independent of the preceding page's last heading. Do not change
content heading levels just to satisfy one rendered sequence.

Add intrinsic image dimensions or reserved aspect ratios throughout the image
pass. Although most measured CLS values were low, missing dimensions were
flagged and Donate's CLS 0.186 needs targeted reproduction and diagnosis.
An automated accessibility score of 98 or 100 does not replace keyboard,
screen-reader, contrast, or reduced-motion testing.

### P2: Sitemap and structured-data consistency

- [sitemap.xml](../public/sitemap.xml) is hand-maintained, omits `/sponsor`,
  and contains fixed `lastmod` dates. Generate entries from public static routes;
  supply truthful modification dates or omit them, rather than stamping every
  page with each build date.
- [Concerts](../src/pages/Concerts.tsx) hardcodes the old GitHub-hosted origin
  for event images and organizer URLs. The old root currently redirects 301 to
  the custom domain, so this is an avoidable consistency/redirect issue rather
  than a demonstrated broken image. Standardize on the production origin.
- Initial HTML contains a `PerformingGroup` with empty `sameAs`, while the
  rendered homepage adds a richer `MusicGroup`. Consolidate authoritative
  organization data and use a stable identity.
- Event JSON-LD currently assumes a two-hour duration and supplies only limited
  offer fields. Verify factual event times, status, image URLs, venue addresses,
  and applicable price/currency data against content, then validate with
  Google's Rich Results Test. Rich-result eligibility was not tested here.

### P3: Font, JavaScript, and cache costs

The homepage transferred approximately 336 KB for BravuraText, 134 KB across
two Inter font requests, and 128 KB for the compressed application script.
Lighthouse estimated 53 KiB of unused homepage JavaScript. Investigate font
subsetting within license terms, needed subsets/weights, and font-loading
behavior after the image and routing work. React islands should reduce page
JavaScript, but retaining the whole SPA as one island would defeat much of
that benefit.

The tested poster and HTML responses used GitHub Pages
`Cache-Control: max-age=600`. Astro's hashed asset names help version assets but
do not change the host's cache headers. Do not promise to resolve the
cache-lifetime warning through a framework switch alone.

## Existing positives

- HTTPS works; HTTP, `www`, and the old GitHub root redirect 301 to the
  preferred HTTPS apex domain.
- Production robots.txt permits crawling and points to a reachable sitemap.
  The homepage response did not contain an `X-Robots-Tag: noindex`.
- Preview returned `X-Robots-Tag: noindex, nofollow` and robots.txt
  `Disallow: /`; preserve both safeguards.
- Page-specific metadata, social tags, semantic headings, image alt text,
  event markup, and lazy loading already exist in the rendered application.
  The migration should preserve and move these capabilities, not discard them.
- Low measured TBT and mostly low CLS support a static-content/islands approach.

## How Astro should address #76

Use Astro's built-in `astro:assets` pipeline rather than adding a separate
image CDN or runtime image server:

1. Put display-image sources under `src/assets` and resolve the existing JSON
   image identifiers/paths to imported image metadata at build time. Preserve
   JSON-driven editing and fail the build on an unresolved asset. Keep only
   intentionally public/downloadable originals at their legacy URLs; do not
   duplicate the entire library unnecessarily.
2. Use `<Image />` for a single optimized format and `<Picture />` where multiple
   formats are useful. Generate WebP and, where measured worthwhile, AVIF with a
   fallback. Choose widths from actual layout slots and device pixel ratios;
   configure responsive layout or explicit widths and `sizes`.
3. Render static images in Astro wherever possible. Astro components cannot
   be imported directly into React components. For hydrated cards, carousels,
   or lightboxes, either pass static Astro image content through a supported
   slot/children boundary or use build-time `getImage()` results and pass
   ordinary serializable `src`, `srcSet`, `sizes`, `width`, and `height` props.
   A plain React `<img>` using the original string gets no automatic processing.
4. Explicitly convert CSS/inline background heroes to the processed pipeline.
   Keep readable poster text, uncropped recognition logos, transparent
   backgrounds where required, current mobile crops, and working lightboxes.
5. Generate derivatives during the static build. GitHub Pages can serve these
   files; no on-demand `/_image` endpoint or server adapter should be required.
   PDFs, external YouTube thumbnails, and assets intentionally left in `public`
   need separate handling. Astro does not optimize PDFs or arbitrary public
   assets merely by copying them.
6. Include the image pipeline in both production and preview builds, monitor
   build time/output size, and use a Node version supported by the chosen Astro
   release rather than assuming the current CI Node 20 setting remains valid.

Astro's sitemap integration also removes the manual route-list maintenance.
Set `site` to `https://redmondtechorchestra.org`, and update robots.txt if the
generated sitemap moves to `sitemap-index.xml`.

### Date-dependent behavior must be preserved

[Sponsors](../src/pages/Sponsors.tsx) currently evaluates start dates and
one-year expiration in the visitor's browser calendar day. Static output moves
that evaluation to build time. Choose and document the intended timezone
(recommendation: `America/Los_Angeles`, subject to team approval), test the
start/expiration and leap-year boundaries, and schedule daily production
rebuilds alongside content-triggered builds.

Daily builds give daily freshness, not an exact midnight guarantee: scheduled
Actions can be delayed and a failed build leaves the previous site live.
Monitor failures and define acceptable staleness. Review footer year rollover,
concert year grouping, and future upcoming/past automation as well; current
home selection uses the explicit content `status`, not automatic expiry.
Preserve contact query-prefill/submission, menu/carousel/lightbox keyboard
behavior, and reduced-motion preferences when choosing island boundaries.

## Delivery order and acceptance criteria

1. **Immediate #76 relief:** optimize the community hero and displayed
   next-concert poster first; use real responsive derivatives. This can be
   shipped on Vite if the migration will take longer.
2. **#125 foundation:** generate every public route and initial page metadata,
   preserve URLs/assets/interactions, add a real 404 page, update both deployment
   flows, and only then remove the SPA redirect workaround.
3. **Finish #76:** wire every image consumer, including backgrounds, archived
   concert posters, sponsor images, team/member photos, and lightbox sources.
   Review unused assets and downloadable originals separately.
4. **Follow-ups:** heading hierarchy, Donate CLS, sitemap/JSON-LD consistency,
   font/JS costs, and Search Console monitoring.

Proposed release gates, not measurements already achieved:

- Every existing public URL returns 200 after at most a normalized-URL
  permanent redirect, without JavaScript; unknown URLs return 404.
- Initial HTML contains page content, unique title/description, canonical and
  social metadata, and intended structured data. Preview remains non-indexable.
- Network checks at mobile and desktop sizes demonstrate selection of
  appropriately sized derivatives, no print-sized poster in listing cards,
  and full-size lightbox downloads only when opened.
- Starting image budgets: selected mobile hero at most **300 KB**, ordinary
  card/carousel image at most **200 KB**, and initial cold page transfer at most
  **1.5 MB**. Confirm poster text/logo fidelity visually; document justified
  exceptions. These are proposed budgets, not automatic Astro guarantees.
- Re-run the same public URLs after deployment, using three sequential cold
  runs and reporting the median. Aim for mobile Performance at least **90**,
  lab LCP at most **2.5 s**, CLS at most **0.1**, no known automated
  accessibility regressions, and no broken form/asset/keyboard interactions.
  Verify field CWV separately when data is available.
- Test sponsor date boundaries and scheduled-build freshness, production and
  preview deployment, mobile layout, and readable no-JavaScript page content.
- In Search Console, inspect representative routes, submit the generated
  sitemap, record indexed/excluded URLs, and compare impressions, clicks,
  queries, and average positions over subsequent weeks. Technical SEO
  improvements do not guarantee ranking gains.

## Reproducing the measurements

Run with Chrome installed. These examples use PowerShell; replace the output
path/profile as needed and run tests sequentially to avoid CPU contention.

```powershell
$env:CHROME_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
npx --yes lighthouse@13.5.0 https://redmondtechorchestra.org `
  --chrome-flags="--headless --disable-gpu" `
  --only-categories=performance,accessibility,best-practices,seo `
  --output=json --output=html --output-path=.\lighthouse-home-mobile

# Add --preset=desktop for the desktop profile.
# Test /community normally for entry behavior; /?/community isolates content.
curl.exe -s -o NUL -w "%{http_code} %{redirect_url}\n" `
  https://redmondtechorchestra.org/community
```

The session retains the full JSON and HTML reports for all **12 runs**:
`lighthouse-home-mobile`, `lighthouse-home-desktop`, the three direct
`lighthouse-{concerts,community,sponsors}-mobile` reports, and seven
`lighthouse-{route}-mobile-content` reports. Report files use `.report.json`
and `.report.html` suffixes. They are not added to the repository.

## Tooling references

Documentation checked during this audit:

- [Astro image guide](https://docs.astro.build/en/guides/images/):
  build-time transformation, public-file limitations, and React boundaries.
- [Astro asset API](https://docs.astro.build/en/reference/modules/astro-assets/):
  image dimensions, formats, quality, responsive widths, and `getImage()`.
- [Astro on GitHub Pages](https://docs.astro.build/en/guides/deploy/github/):
  static deployment and custom-domain configuration.
- [Astro sitemap integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/):
  generated route entries and sitemap index location.
