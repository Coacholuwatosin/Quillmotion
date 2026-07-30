# Quillmotion: AI Video Portfolio Site

Single-page portfolio for an AI video creation service (brands, products, individuals).
Plain HTML/CSS/JS frontend with AOS scroll animations, backed by a small Python
(Flask) API deployed as Vercel serverless functions.

## Project structure

```
index.html          Single page, all sections
css/                 variables, base, components, sections, animations
js/
  main.js            AOS init, navbar, mobile menu, accordion, portfolio video playback
  api.js             fetches /api/stats and /api/reviews, renders them into the DOM
  contact.js         builds mailto:/WhatsApp links from the contact form
assets/
  videos/            real sample clips (hero loop + portfolio grid)
  images/            logo/images if you add any
api/
  _data.py           EDIT THIS to update stats, reviews, ratings, results, portfolio
  index.py           Flask app serving the JSON API, plus local static-file preview
requirements.txt      Python deps (Flask)
vercel.json            Vercel routing config
robots.txt             crawler rules (points at sitemap.xml)
sitemap.xml            single-page sitemap for search engines
```

## Why there's a backend at all

Reviews, ratings, and stats are fetched from `/api/stats` and `/api/reviews`
at runtime instead of being written directly into `index.html`/`js/*.js`.
That way, opening dev tools and looking at page source or the Sources tab
won't show the raw data or how it's put together, only the rendered result
and a `fetch()` call. The JSON response itself is still visible in the
Network tab (unavoidable for anything actually shown on the page), and
video files can still be downloaded or screen recorded. This setup isn't meant
to defeat a determined visitor, just to keep casual snooping from finding the
underlying data or content.

## Updating content

- **Stats / reviews / ratings / results / portfolio videos**: edit
  `api/_data.py` (`STATS`, `REVIEWS`, `PORTFOLIO`), then commit and push.
  Vercel redeploys automatically. No database, no admin login. Portfolio
  order is reshuffled by the backend on every page load, so the "first 6"
  shown isn't always the same clips.
- **Pricing / FAQ / services / leadership copy**: edit directly in
  `index.html` (all copy is easy to find and swap).
- **Video samples**: live in `assets/videos/`. `hero-loop.mp4` plays in the
  hero section. To add a new portfolio clip, drop the file into that folder
  and add a matching entry to the `PORTFOLIO` list in `api/_data.py`, no HTML
  edit needed.
- **Contact routing**: open `js/contact.js` and confirm `OWNER_EMAIL` and
  `OWNER_WHATSAPP` (country code + number, digits only) match your real
  contact details. `OWNER_EMAIL` is currently set to a Gmail address as a
  stand-in until a custom domain email is ready.

## Running locally

**Important**: don't just double-click `index.html` to preview it. Opening it
directly in the browser (a `file://` address) means there's no backend to
answer `/api/stats`, `/api/reviews`, or `/api/portfolio`, so those sections
will stay empty. Use one of the two options below instead.

### Option 1: plain Python (easiest, no Node required)

```
python3 -m pip install -r requirements.txt
python3 api/index.py
```

(`python3 -m pip` instead of bare `pip` avoids installing into the wrong
Python if your machine has more than one.)

Then open `http://localhost:8000` (not port 5000: on a Mac, System Settings
> General > AirDrop & Handoff > AirPlay Receiver often already occupies
port 5000, which silently breaks this exact kind of local server). This
single command serves the whole site (HTML/CSS/JS/videos) *and* the API
together, so everything works exactly like it will on Vercel.

If the terminal shows an error instead of `Running on http://127.0.0.1:8000`,
that error is the real problem, read it before assuming the site is broken.

### Option 2: Vercel CLI (closest match to production)

```
npm i -g vercel
vercel dev
```

Then open the local URL it prints (typically `http://localhost:3000`).

## Before you go live (SEO checklist)

The `<head>` in `index.html` already has title, meta description, Open
Graph/Twitter tags, a JSON-LD business schema, a favicon, `robots.txt`, and
`sitemap.xml`. Three things use a placeholder domain (`quillmotion.com`)
and need updating once you have a real domain:

1. Replace `https://quillmotion.com/` in `index.html` (`canonical`, `og:url`,
   `twitter` tags, and the JSON-LD `url`) and in `robots.txt`/`sitemap.xml`
   with your real domain.
2. Add a real `assets/images/og-preview.jpg` (1200x630px) so links shared on
   social media and messaging apps show a preview image instead of nothing.
3. Double check the JSON-LD email in `index.html` matches whatever's current
   in `js/contact.js`.

## Deploying

1. Push this project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com), import the repo, keep the default
   settings (no build command needed) and deploy.
3. Every future push to the main branch redeploys automatically, including
   whenever you edit `api/_data.py` with new reviews or stats.
