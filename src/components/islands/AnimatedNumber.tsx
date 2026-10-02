/** @jsxImportSource preact */
import { useEffect, useRef, useState } from 'preact/hooks';
import { money } from '../../lib/format';

interface Props {
  value: number;
  duration?: number;
}

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** A short number tween for price totals. Instant with reduced motion. */
export default function AnimatedNumber({ value, duration = 450 }: Props) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  const frame = useRef(0);

  useEffect(() => {
    cancelAnimationFrame(frame.current);
    const start = from.current;
    if (start === value || reduced()) {
      from.current = value;
      setShown(value);
      return;
    }
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = start + (value - start) * eased;
      from.current = v;
      setShown(v);
      if (p < 1) frame.current = requestAnimationFrame(step);
      else from.current = value;
    };
    frame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame.current);
  }, [value, duration]);

  return <span class="tnum">{money(shown)}</span>;
}
