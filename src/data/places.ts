/**
 * Places on the island map. x and y are positions in the map artwork's
 * 600 x 560 viewBox (see scripts/generate-map.py). Walking times are from
 * Driftwood's front door, at island pace.
 */

export interface Place {
  id: string;
  name: string;
  description: string;
  /** Plain-language time from Driftwood */
  fromDriftwood: string;
  x: number;
  y: number;
  kind: 'home' | 'nature' | 'transport' | 'food' | 'village';
}

export const places: Place[] = [
  {
    id: 'driftwood',
    name: 'Driftwood',
    description: 'Twelve rooms on the south side of the island. Breakfast on the terrace from 7 to 10am.',
    fromDriftwood: 'You are here',
    x: 382.4,
    y: 380.9,
    kind: 'home',
  },
  {
    id: 'house-reef',
    name: 'The house reef',
    description: 'Where the lagoon drops to the reef wall. Turtles feed here most mornings.',
    fromDriftwood: '2 minutes on foot',
    x: 331.9,
    y: 427.3,
    kind: 'nature',
  },
  {
    id: 'bikini-beach',
    name: 'Bikini beach',
    description: 'The beach where swimwear is permitted. Loungers, shade and a juice bar.',
    fromDriftwood: '6 minutes on foot',
    x: 523,
    y: 414.4,
    kind: 'nature',
  },
  {
    id: 'jetty',
    name: 'Ferry and speedboat jetty',
    description: 'Arrivals by speedboat and ferry. We meet every boat with a trolley for luggage.',
    fromDriftwood: '5 minutes on foot',
    x: 309.3,
    y: 229,
    kind: 'transport',
  },
  {
    id: 'village',
    name: 'The village',
    description: 'School, mosque, shops and the football pitch.',
    fromDriftwood: '3 minutes on foot',
    x: 185,
    y: 243.7,
    kind: 'village',
  },
  {
    id: 'tea-shop',
    name: 'Village tea shop',
    description: 'Sweet black tea and hedhikaa, the late-afternoon fried snacks. Cash only.',
    fromDriftwood: '4 minutes on foot',
    x: 242.5,
    y: 289.8,
    kind: 'food',
  },
  {
    id: 'garden-cafe',
    name: 'Garden café',
    description: 'Iced coffee and fresh juice in a shaded garden.',
    fromDriftwood: '3 minutes on foot',
    x: 372,
    y: 300,
    kind: 'food',
  },
  {
    id: 'sunset-cafe',
    name: 'Sunset café',
    description: 'Grilled reef fish at the western tip of the island, facing the sunset.',
    fromDriftwood: '12 minutes on foot',
    x: 75,
    y: 191.8,
    kind: 'food',
  },
  {
    id: 'sandbank',
    name: 'Sandbank, this way',
    description: 'A strip of white sand that changes shape with the tide. The picnic trip goes here.',
    fromDriftwood: '15 minutes by boat',
    x: 548,
    y: 100,
    kind: 'nature',
  },
];

export const mapViewBox = { width: 600, height: 560 } as const;
