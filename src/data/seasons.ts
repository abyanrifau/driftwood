/**
 * Seasons and their price multipliers. A night's rate is the room's "from"
 * price multiplied by the season the night falls in, rounded to the dollar.
 * Edit the dates or multipliers here; every price on the site follows.
 */

export type SeasonId = 'low' | 'shoulder' | 'high' | 'peak';

export interface SeasonRange {
  /** Inclusive start, MM-DD */
  from: string;
  /** Inclusive end, MM-DD. If earlier than `from`, the range wraps the new year. */
  to: string;
}

export interface Season {
  id: SeasonId;
  name: string;
  /** Short label shown in calendars and quotes */
  label: string;
  multiplier: number;
  /** 0 = cheapest, 3 = most expensive. Drives the colour scale. */
  tier: 0 | 1 | 2 | 3;
  ranges: SeasonRange[];
  /** Plain-language line for the calendar summary */
  note: string;
}

export const seasons: Season[] = [
  {
    id: 'low',
    name: 'Low season',
    label: 'Quiet season',
    multiplier: 1.0,
    tier: 0,
    ranges: [{ from: '05-01', to: '10-31' }],
    note: 'May to October: the lowest rates, warm water and occasional afternoon showers.',
  },
  {
    id: 'shoulder',
    name: 'Shoulder season',
    label: 'Shoulder',
    multiplier: 1.05,
    tier: 1,
    ranges: [{ from: '11-01', to: '12-19' }],
    note: 'November to mid-December: mostly dry and calm, at rates a little above the quiet season.',
  },
  {
    id: 'high',
    name: 'High season',
    label: 'High',
    multiplier: 1.2,
    tier: 2,
    ranges: [{ from: '01-11', to: '04-30' }],
    note: 'Mid-January to April: dry, bright and calm. January books up early.',
  },
  {
    id: 'peak',
    name: 'Peak season',
    label: 'Peak',
    multiplier: 1.35,
    tier: 3,
    ranges: [{ from: '12-20', to: '01-10' }],
    note: '20 December to 10 January: Christmas and New Year, our busiest weeks. The Rooftop Suites are booked first.',
  },
];

/** Honest, calendar-based urgency lines. No timers, no fake viewers. */
export const seasonalUrgency = {
  headline: 'January books up early. May has the most availability.',
  detail:
    'Christmas and New Year are usually full by October, and the two Rooftop Suites go first. From May to October rates are at their lowest and most rooms are free.',
};
