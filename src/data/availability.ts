/**
 * Settings for the fake, deterministic availability used by the calendars
 * and the booking flow. The same seed always produces the same result, so a
 * date that is sold out today is sold out on every visit.
 */

import type { RoomSlug } from './rooms';
import type { SeasonId } from './seasons';

export interface SoldOutWindow {
  room: RoomSlug;
  /** MM-DD, inclusive */
  from: string;
  /** MM-DD, inclusive. May wrap the new year. */
  to: string;
}

export const availabilityConfig = {
  seed: 'driftwood-maafushi',
  /** Chance that any single room is already booked on a night, by season. */
  occupancy: { low: 0.22, shoulder: 0.4, high: 0.62, peak: 0.86 } satisfies Record<SeasonId, number>,
  /** Bookings come in runs of nights, so gaps look like real gaps. */
  blockNights: 3,
  /** Fully booked whatever the seed says. */
  soldOut: [
    { room: 'rooftop-suite', from: '12-22', to: '01-03' },
    { room: 'beachfront-room', from: '12-27', to: '01-02' },
  ] satisfies SoldOutWindow[],
  /** How far ahead the calendars and booking flow go. */
  horizonDays: 365,
  /** Longest stay the booking flow accepts. */
  maxNights: 30,
} as const;
