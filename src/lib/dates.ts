/**
 * Calendar dates as plain 'YYYY-MM-DD' strings, handled in UTC so a night is
 * always a night, whatever the visitor's timezone or daylight saving.
 */

export type ISODate = string;

const DAY = 86_400_000;
const pad = (n: number) => String(n).padStart(2, '0');

export const toISO = (d: Date): ISODate => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

export const fromISO = (s: ISODate): Date => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

export const isISODate = (s: unknown): s is ISODate =>
  typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && toISO(fromISO(s)) === s;

export const addDays = (s: ISODate, n: number): ISODate => toISO(new Date(fromISO(s).getTime() + n * DAY));

/** Whole days from a to b (b - a). */
export const diffDays = (a: ISODate, b: ISODate): number => Math.round((fromISO(b).getTime() - fromISO(a).getTime()) / DAY);

/** Days since 1970-01-01, used as a stable index for seeded availability. */
export const dayIndex = (s: ISODate): number => Math.round(fromISO(s).getTime() / DAY);

/** Today in the visitor's own calendar. */
export const localToday = (): ISODate => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const monthDay = (s: ISODate): string => s.slice(5);

/** Every night of a stay: check-in up to, not including, check-out. */
export const nightsOf = (checkin: ISODate, checkout: ISODate): ISODate[] => {
  const n = diffDays(checkin, checkout);
  return Array.from({ length: Math.max(0, n) }, (_, i) => addDays(checkin, i));
};

export const firstOfMonth = (s: ISODate): ISODate => `${s.slice(0, 7)}-01`;

export const addMonths = (s: ISODate, n: number): ISODate => {
  const d = fromISO(firstOfMonth(s));
  return toISO(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1)));
};

/**
 * Weeks of a month, Monday first. Days outside the month are null.
 */
export const monthWeeks = (monthStart: ISODate): (ISODate | null)[][] => {
  const d = fromISO(monthStart);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const lead = (d.getUTCDay() + 6) % 7;
  const cells: (ISODate | null)[] = [
    ...Array<null>(lead).fill(null),
    ...Array.from({ length: days }, (_, i) => `${y}-${pad(m + 1)}-${pad(i + 1)}`),
  ];
  while (cells.length % 7) cells.push(null);
  const weeks: (ISODate | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
};

/** Cached formatters: calendars format hundreds of dates per render. */
const fmt = (opts: Intl.DateTimeFormatOptions) => {
  const f = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', ...opts });
  const cache = new Map<ISODate, string>();
  return (s: ISODate) => {
    let out = cache.get(s);
    if (out === undefined) {
      out = f.format(fromISO(s));
      cache.set(s, out);
    }
    return out;
  };
};

/** "Tue 3 Mar" */
export const fmtShort = fmt({ weekday: 'short', day: 'numeric', month: 'short' });
/** "3 Mar" */
export const fmtDayMonth = fmt({ day: 'numeric', month: 'short' });
/** "Tuesday 3 March 2026" */
export const fmtLong = fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
/** "3 March 2026" */
export const fmtDate = fmt({ day: 'numeric', month: 'long', year: 'numeric' });
/** "March 2026" */
export const fmtMonth = fmt({ month: 'long', year: 'numeric' });
/** "Mar" */
export const fmtMonthShort = fmt({ month: 'short' });

/** "3 to 7 March 2026" or "29 Dec 2026 to 2 Jan 2027" */
export const fmtRange = (a: ISODate, b: ISODate): string => {
  if (a.slice(0, 7) === b.slice(0, 7)) return `${Number(a.slice(8))} to ${fmtDate(b)}`;
  if (a.slice(0, 4) === b.slice(0, 4)) return `${fmtDayMonth(a)} to ${fmtDate(b)}`;
  return `${fmtDate(a)} to ${fmtDate(b)}`;
};

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
export const WEEKDAYS_LONG = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
