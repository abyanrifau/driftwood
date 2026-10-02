/** @jsxImportSource preact */
import Pic from '../Pic';
import StepHeading from './StepHeading';
import type { PicData } from '../../../lib/images';
import { rooms, roomBySlug, type RoomSlug } from '../../../data/rooms';
import { whatsappLink } from '../../../data/site';
import { isStayFree } from '../../../lib/availability';
import { stayBreakdown } from '../../../lib/pricing';
import { guestsOf, type BookingState } from '../../../lib/booking';
import { diffDays, fmtRange } from '../../../lib/dates';
import { money, plural } from '../../../lib/format';

interface Props {
  state: BookingState;
  roomPics: Record<string, PicData>;
  notice: string | null;
  onChoose: (slug: RoomSlug) => void;
  onChangeDates: () => void;
}

export default function RoomStep({ state, roomPics, notice, onChoose, onChangeDates }: Props) {
  const checkin = state.checkin!;
  const checkout = state.checkout!;
  const guests = guestsOf(state);
  const nights = diffDays(checkin, checkout);

  const options = rooms.map((r) => {
    const fits = r.maxGuests >= guests;
    const free = isStayFree(r.slug, checkin, checkout);
    const groups = stayBreakdown(r, checkin, checkout);
    const total = groups.reduce((n, g) => n + g.amount, 0);
    return { room: r, fits, free, total, groups };
  });
  const available = options.filter((o) => o.fits && o.free);
  const unavailable = options.filter((o) => !(o.fits && o.free));
  const current = roomBySlug(state.room);

  return (
    <section class="bk-step" aria-labelledby="bk-step-title">
      <StepHeading index={2} title="Choose your room">
        <p class="bk-step-meta">
          {fmtRange(checkin, checkout)} · {plural(nights, 'night')} · {plural(guests, 'guest')}{' '}
          <button type="button" class="link-btn" onClick={onChangeDates}>
            Change
          </button>
        </p>
      </StepHeading>

      {notice && (
        <p class="bk-notice" role="status">
          {notice}
        </p>
      )}

      {available.length ? (
        <ul role="list" class="bk-rooms">
          {available.map(({ room, total, groups }) => (
            <li key={room.slug}>
              <article class={`bk-room${current?.slug === room.slug ? ' is-current' : ''}`}>
                <div class="bk-room-media">{roomPics[room.slug] && <Pic pic={roomPics[room.slug]} alt="" />}</div>
                <div class="bk-room-body">
                  <h3 class="bk-room-name">{room.name}</h3>
                  <p class="bk-room-hl">{room.highlight}</p>
                  <p class="bk-room-facts">
                    {room.bed} bed · Sleeps {room.sleepsLabel} · {room.sizeM2} m²
                  </p>
                  <p class="bk-room-split">
                    {groups.map((g) => `${plural(g.nights, 'night')} at ${money(g.rate)} (${g.season.label})`).join(' + ')}
                  </p>
                </div>
                <div class="bk-room-buy">
                  <p class="bk-room-total">
                    <strong class="tnum">{money(total)}</strong>
                    <span>
                      for {plural(nights, 'night')}, before taxes
                    </span>
                  </p>
                  <button
                    type="button"
                    class="btn btn--block"
                    aria-label={`${current?.slug === room.slug ? 'Keep this room' : 'Choose this room'}: ${room.name}, ${money(total)} for ${plural(nights, 'night')} before taxes`}
                    onClick={() => onChoose(room.slug)}
                  >
                    {current?.slug === room.slug ? 'Keep this room' : 'Choose this room'}
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div class="bk-empty">
          <p>
            <strong>No rooms are available for {fmtRange(checkin, checkout)}.</strong> This is most common over Christmas and New
            Year. Moving your dates by a day or two often helps.
          </p>
          <div class="bk-actions">
            <button type="button" class="btn" onClick={onChangeDates}>
              Change dates
            </button>
            <a class="wa-link" href={whatsappLink(`Hi Driftwood, is anything free around ${fmtRange(checkin, checkout)}?`)}>
              Contact us on WhatsApp
            </a>
          </div>
        </div>
      )}

      {unavailable.length > 0 && (
        <div class="bk-unavailable">
          <h3 class="bk-sub">Not available for these dates</h3>
          <ul role="list">
            {unavailable.map(({ room, fits }) => (
              <li key={room.slug}>
                <strong>{room.name}</strong>: {!fits ? `sleeps ${room.sleepsLabel}` : 'already booked on at least one night'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
