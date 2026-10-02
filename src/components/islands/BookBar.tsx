/** @jsxImportSource preact */
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import './calendar.css';
import './book-bar.css';
import RangeCalendar, { type DayInfo } from './RangeCalendar';
import { rooms, type RoomSlug } from '../../data/rooms';
import { availabilityConfig } from '../../data/availability';
import { isNightFree, isStayFree } from '../../lib/availability';
import { rateFor, seasonFor } from '../../lib/pricing';
import { firstBookableDate, lastBookableDate, MAX_GUESTS } from '../../lib/booking';
import { addDays, addMonths, diffDays, firstOfMonth, fmtShort, localToday, type ISODate } from '../../lib/dates';
import { money, plural } from '../../lib/format';

interface Props {
  /** Build-time today; replaced with the visitor's own date on load */
  today: ISODate;
  /** 'bar' sits under the Home hero; 'panel' is the room page's sticky panel */
  variant: 'bar' | 'panel';
  room?: RoomSlug;
  maxGuests?: number;
  id: string;
  submitLabel?: string;
}

type Picking = 'in' | 'out';

const useWide = (query: string) => {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const set = () => setWide(mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, [query]);
  return wide;
};

/**
 * The quick booking form: styled date fields that open a range calendar,
 * guest selects and Check availability. It submits with GET straight into
 * /book/, so the flow opens with everything filled in. Without JavaScript
 * the date fields stay empty and the form still opens the booking flow.
 */
export default function BookBar({ today: buildToday, variant, room, maxGuests = MAX_GUESTS, id, submitLabel = 'Check availability' }: Props) {
  const [today, setToday] = useState(buildToday);
  const [checkin, setCheckin] = useState<ISODate | undefined>();
  const [checkout, setCheckout] = useState<ISODate | undefined>();
  const [adults, setAdults] = useState(Math.min(2, maxGuests));
  const [children, setChildren] = useState(0);
  const [open, setOpen] = useState<Picking | null>(null);
  const root = useRef<HTMLFormElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);

  useEffect(() => setToday(localToday()), []);

  const min = firstBookableDate(today);
  const max = lastBookableDate(today);
  const twoMonths = useWide(variant === 'bar' ? '(min-width: 900px)' : 'not all');
  const visible = twoMonths ? 2 : 1;
  const [focusDate, setFocusDate] = useState<ISODate>(min);
  const [monthStart, setMonthStart] = useState<ISODate>(firstOfMonth(min));
  const months = Array.from({ length: visible }, (_, i) => addMonths(monthStart, i));

  const guests = adults + children;
  const candidates = useMemo(() => rooms.filter((r) => r.maxGuests >= guests && (!room || r.slug === room)), [guests, room]);

  const dayInfo = (d: ISODate): DayInfo => {
    const season = seasonFor(d);
    const inWindow = d >= min && d <= max;
    const free = candidates.filter((r) => isNightFree(r.slug, d));
    const price = free.length ? Math.min(...free.map((r) => rateFor(r.fromPrice, d))) : undefined;
    return {
      selectable: inWindow && free.length > 0,
      tier: season.tier,
      price,
      soldOut: inWindow && free.length === 0,
      describe: inWindow ? (price ? `${room ? '' : 'from '}${money(price)} a night` : 'sold out') : '',
    };
  };

  const canEnd = (s: ISODate, d: ISODate) =>
    d > s && d <= addDays(max, 1) && diffDays(s, d) <= availabilityConfig.maxNights && candidates.some((r) => isStayFree(r.slug, s, d));

  const moveFocus = (d: ISODate) => {
    setFocusDate(d);
    const m = firstOfMonth(d);
    const lastVisible = addMonths(monthStart, visible - 1);
    if (m < monthStart) setMonthStart(m);
    else if (m > lastVisible) setMonthStart(addMonths(m, -(visible - 1)));
  };

  const show = (which: Picking, el: HTMLButtonElement) => {
    trigger.current = el;
    const start = which === 'out' && checkin ? checkin : checkin ?? min;
    const target = which === 'out' && checkin ? addDays(checkin, 1) : start;
    setFocusDate(target < min ? min : target);
    setMonthStart(firstOfMonth(target < min ? min : target));
    setOpen(which);
  };

  const close = (refocus = true) => {
    setOpen(null);
    if (refocus) trigger.current?.focus();
  };

  // Focus the calendar when it opens; Escape and outside clicks close it.
  useEffect(() => {
    if (!open) return;
    const cal = root.current?.querySelector<HTMLButtonElement>('.bb-pop .cal-day[tabindex="0"]');
    cal?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  const onSelect = (s: ISODate | undefined, e: ISODate | undefined) => {
    setCheckin(s);
    setCheckout(e);
    if (s && !e) setOpen('out');
    if (s && e) close();
  };

  const nights = checkin && checkout ? diffDays(checkin, checkout) : 0;
  const adultOptions = Array.from({ length: maxGuests }, (_, i) => i + 1);
  const childOptions = Array.from({ length: maxGuests }, (_, i) => i);
  const popId = `${id}-dates`;

  return (
    <form
      ref={root}
      class={`bb bb--${variant}${open ? ' is-open' : ''}`}
      action="/book/"
      method="get"
      data-booking-start
      data-astro-reload
    >
      {room && <input type="hidden" name="room" value={room} />}
      {checkin && <input type="hidden" name="checkin" value={checkin} />}
      {checkout && <input type="hidden" name="checkout" value={checkout} />}

      <div class="bb-fields">
        <button
          type="button"
          class={`bb-field bb-date${open === 'in' ? ' is-active' : ''}`}
          aria-expanded={open !== null}
          aria-controls={popId}
          onClick={(e) => (open === 'in' ? close() : show('in', e.currentTarget))}
        >
          <span class="bb-label">Check-in</span>
          <span class={`bb-value${checkin ? '' : ' is-empty'}`}>{checkin ? fmtShort(checkin) : 'Add date'}</span>
        </button>
        <button
          type="button"
          class={`bb-field bb-date${open === 'out' ? ' is-active' : ''}`}
          aria-expanded={open !== null}
          aria-controls={popId}
          onClick={(e) => (open === 'out' ? close() : show('out', e.currentTarget))}
        >
          <span class="bb-label">Check-out</span>
          <span class={`bb-value${checkout ? '' : ' is-empty'}`}>{checkout ? fmtShort(checkout) : 'Add date'}</span>
        </button>
        <div class="bb-field bb-select">
          <label class="bb-label" for={`${id}-adults`}>
            Adults
          </label>
          <select id={`${id}-adults`} name="adults" value={adults} onChange={(e) => setAdults(Number(e.currentTarget.value))}>
            {adultOptions.map((n) => (
              <option value={n} key={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div class="bb-field bb-select">
          <label class="bb-label" for={`${id}-children`}>
            Children
          </label>
          <select
            id={`${id}-children`}
            name="children"
            value={children}
            aria-describedby={`${id}-children-hint`}
            onChange={(e) => setChildren(Number(e.currentTarget.value))}
          >
            {childOptions.map((n) => (
              <option value={n} key={n}>
                {n}
              </option>
            ))}
          </select>
          <span class="visually-hidden" id={`${id}-children-hint`}>
            Ages 2 to 11. Babies under 2 stay free.
          </span>
        </div>
        <button class="btn bb-submit" type="submit">
          {submitLabel}
        </button>
      </div>

      {open && (
        <div class="bb-pop" id={popId} role="group" aria-label={open === 'in' ? 'Choose your check-in date' : 'Choose your check-out date'}>
          <div class="bb-pop-head">
            <p class="bb-pop-title" aria-live="polite">
              {open === 'in' ? 'Select check-in' : 'Select check-out'}
            </p>
            <div class="bb-pop-nav">
              <button
                type="button"
                class="bb-month"
                aria-label="Previous month"
                disabled={monthStart <= firstOfMonth(min)}
                onClick={() => setMonthStart(addMonths(monthStart, -1))}
              >
                <span aria-hidden="true">←</span>
              </button>
              <button
                type="button"
                class="bb-month"
                aria-label="Next month"
                disabled={addMonths(monthStart, visible - 1) >= firstOfMonth(max)}
                onClick={() => setMonthStart(addMonths(monthStart, 1))}
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
          <RangeCalendar
            months={months}
            start={checkin}
            end={checkout}
            focusDate={focusDate}
            onFocusDate={moveFocus}
            min={min}
            max={max}
            dayInfo={dayInfo}
            canEnd={canEnd}
            onSelect={onSelect}
            variant="price"
            idPrefix={`${id}-cal`}
          />
          <div class="bb-pop-foot">
            <p class="bb-pop-sum">
              {checkin && checkout
                ? `${fmtShort(checkin)} to ${fmtShort(checkout)}, ${plural(nights, 'night')}`
                : room
                  ? 'Nightly rate before taxes, breakfast included'
                  : 'Lowest nightly rate before taxes, breakfast included'}
            </p>
            <div class="bb-pop-actions">
              {checkin && (
                <button
                  type="button"
                  class="bb-text"
                  onClick={() => {
                    setCheckin(undefined);
                    setCheckout(undefined);
                    setOpen('in');
                  }}
                >
                  Clear
                </button>
              )}
              <button type="button" class="bb-text" onClick={() => close()}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
