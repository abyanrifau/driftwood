/** @jsxImportSource preact */
import { useEffect, useMemo, useState } from 'preact/hooks';
import type { Confirmed } from './store';
import { icsFor } from './ics';
import { guestsLabel } from './Summary';
import { roomBySlug } from '../../../data/rooms';
import { experienceBySlug } from '../../../data/experiences';
import { transferById } from '../../../data/transfers';
import { site, whatsappLink } from '../../../data/site';
import { addDays, diffDays, fmtDate, fmtLong, fmtShort } from '../../../lib/dates';
import { money, plural } from '../../../lib/format';

interface Props {
  booking: Confirmed;
  onNew: () => void;
}

const duration = (s: number) => {
  if (s < 90) return `${s} ${s === 1 ? 'second' : 'seconds'}`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m} ${m === 1 ? 'minute' : 'minutes'}${r ? ` ${r} ${r === 1 ? 'second' : 'seconds'}` : ''}`;
};

export default function Confirmation({ booking, onNew }: Props) {
  const { state, details, ref } = booking;
  const room = roomBySlug(state.room)!;
  const nights = diffDays(state.checkin!, state.checkout!);
  const transfer = state.transfer !== 'none' ? transferById(state.transfer) : undefined;
  const [icsUrl, setIcsUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(new Blob([icsFor(booking)], { type: 'text/calendar;charset=utf-8' }));
    setIcsUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [booking.ref]);

  const wa = useMemo(
    () =>
      whatsappLink(
        `Hi Driftwood, this is ${details.firstName}. My booking reference is ${ref}: ${room.name}, ${fmtShort(state.checkin!)} to ${fmtShort(
          state.checkout!,
        )}.`,
      ),
    [ref],
  );

  return (
    <section class="bk-step bk-done" aria-labelledby="bk-step-title">
      <div class="bk-done-head">
        <p class="eyebrow">Booking confirmed</p>
        <h2 id="bk-step-title" class="bk-done-title" tabIndex={-1}>
          Thank you, {details.firstName}. Your stay is booked.
        </h2>
        <p class="bk-ref">
          Your reference <strong class="tnum">{ref}</strong>
        </p>
        {booking.seconds !== null && <p class="bk-speed">Dates to confirmed in {duration(booking.seconds)}.</p>}
      </div>

      <p class="demo-note">
        <span>{site.concept.demoNote} Nothing was sent anywhere.</span>
      </p>

      <div class="bk-done-actions">
        {icsUrl && (
          <a class="btn btn--large" href={icsUrl} download={`driftwood-${ref}.ics`}>
            Add to calendar
          </a>
        )}
        <a class="btn btn--large btn--secondary" href={wa}>
          Contact us on WhatsApp
        </a>
      </div>

      <dl class="bk-done-list">
        <div>
          <dt>Room</dt>
          <dd>{room.name}</dd>
        </div>
        <div>
          <dt>Check-in</dt>
          <dd>
            {fmtLong(state.checkin!)}, from {site.policies.checkInLabel}
          </dd>
        </div>
        <div>
          <dt>Check-out</dt>
          <dd>
            {fmtLong(state.checkout!)}, by {site.policies.checkOutLabel} (free late checkout if the room is free)
          </dd>
        </div>
        <div>
          <dt>Stay</dt>
          <dd>
            {plural(nights, 'night')}, {guestsLabel(state)}, breakfast included
          </dd>
        </div>
        {state.experiences.length > 0 && (
          <div>
            <dt>Experiences</dt>
            <dd>
              <ul role="list">
                {state.experiences.map((e) => {
                  const exp = experienceBySlug(e.slug)!;
                  return (
                    <li key={e.slug}>
                      {exp.name}, {plural(e.people, 'person', 'people')}
                      {e.day ? `, ${fmtShort(e.day)}` : ''}
                    </li>
                  );
                })}
              </ul>
            </dd>
          </div>
        )}
        <div>
          <dt>Transfer</dt>
          <dd>{transfer ? `${transfer.name}, return. We’ll confirm the boat time on WhatsApp.` : 'None booked. We’ll meet you at the jetty.'}</dd>
        </div>
        <div>
          <dt>Guest</dt>
          <dd>
            {details.firstName} {details.lastName}, {details.email}, {details.whatsapp}
          </dd>
        </div>
        <div>
          <dt>Total</dt>
          <dd>
            <strong class="tnum">{money(booking.total)}</strong>, paid at the guesthouse. Free cancellation until{' '}
            {fmtDate(addDays(state.checkin!, -site.policies.cancellationDays))}.
          </dd>
        </div>
      </dl>

      <div class="bk-done-foot">
        <button type="button" class="btn btn--secondary" onClick={onNew}>
          Start another booking
        </button>
        <a class="link-arrow" href="/">
          Back to the home page
        </a>
      </div>
    </section>
  );
}
