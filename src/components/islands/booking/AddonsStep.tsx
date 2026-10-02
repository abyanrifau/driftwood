/** @jsxImportSource preact */
import Stepper from '../Stepper';
import StepHeading from './StepHeading';
import { experiences, type ExperienceSlug } from '../../../data/experiences';
import { transfers, transfersNote, transferReturnPrice } from '../../../data/transfers';
import { roomBySlug } from '../../../data/rooms';
import {
  defaultExperienceDay,
  guestsOf,
  type BookingState,
  type ExperienceChoice,
  type TransferChoice,
} from '../../../lib/booking';
import { addDays, diffDays, fmtShort } from '../../../lib/dates';
import { money, plural } from '../../../lib/format';

interface Props {
  state: BookingState;
  onChange: (patch: Partial<BookingState>) => void;
  onContinue: () => void;
  onSkip: () => void;
  onChangeRoom: () => void;
}

export default function AddonsStep({ state, onChange, onContinue, onSkip, onChangeRoom }: Props) {
  const guests = guestsOf(state);
  const room = roomBySlug(state.room)!;
  const nights = diffDays(state.checkin!, state.checkout!);
  const days = Array.from({ length: Math.max(1, nights) }, (_, i) => addDays(state.checkin!, i));
  const chosen = (slug: ExperienceSlug) => state.experiences.find((e) => e.slug === slug);

  const setExp = (slug: ExperienceSlug, patch: Partial<ExperienceChoice> | null) => {
    const others = state.experiences.filter((e) => e.slug !== slug);
    if (patch === null) return onChange({ experiences: others });
    const cur = chosen(slug) ?? { slug, people: guests, day: defaultExperienceDay(state) };
    const next = { ...cur, ...patch };
    // Keep the order of the list stable
    const order = experiences.map((e) => e.slug);
    onChange({ experiences: [...others, next].sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug)) });
  };

  const bookable = transfers.filter((t) => t.bookable);
  const hasAddons = state.experiences.length > 0 || state.transfer !== 'none';

  return (
    <section class="bk-step" aria-labelledby="bk-step-title">
      <StepHeading index={3} title="Add to your stay">
        <p class="bk-step-meta">
          Optional. <strong>{room.name}</strong>, {plural(nights, 'night')}.{' '}
          <button type="button" class="link-btn" onClick={onChangeRoom}>
            Change room
          </button>
        </p>
        <button type="button" class="btn btn--secondary bk-skip" onClick={onSkip}>
          Skip this step
        </button>
      </StepHeading>

      <fieldset class="bk-group">
        <legend class="bk-sub">Experiences, priced per person</legend>
        <ul role="list" class="bk-exps">
          {experiences.map((e) => {
            const c = chosen(e.slug);
            const id = `bk-exp-${e.slug}`;
            return (
              <li key={e.slug} class={`bk-exp${c ? ' is-on' : ''}`}>
                <label class="bk-exp-main" for={id}>
                  <input
                    id={id}
                    type="checkbox"
                    class="bk-check"
                    checked={!!c}
                    onChange={(ev) =>
                      setExp(e.slug, (ev.currentTarget as HTMLInputElement).checked ? {} : null)
                    }
                  />
                  <span class="bk-exp-text">
                    <span class="bk-exp-name">{e.name}</span>
                    <span class="bk-exp-line">
                      {e.duration} · {e.time.replace('Daily, ', '').replace('Daily except Friday, ', 'Not Fridays, ')}
                    </span>
                  </span>
                  <span class="bk-exp-price tnum">
                    {money(e.price)}
                    <span>per person</span>
                  </span>
                </label>
                {c && (
                  <div class="bk-exp-opts">
                    <Stepper
                      id={`${id}-people`}
                      label="People"
                      value={c.people}
                      min={1}
                      max={guests}
                      noun="person"
                      compact
                      onChange={(n) => setExp(e.slug, { people: n })}
                    />
                    <div class="field bk-exp-day">
                      <label for={`${id}-day`}>Preferred day</label>
                      <select
                        id={`${id}-day`}
                        class="input"
                        value={c.day ?? ''}
                        onChange={(ev) => setExp(e.slug, { day: (ev.currentTarget as HTMLSelectElement).value || undefined })}
                      >
                        <option value="">Any day, we’ll suggest one</option>
                        {days.map((d) => (
                          <option value={d} key={d}>
                            {fmtShort(d)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p class="bk-exp-sub tnum">
                      {c.people} × {money(e.price)} = <strong>{money(c.people * e.price)}</strong>
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </fieldset>

      <fieldset class="bk-group">
        <legend class="bk-sub">Airport transfer, there and back</legend>
        <div class="bk-transfers">
          <label class={`bk-radio${state.transfer === 'none' ? ' is-on' : ''}`}>
            <input
              type="radio"
              name="bk-transfer"
              value="none"
              checked={state.transfer === 'none'}
              onChange={() => onChange({ transfer: 'none' })}
            />
            <span class="bk-radio-text">
              <span class="bk-radio-name">No transfer</span>
              <span class="bk-radio-line">I’ll make my own way, or take the public ferry</span>
            </span>
          </label>
          {bookable.map((t) => (
            <label class={`bk-radio${state.transfer === t.id ? ' is-on' : ''}`} key={t.id}>
              <input
                type="radio"
                name="bk-transfer"
                value={t.id}
                checked={state.transfer === t.id}
                onChange={() => onChange({ transfer: t.id as TransferChoice })}
              />
              <span class="bk-radio-text">
                <span class="bk-radio-name">{t.name}</span>
                <span class="bk-radio-line">
                  {t.crossing} · {t.schedule}
                </span>
              </span>
              <span class="bk-radio-price tnum">
                {money(transferReturnPrice(t, guests))}
                <span>{t.priceBasis === 'person' ? `${guests} × ${money(t.oneWay * 2)}` : 'per boat'}</span>
              </span>
            </label>
          ))}
        </div>
        <p class="bk-note">{transfersNote}</p>
      </fieldset>

      <div class="bk-actions bk-desktop-only">
        <button type="button" class="btn btn--large" onClick={onContinue}>
          {hasAddons ? 'Continue to your details' : 'Continue without add-ons'}
        </button>
      </div>
    </section>
  );
}
