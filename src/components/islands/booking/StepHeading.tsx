/** @jsxImportSource preact */
import type { ComponentChildren } from 'preact';
import { STEPS } from '../../../lib/booking';

interface Props {
  index: number;
  title: string;
  children?: ComponentChildren;
}

/** Each step's heading. Focus moves here when the step changes. */
export default function StepHeading({ index, title, children }: Props) {
  return (
    <div class="bk-step-head">
      <h2 id="bk-step-title" class="bk-step-title" tabIndex={-1}>
        <span class="bk-step-count">
          Step {index} of {STEPS.length}
        </span>
        <span class="bk-step-name">{title}</span>
      </h2>
      {children}
    </div>
  );
}
