/** @jsxImportSource preact */
import AnimatedNumber from '../AnimatedNumber';
import Pic from '../Pic';
import type { PicData } from '../../../lib/images';
import type { Quote } from '../../../lib/pricing';
import { guestsOf, type BookingState, type Step } from '../../../lib/booking';
import { roomBySlug, lowestPrice } from '../../../data/rooms';
import { fees } from '../../../data/fees';
import { site } from '../../../data/site';
import { addDays, diffDays, fmtDate, fmtShort } from '../../../lib/dates';
import { money, plural } from '../../../lib/format';

interface Props {
  state: BookingState;
  quote: Quote | null;
  roomPics: Record<string, PicData>;
  step: Step;
  onEdit: (step: Step) => void;
  idPrefix: string;
}

export const guestsLabel = (s: Pick<BookingState, 'adults' | 'children'>) =>
  [plural(s.adults, 'adult'), s.children ? plural(s.children, 'child', 'children') : ''].filter(Boolean).join(', ');

/** The itemised live quote, used in the desktop panel and the mobile sheet. */
export default function Summary({ state, quote, roomPics, step, onEdit, idPrefix }: Props) {
  const room = roomBySlug(state.room);
  const nights = state.checkin && state.checkout ? diffDays(state.checkin, state.checkout) : 0;
  const freeCancelUntil = state.checkin ? addDays(state.checkin, -site.policies.cancellationDays) : undefined;

  return (
    <div class="sum">
      <div class="sum-room">
        {room && roomPics[room.slug] ? <Pic pic={roomPics[room.slug]} alt="" class="sum-thumb" /> : <span class="sum-thumb sum-thumb--empty" aria-hidden="true" />}
        <div>
          <p class="sum-room-name">{room ? room.name : 'Room not chosen yet'}</p>
          {room && step !== 'room' && (
            <button type="button" class="sum-edit" onClick={() => onEdit('room')}>
              Change room
            </button>
          )}
        </div>
      </div>

      <dl class="sum-meta">
        <div>
          <dt>Dates</dt>
          <dd>
            {state.checkin && state.checkout ? (
              <>
                {fmtShort(state.checkin)} to {fmtShort(state.checkout)}, {state.checkout.slice(0, 4)}
                <span class="sum-sub">{plural(nights, 'night')}</span>
              </>
            ) : (
              'Not chosen yet'
            )}
          </dd>
        </div>
        <div>
          <dt>Guests</dt>
          <dd>{guestsLabel(state)}</dd>
        </div>
      </dl>
      {step !== 'dates' && (
        <button type="button" class="sum-edit" onClick={() => onEdit('dates')}>
          Change dates or guests
        </button>
      )}

      {quote ? (
        <>
          <table class="sum-lines" aria-labelledby={`${idPrefix}-quote-title`}>
            <caption id={`${idPrefix}-quote-title`} class="visually-hidden">
              Price breakdown in US dollars
            </caption>
            <tbody>
              {quote.lines.map((l) => (
                <tr key={l.id} class={`sum-line sum-line--${l.kind}`}>
                  <th scope="row">
                    {l.label}
                    {l.detail && <span class="sum-sub">{l.detail}</span>}
                  </th>
                  <td class="tnum">{money(l.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr class="sum-total">
                <th scope="row">Total (USD)</th>
                <td>
                  <AnimatedNumber value={quote.total} />
                </td>
              </tr>
            </tfoot>
          </table>
          <p class="sum-fine">{fees.note} Pay at the guesthouse; nothing is charged today.</p>
        </>
      ) : (
        <p class="sum-empty">
          {state.checkin && state.checkout
            ? 'Choose a room to see your total, with every tax and fee itemised.'
            : `Rooms from $${lowestPrice} a night. Choose dates to see the rate for each night.`}
        </p>
      )}

      <ul role="list" class="sum-perks">
        <li>Breakfast included for {guestsOf(state) === 1 ? 'you' : `all ${guestsOf(state)} of you`}</li>
        <li>{freeCancelUntil ? `Free cancellation until ${fmtDate(freeCancelUntil)}` : site.policies.cancellation}</li>
        <li>Late checkout until 3pm, when available</li>
      </ul>
    </div>
  );
}
