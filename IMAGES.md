# Image log

Every photograph on the Driftwood site: where it appears, where it comes from, why it was chosen, what it replaced and where its crop is anchored.

All photos are from Unsplash under the free Unsplash License (no Unsplash+ images). `npm run photos` downloads each one once, applies the same warm grade to every photo and saves a master JPEG to `src/assets/photos`. Nothing is hotlinked. Photographer credits are in `src/data/credits.ts` and on `/credits/`.

## How crops work

- **Focal point.** Every photo has a focal point in `src/data/credits.ts`, written as a CSS `object-position` value (for example `50% 74%`). A slot can override it.
- **Build-time crops.** These are cut around that point by `src/lib/focal-sharp.ts`, which uses the same maths as `object-position`, so a slot never shows a sliver of the wrong part of the frame.
- **Aspect ratios.**
  - Full-bleed bands: 21:9 on screens 768px and wider, 4:5 on phones.
  - Room page heroes: 16:9, and 4:5 on phones.
  - Portraits: 4:5 or 3:4.
  - Spreads and galleries: 3:2.
  - Thumbnails: 1:1.
- **Art direction.** The hero and every full-bleed image use a `<picture>` with separate phone and desktop sources (`ArtPhoto.astro`), so phones get their own composed crop.
- **The Home hero is the one exception to 4:5.** On phones it fills a whole screen of roughly 9:19, and a 4:5 crop would lose the daybed at the sides. It uses a second, upright photo of the same scene, cropped to 2:3.
- **Size rule.** Every full-bleed source is at least 2,400px wide; every other source is at least 1,600px wide.

## Slots

### Home

| Slot | Photo key | Crop |
|---|---|---|
| Hero, desktop | `hero-wide` | 16:9 |
| Hero, phones | `hero-tall` | 2:3 |
| 01 The house, full-bleed | `house` | 21:9 / 4:5 |
| 01 spread, large | `villa-terrace` | 4:5 |
| 01 spread, small (offset) | `plaster-shutter` | 3:2 |
| 01 portrait beside text | `breakfast` | 3:4 |
| 02 Rooms spreads | `reef-view-1`, `garden-suite-3`, `beachfront-2`, `rooftop-3` | 3:2, 4:5, 3:2, 4:5 |
| 03 The reef, tall portrait | `reef-split` | 3:4 |
| 03 The reef, small offset | `reef-coral` | 3:2 |
| 04 Days out, panorama | `sandbank-wide` | 21:9 / 4:5 |
| 04 experience entries | `snorkel`, `sandbank`, `dolphins`, `street` | 4:5, 3:2, 3:2, 4:5 |
| 05 Getting here, panorama | `speedboat` | 21:9 / 4:5 |
| Closing band | `wet-sand` | 21:9 / 4:5 |

### Rooms (`/rooms/`)

| Slot | Photo key | Crop |
|---|---|---|
| Explorer galleries | All 20 room photos | 3:2 |
| Compare thumbnails | First photo of each room | 3:2 |
| Closing band | `rooftop-2` | 21:9 / 4:5 |

### Room pages

| Slot | Photo key | Crop |
|---|---|---|
| Hero | Each room's first photo; `beachfront-2` for the Beachfront Room | 16:9 / 4:5 |
| Editorial gallery | The other four photos of the room | 3:2 if landscape, 4:5 if upright |
| Other rooms | First photo of each other room | 4:5 |

### Other pages

| Page | Slot | Photo key | Crop |
|---|---|---|---|
| Experiences | Hero | `boat-sunset` | 21:9 / 4:5 |
| Experiences | Four spreads | `snorkel`, `sandbank`, `dolphins`, `street` | 3:2 / 4:5, alternating |
| Experiences | Closing band | `sandbank-wide` | 21:9 / 4:5 |
| About | Hero | `house` on desktop, `villa-terrace` on phones | 21:9 / 4:5 |
| About | Materials | `timber-courtyard`, `plaster-shutter`, `reef-view-3` | 4:5 |
| About | Island | `island-aerial` | 4:5 |
| About | Closing band | `beachfront-2` | 21:9 / 4:5 |
| Getting here | Hero | `speedboat` | 21:9 / 4:5 |
| Getting here | Closing band | `boat-sunset` | 21:9 / 4:5 |
| FAQ | Closing band | `wet-sand` | 21:9 / 4:5 |
| 404 | Background | `wet-sand` | 16:9 / 2:3 |
| Book | Room thumbnails | First photo of each room | 1:1 |

The About page gives phones the upright terrace photo of the same house. It compresses to about half the size of the palm-filled veranda frame, which keeps the phone LCP under 2 seconds.

**OG images** use one photo per page (see `src/pages/og/[slug].jpg.ts`), cropped with sharp's attention strategy.

## Photos

The source is the size of the original upload on Unsplash. The focal point is the default `object-position`.

### New in this revision

| Key | Photo, photographer, Unsplash id | Source | Focal point | Why it fits | Replaced |
|---|---|---|---|---|---|
| `hero-wide` | Canopy daybed on a terrace, linen curtains framing a turquoise lagoon. Omar, `IyvAqGd5Hd0` | 6240×4160 | 50% 62% | A terrace with a daybed over calm turquoise water, in soft daylight. Timber, linen and a thatched villa behind, with no people. | `hero`: a timber beach house with a corrugated roof, under palms at dusk (Mick Kirchman). Worn and dark. |
| `hero-tall` | The same daybed and lagoon, upright frame. Omar, `r02TJbjch7I` | 4160×6240 | 50% 60% | The same scene shot upright, so the phone hero is composed rather than cut from the wide frame. | The phone crop of `hero`. |
| `house` | Whitewashed veranda with columns, palms, lawn and a long pool. Dinuka Lankaloka, `pm3vGgDnb3o` | 5760×3840 | 62% 60% | Refined whitewashed architecture with timber eaves and a calm garden. The focal point sits right of the left column, where the lens curve is strongest. | `exterior`: a two-storey timber guesthouse with red plastic loungers (Raynil Kumar BS). |
| `villa-terrace` | Limestone terrace, rattan loungers, plunge pool, linen curtain. Pepita Martasya, `OaQ-p0lCmRs` | 4160×6240 | 45% 62% | Limestone, rattan, linen and an arched doorway, in warm morning light. | New slots (Home, chapter 01; About hero on phones). |
| `plaster-shutter` | Teak shutter in a plaster wall, palm shadows. Kadir Celep, `A8aJwJ49rVM` | 4032×2688 | 38% 50% | A quiet material detail of lime plaster and timber, the shutter kept clear of the frame edges. | `niche-plaster`: a rough mud wall with a carved niche (Saifee Art). Weathered. |
| `timber-courtyard` | Teak-clad pavilion beside a walled courtyard with frangipani. Shawn, `74db2s4okvc` | 6048×8064 | 50% 55% | Timber cladding, white walls and planting, for the "Reclaimed teak" material. | `timber`: weathered, peeling planks (Andrej Lišakov). |
| `breakfast` | Breakfast bowls on a terrace table by the sea. Anastase Maragos, `hW-a5RqguOU` | 5341×8007 | 50% 68% | Breakfast styled simply on a terrace, soft light, the sea out of focus behind. | `breakfast`: a crowded table behind a glass balustrade (Meg von Haartman). |
| `sandbank-wide` | Curved white sandbank in a turquoise lagoon, from above. Hamdhulla Shakeeb, `IGaHJutSeBI` | 3982×2986 | 50% 50% | A sandbank from above. The curve reads well as a 21:9 panorama. | New slot (Home, chapter 04; Experiences closing band). |
| `reef-view-2` | Linen bed facing an open balcony door and the sea. Kristina Paparo, `GJb-5DMv9js` | 3024×4032 | 55% 50% | Shows the room's defining feature, the balcony facing the water. | Arched balcony with dark loungers and a telescope, strong blue cast (Steve Adams). |
| `reef-view-4` | Cushioned window seat looking out to sea. amelia elite, `jltLS_8EmMw` | 2739×1826 | 50% 55% | Matches the room description's window seat. Calm, white and timber. | Grey plaster niche with a plant (Eléonore Gautier). Did not show anything the description mentions. |
| `garden-suite-1` | Canopy bed under a high pitched timber ceiling. Didi Paul, `xchTgSqaoTo` | 4718×3713 | 45% 70% | "King bed under a timber ceiling" with a canopy. The focal point is low so the bed is never cut. | A different canopy bed under beams (Alexander Davies). Replaced so both bedroom photos show one room. |
| `garden-suite-4` | The same canopy bed, closer. Didi Paul, `qz_yWytwgcE` | 5905×3942 | 55% 55% | A second view of the same bedroom, from the same shoot. | Candlelit plaster niche with a strong orange cast (Declan Sun). |
| `beachfront-2` | Timber cabanas under palms on a white beach. Zidhan Ibrahim, `nO746fCppak` | 8796×5864 | 60% 70% | The beach the room opens onto, in bright, clean light. Used as the room's opening image. | Adirondack chairs on a railed deck (Peng Chen). Did not read as the Maldives. |
| `beachfront-3` | Beach and shallow lagoon, from above the palms. Adam Juman, `PqVMpLu8pyA` | 4000×2250 | 55% 50% | The lagoon in front of the room, calm and clear. | Red-roofed timber cabin in harsh midday light (Patrick Petit). |
| `beachfront-4` | Two timber loungers under a thatched shade. Datingjungle, `_NfK1MoEPGk` | 7837×5193 | 62% 58% | The loungers and shade kept for each Beachfront Room. | Veranda with white plastic-looking chairs under an overcast sky (Rich Brents). |
| `rooftop-3` | Canopy daybed with white curtains on a stone terrace. Anastase Maragos, `ZEPeidUonGA` | 3339×5949 | 50% 52% | Matches the description's "terrace with a canopy daybed". The upright frame keeps the whole canopy in view. | A roof terrace crowded with café tables and chairs (Ries Bosch). |
| `rooftop-5` | Stone counter with two basins in a timber-lined bathroom. Caroline Badran, `XXsCZqj78wU` | 4672×7008 | 62% 70% | Matches "timber-lined bathroom with a stone counter and two basins". | Lit niche framed by dead vines (Sebastian Schuster). Worn. |

### Kept from the first version

They passed the review against the new rules.

| Key | Photo, photographer, Unsplash id | Source | Focal point | Why it stays |
|---|---|---|---|---|
| `reef-split` | Reef above and below the waterline. Ishan @seefromthesky, `8qEuawM_txg` | 3000×4000 | 50% 45% | Calm, clear water. The waterline sits above the centre, so the 3:4 crop keeps both halves. |
| `reef-coral` | Hard coral and reef fish. Hiroko Yoshii, `9y7y26C-l4Y` | 3648×2736 | 50% 60% | A clear reef shot in natural light. |
| `snorkel` | Snorkeler over a shallow reef. Subtle Cinematics, `O5Fr1BZ-aR4` | 3391×2543 | 50% 40% | Clear water. The swimmer is small, facing away and not posing. |
| `sandbank` | Sandbank from above. Ibrahim Mohamed, `DwBiWW-aE5A` | 3070×5464 | 45% 50% | A sandbank from above, for the picnic trip. |
| `boat-sunset` | Wooden boat on still water at sunset. Inu Etc, `N5n9FDQkmGQ` | 3500×3500 | 55% 58% | A wooden boat on still water at sunset. The square source allows a 21:9 crop with the boat inside it. |
| `dolphins` | Dolphins in a turquoise lagoon. Hushaan @fromtinyisles, `MYEycJFNEu8` | 2389×2986 | 50% 45% | Clear water, no people. Used at half width, so 2,389px is enough. |
| `street` | White sand path under palms. World Wanderer, `TygYYmyHKro` | 12000×9000 | 50% 62% | A tidy sand path and planting. No clutter, no power lines. |
| `wet-sand` | Low sun on wet sand. Harald Attila, `_XqbPS0b2Bw` | 4272×2848 | 50% 55% | A quiet beach detail at golden hour, behind the closing text. |
| `island-aerial` | Local island and lagoon from the air. Adam Juman, `p7AvZ7a2N3U` | 6048×8064 | 50% 50% | An honest view of a local island in the atoll. |
| `speedboat` | Speedboat crossing the atoll. Ibrahim Shabil, `RKMVOSGWMC8` | 4000×2667 | 50% 55% | The arrival, in calm light. The wake leads the eye through the 21:9 band. |
| `reef-view-1` | Whitewashed bedroom with a timber bed. Sanju Pandita, `TKDF5G6ua1w` | 8511×5674 | 50% 74% | Whitewash, rattan and linen. The focal point is low so the bed is whole even in the wide room hero. |
| `reef-view-3` | Linen in morning light. Liz Vo, `pl3sj3DigxM` | 5677×8516 | 50% 50% | A linen detail in soft light. |
| `reef-view-5` | Stone basin on a plaster shelf. Sanibell BV, `530lZQXMKGw` | 5472×3648 | 45% 55% | Stone and plaster, as in the description. |
| `garden-suite-2` | Outdoor rain shower among plants. Alexander Davies, `EL2cArqkB_Y` | 4000×2667 | 50% 50% | The suite's outdoor shower in a planted courtyard. |
| `garden-suite-3` | Planted courtyard against white walls. Kirke Kiki, `ZJB_V7XmsPQ` | 3448×4592 | 50% 60% | The walled courtyard. |
| `garden-suite-5` | Linen bed in warm light. Efe Kekikciler, `APy5TV9HrVo` | 4608×3456 | 50% 50% | A calm linen detail. |
| `beachfront-1` | White linen and a carved timber headboard. Michael DeMarco, `hdDDRjF34v4` | 3840×5760 | 50% 55% | A beautifully made bed with timber. |
| `beachfront-5` | Linen against a timber wall. Andreas Haslinger, `safXxEsD-fs` | 4160×6240 | 50% 55% | A linen and timber detail. |
| `rooftop-1` | Bright bedroom with glass doors to the terrace. Greg Rivers, `vvYs67H9Y2E` | 6000×4000 | 45% 72% | Glass doors onto the terrace, as described. The focal point keeps the bed and the doors in frame. |
| `rooftop-2` | Canopy daybed on a terrace at sunset. George Desipris, `icZYX3A6nzM` | 7380×4145 | 50% 58% | The terrace daybed at sunset. |
| `rooftop-4` | Lounger facing the evening sea. Datingjungle, `VTII8TeLmeU` | 2956×3941 | 50% 62% | Sea at dusk from the terrace. |

### Removed without a direct replacement

- `reef-above`: reef from above. The new reef chapter uses a tall portrait and one detail instead.
- `street-bikes`: a village street with thatched stalls and clutter.
- `bicycle-palm`: a bicycle against a palm. The 404 page now uses `wet-sand`.

## Slots where a better photo is still wanted

These slots work, but a free photo that fits exactly could not be found. To supply one, add it to `credits.ts` under the same key and run `npm run photos -- --force`.

1. **Beachfront Room veranda** (`beachfront-2` to `beachfront-4`). No free photo shows a timber veranda stepping down onto white sand that matches the rest of the set, so the room is shown through its beach, lagoon and loungers.
   - **Wanted:** a ground-floor room with a whitewashed wall and a low teak veranda with two chairs, opening straight onto white sand with the lagoon beyond. Late-afternoon light, landscape, at least 2,400px wide.
2. **Exterior of the house** (`house`). The current photo is refined but was shot with a wide lens, and the left column bends slightly. The focal point keeps the 21:9 crop clear of the worst of it.
   - **Wanted:** a straight-on view of a two-storey whitewashed guesthouse with teak shutters and palms at golden hour. Landscape, at least 2,400px wide.
3. **Local Island Walk** (`street`). This is a sand path through gardens, not a village lane.
   - **Wanted:** a quiet Maldivian village lane with white coral walls, a sand street and soft light, with no people posing. At least 1,600px wide.
4. **Rooftop Suite daybed** (`rooftop-3`). The stone paving under the daybed reads slightly Mediterranean.
   - **Wanted:** a white canopy daybed on a plastered roof terrace with the lagoon behind. Upright, at least 1,600px wide.
