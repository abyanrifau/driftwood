/**
 * Bookable add-ons. Prices are per person in USD, before taxes.
 */

export type ExperienceSlug =
  | 'snorkeling-house-reef'
  | 'sandbank-picnic'
  | 'dolphin-sunset-cruise'
  | 'local-island-walk';

export interface Experience {
  slug: ExperienceSlug;
  name: string;
  /** One plain sentence for listings */
  line: string;
  /** Short facts for the small-caps detail line, e.g. "Half day · 6 guests at most" */
  detail: string;
  price: number;
  priceUnit: 'per person';
  duration: string;
  /** ISO 8601 duration for structured data */
  isoDuration: string;
  time: string;
  groupSize: string;
  inclusions: string[];
  description: string[];
  goodToKnow: string;
  photo: { key: string; alt: string; caption: string };
}

export const experiences: Experience[] = [
  {
    slug: 'snorkeling-house-reef',
    name: 'Snorkeling at the House Reef',
    line: 'A guided swim along the reef edge, two minutes from the house.',
    detail: '3 hours · Daily from 8:30am · 6 guests at most',
    price: 35,
    priceUnit: 'per person',
    duration: 'About 3 hours',
    isoDuration: 'PT3H',
    time: 'Daily, 8:30 to 11:30am',
    groupSize: 'Six guests at most',
    inclusions: ['Guide trained in reef first aid', 'Mask, snorkel and fins', 'Reef-safe sunscreen', 'Water and fresh fruit'],
    description: [
      'We enter from the beach and follow the reef edge, where the shallow lagoon drops to about twelve metres. Green and hawksbill turtles feed here most mornings, with parrotfish, unicornfish and small blacktip reef sharks.',
      'Groups are six people at most and move at the pace of the slowest swimmer. Beginners are welcome: we give a short briefing on the beach and provide life jackets.',
    ],
    goodToKnow: 'The water is calmest between 8 and 11am. Life jackets in all sizes, including for children.',
    photo: { key: 'snorkel', alt: 'Snorkeler floating above coral in clear, shallow turquoise water', caption: 'House reef, 9am' },
  },
  {
    slug: 'sandbank-picnic',
    name: 'Sandbank Picnic',
    line: 'Lunch on a sandbank fifteen minutes away by boat.',
    detail: '5 hours · Daily from 12pm · 10 guests per boat',
    price: 60,
    priceUnit: 'per person',
    duration: 'About 5 hours',
    isoDuration: 'PT5H',
    time: 'Daily, 12 to 5pm',
    groupSize: 'Up to 10 guests per boat',
    inclusions: ['Boat to the sandbank and back', 'Lunch of grilled reef fish, rice, salads and fruit', 'Shade and mats', 'Snorkel gear and cold drinks'],
    description: [
      'The sandbank lies fifteen minutes north-east of Maafushi and changes shape with the tide. At low water it is about two hundred metres long. We leave at noon and collect you at five.',
      'Lunch is grilled reef fish, rice, two salads and fruit, served under a shade with mats and cold drinks. Snorkel gear is kept on the boat.',
    ],
    goodToKnow: 'Swimwear is fine on the sandbank. Bring a hat: the shade covers about four people.',
    photo: { key: 'sandbank', alt: 'Curved white sandbank in turquoise water, seen from above, with a boat moored nearby', caption: 'The sandbank, low tide' },
  },
  {
    slug: 'dolphin-sunset-cruise',
    name: 'Dolphin Sunset Cruise',
    line: 'Ninety minutes on a wooden dhoni at sunset.',
    detail: '1.5 hours · Daily from 5pm · 12 guests per boat',
    price: 45,
    priceUnit: 'per person',
    duration: 'About 1.5 hours',
    isoDuration: 'PT1H30M',
    time: 'Daily, 5 to 6:30pm',
    groupSize: 'Up to 12 guests per boat',
    inclusions: ['Traditional wooden dhoni and crew', 'Guide', 'Fresh juice and short eats'],
    description: [
      'Spinner dolphins feed in the channel west of Maafushi most evenings. We leave at 5pm on a traditional wooden dhoni and are back at the jetty by 6:30, after sunset.',
      'We see dolphins on about four trips in five. If we do not, you are welcome to join another trip at no charge.',
    ],
    goodToKnow: 'The channel can be choppy. If you are prone to seasickness, tell us and we will seat you at the stern.',
    photo: { key: 'dolphins', alt: 'Small pod of dolphins swimming in clear turquoise water, seen from above', caption: 'Spinner dolphins, the west channel' },
  },
  {
    slug: 'local-island-walk',
    name: 'Local Island Walk',
    line: 'An hour through the village with a local guide.',
    detail: '1 hour · Daily except Friday, 4pm · 8 guests at most',
    price: 20,
    priceUnit: 'per person',
    duration: 'About 1 hour',
    isoDuration: 'PT1H',
    time: 'Daily except Friday, 4 to 5pm',
    groupSize: 'Eight guests at most',
    inclusions: ['Local guide', 'Sweet tea and short eats at a tea shop'],
    description: [
      'Maafushi has about three thousand residents, a school, a mosque and a working harbour. The walk follows the village lanes past the boatyard and the old banyan tree, with time for questions.',
      'It ends at a tea shop for sweet black tea and hedhikaa, the small fried snacks served across the Maldives in the late afternoon.',
    ],
    goodToKnow: 'Please cover shoulders and knees in the village. We can lend you a sarong.',
    photo: { key: 'street', alt: 'White sand path through palms and gardens on Maafushi', caption: 'Maafushi, 4pm' },
  },
];

export const experienceBySlug = (slug: string | null | undefined): Experience | undefined =>
  experiences.find((e) => e.slug === slug);
