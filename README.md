# QuillMotion: AI Video Portfolio Site

Single-page portfolio for an AI video creation service (brands, products, individuals).
Plain HTML/CSS/JS frontend with AOS scroll animations, backed by three tiny
JavaScript API endpoints deployed as Vercel serverless functions.

## Project structure

```
index.html          Single page, all sections
css/                 variables, base, components, sections, animations
js/
  main.js            AOS init, navbar, mobile menu, accordion, scroll progress
  api.js             fetches /api/stats, /api/reviews, /api/portfolio, renders them into the DOM
  contact.js         builds a mailto: link from the contact form
assets/
  videos/            real sample clips (hero loop + portfolio grid)
  images/            logo/images if you add any
api/
  _data.js           EDIT THIS to update stats, reviews, ratings, results, portfolio
  stats.js           serves /api/stats
  reviews.js         serves /api/reviews
  portfolio.js       serves /api/portfolio (server-shuffled order, no caching)
robots.txt            crawler rules (points at sitemap.xml)
sitemap.xml            single-page sitemap for search engines
```

No `vercel.json` needed: Vercel auto-detects any `.js` file under `api/` as
its own serverless function and maps it to the matching URL (`api/stats.js`
-> `/api/stats`), and serves everything else in the project root as static
files, automatically. `_data.js` is skipped because it starts with `_`.

## Why there's a backend at all

Reviews, ratings, stats, and portfolio videos are fetched from `/api/*` at
runtime instead of being written directly into `index.html`/`js/*.js`. That
way, opening dev tools and looking at page source or the Sources tab won't
show the raw data or how it's put together, only the rendered result and a
`fetch()` call. The JSON response itself is still visible in the Network tab
(unavoidable for anything actually shown on the page), and video files can
still be downloaded or screen recorded. This setup isn't meant to defeat a
determined visitor, just to keep casual snooping from finding the underlying
data or content.

## Updating content

- **Stats / reviews / ratings / results / portfolio videos**: edit
  `api/_data.js` (`STATS`, `REVIEWS`, `PORTFOLIO`), then commit and push.
  Vercel redeploys automatically. No database, no admin login. Portfolio
  order is reshuffled by the backend on every page load, so the "first 6"
  shown isn't always the same clips.
- **Pricing / FAQ / services / leadership copy**: edit directly in
  `index.html` (all copy is easy to find and swap).
- **Video samples**: live in `assets/videos/`. `hero-loop.mp4` plays in the
  hero section. To add a new portfolio clip: drop the file into that folder,
  add a matching entry to the `PORTFOLIO` array in `api/_data.js` (no HTML
  edit needed), and generate a matching poster image at
  `assets/images/poster-<same-filename-without-.mp4>.jpg`, e.g. for
  `my-clip.mp4` create `poster-my-clip.jpg`
  (`ffmpeg -ss 1 -i assets/videos/my-clip.mp4 -vframes 1 assets/images/poster-my-clip.jpg`).
  Without it, some mobile browsers (notably iOS Safari) show a blank frame
  until the video is actually played, since they won't render a frame from
  `preload="metadata"` alone.
- **Contact routing**: open `js/contact.js` and confirm `OWNER_EMAIL` matches
  your real address. It's currently set to a Gmail address as a stand-in
  until a custom domain email is ready. WhatsApp sending was removed until
  a real number is ready, see the comment at the top of `js/contact.js` for
  how to add it back.

## Running locally

**Important**: don't just double-click `index.html` to preview it. Opening it
directly in the browser (a `file://` address) means there's no backend to
answer `/api/stats`, `/api/reviews`, or `/api/portfolio`, so those sections
will stay empty. Use the Vercel CLI instead, it's what actually runs these
functions:

```
npm i -g vercel
vercel dev
```

Then open the local URL it prints (typically `http://localhost:3000`). This
serves the whole site *and* the three API functions together, exactly like
production.

If you don't have Node.js installed, get it from
[nodejs.org](https://nodejs.org) first (any current LTS version works).

## Before you go live (SEO checklist)

The `<head>` in `index.html` already has title, meta description, Open
Graph/Twitter tags, a JSON-LD business schema, a favicon, an `og-preview.jpg`
social share image, `robots.txt`, and `sitemap.xml`. One thing uses a
placeholder domain (`quillmotion.com`) and needs updating once you have a
real domain:

1. Replace `https://quillmotion.com/` in `index.html` (`canonical`, `og:url`,
   `twitter` tags, and the JSON-LD `url`) and in `robots.txt`/`sitemap.xml`
   with your real domain.
2. Double check the JSON-LD email in `index.html` matches whatever's current
   in `js/contact.js`.

## Deploying

1. Push this project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com), import the repo, keep the default
   settings (no build command, no framework preset needed) and deploy.
3. Every future push to the main branch redeploys automatically, including
   whenever you edit `api/_data.js` with new reviews or stats.
