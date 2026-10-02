/** @jsxImportSource preact */
import { useEffect, useRef, useState } from 'preact/hooks';

interface Props {
  items: { href: string; label: string }[];
  current: string;
  whatsapp: string;
  email: string;
}

/**
 * Accessible mobile menu: a modal panel with a focus trap, Escape to close,
 * focus returned to the toggle, and the page behind made inert.
 */
export default function MobileMenu({ items, current, whatsapp, email }: Props) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.classList.add('menu-open');
    const main = document.getElementById('main');
    const footer = document.querySelector('footer');
    main?.setAttribute('inert', '');
    footer?.setAttribute('inert', '');
    const first = panel.current?.querySelector<HTMLElement>('a, button');
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        toggle.current?.focus();
        return;
      }
      if (e.key !== 'Tab' || !panel.current) return;
      const focusables = [toggle.current, ...panel.current.querySelectorAll<HTMLElement>('a[href], button')].filter(Boolean) as HTMLElement[];
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const close = () => setOpen(false);
    document.addEventListener('astro:before-swap', close);
    return () => {
      root.classList.remove('menu-open');
      main?.removeAttribute('inert');
      footer?.removeAttribute('inert');
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('astro:before-swap', close);
    };
  }, [open]);

  return (
    <>
      <button
        ref={toggle}
        type="button"
        class="menu-toggle"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span class="menu-toggle-bars" aria-hidden="true">
          <span />
          <span />
        </span>
        <span class="menu-toggle-label">{open ? 'Close' : 'Menu'}</span>
      </button>
      <div
        ref={panel}
        id="mobile-menu"
        class="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
      >
        <nav aria-label="Main">
          <ul role="list">
            <li>
              <a href="/" aria-current={current === '/' ? 'page' : undefined} onClick={() => setOpen(false)}>
                Home
              </a>
            </li>
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={current.startsWith(item.href) ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div class="mobile-menu-foot">
          <a class="btn btn--large btn--block" href="/book/" data-astro-reload data-booking-start>
            Check availability
          </a>
          <p class="mobile-menu-contact">
            Questions before you book: <a href={whatsapp}>WhatsApp</a> or <a href={`mailto:${email}`}>{email}</a>.
          </p>
        </div>
      </div>
    </>
  );
}
