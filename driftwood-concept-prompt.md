# Build: Driftwood, a Nuit Works concept site (fresh repo)

You are building a brand-new concept website from scratch in this empty repo. It is a portfolio piece for Nuit Works (https://nuit.works), a web design studio. The business is fictional: Driftwood, a 12-room boutique guesthouse on Maafushi, Kaafu Atoll, Maldives.

Plan the whole build first (structure, components, data files, page list), then build it end to end, then test and optimise until every success criterion below is met. Do not stop at a skeleton.

---

## 1. The one rule above everything: conversion

This concept exists to prove that a Nuit Works site converts. If a visitor takes a long time to act, the site has failed. Every design decision must shorten the path from landing to booking.

Success criteria:
- From any page, a visitor can start a booking within 5 seconds of landing, with a booking action visible without scrolling on both mobile (375px) and desktop.
- A first-time visitor can complete the demo booking (dates to confirmation) in under 60 seconds.
- The booking flow has at most 4 steps before confirmation, and the experiences step is optional and skippable in one tap.
- No popups, no newsletter modals, no cookie walls, no autoplay sound, nothing that blocks the path to booking.

Conversion patterns to implement:
- Header with a persistent "Book now" button on every page.
- On mobile, a sticky bottom bar with the "from" price and a "Check availability" button. It hides while the user is inside the booking flow.
- A hero booking widget on the Home page (check-in, check-out, guests, "Check availability") that sends the user straight into the booking flow with those values already filled.
- Prices shown upfront everywhere ("from $180 / night"), never hidden behind a click.
- Every room card, room page and experience card has a direct action: "Book this room" (preselects the room) or "Add to my stay" (preselects the experience).
- A "Book direct" perk strip near the top of Home and Rooms: Breakfast included, Free cancellation up to 7 days before check-in, Best rate when you book here, Free late checkout when you book direct.
- Honest urgency only, tied to the seasonal calendar (for example "January fills up early. May is wide open."). No fake countdown timers or fake "3 people are viewing" messages.
- A WhatsApp quick-contact link for people who want to ask first, placed as a secondary action, never competing visually with the main booking button.
- Specific CTA wording. Never use "Learn more" or "Submit".

---

## 2. Tech stack

- Astro (latest stable), TypeScript, static output, ready to deploy on Vercel.
- Interactive parts as islands only (booking flow, seasonal calendar, room explorer, island map, mobile menu). Use Preact for islands to keep JS small. Hydrate with `client:visible` or `client:idle` unless the component is needed immediately.
- Styling: scoped Astro styles plus a small global stylesheet built on CSS custom properties (design tokens). No heavy CSS framework.
- Motion: CSS transitions plus IntersectionObserver, and Astro View Transitions for page changes. No GSAP or other large animation libraries.
- Images: `astro:assets` with AVIF and WebP output, responsive `srcset`, explicit width and height on every image.
- Fonts: self-hosted, subset to Latin, `font-display: swap`, preload only the fonts used above the fold. Maximum two families.
- All site data (rooms, experiences, prices, seasons, taxes, FAQ, reviews, contact details) lives in typed data files in `src/data/`, so it can be edited without touching components.
- No third-party scripts, trackers, chat widgets or embedded Google Maps.

---

## 3. Brand and visual direction

Keep the existing Driftwood feel and push it further: warm, natural, quiet and editorial, but more impressive. The site should get bigger imagery, more motion and more interaction, while still feeling calm.

Design tokens (refine as needed, keep the spirit):
- `--cream: #F5F1EA` (page background, also the meta theme colour)
- `--sand: #E9E1D3` (alternate section background)
- `--ink: #1F1B16` (main text)
- `--timber: #7A5A3C` (accents, small details)
- `--stone: #8C857B` (secondary text, borders)
- `--sea: #2F6F73` (used sparingly: map water, availability states, links on hover)
- `--cta`: a deep, warm colour with strong contrast on cream for all primary buttons (pick it and check WCAG AA contrast)

Typography:
- Headings: a soft editorial serif (for example Fraunces, variable, self-hosted), set large with generous line height.
- Body and UI: a clean, highly legible sans (for example Instrument Sans or Inter).

Imagery:
- Use free stock photos only (Unsplash or Pexels). Download them into the repo, optimise them, and never hotlink.
- Keep a single consistent warm, natural colour grade across all images.
- Subjects: timber guesthouse exteriors with palms, whitewashed rooms with linen, plaster walls and window niches, a coral reef from above and below, sandbanks, a wooden boat at sunset, a sandy local-island street, bicycles against palms, breakfast on a terrace, low sun on wet sand.
- Use full-bleed and large editorial crops. Make the hero a full-viewport image with the booking widget over it, and keep the text readable using a subtle gradient, not a heavy overlay.
- List every image with photographer and source in `src/data/credits.ts` and show them on a small `/credits` page linked from the footer.

Motion (subtle to medium, calm, never in the way of booking):
- Soft fade-and-rise reveals on scroll for headings, images and cards.
- Gentle parallax on 2 or 3 large images on Home only.
- Smooth page transitions with View Transitions, including a shared-element transition from room card image to room page hero.
- Hover states on cards: a slight image zoom and a lift.
- Animated price totals in the booking flow (number tween, short).
- Respect `prefers-reduced-motion` everywhere: all motion off, with content shown instantly.

Copy voice: calm, dry, warm, specific, a little understated humour. Keep it in the spirit of these lines from the current site:
- "Twelve rooms, one reef, and nowhere you need to be."
- "The front door opens onto a sandy street. The reef is at the end of it."
- "Coral starts where the sand runs out."
- "Before breakfast, or after. Nobody minds."
- "January fills up early. May is wide open."

Copy should be short, scannable and factual enough for AI search tools to quote.

---

## 4. Content (put all of this in `src/data/`)

Brand:
- Name: Driftwood
- Tagline: "Twelve rooms, one reef, and nowhere you need to be."
- Location: Maafushi, Kaafu Atoll, Maldives. A 2-minute walk to the house reef.
- Story: built slowly with reclaimed timber and stone from the atoll. Nothing imported to look expensive. Linen that gets softer every wash.
- Contact (placeholders): stay@driftwoodmaldives.com, WhatsApp +960 700 0000, Instagram link.
- Policies: breakfast included, free cancellation up to 7 days before check-in, check-in 2pm, check-out 12pm.

Rooms (12 rooms in total across 4 types):
| Type | Count | From / night | Bed | Sleeps | Highlight |
|---|---|---|---|---|---|
| Reef View Room | 4 | $180 | Queen | 2 | Small private balcony facing the reef |
| Garden Suite | 3 | $220 | King | 2 to 3 | Outdoor rain shower, its own courtyard |
| Beachfront Room | 3 | $240 | Queen | 2 to 3 | Veranda, sand under your feet at the step |
| Rooftop Suite | 2 | $260 | King | 2 | Private terrace with a daybed, best sunset on the property |

For each room, also add a size in square metres, a full amenities list, 4 to 6 photos and a short description in the brand voice.

Experiences (bookable add-ons, priced per person):
- Snorkeling at the House Reef: half day, small guided groups, gear included, $35
- Sandbank Picnic: full afternoon, boat to a nearby sandbank, set picnic lunch, $60
- Dolphin Sunset Cruise: early evening, back before dark, $45
- Local Island Walk: a guided hour through the village side with a stop at a tea shop, $20

Seasons (multipliers on the "from" price, editable in one config file):
- Peak: 20 December to 10 January, x1.35
- High: 11 January to 30 April, x1.2
- Shoulder: November and early December, x1.05
- Low: May to October, x1.0, with a "quiet season" label

Taxes and fees: show service charge, GST and Maldives Green Tax as separate line items in the quote. Keep all rates in one config file, labelled clearly as estimates for this concept.

Availability: generate deterministic fake availability from a seed, so the same dates always show the same result. Make some peak dates sold out for certain room types, so the calendar looks real.

Getting here (placeholders in config, labelled approximate): shared speedboat and private speedboat from Velana International Airport, with typical journey times and prices, plus the cheaper public ferry option. Driftwood can arrange the transfer, offered as an option inside the booking flow.

Guest reviews: 6 to 8 short sample reviews with first name, country and month. Mark them clearly as sample reviews for this concept with a small visible note. Do not add them to structured data.

FAQ: 8 to 10 real questions a guest would ask, such as transfers, bikini beach and local island rules, alcohol (not served on local islands, with nearby options), payment, cancellation, kids, best months to visit, what is included, Wi-Fi and power.

---

## 5. Pages

Every page has a unique title and meta description, a single H1, the header with "Book now", the mobile sticky bar (except inside booking) and the footer.

1. **Home** (`/`), in this order, kept tight:
   - Full-viewport hero image, H1, tagline and the booking widget (dates, guests, Check availability).
   - Book-direct perk strip.
   - Quick facts: 12 rooms, 4 room types, 2 minutes to the water, breakfast included.
   - Rooms preview: 4 cards with photo, price, key details and "Book this room".
   - The house reef: a large image story section with parallax.
   - Island map (interactive, see section 7).
   - Experiences: 4 cards with price and "Add to my stay".
   - Seasonal calendar teaser: "Find the cheaper weeks" with a compact preview linking to the full calendar.
   - Sample guest reviews.
   - Short "Getting here" summary linking to the full page.
   - 4 to 5 top FAQs linking to the full FAQ.
   - Final CTA section with honest seasonal urgency and a "Check availability" button.
2. **Rooms** (`/rooms`): the room explorer (see section 7), perk strip, sample reviews and the seasonal calendar.
3. **Room detail pages** (`/rooms/[slug]`), one per room type: a gallery, details, amenities, price by season, a "Book this room" sticky panel on desktop with a date picker, other rooms, and FAQs relevant to rooms.
4. **Experiences** (`/experiences`): a section per experience with time, duration, inclusions, price and "Add to my stay".
5. **About** (`/about`): the build story, materials, the island and the people (fictional), with a CTA at the end.
6. **Getting Here** (`/getting-here`): transfer options compared side by side, the island map, arrival tips and a CTA to book with a transfer.
7. **FAQ** (`/faq`): accordion, grouped by topic, with FAQPage structured data.
8. **Contact** (`/contact`): WhatsApp and email first, a short enquiry form (name, email, message, optional dates), and the map.
9. **Book** (`/book`): the full booking flow (see section 6).
10. **404**: on-brand, with a "Check availability" button and links to main pages.
11. **Credits** (`/credits`) and a short **Privacy** page (`/privacy`) stating that no data is stored or sent because this is a concept.

---

## 6. Booking flow (the core USP: book direct, fast)

Build this as one island on `/book`, with state kept in URL query params (so deep links from the hero widget, room pages and experience cards prefill it) and mirrored to sessionStorage so a refresh never loses progress.

Steps:
1. **Dates and guests**: a range calendar showing the nightly price on each day, coloured by season, with sold-out dates disabled. Guests stepper for adults and children. If prefilled, skip straight to step 2.
2. **Room**: show only rooms that fit the guest count and are available for the dates. Each option shows the total for the stay, not just the nightly price. One tap selects and moves on. If a room was preselected and is available, skip straight to step 3, with an easy way to change it.
3. **Add-ons (optional)**: experiences with person count and a preferred day, plus the airport transfer option. A clear "Skip" button. Items preselected via a link are already ticked.
4. **Your details**: first name, last name, email and WhatsApp number only, plus an optional arrival time and note. Inline validation, correct input types and autocomplete attributes, and a large "Confirm booking" button.
5. **Confirmation**: a booking reference, a full summary, an "Add to calendar" (.ics download) button, and a "Message us on WhatsApp" link with a prefilled message containing the reference.

Live quote:
- On desktop, a sticky summary panel on the right. On mobile, a collapsible summary bar at the bottom.
- Itemised: nights x rate by season, add-ons, transfer, service charge, GST, Green Tax and total. Totals tween when they change.

Speed showcase (this is the case study proof):
- Measure the time from the first interaction with the booking widget or flow to reaching confirmation.
- Show it on the confirmation screen in a small, calm line, for example "Dates to confirmed in 38 seconds."

Demo honesty:
- On step 4 and on the confirmation screen, show a small clear note: "This is a Nuit Works concept. No booking is made and no payment is taken."
- Nothing is sent anywhere.

Quality:
- Fully keyboard and screen-reader accessible (calendar grid with arrow-key navigation, ARIA live region for price updates, focus moved to each step's heading).
- Works with one thumb on a 375px screen.
- Back and forward browser buttons move between steps correctly.

---

## 7. Interactive pieces

**Island map** (Home, Getting Here, Contact):
- A lightweight hand-styled SVG illustration of Maafushi in the brand palette, not an embedded map.
- Hotspots: Driftwood, the house reef, the bikini beach, the ferry and speedboat jetty, the village, a few cafes, and the sandbank direction.
- Tapping or hovering a hotspot shows a small card with the name, a one-line description and the walking time from Driftwood.
- Include a subtle animated walking path from Driftwood to the reef ("2 minutes").
- Provide an accessible list version of the same places for screen readers and keyboard users.

**Room explorer** (Rooms page):
- All 4 rooms browsable with large photos and swipeable galleries.
- A "Compare" mode to view 2 or 3 rooms side by side: size, bed, sleeps, view, outdoor space, price from, standout features.
- Every room in the explorer and comparison has "Book this room".

**Seasonal price calendar** (Rooms, Home teaser, booking step 1):
- A 12-month view where each day shows its relative price as a colour scale (low to peak), with a legend.
- Toggle the room type to update prices.
- Selecting a date range opens the booking flow with those dates and the room prefilled.
- A plain-language summary above it: the cheapest months, the busiest weeks.

---

## 8. SEO and GEO

- Unique title (under 60 characters) and meta description (under 155 characters) per page, canonical URLs, Open Graph and Twitter tags.
- Generate a static OG image per page at build time in the brand style.
- Semantic HTML, one H1 per page, logical heading order, descriptive alt text, and descriptive internal link text.
- JSON-LD structured data:
  - `LodgingBusiness` on Home and About, with name, description, address on Maafushi, geo, priceRange, amenityFeature, check-in and check-out times, and a `disambiguatingDescription` stating it is a fictional concept by Nuit Works.
  - `HotelRoom` with `Offer` on each room page.
  - `FAQPage` on the FAQ page.
  - `TouristTrip` on the Experiences page.
  - `BreadcrumbList` on inner pages.
  - Never add `Review` or `AggregateRating` markup, because the reviews are samples.
- `sitemap.xml` (@astrojs/sitemap), `robots.txt` and an `llms.txt` at the root summarising the site, the pages and the key facts, and stating clearly that Driftwood is a fictional concept by Nuit Works.
- GEO: write key facts as clear, quotable sentences (location, distance to reef, room types and prices, what is included, how to get there, best months). Include a short "At a glance" facts block on Home and About.

---

## 9. Performance (PageSpeed is part of the pitch)

Targets, on mobile and desktop, for every page including `/book`:
- Lighthouse Performance 95 or higher (aim for 100), and Accessibility, Best Practices and SEO all at 100.
- LCP under 2.0s, CLS under 0.05, INP under 200ms.

How:
- Preload the hero image and use `fetchpriority="high"` on it. Lazy-load everything below the fold.
- Ship zero JS on static sections. Keep islands small and hydrate them late.
- Keep total JS on Home under about 50 KB gzipped. The booking page may use more but must stay lean.
- Self-hosted, subset fonts with only the needed weights.
- Reserve space for every image and island to avoid layout shift.
- Compress and right-size every stock photo.

---

## 10. Must-haves on every concept

- A favicon set: SVG favicon, `favicon.ico`, `apple-touch-icon` and `site.webmanifest`, using a simple Driftwood mark (a minimal piece of driftwood or a wave-worn plank in timber on cream).
- Navigation: desktop nav with active states, an accessible mobile menu (focus trap, Escape to close), and a skip-to-content link.
- Accessibility to WCAG 2.2 AA: contrast, visible focus states, labelled form fields, alt text and reduced motion.
- The meta theme colour set to `#F5F1EA`.
- A 404 page, a credits page and a privacy page.
- A footer on every page with page links, contact details, the cancellation note, copyright and this line, clearly visible and legible:

  **"A Nuit Works concept. Driftwood is a fictional business."**

  "Nuit Works" links to https://nuit.works. Do not make it tiny or low-contrast; it must be easy to read.

---

## 11. Case study file

Create `CASE-STUDY.md` in the repo root for use on the Nuit Works website. It should contain:
- The USP in one line: "Book direct, fast: dates to confirmed in under a minute, with a live quote and no third-party booking site."
- The problem it solves for a real guesthouse: losing 15 to 20 percent commission to booking platforms, and slow or confusing booking.
- The key features: booking flow, live quote, seasonal calendar, room explorer, island map and conversion patterns.
- The measured results: your timed test runs of the booking flow, and the final Lighthouse scores for Home, Rooms and Book on mobile and desktop.
- The tech stack, in a short list.

---

## 12. Testing before you finish

1. Run `astro check` and a production build with zero errors or warnings.
2. Serve the production build and run Lighthouse on mobile and desktop for Home, Rooms, a room page and Book. Fix anything below the targets and rerun until they pass.
3. Walk the booking flow end to end at 375px and at desktop width:
   - from the hero widget
   - from a room's "Book this room" button
   - from an experience's "Add to my stay" button
   - from the seasonal calendar

   Check that the prefill and step skipping work, that refresh keeps state, and that browser back and forward work.
4. Do a keyboard-only pass through the nav, the booking flow, the calendar, the map and the explorer.
5. Check that the conversion criteria in section 1 are met on every page.
6. Validate the JSON-LD (no errors), and check that the sitemap, robots.txt, llms.txt, favicons and OG images are all present.
7. Check that the Nuit Works concept line is in the footer on every page.
8. Make sure the project is ready to deploy on Vercel as a static site.

Finish with a short report covering:
- the final Lighthouse scores
- the booking test times
- anything you could not complete and why
