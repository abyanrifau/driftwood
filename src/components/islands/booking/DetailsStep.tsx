/** @jsxImportSource preact */
import { useRef, useState } from 'preact/hooks';
import StepHeading from './StepHeading';
import AnimatedNumber from '../AnimatedNumber';
import type { GuestDetails } from '../../../lib/booking';
import { site } from '../../../data/site';

interface Props {
  details: GuestDetails;
  total: number | null;
  onChange: (patch: Partial<GuestDetails>) => void;
  onConfirm: () => void;
}

type Field = 'firstName' | 'lastName' | 'email' | 'whatsapp';

const check: Record<Field, (v: string) => string> = {
  firstName: (v) => (v.trim() ? '' : 'Add your first name.'),
  lastName: (v) => (v.trim() ? '' : 'Add your last name.'),
  email: (v) =>
    !v.trim() ? 'Add your email address.' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Check the email address, for example name@example.com.',
  whatsapp: (v) =>
    !v.trim()
      ? 'Add a WhatsApp number so we can reach you on the island.'
      : /^\+?[\d\s()-]{7,20}$/.test(v.trim()) && v.replace(/\D/g, '').length >= 7
        ? ''
        : 'Check the number, with country code, for example +44 7700 900123.',
};

const arrivalOptions = [
  ['', 'Not sure yet'],
  ['morning', 'Morning, before 12pm'],
  ['afternoon', 'Afternoon, 12pm to 5pm'],
  ['evening', 'Evening, 5pm to 9pm'],
  ['late', 'Late, after 9pm'],
] as const;

export default function DetailsStep({ details, total, onChange, onConfirm }: Props) {
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  const errors = Object.fromEntries((Object.keys(check) as Field[]).map((f) => [f, check[f](details[f])])) as Record<Field, string>;
  const show = (f: Field) => (touched[f] || submitted) && errors[f];

  const submit = (e: Event) => {
    e.preventDefault();
    setSubmitted(true);
    const firstBad = (Object.keys(check) as Field[]).find((f) => errors[f]);
    if (firstBad) {
      form.current?.querySelector<HTMLInputElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }
    onConfirm();
  };

  const input = (f: Field, label: string, attrs: Record<string, string>) => (
    <div class="field">
      <label for={`bk-${f}`}>{label}</label>
      <input
        id={`bk-${f}`}
        name={f}
        class="input"
        value={details[f]}
        aria-invalid={show(f) ? 'true' : undefined}
        aria-describedby={show(f) ? `bk-${f}-error` : undefined}
        required
        onInput={(ev) => onChange({ [f]: (ev.currentTarget as HTMLInputElement).value })}
        onBlur={() => setTouched((t) => ({ ...t, [f]: true }))}
        {...attrs}
      />
      {show(f) && (
        <p id={`bk-${f}-error`} class="field-error">
          {errors[f]}
        </p>
      )}
    </div>
  );

  return (
    <section class="bk-step" aria-labelledby="bk-step-title">
      <StepHeading index={4} title="Your details">
        <p class="bk-step-meta">Four fields. We use them only to confirm your stay.</p>
      </StepHeading>

      <form id="bk-details-form" class="bk-form" ref={form} onSubmit={submit} noValidate>
        <div class="bk-form-row">
          {input('firstName', 'First name', { type: 'text', autocomplete: 'given-name', autocapitalize: 'words', enterkeyhint: 'next' })}
          {input('lastName', 'Last name', { type: 'text', autocomplete: 'family-name', autocapitalize: 'words', enterkeyhint: 'next' })}
        </div>
        {input('email', 'Email', { type: 'email', autocomplete: 'email', inputmode: 'email', spellcheck: 'false', enterkeyhint: 'next' })}
        {input('whatsapp', 'WhatsApp number', { type: 'tel', autocomplete: 'tel', inputmode: 'tel', enterkeyhint: 'next', placeholder: '+44 7700 900123' })}

        <details class="bk-optional" open={!!(details.arrival || details.note)}>
          <summary>Add arrival time or a note (optional)</summary>
          <div class="bk-optional-body">
            <div class="field">
              <label for="bk-arrival">Arrival time on Maafushi</label>
              <select id="bk-arrival" name="arrival" class="input" value={details.arrival} onChange={(ev) => onChange({ arrival: (ev.currentTarget as HTMLSelectElement).value })}>
                {arrivalOptions.map(([v, l]) => (
                  <option value={v} key={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div class="field">
              <label for="bk-note">Note for us</label>
              <textarea
                id="bk-note"
                name="note"
                class="input"
                rows={3}
                maxLength={500}
                value={details.note}
                onInput={(ev) => onChange({ note: (ev.currentTarget as HTMLTextAreaElement).value })}
                placeholder="Allergies, a birthday, a very large surfboard…"
              />
            </div>
          </div>
        </details>

        <p class="demo-note">
          <span>{site.concept.demoNote}</span>
        </p>

        <button type="submit" class="btn btn--large btn--block bk-confirm">
          Confirm booking{total !== null && (
            <>
              {' · '}
              <AnimatedNumber value={total} />
            </>
          )}
        </button>
        <p class="bk-note bk-confirm-note">Nothing is charged today. Free cancellation up to 7 days before check-in.</p>
      </form>
    </section>
  );
}
