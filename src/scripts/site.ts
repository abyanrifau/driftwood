/**
 * The only script on static sections: slow reveal-on-scroll, header state,
 * the mobile booking bar and the booking stopwatch. Re-initialises after
 * ClientRouter navigations.
 */
import { markBookingStart } from '../lib/timer';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let cleanups: (() => void)[] = [];

function reveal() {
  const els = [...document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in), [data-reveal-img]:not(.is-in)')];
  if (!els.length) return;
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.01 },
  );
  els.forEach((el) => io.observe(el));
  cleanups.push(() => io.disconnect());
}

function header() {
  const el = document.querySelector<HTMLElement>('[data-header]');
  const sentinel = document.querySelector<HTMLElement>('[data-header-sentinel]');
  if (!el || !sentinel) return;
  const io = new IntersectionObserver(([e]) => el.classList.toggle('is-solid', !e.isIntersecting));
  io.observe(sentinel);
  cleanups.push(() => io.disconnect());
}

function mobileBar() {
  const bar = document.querySelector<HTMLElement>('[data-mobile-bar]');
  const watch = document.querySelector<HTMLElement>('[data-hide-bar]');
  if (!bar) return;
  if (!watch) {
    bar.classList.remove('is-hidden');
    return;
  }
  // Step aside only while a good part of the booking bar is on screen.
  const io = new IntersectionObserver(([e]) => bar.classList.toggle('is-hidden', e.isIntersecting), { threshold: 0.3 });
  io.observe(watch);
  cleanups.push(() => io.disconnect());
}

function init() {
  cleanups.forEach((fn) => fn());
  cleanups = [];
  document.documentElement.classList.add('js');
  reveal();
  header();
  mobileBar();
}

// The stopwatch starts on the first touch of any booking widget.
const start = (e: Event) => {
  if ((e.target as Element | null)?.closest?.('[data-booking-start]')) markBookingStart();
};
document.addEventListener('pointerdown', start, { capture: true, passive: true });
document.addEventListener('focusin', start, { capture: true });
document.addEventListener('keydown', start, { capture: true });

if (document.querySelector('meta[name="astro-view-transitions-enabled"]')) {
  document.addEventListener('astro:page-load', init);
  document.addEventListener('astro:after-swap', () => document.documentElement.classList.add('js'));
} else {
  init();
}
