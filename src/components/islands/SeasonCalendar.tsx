/** @jsxImportSource preact */
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import './calendar.css';
import './season-calendar.css';
import RangeCalendar, { type DayInfo } from './RangeCalendar';
import { rooms, type RoomSlug } from '../../data/rooms';
import { seasons } from '../../data/seasons';
import { availabilityConfig } from '../../data/availability';
import { addDays, addMonths, diffDays, firstOfMonth, fmtDate, fmtRange, localToday, nightsOf, type ISODate } from '../../lib/dates';
import { rateFor, seasonFor, stayTotal } from '../../lib/pricing';
import { isNightFree, isStayFree } from '../../lib/availability';
import { bookUrl } from '../../lib/booking';
import { money, plural } from '../../lib/format';
import { markBookingStart } from '../../lib/timer';

interface Props {
  /** Build-time "today", so the server render and hydration match */
  today: ISODate;
  initialRoom?: RoomSlug;
}

const legend = [...seasons].sort((a, b) => a.tier - b.tier);

/**
 * Twelve months, each day coloured by its relative price. Pick a room type,
 * pick a range, and go straight to the booking flow with both filled in.
 */
export default function SeasonCalendar({ today: buildToday, initialRoom = 'reef-view-room' }: Props) {
  const [today, setToday] = useState(buildToday);
  // The toggle updates at once; the 365-day grid follows a frame later, so
  // the tap paints immediately (keeps interaction latency low on phones).
  const [roomSlug, setRoomSlug] = useState<RoomSlug>(initialRoom);
  const [calRoomSlug, setCalRoomSlug] = useState<RoomSlug>(initialRoom);
  const [start, setStart] = useState<ISODate | undefined>();
  const [end, setEnd] = useState<ISODate | undefined>();
  const [focusDate, setFocusDate] = useState(addDays(buildToday, 1));
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = localToday();
    if (t !== buildToday) {
      setToday(t);
      setFocusDate(addDays(t, 1));
    }
  }, []);

  const room = rooms.find((r) => r.slug === calRoomSlug)!;
  const min = addDays(today, 1);
  const max = addDays(today, availabilityConfig.horizonDays);
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => addMonths(firstOfMonth(today), i)), [today]);
  const lastShown = addDays(addMonths(months[11], 1), -1);

  const dayInfo = (d: ISODate): DayInfo => {
    const season = seasonFor(d);
    const price = rateFor(room.fromPrice, d);
    const free = isNightFree(room.slug, d);
    const inWindow = d >= min && d <= max;
    return {
      selectable: inWindow && free,
      tier: season.tier,
      price,
      soldOut: inWindow && !free,
      describe: inWindow ? `${money(price)} a night, ${season.label}${free ? '' : ', sold out'}` : '',
    };
  };

  const canEnd = (s: ISODate, d: ISODate) =>
    d > s && diffDays(s, d) <= availabilityConfig.maxNights && d <= addDays(max, 1) && isStayFree(room.slug, s, d);

  // Plain-language summary, computed from the same data the grid uses.
  const summary = useMemo(() => {
    const low = seasons.find((s) => s.id === 'low')!;
    const peak = seasons.find((s) => s.id === 'peak')!;
    const days = nightsOf(min, lastShown);
    const peakSoldOut = days.filter((d) => seasonFor(d).id === 'peak' && !isNightFree(room.slug, d)).length;
    const peakDays = days.filter((d) => seasonFor(d).id === 'peak').length;
    return {
      cheap: `Lowest rates: May to October, from ${money(Math.round(room.fromPrice * low.multiplier))} a night for the ${room.name}.`,
      busy: `Highest rates: 20 December to 10 January, from ${money(Math.round(room.fromPrice * peak.multiplier))} a night.${
        peakDays ? ` ${peakSoldOut} of those ${peakDays} nights are already sold out for this room.` : ''
      }`,
    };
  }, [calRoomSlug, today]);

  const onSelect = (s?: ISODate, e?: ISODate) => {
    markBookingStart();
    setStart(s);
    setEnd(e);
  };

  const changeRoom = (slug: RoomSlug) => {
    markBookingStart();
    setRoomSlug(slug);
    requestAnimationFrame(() =>
      setTimeout(() => {
        setCalRoomSlug(slug);
        const r = rooms.find((x) => x.slug === slug)!;
        if (start && end && !isStayFree(r.slug, start, end)) {
          setStart(undefined);
          setEnd(undefined);
        }
      }),
    );
  };

  const scrollMonths = (dir: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' });
  };

  const total = start && end ? stayTotal(room, start, end) : 0;
  const nights = start && end ? diffDays(start, end) : 0;

  return (
    <div class="sc" data-booking-start>
      <div class="sc-summary">
        <p>{summary.cheap}</p>
        <p>{summary.busy}</p>
      </div>

      <div class="sc-controls">
        <fieldset class="sc-rooms">
          <legend class="sc-legend-title">Show prices for</legend>
          <div class="seg">
            {rooms.map((r) => (
              <label class={`seg-option${r.slug === roomSlug ? ' is-on' : ''}`} key={r.slug}>
                <input
                  type="radio"
                  name="sc-room"
                  value={r.slug}
                  checked={r.slug === roomSlug}
                  onChange={() => changeRoom(r.slug)}
                />
                <span>{r.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <ul class="cal-legend" aria-label="Price scale, cheapest to busiest">
          {legend.map((s) => (
            <li class={`s${s.tier}`} key={s.id}>
              <span class="swatch" aria-hidden="true" />
              {s.label} · {money(Math.round(room.fromPrice * s.multiplier))}
            </li>
          ))}
          <li>
            <span class="swatch swatch--soldout" aria-hidden="true" />
            Sold out
          </li>
        </ul>
      </div>

      <div class="sc-scroll-nav" aria-hidden="true">
        <button type="button" class="sc-arrow" tabIndex={-1} onClick={() => scrollMonths(-1)}>
          ←
        </button>
        <span>Swipe for more months</span>
        <button type="button" class="sc-arrow" tabIndex={-1} onClick={() => scrollMonths(1)}>
          →
        </button>
      </div>

      <div class="sc-months" ref={scroller}>
        <RangeCalendar
          months={months}
          start={start}
          end={end}
          focusDate={focusDate}
          onFocusDate={setFocusDate}
          min={min}
          max={lastShown < max ? lastShown : max}
          dayInfo={dayInfo}
          canEnd={canEnd}
          onSelect={onSelect}
          variant="heat"
          idPrefix="sc"
        />
      </div>

      <div class="sc-result" aria-live="polite">
        {start && end ? (
          <>
            <p class="sc-result-text">
              <strong>{fmtRange(start, end)}</strong>
              <span>
                {plural(nights, 'night')} in the {room.name} · {money(total)} before taxes
              </span>
            </p>
            <div class="sc-result-actions">
              <a class="btn" href={bookUrl({ checkin: start, checkout: end, room: room.slug })} data-astro-reload data-booking-start>
                Book now
              </a>
              <button type="button" class="btn btn--secondary btn--small" onClick={() => onSelect(undefined, undefined)}>
                Clear dates
              </button>
            </div>
          </>
        ) : start ? (
          <p class="sc-result-text">
            <strong>Check-in {fmtDate(start)}</strong> <span>Choose your check-out date.</span>
          </p>
        ) : (
          <p class="sc-result-text">
            <span>Choose a check-in date, then a check-out date. Booking opens with both filled in.</span>
          </p>
        )}
      </div>
    </div>
  );
}
