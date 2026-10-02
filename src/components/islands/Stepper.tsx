/** @jsxImportSource preact */

interface Props {
  id: string;
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  /** Singular noun for button labels, e.g. "adult" */
  noun: string;
  onChange: (n: number) => void;
  compact?: boolean;
}

/** A labelled - / + counter with big thumb-sized buttons. */
export default function Stepper({ id, label, hint, value, min, max, noun, onChange, compact }: Props) {
  return (
    <div class={`stepper${compact ? ' stepper--compact' : ''}`} role="group" aria-labelledby={`${id}-label`}>
      <div class="stepper-text">
        <span id={`${id}-label`} class="stepper-label">
          {label}
        </span>
        {hint && <span class="stepper-hint">{hint}</span>}
      </div>
      <div class="stepper-controls">
        <button
          type="button"
          class="stepper-btn"
          aria-label={`Remove ${/^[aeiou]/.test(noun) ? 'an' : 'a'} ${noun}`}
          aria-describedby={`${id}-value`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          <span aria-hidden="true">−</span>
        </button>
        <output id={`${id}-value`} class="stepper-value tnum" aria-live="polite">
          {value}
        </output>
        <button
          type="button"
          class="stepper-btn"
          aria-label={`Add ${/^[aeiou]/.test(noun) ? 'an' : 'a'} ${noun}`}
          aria-describedby={`${id}-value`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
    </div>
  );
}
