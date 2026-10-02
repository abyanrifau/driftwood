/**
 * Getting to Maafushi from Velana International Airport (MLE).
 * APPROXIMATE times and prices, placeholders for this concept.
 */

export type TransferId = 'shared' | 'private' | 'ferry';

export interface Transfer {
  id: TransferId;
  name: string;
  crossing: string;
  /** One-way price in USD */
  oneWay: number;
  priceBasis: 'person' | 'boat';
  priceLabel: string;
  schedule: string;
  bestFor: string;
  notes: string[];
  /** Whether Driftwood can arrange it inside the booking flow */
  bookable: boolean;
}

export const transfersNote = 'Approximate crossing times and prices. We confirm the exact time and fare when we book it for you.';

export const transfers: Transfer[] = [
  {
    id: 'shared',
    name: 'Shared speedboat',
    crossing: '35 to 45 minutes',
    oneWay: 30,
    priceBasis: 'person',
    priceLabel: 'about $30 per person, each way',
    schedule: 'Several scheduled departures a day, roughly 10am to 6pm',
    bestFor: 'Most arrivals in daylight',
    notes: ['Leaves from the airport jetty, a short walk from arrivals', 'We meet the boat at Maafushi jetty with a trolley for bags'],
    bookable: true,
  },
  {
    id: 'private',
    name: 'Private speedboat',
    crossing: 'About 30 minutes',
    oneWay: 220,
    priceBasis: 'boat',
    priceLabel: 'about $220 per boat, each way, up to 6 people',
    schedule: 'Any time, including late arrivals',
    bestFor: 'Late flights, families and small groups',
    notes: ['Waits for you if your flight is delayed', 'Runs direct from the airport jetty to Maafushi'],
    bookable: true,
  },
  {
    id: 'ferry',
    name: 'Public ferry',
    crossing: 'About 1.5 hours',
    oneWay: 2,
    priceBasis: 'person',
    priceLabel: 'about $2 per person, each way',
    schedule: 'Usually once or twice a day, Saturday to Thursday. No Friday service.',
    bestFor: 'Travellers on a budget with a flexible day',
    notes: ['Leaves from the ferry terminal in Malé, not the airport', 'Allow time for the airport ferry or taxi into Malé first'],
    bookable: false,
  },
];

export const transferById = (id: string | null | undefined) => transfers.find((t) => t.id === id);

/** Return price (both ways) for a bookable transfer and party size. */
export const transferReturnPrice = (t: Transfer, guests: number) =>
  t.priceBasis === 'person' ? t.oneWay * 2 * guests : t.oneWay * 2;
