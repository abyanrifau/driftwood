# Driftwood revision: luxury lookbook pass

This is a revision of the Driftwood concept site that is already built in this repo. Keep everything that works: the booking flow, live quote, seasonal calendar, room explorer, island map, SEO and GEO setup, performance work, the Nuit Works footer line and the case study file. Do not rebuild from scratch.

This pass changes how the site looks, reads and feels. Driftwood must now look and feel like a small luxury hotel, in a lookbook style, while still converting well.

Before you change anything:
1. Read through the current codebase.
2. Take screenshots of every page at 375px and 1440px, so you can compare before and after.

Then work through every section below. Finish with the checks in section 9.

---

## 1. Overall direction: luxury lookbook

The site currently feels like a friendly booking site. It needs to feel like the lookbook of a small, expensive guesthouse. The images should do most of the talking, with very little text and a lot of calm space.

Think of how small luxury hotels and design-led villas present themselves online:
- full-bleed photography
- thin serif headlines
- small tracked uppercase labels
- restrained colour
- sharp edges
- lots of space

Lookbook layout rules:
- Build the homepage as a sequence of image-led chapters, not a stack of card grids. Each chapter has a small numbered uppercase label (01 The house, 02 Rooms, 03 The reef, 04 Days out, 05 Getting here), a short headline and a few lines of text at most.
- Mix layouts from chapter to chapter:
  - full-bleed single images
  - asymmetric two-image spreads (one large, one smaller and offset)
  - a tall portrait image beside a short text column
  - occasional wide panoramic crops
- Add small uppercase captions under or beside images, for example "Rooftop Suite, terrace" or "House reef, 8am".
- Increase whitespace between chapters. Keep text columns narrow (about 34 to 40 characters per line for intro text, about 60 to 70 for body text).
- Room and experience listings should feel like lookbook spreads, not product cards:
  - a large image, then the name in the serif
  - one line of detail in small uppercase (for example QUEEN BED · SLEEPS 2 · REEF BALCONY)
  - the price in a thin line ("From $180 per night")
  - a square "Book" button or text link
  - no boxes, shadows or card backgrounds around them
- Room detail pages should open with a full-bleed image, then an editorial gallery of mixed sizes, then details. The sticky booking panel on desktop stays, restyled to match.
- Lean into the editorial structure of the original concept (the earlier version of this site): a long, calm scroll that alternates large images with short pieces of text.

---

## 2. Hero

- **Remove all calls to action from the hero:**
  - no booking widget
  - no "Check availability" button
  - no WhatsApp link
  - no "Free cancellation" line
- **What the hero is:**
  - a full-viewport image
  - a small uppercase location line (MAAFUSHI · KAAFU ATOLL · MALDIVES)
  - a short headline in the thin serif
  - optionally one short factual line beneath it
  - a minimal scroll indicator (a thin line or "Scroll" in small caps)
- **Header:** the header still shows "Book now" on every page. That is now the main booking entry point above the fold, and it keeps the 5-second rule from the original brief.
- **Booking bar:** move the booking widget (check-in, check-out, adults, children, Check availability) to a slim, full-width bar placed directly below the hero. It must sit flat on the page, with sharp corners and thin hairline borders, styled like the rest of the site. Use your own styled date fields, not the browser's default mm/dd/yyyy inputs.
- **Hero image:** must follow the image rules in section 5. No old buildings, shacks, corrugated roofs or anything worn. It should show a refined luxury guesthouse or villa setting, for example:
  - a whitewashed or limestone villa with timber details at golden hour
  - a terrace with a daybed looking over calm turquoise water
  - a calm beachfront with a beautifully made building
- **Art direction:** use separate crops for mobile (portrait, about 4:5) and desktop (landscape, about 16:9), with a `<picture>` element, so the hero looks composed on both.
- **Text contrast:** keep the hero text readable with a soft gradient at the bottom of the image only. Do not darken the whole photo.

---

## 3. Typography

The current heading font is too soft and rounded. Replace it with a thinner, more refined, luxurious serif.

- **Headings:** Cormorant Garamond, weights 300 and 400 only, with italic 300 used very sparingly for one or two accent words at most.
  - Use large sizes with slightly tight line height (about 1.05 to 1.15).
  - Do not use bold anywhere in headings.
- **Body and UI:** Jost, weights 300 and 400.
  - Body text at weight 300 or 400, depending on contrast (it must still pass WCAG AA).
- **Labels, eyebrows, captions, button text and nav:** Jost 400 in uppercase, with wide letter spacing (about 0.14em to 0.2em), at small sizes.
- **Loading:** self-host both fonts, subset to Latin, preload only the weights used above the fold, and use `font-display: swap`. Remove the old font files.
- **Wordmark:** set the "Driftwood" wordmark in the header in the new serif at weight 300. Keep or refine the logo mark so it is sharp and thin-lined, not rounded.

---

## 4. Shape: everything square and sharp

Remove every curved element from the site and replace it with square, sharp corners.

- Set `border-radius: 0` on everything:
  - buttons, inputs, selects and date fields
  - the booking bar and booking flow panels
  - calendar day cells and the seasonal calendar
  - room explorer and compare views
  - island map hotspot cards and the map frame
  - images and galleries, including gallery controls (for example the "5 / 5" counter and arrows, which are currently pill shaped)
  - modals, sheets and the mobile menu
  - the mobile sticky bar
  - tags and badges, tooltips, toasts and focus outlines
  - everything else
- Search the whole codebase for `border-radius`, `rounded`, `9999px`, `50%`, `pill` and similar, and remove them. Leave a circle only where the shape itself is the point, and look for one before deciding none exist (for example a map location dot).
- **Buttons:**
  - **Primary:** square, solid deep espresso (`#2B2420`) with cream text, uppercase tracked Jost, and generous horizontal padding. On hover, it inverts to an outline style.
  - **Secondary:** square, transparent, with a 1px ink border.
  - **Text links:** small uppercase with a thin underline that animates in on hover.
  - Remove the current rust-orange pill buttons entirely.
- No drop shadows. Use thin 1px hairline borders and spacing to separate things instead.
- Keep focus states clearly visible, but square.

---

## 5. Images: replace, curate and crop properly

Go through every image on the site. Open and look at each one yourself; do not judge by filename. Replace every image that does not fit a luxury small-hotel lookbook.

Reject any image showing:
- old, worn, weathered, rusty, damaged or abandoned buildings, shacks, corrugated metal roofs, peeling paint or graffiti
- clutter, plastic furniture, messy rooms, power lines or construction
- overcast or dull, flat light
- strong colour casts that do not match the rest of the set
- people posing or looking at the camera
- visible logos, watermarks or text
- obviously staged stock photos
- low resolution: full-bleed images must be at least 2400px wide at the source, and other images at least 1600px

Look for:
- refined whitewashed, limestone or plaster architecture with natural timber
- linen, rattan and stone details
- beautifully made beds in calm rooms
- terraces with daybeds over turquoise water
- outdoor rain showers in a planted courtyard
- calm reef and underwater shots with clear water
- sandbanks from above
- a wooden boat on still water at sunset
- breakfast styled simply on a terrace
- quiet beach details at golden hour

Image rules:
- **Light and grade:** keep a consistent warm, soft, natural light and grade across the whole set, so it reads as one shoot.
- **Matching the content:** every room's images must match that room's description. The Rooftop Suite shows a terrace with a daybed, the Garden Suite shows a courtyard and an outdoor shower, and so on.
- **Source and storage:** use free stock only (Unsplash or Pexels). Download images into the repo, never hotlink, and update `src/data/credits.ts` and the `/credits` page.
- **Image log:** create an `IMAGES.md` log listing every image slot on the site with:
  - the chosen image and its source
  - why it fits
  - which old image it replaced
  - the focal point you set

Cropping:
- **Focal points:** give every image an explicit focal point in the data (an `object-position` value) and a defined aspect ratio for each slot. Use 16:9 or 21:9 for full-bleed images, 4:5 or 3:4 for portraits and 3:2 for spreads.
- **Art direction:** use `<picture>` for the hero and every full-bleed image, so mobile gets its own composed crop.
- **No bad crops.** Nothing important should be cut off. Specifically:
  - no beds cut in half
  - no horizons slicing through the middle of a subject
  - no tops of buildings missing
  - no awkward slivers of objects at the edges
- **Screenshot check:** screenshot every page at 375px, 768px, 1440px and 1920px, look at every image crop, and fix any that look awkward. Repeat until every crop looks intentional.

---

## 6. Copy: professional, specific, never AI-sounding

Rewrite all copy across the whole site, including:
- headings, body text and captions
- room and experience descriptions
- FAQ answers and the sample reviews
- the booking flow, confirmation, 404, and meta titles and descriptions

It must read like it was written by the owner of a real, small luxury guesthouse. It should be calm, factual and specific.

Remove lines like these, which no real business would write:
- "Twelve rooms, one reef, and nowhere you need to be."
- "Come and see what twelve rooms feels like."
- "Twelve rooms, and no two mornings the same in any of them."
- "Before breakfast, or after. Nobody minds."
- "Guests work this out on their first day and then argue about it politely for the rest of the week."

Rules:
- **Say what is true and useful.** Use concrete facts: room sizes, bed types, views, distances in minutes, what is included, times and prices. Good references are the plain, factual tone of small luxury hotels and villas. Remove any line that does not give the guest information.
- **No slogans, no cleverness:** no aphorisms, wordplay, poetic fragments or punchy one-liners written to sound deep. No "X, Y, and nowhere..." style triplets.
- **No quirky asides:** no personification, no jokes about guests, no rhetorical questions, no "Nobody minds" style lines.
- **Banned words and phrases:** never use elevate, indulge, discover, nestled, unparalleled, seamless, journey, unlock, curated, hidden gem, paradise, oasis, sanctuary, escape, bliss, unwind, tranquil haven, slice of, little piece of, effortless, "whether you're... or...", "more than just", "experience the", "where X meets Y".
- **Sentence shape:** vary sentence length naturally. Keep headlines short and plain, and keep body text in complete, normal sentences.
- **Buttons:** keep button text short and standard: "Book now", "Check availability", "View room", "View all rooms", "Add to booking", "Contact us". No bespoke CTA wording.
- **Hero headline:** short and factual. Good directions:
  - "A twelve-room guesthouse on Maafushi"
  - "Driftwood, Maafushi"
  - "Twelve rooms on the house reef"

  Use a subline only if it adds facts, for example "Four room types, two minutes from the house reef. Breakfast included."
- **Reviews:** sample reviews should sound like real guest reviews: specific, plain and a little uneven, not polished marketing.
- **Check everything:** after rewriting, search the whole codebase for every banned word and phrase, and for the old lines quoted above, and confirm none remain.

---

## 7. Colour and detail

- Keep the warm cream base, but make the palette quieter and more refined:
  - `--cream: #F6F2EC`
  - `--ivory: #FBF9F5`
  - `--ink: #1E1A17`
  - `--espresso: #2B2420`, for primary buttons
  - `--taupe: #8B8178`, for secondary text and captions
  - `--hairline: #E3DCD2`
  - `--sea: #3E6F70`, used only for the map water and availability states
- Remove the rust-orange colour everywhere.
- Restyle the seasonal calendar's colour scale in quiet tones (from ivory through sand to taupe), with sharp square cells.
- Restyle the island map in the same palette, with thin lines and small uppercase labels. The hotspot cards must be square.
- Keep motion subtle and slow:
  - slow fades, and a very gentle image scale on reveal (1.04 to 1.0)
  - smooth page transitions
  - no bouncy or springy easing
  - `prefers-reduced-motion` still turns everything off

---

## 8. Keep conversion working

The site must still convert. Luxury styling cannot slow people down.
- "Book now" stays in the header on every page and is visible without scrolling.
- The booking bar sits directly below the hero on Home.
- Every room has a square "Book" action that preselects the room.
- The mobile sticky bottom bar stays, restyled sharp and square, showing "From $180 per night" and a "Book now" button. It stays hidden inside the booking flow.
- The booking flow keeps all of its steps, live quote, prefill, skipping, timing and confirmation. Restyle it to match: sharp edges, thin serif headings, uppercase labels and square buttons.
- The demo notice and the footer line "A Nuit Works concept. Driftwood is a fictional business." stay, and remain clearly readable.

---

## 9. Checks before you finish

1. **Before and after:** screenshot every page at 375px, 768px, 1440px and 1920px. Compare against your "before" screenshots and confirm that every point in sections 1 to 8 is visibly done.
2. **Corners:** confirm there are no rounded corners anywhere, including inside the booking flow, calendar, map, explorer, galleries and mobile menu.
3. **Images:** confirm every image fits the luxury direction and every crop looks intentional at all four widths. Make sure `IMAGES.md` is complete.
4. **Copy:** confirm none of the banned words or the old quoted lines remain anywhere, including meta tags, `llms.txt` and the JSON-LD descriptions.
5. **Booking flow:** walk it end to end at 375px and 1440px, starting from the header "Book now", the booking bar and a room's "Book" button. Record the times.
6. **Lighthouse:** run it on mobile and desktop for Home, Rooms, a room page and Book. The targets from the original brief still apply (Performance 95 or higher; Accessibility, Best Practices and SEO 100; LCP under 2.0s; CLS under 0.05). New, larger images must not break these.
7. **Build:** run `astro check` and a production build with zero errors or warnings.
8. **Case study:** update `CASE-STUDY.md` with the new scores and booking times.

Finish with a short report covering:
- what changed
- final Lighthouse scores
- booking test times
- any image slots where you could not find a good enough free image (describe what is needed, so I can supply one)
