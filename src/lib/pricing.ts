import { seasons, type Season } from '../data/seasons';
import { fees } from '../data/fees';
import { experienceBySlug, type ExperienceSlug } from '../data/experiences';
import { transferById, transferReturnPrice, type TransferId } from '../data/transfers';
import type { Room } from '../data/rooms';
import { monthDay, nightsOf, type ISODate } from './dates';

/** Is a MM-DD inside an inclusive MM-DD range that may wrap the year? */
export const inMonthDayRange = (md: string, from: string, to: string): boolean =>
  from <= to ? md >= from && md <= to : md >= from || md <= to;

const seasonCache = new Map<string, Season>();

export const seasonFor = (night: ISODate): Season => {
  const md = monthDay(night);
  let s = seasonCache.get(md);
  if (!s) {
    s = seasons.find((x) => x.ranges.some((r) => inMonthDayRange(md, r.from, r.to))) ?? seasons[0];
    seasonCache.set(md, s);
  }
  return s;
};

export const rateFor = (fromPrice: number, night: ISODate): number => Math.round(fromPrice * seasonFor(night).multiplier);

/** The nightly rate of every season for one room, cheapest first. */
export const seasonRates = (fromPrice: number) =>
  [...seasons].sort((a, b) => a.tier - b.tier).map((s) => ({ season: s, rate: Math.round(fromPrice * s.multiplier) }));

export interface NightGroup {
  season: Season;
  rate: number;
  nights: number;
  amount: number;
}

/** Nights grouped by season, in stay order. */
export const stayBreakdown = (room: Pick<Room, 'fromPrice'>, checkin: ISODate, checkout: ISODate): NightGroup[] => {
  const groups: NightGroup[] = [];
  for (const night of nightsOf(checkin, checkout)) {
    const season = seasonFor(night);
    const rate = Math.round(room.fromPrice * season.multiplier);
    const last = groups[groups.length - 1];
    if (last && last.season.id === season.id && last.rate === rate) {
      last.nights += 1;
      last.amount += rate;
    } else {
      groups.push({ season, rate, nights: 1, amount: rate });
    }
  }
  return groups;
};

export const stayTotal = (room: Pick<Room, 'fromPrice'>, checkin: ISODate, checkout: ISODate): number =>
  stayBreakdown(room, checkin, checkout).reduce((n, g) => n + g.amount, 0);

export interface QuoteLine {
  id: string;
  label: string;
  detail?: string;
  amount: number;
  kind: 'room' | 'addon' | 'transfer' | 'tax';
}

export interface Quote {
  nights: number;
  guests: number;
  lines: QuoteLine[];
  subtotal: number;
  serviceCharge: number;
  gst: number;
  greenTax: number;
  total: number;
}

export interface QuoteInput {
  room?: Pick<Room, 'name' | 'fromPrice'>;
  checkin?: ISODate;
  checkout?: ISODate;
  adults: number;
  children: number;
  experiences: { slug: ExperienceSlug; people: number }[];
  transfer: TransferId | 'none';
}

const pct = (n: number) => `${Math.round(n * 100)}%`;

/**
 * Build an itemised quote. Every line is a whole dollar amount and the total
 * is the sum of the lines, so what you see always adds up.
 */
export const buildQuote = (q: QuoteInput): Quote | null => {
  if (!q.room || !q.checkin || !q.checkout) return null;
  const nights = nightsOf(q.checkin, q.checkout).length;
  if (nights < 1) return null;
  const guests = q.adults + q.children;
  const lines: QuoteLine[] = [];

  for (const g of stayBreakdown(q.room, q.checkin, q.checkout)) {
    lines.push({
      id: `room-${g.season.id}-${g.rate}`,
      label: `${g.nights} ${g.nights === 1 ? 'night' : 'nights'} × $${g.rate}`,
      detail: g.season.label,
      amount: g.amount,
      kind: 'room',
    });
  }
  const roomTotal = lines.reduce((n, l) => n + l.amount, 0);

  let addons = 0;
  for (const e of q.experiences) {
    const exp = experienceBySlug(e.slug);
    if (!exp || e.people < 1) continue;
    const amount = exp.price * e.people;
    addons += amount;
    lines.push({ id: `exp-${exp.slug}`, label: exp.name, detail: `${e.people} × $${exp.price}`, amount, kind: 'addon' });
  }

  let transfer = 0;
  const t = q.transfer !== 'none' ? transferById(q.transfer) : undefined;
  if (t && t.bookable) {
    transfer = transferReturnPrice(t, guests);
    lines.push({
      id: `transfer-${t.id}`,
      label: `${t.name}, return`,
      detail: t.priceBasis === 'person' ? `${guests} × $${t.oneWay * 2}` : 'Per boat',
      amount: transfer,
      kind: 'transfer',
    });
  }

  const subtotal = roomTotal + addons + transfer;
  const serviceCharge = Math.round((roomTotal + addons) * fees.serviceCharge.rate);
  const gst = Math.round((subtotal + serviceCharge) * fees.gst.rate);
  const greenTax = fees.greenTax.perGuestPerNight * guests * nights;

  lines.push(
    { id: 'service', label: `${fees.serviceCharge.label} (${pct(fees.serviceCharge.rate)})`, amount: serviceCharge, kind: 'tax' },
    { id: 'gst', label: `${fees.gst.label} (${pct(fees.gst.rate)})`, amount: gst, kind: 'tax' },
    {
      id: 'green',
      label: fees.greenTax.label,
      detail: `$${fees.greenTax.perGuestPerNight} × ${guests} ${guests === 1 ? 'guest' : 'guests'} × ${nights} ${nights === 1 ? 'night' : 'nights'}`,
      amount: greenTax,
      kind: 'tax',
    },
  );

  return { nights, guests, lines, subtotal, serviceCharge, gst, greenTax, total: subtotal + serviceCharge + gst + greenTax };
};
