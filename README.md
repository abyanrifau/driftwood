# Driftwood

A concept site by [Nuit Works](https://nuit.works) for **Driftwood**, a fictional 12-room guesthouse on Maafushi, Kaafu Atoll, Maldives. It's built to show that a small hotel site can turn a visitor into a direct booking in under a minute.

Driftwood is not a real business. Nothing can be booked and nothing is sent anywhere.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run preview    # serve dist/
npm run check      # astro check (types and templates)
```

Requires Node 22.12 or newer. The asset scripts below use Node's built-in TypeScript support, so they need Node 22.18 or newer.

## Deploy

The site is fully static and ready for Vercel. Import the repo and Vercel detects Astro, runs `astro build` and serves `dist/`. `vercel.json` sets trailing slashes and caching headers.

Set `SITE_URL` to the production domain so canonical URLs, the sitemap and OG tags point at it (it defaults to `https://driftwood.nuit.works`).

## Edit the content

Everything a guesthouse would change lives in typed files in `src/data/`. Components don't need touching.

| File | What's in it |
|---|---|
| `site.ts` | Name, tagline, location, contact details, policies, navigation, book-direct perks |
| `rooms.ts` | The 4 room types: counts, prices, beds, sizes, amenities, photos |
| `experiences.ts` | Bookable add-ons, priced per person |
| `seasons.ts` | Season dates and price multipliers, seasonal urgency copy |
| `fees.ts` | Service charge, GST and Green Tax (estimates for this concept) |
| `transfers.ts` | Airport transfer options, approximate times and prices |
| `availability.ts` | Seed and occupancy settings for the fake, deterministic availability |
| `reviews.ts` | Sample reviews (labelled as samples, never in structured data) |
| `faq.ts` | Questions and answers, grouped by topic |
| `places.ts` | Island map hotspots and walking times |
| `credits.ts` | Every photo, with photographer and source |

## How it's built

- **Astro 7**, static output, TypeScript. Scoped component styles plus one token-based stylesheet (`src/styles/global.css`).
- **Preact islands** only where interaction is needed: booking bar, booking flow, seasonal calendar, room explorer, map hotspots and mobile menu. Everything else ships no JavaScript.
- **Booking flow** (`src/components/islands/booking/`) keeps its state in URL query params, mirrored to sessionStorage, so deep links prefill it and refresh, back and forward all work. Personal details live only in sessionStorage.
- **Shared logic** in `src/lib/`: dates, pricing and quotes, seeded availability, booking state ⇄ URL, image helpers and typed JSON-LD builders.
- **Images** go through `astro:assets` as AVIF and WebP srcsets. The masters in `src/assets/photos/` were downloaded from Unsplash and graded to one warm look.
- **Fonts** are self-hosted Latin subsets loaded through Astro's Fonts API: Cormorant Garamond 300/400 (+ 300 italic) for headings and Jost 300/400 for text and labels. Only the above-the-fold weights are preloaded.
- **Images** are cropped around a focal point per photo (`src/lib/focal-sharp.ts`); full-bleed images get separate phone crops. See `IMAGES.md` for every slot.
- **OG images** are generated at build time for every page (`src/pages/og/[slug].jpg.ts`, satori + sharp). The site also builds `sitemap-index.xml`, `robots.txt` and `llms.txt`.

## Asset scripts

These are already run, and their output is committed. Rerun one only if you change its inputs.

```bash
npm run photos        # download, grade and save the photos listed in src/data/credits.ts
npm run fonts         # subset the fonts (needs: pip install fonttools brotli)
npm run icons         # favicon.ico and PNG icons from public/favicon.svg
python scripts/generate-map.py   # redraw public/map/maafushi.svg
```

## Quality

See `CASE-STUDY.md` for Lighthouse scores and the booking flow timings. Checks run before handover:

- `astro check` and the production build with 0 errors and 0 warnings
- Lighthouse on Home, Rooms, a room page and Book, on mobile and desktop
- The booking flow end to end from the header Book now, the booking bar, a room's Book button, an experience and the seasonal calendar, at 375px and 1440px
- A computed-style audit of every element on every page and UI state: no rounded corners and no shadows (the map's location dots are the one deliberate circle)
- Keyboard-only use of the navigation, mobile menu, booking flow, calendars, map and room explorer
- axe-core (WCAG 2.2 AA plus best practice) on every page and on each booking step
- Structured data, meta tags, sitemap, robots, llms.txt, favicons and OG images
