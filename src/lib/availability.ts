/**
 * Deterministic fake availability. A string hash of (seed, room type, room
 * number, block of nights) decides whether each room is already taken, with
 * busier seasons more likely to be full. Same input, same answer, always.
 */
import { availabilityConfig } from '../data/availability';
import { rooms, type Room, type RoomSlug } from '../data/rooms';
import { inMonthDayRange, seasonFor } from './pricing';
import { dayIndex, monthDay, nightsOf, type ISODate } from './dates';

/** cyrb53 string hash, scaled to [0, 1). */
const hash01 = (str: string): number => {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)) / 2 ** 53;
};

const cache = new Map<string, number>();

/** How many rooms of a type are still free on a night. */
export const roomsFree = (slug: RoomSlug, night: ISODate): number => {
  const key = `${slug}|${night}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;

  const room = rooms.find((r) => r.slug === slug);
  if (!room) return 0;
  const md = monthDay(night);
  const forced = availabilityConfig.soldOut.some((w) => w.room === slug && inMonthDayRange(md, w.from, w.to));
  let free = 0;
  if (!forced) {
    const p = availabilityConfig.occupancy[seasonFor(night).id];
    const idx = dayIndex(night);
    for (let unit = 0; unit < room.count; unit++) {
      const block = Math.floor((idx + unit * 2) / availabilityConfig.blockNights);
      if (hash01(`${availabilityConfig.seed}|${slug}|${unit}|${block}`) >= p) free++;
    }
  }
  cache.set(key, free);
  return free;
};

export const isNightFree = (slug: RoomSlug, night: ISODate): boolean => roomsFree(slug, night) > 0;

export const isStayFree = (slug: RoomSlug, checkin: ISODate, checkout: ISODate): boolean =>
  nightsOf(checkin, checkout).every((n) => isNightFree(slug, n));

/** Rooms that fit the party and are free for every night of the stay. */
export const availableRooms = (guests: number, checkin: ISODate, checkout: ISODate): Room[] =>
  rooms.filter((r) => r.maxGuests >= guests && isStayFree(r.slug, checkin, checkout));

/** Is any room that fits the party free on this night? */
export const anyRoomFree = (guests: number, night: ISODate, only?: RoomSlug): boolean =>
  rooms.some((r) => (!only || r.slug === only) && r.maxGuests >= guests && isNightFree(r.slug, night));
