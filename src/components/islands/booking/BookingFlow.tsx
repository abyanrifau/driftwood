/** @jsxImportSource preact */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import '../calendar.css';
import './booking.css';
import DatesStep from './DatesStep';
import RoomStep from './RoomStep';
import AddonsStep from './AddonsStep';
import DetailsStep from './DetailsStep';
import Confirmation from './Confirmation';
import Summary from './Summary';
import AnimatedNumber from '../AnimatedNumber';
import type { PicData } from '../../../lib/images';
import { loadConfirmed, loadSaved, makeRef, save, saveConfirmed, type Confirmed } from './store';
import {
  allowedStep,
  datesValid,
  defaultExperienceDay,
  defaultState,
  emptyDetails,
  furthestStep,
  guestsOf,
  landingStep,
  parseParams,
  roomValid,
  stepIndex,
  STEPS,
  STEP_TITLES,
  toParams,
  type BookingState,
  type GuestDetails,
  type Step,
} from '../../../lib/booking';
import { roomBySlug, lowestPrice, type RoomSlug } from '../../../data/rooms';
import { buildQuote, stayTotal } from '../../../lib/pricing';
import { availableRooms } from '../../../lib/availability';
import { diffDays, localToday } from '../../../lib/dates';
import { money, plural } from '../../../lib/format';
import { clearBookingStart, markBookingStart, readBookingStart } from '../../../lib/timer';

interface Props {
  roomPics: Record<string, PicData>;
}

interface Init {
  state: BookingState;
  step: Step;
  details: GuestDetails;
  confirmed: Confirmed | null;
  notice: string | null;
}

/** Keep experiences valid when dates or guests change. */
const normalise = (s: BookingState): BookingState => {
  const guests = guestsOf(s);
  const inStay = (d?: string) => !!d && !!s.checkin && !!s.checkout && d >= s.checkin && d < s.checkout;
  return {
    ...s,
    experiences: s.experiences.map((e) => ({
      ...e,
      people: Math.min(Math.max(1, e.people), guests),
      day: inStay(e.day) ? e.day : defaultExperienceDay(s),
    })),
  };
};

const roomNotice = (s: BookingState): string | null => {
  const room = roomBySlug(s.room);
  if (!room || !s.checkin || !s.checkout) return null;
  if (room.maxGuests < guestsOf(s)) return `The ${room.name} sleeps ${room.sleepsLabel}. These rooms fit ${plural(guestsOf(s), 'guest')}.`;
  if (!roomValid(s)) return `The ${room.name} is already booked on at least one of those nights. These rooms are free.`;
  return null;
};

const urlFor = (s: BookingState, step: Step, ref?: string) => {
  const q = toParams(s, step, ref).toString();
  return `${location.pathname}${q ? `?${q}` : ''}`;
};

function init(today: string): Init {
  const parsed = parseParams(new URLSearchParams(location.search));
  const saved = loadSaved();
  const confirmed = loadConfirmed();

  if (parsed.step === 'confirmed' && parsed.ref && confirmed?.ref === parsed.ref) {
    return { state: confirmed.state, step: 'confirmed', details: confirmed.details, confirmed, notice: null };
  }

  let state: BookingState;
  let step: Step;
  if (parsed.hasChoices) {
    state = normalise(parsed.state);
    step = parsed.step ? allowedStep(parsed.step, state, today) : landingStep(state, today);
  } else if (saved && saved.step !== 'confirmed') {
    state = normalise(saved.state);
    step = allowedStep(saved.step, state, today);
  } else {
    state = defaultState();
    step = 'dates';
  }
  // A link from a room or experience counts as a preselection, not progress:
  // keep the details someone already typed in this tab.
  const details = saved?.details ?? emptyDetails;
  return { state, step, details, confirmed: null, notice: step === 'room' ? roomNotice(state) : null };
}

const useDesktop = () => {
  const [desktop, setDesktop] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const set = () => setDesktop(mq.matches);
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);
  return desktop;
};

export default function BookingFlow({ roomPics }: Props) {
  const today = useMemo(localToday, []);
  const first = useMemo(() => init(today), []);
  const [state, setState] = useState<BookingState>(first.state);
  const [step, setStep] = useState<Step>(first.step);
  const [details, setDetails] = useState<GuestDetails>(first.details);
  const [confirmed, setConfirmed] = useState<Confirmed | null>(first.confirmed);
  const [notice, setNotice] = useState<string | null>(first.notice);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [live, setLive] = useState('');
  const focusNext = useRef(false);
  const desktop = useDesktop();
  const root = useRef<HTMLDivElement>(null);

  // Put the resolved step in the URL without adding a history entry.
  useEffect(() => {
    history.replaceState(null, '', urlFor(first.state, first.step, first.confirmed?.ref));
  }, []);

  // Mirror to sessionStorage on every change. A layout effect runs right
  // after each render, so even a refresh straight after typing keeps it.
  const latest = useRef({ state, step, details });
  latest.current = { state, step, details };
  useLayoutEffect(() => {
    save(step === 'confirmed' ? null : { state, step, details });
  }, [state, step, details]);
  // Last-chance flush when the tab is hidden, closed or navigated away.
  useEffect(() => {
    const flush = () => {
      const l = latest.current;
      if (l.step !== 'confirmed') save(l);
    };
    window.addEventListener('pagehide', flush);
    return () => window.removeEventListener('pagehide', flush);
  }, []);

  // Browser back and forward move between steps.
  useEffect(() => {
    const onPop = () => {
      const parsed = parseParams(new URLSearchParams(location.search));
      if (parsed.step === 'confirmed' && parsed.ref) {
        const c = loadConfirmed();
        if (c?.ref === parsed.ref) {
          setConfirmed(c);
          setState(c.state);
          setStep('confirmed');
          focusNext.current = true;
          return;
        }
      }
      const s = normalise(parsed.state);
      const next = allowedStep(parsed.step ?? 'dates', s, today);
      setState(s);
      setStep(next);
      setNotice(next === 'room' ? roomNotice(s) : null);
      setSheetOpen(false);
      focusNext.current = true;
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [today]);

  // Move focus to the new step's heading, and bring it into view.
  useEffect(() => {
    if (!focusNext.current) return;
    focusNext.current = false;
    const heading = document.getElementById('bk-step-title');
    if (!heading) return;
    heading.focus({ preventScroll: true });
    const top = heading.getBoundingClientRect().top;
    const header = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0;
    if (top < header + 8 || top > window.innerHeight * 0.5) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: window.scrollY + top - header - 24, behavior: reduce ? 'auto' : 'smooth' });
    }
  }, [step]);

  const quote = useMemo(
    () =>
      buildQuote({
        room: roomBySlug(state.room) && roomValid(state) ? roomBySlug(state.room) : undefined,
        checkin: state.checkin,
        checkout: state.checkout,
        adults: state.adults,
        children: state.children,
        experiences: state.experiences,
        transfer: state.transfer,
      }),
    [state],
  );

  // Announce total changes politely, once things settle.
  useEffect(() => {
    if (!quote) return;
    const t = setTimeout(() => setLive(`Total now ${money(quote.total)} for ${plural(quote.nights, 'night')}.`), 700);
    return () => clearTimeout(t);
  }, [quote?.total]);

  const go = (next: Step, s: BookingState = state, ref?: string) => {
    setState(s);
    setStep(next);
    setSheetOpen(false);
    focusNext.current = true;
    history.pushState(null, '', urlFor(s, next, ref));
  };

  const update = (patch: Partial<BookingState>) => {
    const s = normalise({ ...state, ...patch });
    setState(s);
    history.replaceState(null, '', urlFor(s, step));
  };

  const continueFromDates = () => {
    if (!datesValid(state, today)) return;
    const s = normalise(state);
    if (roomValid(s)) {
      setNotice(null);
      go('addons', s);
    } else {
      setNotice(roomNotice(s));
      go('room', s);
    }
  };

  const chooseRoom = (slug: RoomSlug) => {
    setNotice(null);
    go('addons', normalise({ ...state, room: slug }));
  };

  const skipAddons = () => go('details', { ...state, experiences: [], transfer: 'none' });

  const confirm = () => {
    if (!quote || !roomValid(state)) return;
    const t0 = readBookingStart();
    const booking: Confirmed = {
      ref: makeRef(),
      state,
      details,
      total: quote.total,
      seconds: t0 ? Math.max(1, Math.round((Date.now() - t0) / 1000)) : null,
      createdAt: Date.now(),
    };
    saveConfirmed(booking);
    clearBookingStart();
    setConfirmed(booking);
    go('confirmed', state, booking.ref);
  };

  const startOver = () => {
    save(null);
    saveConfirmed(null);
    setConfirmed(null);
    setDetails(emptyDetails);
    setNotice(null);
    markBookingStart();
    go('dates', defaultState());
  };

  const furthest = furthestStep(state, today);
  const preRoom = roomBySlug(state.room);
  // With dates but no room yet, show the cheapest real total for those dates.
  const cheapest = useMemo(() => {
    if (quote || !datesValid(state, today)) return null;
    const totals = availableRooms(guestsOf(state), state.checkin!, state.checkout!).map((r) => stayTotal(r, state.checkin!, state.checkout!));
    return totals.length ? { nights: diffDays(state.checkin!, state.checkout!), total: Math.min(...totals) } : null;
  }, [state, quote, today]);
  const primary =
    step === 'dates'
      ? { label: datesValid(state, today) ? 'Continue' : 'Choose dates', disabled: !datesValid(state, today), onClick: continueFromDates }
      : step === 'addons'
        ? { label: state.experiences.length || state.transfer !== 'none' ? 'Continue' : 'Continue, no add-ons', disabled: false, onClick: () => go('details') }
        : null;

  if (step === 'confirmed' && confirmed) {
    return (
      <div class="bk bk--done" ref={root}>
        <Confirmation booking={confirmed} onNew={startOver} />
      </div>
    );
  }

  return (
    <div class="bk" ref={root} data-booking-start>
      <nav class="bk-progress" aria-label="Booking steps">
        <ol role="list">
          {STEPS.map((s, i) => {
            const done = stepIndex(s) < stepIndex(step);
            const reachable = stepIndex(s) <= stepIndex(furthest) && s !== step;
            const label = (
              <>
                <span class="bk-progress-n" aria-hidden="true">
                  {done ? '✓' : i + 1}
                </span>
                <span class="bk-progress-label">{STEP_TITLES[s]}</span>
                {s === 'addons' && <span class="visually-hidden"> (optional)</span>}
              </>
            );
            return (
              <li key={s} class={`${s === step ? 'is-current' : ''}${done ? ' is-done' : ''}`}>
                {reachable ? (
                  <button type="button" onClick={() => go(s)}>
                    {label}
                  </button>
                ) : (
                  <span aria-current={s === step ? 'step' : undefined}>{label}</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div class="bk-layout">
        <div class="bk-main">
          {step === 'dates' && <DatesStep state={state} today={today} onChange={update} onContinue={continueFromDates} />}
          {step === 'room' && (
            <RoomStep state={state} roomPics={roomPics} notice={notice} onChoose={chooseRoom} onChangeDates={() => go('dates')} />
          )}
          {step === 'addons' && (
            <AddonsStep state={state} onChange={update} onContinue={() => go('details')} onSkip={skipAddons} onChangeRoom={() => go('room')} />
          )}
          {step === 'details' && (
            <DetailsStep details={details} total={quote?.total ?? null} onChange={(p) => setDetails((d) => ({ ...d, ...p }))} onConfirm={confirm} />
          )}
        </div>

        {desktop && (
          <aside class="bk-panel" aria-labelledby="bk-panel-title">
            <h2 id="bk-panel-title" class="bk-panel-title">
              Your stay
            </h2>
            <Summary state={state} quote={quote} roomPics={roomPics} step={step} onEdit={(s) => go(s)} idPrefix="panel" />
          </aside>
        )}
      </div>

      {!desktop && (
      <div class={`bk-bar${sheetOpen ? ' is-open' : ''}`}>
        <div id="bk-sheet" class="bk-sheet" hidden={!sheetOpen}>
          {sheetOpen && <Summary state={state} quote={quote} roomPics={roomPics} step={step} onEdit={(s) => go(s)} idPrefix="sheet" />}
        </div>
        <div class="bk-bar-row">
          <button type="button" class="bk-bar-total" aria-expanded={sheetOpen} aria-controls="bk-sheet" onClick={() => setSheetOpen((o) => !o)}>
            <span class="bk-bar-label">
              {quote ? 'Total' : cheapest ? `${plural(cheapest.nights, 'night')} from` : preRoom ? `${preRoom.name} from` : 'Rooms from'}
            </span>
            <strong class="bk-bar-amount">
              {quote ? (
                <AnimatedNumber value={quote.total} />
              ) : (
                <span class="tnum">{money(cheapest?.total ?? preRoom?.fromPrice ?? lowestPrice)}</span>
              )}
            </strong>
            <span class="bk-bar-more">
              {quote ? `${plural(quote.nights, 'night')} · details` : cheapest ? 'before taxes · details' : 'a night · details'}
              <span aria-hidden="true" class="bk-bar-caret" />
            </span>
          </button>
          {primary && (
            <button type="button" class="btn bk-bar-cta" aria-disabled={primary.disabled ? 'true' : undefined} onClick={() => !primary.disabled && primary.onClick()}>
              {primary.label}
            </button>
          )}
        </div>
      </div>
      )}

      <p class="visually-hidden" aria-live="polite">
        {live}
      </p>
    </div>
  );
}
