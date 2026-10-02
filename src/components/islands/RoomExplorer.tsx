/** @jsxImportSource preact */
import { useEffect, useRef, useState } from 'preact/hooks';
import './room-explorer.css';
import Pic from './Pic';
import type { PicData } from '../../lib/images';
import type { RoomSlug } from '../../data/rooms';
import { bookUrl } from '../../lib/booking';

export interface ExplorerRoom {
  slug: RoomSlug;
  name: string;
  fromPrice: number;
  bed: string;
  sleepsLabel: string;
  sizeM2: number;
  view: string;
  outdoorSpace: string;
  highlight: string;
  summary: string;
  standout: string[];
  /** One line of detail in small caps */
  detail: string;
  photos: PicData[];
  /** A short caption for each photo */
  captions: string[];
  thumb: PicData;
}

interface Props {
  rooms: ExplorerRoom[];
}

function Gallery({ room, first = false }: { room: ExplorerRoom; first?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = room.photos.length;

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const slides = [...el.children] as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.6) setIndex(slides.indexOf(e.target as HTMLElement));
        }
      },
      { root: el, threshold: [0.6] },
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const next = (i + count) % count;
    const slide = el.children[next] as HTMLElement;
    el.scrollTo({ left: slide.offsetLeft - el.offsetLeft, behavior: 'smooth' });
    setIndex(next);
  };

  return (
    <div class="gal" role="region" aria-roledescription="carousel" aria-label={`Photos of the ${room.name}`}>
      <div class="gal-track" ref={track} tabIndex={0} role="group" aria-label={`${count} photos, scroll sideways with the arrow keys`}>
        {room.photos.map((p, i) => (
          <div class="gal-slide" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${count}`} key={i}>
            <Pic
              pic={p}
              priority={first && i === 0}
              style={i === 0 ? { viewTransitionName: `room-${room.slug}` } : undefined}
            />
          </div>
        ))}
      </div>
      <div class="gal-foot">
        <p class="gal-caption caption" aria-live="polite">
          <span class="gal-count tnum">
            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
          {room.captions[index]}
        </p>
        <div class="gal-ui">
          <button type="button" class="gal-btn" aria-label="Previous photo" onClick={() => go(index - 1)}>
            <span aria-hidden="true">←</span>
          </button>
          <button type="button" class="gal-btn" aria-label="Next photo" onClick={() => go(index + 1)}>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const rows: { label: string; get: (r: ExplorerRoom) => string | string[] }[] = [
  { label: 'From', get: (r) => `$${r.fromPrice} per night` },
  { label: 'Size', get: (r) => `${r.sizeM2} m²` },
  { label: 'Bed', get: (r) => r.bed },
  { label: 'Sleeps', get: (r) => r.sleepsLabel },
  { label: 'View', get: (r) => r.view },
  { label: 'Outdoor space', get: (r) => r.outdoorSpace },
  { label: 'Standout', get: (r) => r.standout },
];

export default function RoomExplorer({ rooms }: Props) {
  const [mode, setMode] = useState<'browse' | 'compare'>('browse');
  const [selected, setSelected] = useState<RoomSlug[]>([rooms[0].slug, rooms[1].slug]);
  const compareHeading = useRef<HTMLHeadingElement>(null);
  const firstFocus = useRef(true);

  useEffect(() => {
    if (firstFocus.current) {
      firstFocus.current = false;
      return;
    }
    if (mode === 'compare') compareHeading.current?.focus();
  }, [mode]);

  const toggle = (slug: RoomSlug) => {
    setSelected((cur) => {
      if (cur.includes(slug)) return cur.length > 1 ? cur.filter((s) => s !== slug) : cur;
      const next = [...cur, slug];
      return next.length > 3 ? next.slice(1) : next;
    });
  };

  const chosen = rooms.filter((r) => selected.includes(r.slug));

  return (
    <div class="rx">
      <div class="rx-bar">
        <div class="rx-modes" role="group" aria-label="View">
          <button type="button" class="rx-mode" aria-pressed={mode === 'browse'} onClick={() => setMode('browse')}>
            Browse
          </button>
          <button type="button" class="rx-mode" aria-pressed={mode === 'compare'} onClick={() => setMode('compare')}>
            Compare ({selected.length} rooms)
          </button>
        </div>
        <p class="rx-hint">
          {mode === 'browse' ? 'Select Compare on two or three rooms to see them side by side.' : 'Choose two or three rooms to compare.'}
        </p>
      </div>

      {mode === 'browse' ? (
        <ul role="list" class="rx-list">
          {rooms.map((r, ri) => (
            <li key={r.slug}>
              <article class="rx-room" aria-labelledby={`rx-${r.slug}`}>
                <Gallery room={r} first={ri === 0} />
                <div class="rx-info">
                  <h3 id={`rx-${r.slug}`} class="rx-name">
                    <a href={`/rooms/${r.slug}/`}>{r.name}</a>
                  </h3>
                  <p class="meta">{r.detail}</p>
                  <p class="rx-summary">{r.summary}</p>
                  <p class="price-line">From ${r.fromPrice} per night</p>
                  <div class="rx-actions">
                    <a class="btn btn--small" href={bookUrl({ room: r.slug })} data-astro-reload data-booking-start aria-label={`Book the ${r.name}`}>
                      Book
                    </a>
                    <a class="text-link" href={`/rooms/${r.slug}/`} aria-label={`View room: ${r.name}`}>
                      View room
                    </a>
                    <label class="rx-compare">
                      <input type="checkbox" checked={selected.includes(r.slug)} onChange={() => toggle(r.slug)} />
                      <span>Compare</span>
                    </label>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <section class="rx-cmp" aria-labelledby="rx-cmp-title">
          <h3 id="rx-cmp-title" class="rx-cmp-title" tabIndex={-1} ref={compareHeading}>
            Side by side
          </h3>
          <fieldset class="rx-picks">
            <legend class="visually-hidden">Rooms to compare, up to three</legend>
            {rooms.map((r) => (
              <label class={`rx-pick${selected.includes(r.slug) ? ' is-on' : ''}`} key={r.slug}>
                <input type="checkbox" checked={selected.includes(r.slug)} onChange={() => toggle(r.slug)} />
                <span>{r.name}</span>
              </label>
            ))}
          </fieldset>
          <div class="rx-table-wrap" tabIndex={0} role="region" aria-label="Room comparison table">
            <table class="rx-table">
              <caption class="visually-hidden">Comparing {chosen.map((r) => r.name).join(', ')}</caption>
              <thead>
                <tr>
                  <td />
                  {chosen.map((r) => (
                    <th scope="col" key={r.slug}>
                      <Pic pic={r.thumb} alt="" class="rx-thumb" />
                      <span>{r.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {chosen.map((r) => {
                      const v = row.get(r);
                      return (
                        <td key={r.slug}>
                          {Array.isArray(v) ? (
                            <ul role="list" class="rx-standout">
                              {v.map((s) => (
                                <li key={s}>{s}</li>
                              ))}
                            </ul>
                          ) : (
                            v
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr>
                  <td />
                  {chosen.map((r) => (
                    <td key={r.slug}>
                      <a class="btn btn--small btn--block" href={bookUrl({ room: r.slug })} data-astro-reload data-booking-start aria-label={`Book the ${r.name}`}>
                        Book
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
