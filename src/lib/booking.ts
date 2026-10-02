/**
 * Booking state, and how it maps to /book/ query params. Deep links from the
 * hero form, room pages, experience cards and the seasonal calendar all use
 * the same params, so the flow can prefill itself and skip finished steps.
 *
 *   /book/?checkin=2026-11-03&checkout=2026-11-07&adults=2&children=0
 *         &room=garden-suite&exp=sandbank-picnic.2.2026-11-05&transfer=shared&step=addons
 */
import { roomBySlug, maxGuestsAnyRoom, type RoomSlug } from '../data/rooms';
import { experienceBySlug, type ExperienceSlug } from '../data/experiences';
import { availabilityConfig } from '../data/availability';
import type { TransferId } from '../data/transfers';
import { addDays, diffDays, isISODate, type ISODate } from './dates';
import { isStayFree } from './availability';

export type Step = 'dates' | 'room' | 'addons' | 'details' | 'confirmed';
export const STEPS: Exclude<Step, 'confirmed'>[] = ['dates', 'room', 'addons', 'details'];
export const STEP_TITLES: Record<Step, string> = {
  dates: 'Dates and guests',
  room: 'Choose your room',
  addons: 'Add to your stay',
  details: 'Your details',
  confirmed: 'Confirmed',
};

export type TransferChoice = Extract<TransferId, 'shared' | 'private'> | 'none';

export interface ExperienceChoice {
  slug: ExperienceSlug;
  people: number;
  day?: ISODate;
}

export interface BookingState {
  checkin?: ISODate;
  checkout?: ISODate;
  adults: number;
  children: number;
  room?: RoomSlug;
  experiences: ExperienceChoice[];
  transfer: TransferChoice;
}

export interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string;
  arrival: string;
  note: string;
}

export const emptyDetails: GuestDetails = { firstName: '', lastName: '', email: '', whatsapp: '', arrival: '', note: '' };

export const MAX_GUESTS = maxGuestsAnyRoom;
export const MAX_CHILDREN = MAX_GUESTS - 1;

export const defaultState = (): BookingState => ({ adults: 2, children: 0, experiences: [], transfer: 'none' });

export const guestsOf = (s: Pick<BookingState, 'adults' | 'children'>) => s.adults + s.children;

const clampInt = (v: string | null, min: number, max: number): number | undefined => {
  if (v === null || v === '') return undefined;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : undefined;
};

export interface ParsedParams {
  state: BookingState;
  step?: Step;
  ref?: string;
  /** True when the URL carried any booking choice at all */
  hasChoices: boolean;
}

export const parseParams = (params: URLSearchParams): ParsedParams => {
  const s = defaultState();
  const checkin = params.get('checkin');
  const checkout = params.get('checkout');
  if (isISODate(checkin)) s.checkin = checkin;
  if (isISODate(checkout)) s.checkout = checkout;
  s.adults = clampInt(params.get('adults'), 1, MAX_GUESTS) ?? s.adults;
  s.children = clampInt(params.get('children'), 0, MAX_CHILDREN) ?? s.children;
  if (s.adults + s.children > MAX_GUESTS) s.children = Math.max(0, MAX_GUESTS - s.adults);

  const room = roomBySlug(params.get('room'));
  if (room) s.room = room.slug;

  for (const raw of params.getAll('exp')) {
    for (const item of raw.split(',')) {
      const [slug, people, day] = item.split('.');
      const exp = experienceBySlug(slug);
      if (!exp || s.experiences.some((e) => e.slug === exp.slug)) continue;
      s.experiences.push({
        slug: exp.slug,
        people: clampInt(people ?? null, 1, MAX_GUESTS) ?? guestsOf(s),
        day: isISODate(day) ? day : undefined,
      });
    }
  }

  const transfer = params.get('transfer');
  if (transfer === 'shared' || transfer === 'private') s.transfer = transfer;

  const stepParam = params.get('step') as Step | null;
  const step = stepParam && (['dates', 'room', 'addons', 'details', 'confirmed'] as const).includes(stepParam) ? stepParam : undefined;
  const ref = params.get('ref') ?? undefined;

  const hasChoices = ['checkin', 'checkout', 'adults', 'children', 'room', 'exp', 'transfer'].some((k) => params.has(k));
  return { state: s, step, ref: ref && /^DW-[A-Z0-9]{6}$/.test(ref) ? ref : undefined, hasChoices };
};

export const toParams = (s: BookingState, step?: Step, ref?: string): URLSearchParams => {
  const p = new URLSearchParams();
  if (s.checkin) p.set('checkin', s.checkin);
  if (s.checkout) p.set('checkout', s.checkout);
  p.set('adults', String(s.adults));
  if (s.children) p.set('children', String(s.children));
  if (s.room) p.set('room', s.room);
  for (const e of s.experiences) p.append('exp', [e.slug, e.people, e.day].filter(Boolean).join('.'));
  if (s.transfer !== 'none') p.set('transfer', s.transfer);
  if (step && step !== 'dates') p.set('step', step);
  if (ref) p.set('ref', ref);
  return p;
};

/** Link into the booking flow with some choices already made. */
export const bookUrl = (opts: {
  checkin?: ISODate;
  checkout?: ISODate;
  adults?: number;
  room?: RoomSlug;
  exp?: ExperienceSlug;
  transfer?: TransferChoice;
} = {}): string => {
  const p = new URLSearchParams();
  if (opts.checkin) p.set('checkin', opts.checkin);
  if (opts.checkout) p.set('checkout', opts.checkout);
  if (opts.adults) p.set('adults', String(opts.adults));
  if (opts.room) p.set('room', opts.room);
  if (opts.exp) p.set('exp', opts.exp);
  if (opts.transfer && opts.transfer !== 'none') p.set('transfer', opts.transfer);
  const q = p.toString();
  return `/book/${q ? `?${q}` : ''}`;
};

/** Earliest check-in we accept: tomorrow. */
export const firstBookableDate = (today: ISODate): ISODate => addDays(today, 1);
export const lastBookableDate = (today: ISODate): ISODate => addDays(today, availabilityConfig.horizonDays);

export const datesValid = (s: BookingState, today: ISODate): boolean => {
  if (!s.checkin || !s.checkout) return false;
  const nights = diffDays(s.checkin, s.checkout);
  return (
    s.checkin >= firstBookableDate(today) &&
    s.checkout <= addDays(lastBookableDate(today), 1) &&
    nights >= 1 &&
    nights <= availabilityConfig.maxNights
  );
};

export const roomValid = (s: BookingState): boolean => {
  const room = roomBySlug(s.room);
  return !!room && !!s.checkin && !!s.checkout && room.maxGuests >= guestsOf(s) && isStayFree(room.slug, s.checkin, s.checkout);
};

/**
 * The furthest step the state allows. Used to skip finished steps on a
 * deep link and to stop anyone landing on a step they cannot use yet.
 */
export const furthestStep = (s: BookingState, today: ISODate): Step => {
  if (!datesValid(s, today)) return 'dates';
  if (!roomValid(s)) return 'room';
  return 'details';
};

const order: Step[] = ['dates', 'room', 'addons', 'details', 'confirmed'];
export const stepIndex = (s: Step) => order.indexOf(s);

/** Where a fresh visit should land: the first step that still needs an answer. */
export const landingStep = (s: BookingState, today: ISODate): Step => {
  const furthest = furthestStep(s, today);
  return furthest === 'details' ? 'addons' : furthest;
};

/** Clamp a requested step to what the state allows. */
export const allowedStep = (requested: Step | undefined, s: BookingState, today: ISODate): Step => {
  const landing = landingStep(s, today);
  if (!requested || requested === 'confirmed') return landing;
  return stepIndex(requested) <= stepIndex(furthestStep(s, today)) ? requested : landing;
};

/** Default day for an experience: the first full day of the stay. */
export const defaultExperienceDay = (s: BookingState): ISODate | undefined => {
  if (!s.checkin || !s.checkout) return undefined;
  const nights = diffDays(s.checkin, s.checkout);
  return nights > 1 ? addDays(s.checkin, 1) : s.checkin;
};
