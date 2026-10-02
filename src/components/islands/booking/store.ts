/**
 * sessionStorage mirror of the booking, so a refresh never loses progress.
 * Personal details live only here, never in the URL.
 */
import type { BookingState, GuestDetails, Step } from '../../../lib/booking';

const KEY = 'dw:booking';
const CONFIRMED_KEY = 'dw:confirmed';

export interface Saved {
  state: BookingState;
  step: Step;
  details: GuestDetails;
}

export interface Confirmed {
  ref: string;
  state: BookingState;
  details: GuestDetails;
  total: number;
  /** Seconds from first booking interaction to confirmation, if known */
  seconds: number | null;
  createdAt: number;
}

const read = <T,>(key: string): T | null => {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const write = (key: string, value: unknown) => {
  try {
    if (value === null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode or full storage: the URL still carries the booking */
  }
};

export const loadSaved = () => read<Saved>(KEY);
export const save = (s: Saved | null) => write(KEY, s);
export const loadConfirmed = () => read<Confirmed>(CONFIRMED_KEY);
export const saveConfirmed = (c: Confirmed | null) => write(CONFIRMED_KEY, c);

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const makeRef = () => {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return `DW-${[...bytes].map((b) => ALPHABET[b % ALPHABET.length]).join('')}`;
};
