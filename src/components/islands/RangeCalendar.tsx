/** @jsxImportSource preact */
import { useLayoutEffect, useRef, useState } from 'preact/hooks';
import {
  addDays,
  addMonths,
  fmtLong,
  fmtMonth,
  fromISO,
  monthWeeks,
  WEEKDAYS,
  WEEKDAYS_LONG,
  type ISODate,
} from '../../lib/dates';

export interface DayInfo {
  /** Can the night of this day be booked (so it can be a check-in)? */
  selectable: boolean;
  tier: 0 | 1 | 2 | 3;
  price?: number;
  /** Extra words for screen readers, e.g. "$216 a night, High season" */
  describe: string;
  soldOut?: boolean;
}

interface Props {
  /** First day of each month to render */
  months: ISODate[];
  start?: ISODate;
  end?: ISODate;
  focusDate: ISODate;
  onFocusDate: (d: ISODate) => void;
  min: ISODate;
  max: ISODate;
  dayInfo: (d: ISODate) => DayInfo;
  /** Can `d` be the check-out for a stay starting on `start`? */
  canEnd: (start: ISODate, d: ISODate) => boolean;
  onSelect: (start: ISODate | undefined, end: ISODate | undefined) => void;
  variant: 'price' | 'heat';
  idPrefix: string;
}

const weekdayIndex = (d: ISODate) => (fromISO(d).getUTCDay() + 6) % 7;

const shiftMonths = (d: ISODate, n: number): ISODate => {
  const target = addMonths(d, n);
  const day = Number(d.slice(8));
  const last = Number(addDays(addMonths(target, 1), -1).slice(8));
  return `${target.slice(0, 8)}${String(Math.min(day, last)).padStart(2, '0')}`;
};

/**
 * Accessible date-range grid: one tab stop, arrow keys move by day and week,
 * Home/End to the week's ends, PageUp/PageDown by month (Shift for a year).
 */
export default function RangeCalendar(props: Props) {
  const { months, start, end, focusDate, onFocusDate, min, max, dayInfo, canEnd, onSelect, variant, idPrefix } = props;
  const [hover, setHover] = useState<ISODate | undefined>();
  const root = useRef<HTMLDivElement>(null);
  /** The date that should receive focus once it is rendered. */
  const pendingFocus = useRef<ISODate | null>(null);

  // Layout effect, so focus follows each key press before the next one
  // arrives (holding an arrow key fires many presses per second).
  useLayoutEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    const el = root.current?.querySelector<HTMLButtonElement>(`[data-date="${target}"]`);
    if (el) {
      el.focus();
      pendingFocus.current = null;
    }
  });

  const awaitingEnd = !!start && !end;

  const choose = (d: ISODate) => {
    const info = dayInfo(d);
    if (start && !end && d > start && canEnd(start, d)) {
      onSelect(start, d);
    } else if (info.selectable) {
      onSelect(d, undefined);
    }
    onFocusDate(d);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (!target.dataset?.date) return;
    let next: ISODate | undefined;
    switch (e.key) {
      case 'ArrowLeft':
        next = addDays(focusDate, -1);
        break;
      case 'ArrowRight':
        next = addDays(focusDate, 1);
        break;
      case 'ArrowUp':
        next = addDays(focusDate, -7);
        break;
      case 'ArrowDown':
        next = addDays(focusDate, 7);
        break;
      case 'Home':
        next = addDays(focusDate, -weekdayIndex(focusDate));
        break;
      case 'End':
        next = addDays(focusDate, 6 - weekdayIndex(focusDate));
        break;
      case 'PageUp':
        next = shiftMonths(focusDate, e.shiftKey ? -12 : -1);
        break;
      case 'PageDown':
        next = shiftMonths(focusDate, e.shiftKey ? 12 : 1);
        break;
      default:
        return;
    }
    e.preventDefault();
    if (next < min) next = min;
    if (next > max) next = max;
    pendingFocus.current = next;
    onFocusDate(next);
  };

  return (
    <div class={`cal cal--${variant}`} ref={root} onKeyDown={onKeyDown} onMouseLeave={() => setHover(undefined)}>
      {months.map((m) => {
        const capId = `${idPrefix}-${m.slice(0, 7)}`;
        return (
          <div class="cal-month" key={m}>
            <h3 class="cal-caption" id={capId}>
              {fmtMonth(m)}
            </h3>
            <table role="grid" class="cal-grid" aria-labelledby={capId}>
              <thead>
                <tr>
                  {WEEKDAYS.map((w, i) => (
                    <th scope="col" abbr={WEEKDAYS_LONG[i]} key={w}>
                      {variant === 'heat' ? w.slice(0, 1) : w.slice(0, 2)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthWeeks(m).map((week, wi) => (
                  <tr key={wi}>
                    {week.map((d, di) => {
                      if (!d) return <td key={di} class="cal-empty" />;
                      const outOfRange = d < min || d > max;
                      const info = dayInfo(d);
                      const isStart = d === start;
                      const isEnd = d === end;
                      const inRange = !!start && !!end && d > start && d < end;
                      const preview = awaitingEnd && !!hover && d > start! && d <= hover && canEnd(start!, hover);
                      const endable = awaitingEnd && d > start! && canEnd(start!, d);
                      const enabled = !outOfRange && (endable || info.selectable);
                      const state = [isStart && 'check-in', isEnd && 'check-out', inRange && 'in your stay'].filter(Boolean).join(', ');
                      const unavailable = outOfRange ? 'not available' : !enabled ? (info.soldOut ? 'sold out' : 'not available') : '';
                      const label = [fmtLong(d), info.describe, state, unavailable].filter(Boolean).join(', ');
                      const cls = [
                        'cal-day',
                        `s${info.tier}`,
                        !enabled && 'is-off',
                        info.soldOut && !outOfRange && 'is-soldout',
                        isStart && 'is-start',
                        isEnd && 'is-end',
                        (inRange || preview) && 'is-in',
                        endable && 'is-endable',
                      ]
                        .filter(Boolean)
                        .join(' ');
                      return (
                        <td key={d} aria-selected={isStart || isEnd || inRange ? 'true' : 'false'}>
                          <button
                            type="button"
                            class={cls}
                            data-date={d}
                            tabIndex={d === focusDate ? 0 : -1}
                            aria-disabled={enabled ? undefined : 'true'}
                            onClick={() => (enabled ? choose(d) : onFocusDate(d))}
                            onMouseEnter={awaitingEnd ? () => setHover(d) : undefined}
                          >
                            <span class="cal-num" aria-hidden="true">
                              {Number(d.slice(8))}
                            </span>
                            <span class="visually-hidden">{label}</span>
                            {variant === 'price' && info.price && !outOfRange && enabled && (
                              <span class="cal-price" aria-hidden="true">
                                ${info.price}
                              </span>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
