/**
 * The 12 rooms, in 4 types. Prices are the "from" nightly rate in USD,
 * before season multipliers (see seasons.ts) and taxes (see fees.ts).
 */

export type RoomSlug = 'reef-view-room' | 'garden-suite' | 'beachfront-room' | 'rooftop-suite';

export interface RoomPhoto {
  /** Key in src/assets/photos */
  key: string;
  alt: string;
  /** Short caption shown under the photo, e.g. "Rooftop Suite, terrace" */
  caption: string;
}

export interface Room {
  slug: RoomSlug;
  name: string;
  /** Number of rooms of this type */
  count: number;
  /** Lowest nightly rate in USD, quiet season, before taxes */
  fromPrice: number;
  bed: 'Queen' | 'King';
  /** Maximum guests, adults and children together */
  maxGuests: number;
  sleepsLabel: string;
  sizeM2: number;
  floor: string;
  view: string;
  outdoorSpace: string;
  /** The room's defining feature, a few words for the detail line */
  feature: string;
  highlight: string;
  summary: string;
  description: string[];
  standout: string[];
  amenities: string[];
  photos: RoomPhoto[];
}

export const rooms: Room[] = [
  {
    slug: 'reef-view-room',
    name: 'Reef View Room',
    count: 4,
    fromPrice: 180,
    bed: 'Queen',
    maxGuests: 2,
    sleepsLabel: '2',
    sizeM2: 22,
    floor: 'First floor',
    view: 'Reef and open sea',
    outdoorSpace: 'Balcony with two chairs',
    feature: 'Reef balcony',
    highlight: 'First-floor balcony facing the reef',
    summary: 'A 22 m² first-floor room with a queen bed, a window seat and a balcony facing the reef.',
    description: [
      'The four Reef View Rooms are on the first floor, on the side of the house that faces the water. Each has a queen bed, a deep window seat and a balcony with two chairs, wide enough for coffee in the morning.',
      'Walls are lime plaster and the floors are reclaimed teak. The bathroom has a rain shower and a stone basin. From the balcony you can see where the reef begins, two minutes away on foot.',
    ],
    standout: ['Balcony facing the reef', 'Window seat', 'Lowest rate in the house'],
    amenities: [
      'Queen bed with linen bedding',
      'Balcony facing the reef',
      'Window seat',
      'Air conditioning and ceiling fan',
      'Rain shower with hot water',
      'Wi-Fi',
      'Mini fridge',
      'In-room safe',
      'Universal sockets and USB-C',
      'Beach towels and a snorkel bag',
      'Filtered drinking water',
      'Daily housekeeping',
    ],
    photos: [
      { key: 'reef-view-1', alt: 'Whitewashed bedroom with a low timber bed, linen bedding and woven wall hangings', caption: 'Reef View Room' },
      { key: 'reef-view-2', alt: 'Unmade linen bed facing an open balcony door and the sea', caption: 'Reef View Room, balcony, 7am' },
      { key: 'reef-view-3', alt: 'White linen pillows in morning light through the shutters', caption: 'Linen, washed and line-dried' },
      { key: 'reef-view-4', alt: 'Cushioned window seat looking out over the beach and the sea', caption: 'The window seat' },
      { key: 'reef-view-5', alt: 'Stone basin on a white plaster shelf with dark brass taps', caption: 'Bathroom, stone basin' },
    ],
  },
  {
    slug: 'garden-suite',
    name: 'Garden Suite',
    count: 3,
    fromPrice: 220,
    bed: 'King',
    maxGuests: 3,
    sleepsLabel: '2 to 3',
    sizeM2: 32,
    floor: 'Ground floor',
    view: 'Private courtyard garden',
    outdoorSpace: 'Walled courtyard with outdoor rain shower',
    feature: 'Outdoor shower',
    highlight: 'Walled courtyard with an outdoor rain shower',
    summary:
      'A 32 m² ground-floor suite with a king bed under a timber ceiling, a daybed for a third guest and a walled courtyard with an outdoor rain shower.',
    description: [
      'Each Garden Suite opens onto its own courtyard, planted with frangipani and banana palms and enclosed by a two-metre plaster wall. The rain shower stands in the courtyard, and there is a second bathroom indoors.',
      'Inside, a king bed with a cotton canopy sits under a pitched timber ceiling with a fan. The daybed by the window makes up as a single bed for a third guest, adult or child.',
    ],
    standout: ['Outdoor rain shower', 'Private walled courtyard', 'Sleeps three'],
    amenities: [
      'King bed with linen bedding',
      'Daybed that sleeps a third guest',
      'Private walled courtyard',
      'Outdoor rain shower and indoor bathroom',
      'Air conditioning and ceiling fan',
      'Wi-Fi',
      'Mini fridge',
      'Kettle with local tea',
      'In-room safe',
      'Universal sockets and USB-C',
      'Beach towels and a snorkel bag',
      'Daily housekeeping',
    ],
    photos: [
      { key: 'garden-suite-1', alt: 'Canopy bed with white netting under a high pitched timber ceiling', caption: 'Garden Suite' },
      { key: 'garden-suite-2', alt: 'Outdoor rain shower against a white wall, surrounded by tropical plants', caption: 'Garden Suite, courtyard shower' },
      { key: 'garden-suite-3', alt: 'Planted courtyard enclosed by white plaster walls', caption: 'The courtyard, afternoon' },
      { key: 'garden-suite-4', alt: 'Canopy bed with white netting and a carved timber bedside table', caption: 'King bed, cotton canopy' },
      { key: 'garden-suite-5', alt: 'Linen bedding in warm late-afternoon light', caption: 'Linen, 5pm' },
    ],
  },
  {
    slug: 'beachfront-room',
    name: 'Beachfront Room',
    count: 3,
    fromPrice: 240,
    bed: 'Queen',
    maxGuests: 3,
    sleepsLabel: '2 to 3',
    sizeM2: 26,
    floor: 'Ground floor',
    view: 'Beach and lagoon',
    outdoorSpace: 'Timber veranda onto the beach',
    feature: 'On the beach',
    highlight: 'Ground floor, the veranda steps down onto the sand',
    summary: 'A 26 m² ground-floor room facing the lagoon, with a queen bed, a sofa bed and a timber veranda that steps down onto the sand.',
    description: [
      'The three Beachfront Rooms face the lagoon on the west side of the house. The veranda has two chairs and steps straight down onto the sand. The water is about forty metres away, a little further at low tide.',
      'Each room has a queen bed, a sofa bed for a third guest, linen curtains and a walk-in rain shower. Two loungers and a thatched shade on the beach are kept for each room.',
    ],
    standout: ['Steps down onto the beach', 'Loungers and shade on the sand', 'Sleeps three'],
    amenities: [
      'Queen bed with linen bedding',
      'Sofa bed for a third guest',
      'Timber veranda onto the beach',
      'Two loungers and a shade on the sand',
      'Air conditioning and ceiling fan',
      'Walk-in rain shower with hot water',
      'Wi-Fi',
      'Mini fridge',
      'In-room safe',
      'Outdoor tap for sandy feet',
      'Universal sockets and USB-C',
      'Daily housekeeping',
    ],
    photos: [
      { key: 'beachfront-1', alt: 'White pillows and linen against a carved timber headboard', caption: 'Beachfront Room' },
      { key: 'beachfront-2', alt: 'Timber cabanas under two palms on a white beach beside turquoise water', caption: 'The beach in front of the house' },
      { key: 'beachfront-3', alt: 'White beach and shallow turquoise lagoon edged with palms, seen from above', caption: 'The lagoon, low tide' },
      { key: 'beachfront-4', alt: 'Two timber loungers under a thatched shade on white sand', caption: 'Loungers and shade, one set per room' },
      { key: 'beachfront-5', alt: 'Linen bedding against a timber slatted headboard', caption: 'Beachfront Room, linen' },
    ],
  },
  {
    slug: 'rooftop-suite',
    name: 'Rooftop Suite',
    count: 2,
    fromPrice: 260,
    bed: 'King',
    maxGuests: 2,
    sleepsLabel: '2',
    sizeM2: 34,
    floor: 'Top floor',
    view: 'Lagoon and sunset',
    outdoorSpace: 'Private 20 m² terrace with a daybed',
    feature: 'Private terrace',
    highlight: 'Private west-facing terrace with a canopy daybed',
    summary: 'A 34 m² top-floor suite with a king bed, glass doors and a private 20 m² terrace facing west, with a canopy daybed.',
    description: [
      'The two Rooftop Suites take the top floor and face west over the lagoon. Glass doors open from the bedroom onto a private terrace of 20 m² with a canopy daybed, two loungers and a small table.',
      'The bathroom is lined in timber, with a stone counter, two basins and a rain shower. These suites are booked first in high season. From May to October they are usually available.',
    ],
    standout: ['Private 20 m² terrace', 'Canopy daybed facing west', 'Top floor'],
    amenities: [
      'King bed with linen bedding',
      'Private west-facing terrace, 20 m²',
      'Canopy daybed and two loungers',
      'Air conditioning and ceiling fan',
      'Rain shower, two basins',
      'Wi-Fi',
      'Mini fridge with cold drinks on arrival',
      'Kettle with local tea',
      'In-room safe',
      'Universal sockets and USB-C',
      'Beach towels and a snorkel bag',
      'Daily housekeeping',
    ],
    photos: [
      { key: 'rooftop-1', alt: 'Bright bedroom with tall glass doors opening onto a terrace', caption: 'Rooftop Suite' },
      { key: 'rooftop-2', alt: 'Canopy daybed with white curtains on a terrace at sunset', caption: 'Rooftop Suite, terrace, 6pm' },
      { key: 'rooftop-3', alt: 'Canopy daybed with white curtains on a stone terrace under a blue sky', caption: 'The daybed, midday' },
      { key: 'rooftop-4', alt: 'Timber lounger facing the sea at dusk', caption: 'Rooftop Suite, dusk' },
      { key: 'rooftop-5', alt: 'Stone counter with two basins in a timber-lined bathroom', caption: 'Bathroom, stone and teak' },
    ],
  },
];

export const roomBySlug = (slug: string | null | undefined): Room | undefined =>
  rooms.find((r) => r.slug === slug);

/** One line of detail for listings: "QUEEN BED · SLEEPS 2 · REEF BALCONY" (shown in small caps) */
export const roomDetailLine = (r: Room) => `${r.bed} bed · Sleeps ${r.sleepsLabel} · ${r.sizeM2} m² · ${r.feature}`;

export const totalRooms = rooms.reduce((n, r) => n + r.count, 0);
export const lowestPrice = Math.min(...rooms.map((r) => r.fromPrice));
export const maxGuestsAnyRoom = Math.max(...rooms.map((r) => r.maxGuests));
