# Driftwood: a Nuit Works concept

**Book direct, fast: dates to confirmed in under a minute, with a live quote and no third-party booking site.**

Driftwood is a fictional 12-room guesthouse on Maafushi, Kaafu Atoll, Maldives. Nuit Works built it to show what a small hotel site looks like when every decision shortens the path to booking.

## The problem

Small guesthouses lose 15 to 20 percent of every booking to commission on the big booking platforms. Their own sites rarely win those guests back, because booking direct is slow and confusing: prices hidden behind clicks, long forms, and a third-party booking engine that feels like a different company.

## What we built

- **A four-step booking flow**: dates, room, optional add-ons, details, then confirmation. Deep links from the hero form, room pages, experience cards and the seasonal calendar prefill it and skip any step that's already answered. Add-ons can be skipped in one tap, and the details step asks for four fields.
- **A live, itemised quote**: nights by season, add-ons, transfer, service charge, GST and Green Tax, with totals that tween as they change. It's a sticky panel on desktop and a collapsible bar on phones. Before a room is chosen, the bar already shows the cheapest real total for the chosen dates.
- **A seasonal price calendar**: twelve months coloured by relative price for each room type, with a plain-language summary ("cheapest May to October"). Picking a range opens booking with the dates and room filled in.
- **A room explorer**: swipeable galleries and a side-by-side compare mode, with "Book this room" in every view.
- **An illustrated island map**: hotspots with walking times from the front door, an animated path to the reef, and a text list of the same places.
- **Conversion patterns throughout**:
  - "Book now" in the header on every page
  - a sticky price bar on phones
  - a book-direct perk strip
  - prices shown upfront
  - honest seasonal urgency ("January fills up early. May is wide open.")
  - WhatsApp as a quiet secondary action
  - no popups, no cookie wall and no autoplay
- **Built for the details guests care about**: the booking survives refresh, back and forward buttons work as expected, it can be completed with one thumb or entirely by keyboard, and confirmation offers an .ics calendar file plus a WhatsApp message prefilled with the booking reference.

## Results

### Speed to book

Scripted runs of the real flow on the production build, at 375px and 1440px (same results at both). The time is the site's own "dates to confirmed" stopwatch, which starts on the first touch of a booking control.

| Entry point | Typical guest | Cautious first-time guest |
|---|---|---|
| Header "Book now" (all four steps) | 17 s | 37 s |
| Booking bar under the hero | 17 s | 36 s |
| Room page "Book" | 14 s | 30 s |
| Experience "Add to booking" | 17 s | 37 s |
| Seasonal calendar | 14 s | 29 s |

Typical runs pause 1 to 3 seconds per decision and type about 12 characters a second; cautious runs double the pauses and type at about 5. Every run finished in under a minute.

### Lighthouse

Lighthouse 13 on the production build, served with compression:

| | Performance | Accessibility | Best Practices | SEO | LCP |
|---|---|---|---|---|---|
| Home, mobile | 99–100 | 100 | 100 | 100 | 1.66–1.81 s |
| Rooms, mobile | 99–100 | 100 | 100 | 100 | 1.58–1.97 s |
| Room page, mobile | 99–100 | 100 | 100 | 100 | 1.65–1.81 s |
| Book, mobile | 100 | 100 | 100 | 100 | 1.06–1.51 s |
| Home, Rooms, Room page, Book, desktop | 100 | 100 | 100 | 100 | 0.41–0.49 s |

- **Every page:** 99–100 Performance on mobile, 100 on desktop, and 100 for Accessibility, Best Practices and SEO.
- **Layout shift (CLS):** 0.003 or lower.
- **Interaction latency:** slowest interaction 96 ms at 4× CPU slowdown (INP target 200 ms).
- **JavaScript:** Home about 27 KB gzipped including the booking bar's calendar; Book about 30 KB.

### Accessibility

- **axe-core:** no WCAG 2.2 AA violations on any page or booking step, including validation errors and the open mobile menu.
- **Keyboard only:** the full booking flow works with the keyboard alone. The calendars use arrow keys, Home/End and Page Up/Page Down; focus moves to each step heading; and the mobile menu traps focus and closes with Escape.

## Stack

- Astro 7 (static output) with TypeScript
- Preact islands for the interactive parts only
- Scoped CSS on design tokens, no CSS framework
- astro:assets (AVIF and WebP) and Astro's Fonts API with self-hosted Latin subsets
- Astro view transitions and slow IntersectionObserver fades, with reduced motion respected
- Cormorant Garamond and Jost, self-hosted; square corners and hairlines throughout
- Build-time OG images, typed JSON-LD, sitemap, robots.txt and llms.txt
- Deployed as a static site on Vercel
