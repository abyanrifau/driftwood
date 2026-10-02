/** @jsxImportSource preact */
import { useEffect, useMemo, useState } from 'preact/hooks';
import RangeCalendar, { type DayInfo } from '../RangeCalendar';
import Stepper from '../Stepper';
import StepHeading from './StepHeading';
import { rooms, roomBySlug } from '../../../data/rooms';
import { seasons } from '../../../data/seasons';
import { availabilityConfig } from '../../../data/availability';
import { childAgeNote } from '../../../data/fees';
import { isNightFree, isStayFree } from '../../../lib/availability';
import { rateFor, seasonFor } from '../../../lib/pricing';
import {
  datesValid,
  firstBookableDate,
  guestsOf,
  lastBookableDate,
  MAX_GUESTS,
  type BookingState,
} from '../../../lib/booking';
import { addDays, addMonths, diffDays, firstOfMonth, fmtShort, type ISODate } from '../../../lib/dates';
import { money, plural } from '../../../lib/format';

interface Props {
  state: BookingState;
  today: ISODate;
  onChange: (patch: Partial<BookingState>) => void;
  onContinue: () => void;
}

const useMonthsVisible = () => {
  const [n, setN] = useState(1);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 760px)');
    const set = () => setN(mq.matches ? 2 : 1);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);
  return n;
};

const legend = [...seasons].sort((a, b) => a.tier - b.tier);

export default function DatesStep({ state, today, onChange, onContinue }: Props) {
  const min = firstBookableDate(today);
  const max = lastBookableDate(today);
  const guests = guestsOf(state);
  const chosenRoom = roomBySlug(state.room);
  const roomFilter = chosenRoom && chosenRoom.maxGuests >= guests ? chosenRoom : undefined;
  const candidates = useMemo(
    () => rooms.filter((r) => r.maxGuests >= guests && (!roomFilter || r.slug === roomFilter.slug)),
    [guests, roomFilter?.slug],
  );

  const visible = useMonthsVisible();
  const [focusDate, setFocusDate] = useState<ISODate>(state.checkin && state.checkin >= min ? state.checkin : min);
  const [monthStart, setMonthStart] = useState<ISODate>(firstOfMonth(focusDate));
  const months = Array.from({ length: visible }, (_, i) => addMonths(monthStart, i));
  const firstMonth = firstOfMonth(min);
  const lastMonth = firstOfMonth(max);

  const moveFocus = (d: ISODate) => {
    setFocusDate(d);
    const m = firstOfMonth(d);
    const lastVisible = addMonths(monthStart, visible - 1);
    if (m < monthStart) setMonthStart(m);
    else if (m > lastVisible) setMonthStart(addMonths(m, -(visible - 1)));
  };

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
      describe: inWindow
        ? price
          ? `${roomFilter ? '' : 'from '}${money(price)} a night, ${season.label}`
          : `sold out${roomFilter ? ` for the ${roomFilter.name}` : ''}`
        : '',
    };
  };

  const canEnd = (s: ISODate, d: ISODate) =>
    d > s &&
    d <= addDays(max, 1) &&
    diffDays(s, d) <= availabilityConfig.maxNights &&
    candidates.some((r) => isStayFree(r.slug, s, d));

  const nights = state.checkin && state.checkout ? diffDays(state.checkin, state.checkout) : 0;
  const ok = datesValid(state, today);

  const setGuests = (adults: number, children: number) => onChange({ adults, children });

  return (
    <section class="bk-step" aria-labelledby="bk-step-title">
      <StepHeading index={1} title="Dates and guests" />

      <div class="bk-cal-head">
        <p class="bk-cal-for">
          {roomFilter ? (
            <>
              Prices for the <strong>{roomFilter.name}</strong>.{' '}
              <button type="button" class="link-btn" onClick={() => onChange({ room: undefined })}>
                Show all rooms
              </button>
            </>
          ) : (
            <>Lowest nightly price for rooms that fit {plural(guests, 'guest')}, before taxes.</>
          )}
        </p>
        <div class="bk-cal-nav">
          <button
            type="button"
            class="bk-month-btn"
            aria-label="Previous month"
            disabled={monthStart <= firstMonth}
            onClick={() => setMonthStart(addMonths(monthStart, -1))}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            class="bk-month-btn"
            aria-label="Next month"
            disabled={addMonths(monthStart, visible - 1) >= lastMonth}
            onClick={() => setMonthStart(addMonths(monthStart, 1))}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <div class="bk-cal">
        <RangeCalendar
          months={months}
          start={state.checkin}
          end={state.checkout}
          focusDate={focusDate}
          onFocusDate={moveFocus}
          min={min}
          max={max}
          dayInfo={dayInfo}
          canEnd={canEnd}
          onSelect={(s, e) => onChange({ checkin: s, checkout: e })}
          variant="price"
          idPrefix="bk-cal"
        />
      </div>

      <ul role="list" class="cal-legend bk-legend" aria-label="Season colours">
        {legend.map((s) => (
          <li class={`s${s.tier}`} key={s.id}>
            <span class="swatch swatch--tint" aria-hidden="true" />
            {s.label}
          </li>
        ))}
        <li>
          <span class="swatch swatch--soldout" aria-hidden="true" />
          Sold out
        </li>
      </ul>

      <p class="bk-selection" aria-live="polite">
        {state.checkin && state.checkout ? (
          <>
            <strong>
              {fmtShort(state.checkin)} to {fmtShort(state.checkout)}
            </strong>{' '}
            · {plural(nights, 'night')}
          </>
        ) : state.checkin ? (
          <>
            <strong>Check-in {fmtShort(state.checkin)}.</strong> Now choose your check-out day.
          </>
        ) : (
          <>Choose your check-in day, then your check-out day.</>
        )}
      </p>

      <div class="bk-guests">
        <h3 class="bk-sub">Who’s coming</h3>
        <Stepper
          id="bk-adults"
          label="Adults"
          value={state.adults}
          min={1}
          max={MAX_GUESTS - state.children}
          noun="adult"
          onChange={(n) => setGuests(n, state.children)}
        />
        <Stepper
          id="bk-children"
          label="Children"
          hint={childAgeNote}
          value={state.children}
          min={0}
          max={MAX_GUESTS - state.adults}
          noun="child"
          onChange={(n) => setGuests(state.adults, n)}
        />
        <p class="bk-note">
          Rooms sleep up to {MAX_GUESTS}. For bigger groups, book two rooms or message us and we’ll hold them together.
          {chosenRoom && chosenRoom.maxGuests < guests && (
            <>
              {' '}
              The {chosenRoom.name} sleeps {chosenRoom.maxGuests}, so we’ll show rooms that fit.
            </>
          )}
        </p>
      </div>

      <div class="bk-actions bk-desktop-only">
        <button type="button" class="btn btn--large" aria-disabled={!ok} onClick={() => ok && onContinue()}>
          {ok ? `Continue with ${plural(nights, 'night')}` : 'Choose your dates to continue'}
        </button>
      </div>
    </section>
  );
}
