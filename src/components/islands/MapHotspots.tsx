/** @jsxImportSource preact */
import { useEffect, useRef, useState } from 'preact/hooks';
import type { Place } from '../../data/places';

interface Props {
  places: Place[];
  width: number;
  height: number;
  idPrefix: string;
}

/**
 * Hotspot buttons over the static map artwork. Hover or focus previews a
 * place; a tap or click pins it; Escape or a tap elsewhere closes it.
 */
export default function MapHotspots({ places, width, height, idPrefix }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const active = pinned ?? hovered;
  const place = places.find((p) => p.id === active);

  useEffect(() => {
    if (!pinned) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setPinned(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPinned(null);
        setHovered(null);
      }
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [pinned]);

  const left = (p: Place) => (p.x / width) * 100;
  const top = (p: Place) => (p.y / height) * 100;
  const cardId = `${idPrefix}-card`;

  return (
    <div
      class="hotspots"
      ref={root}
      onMouseLeave={() => setHovered(null)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setPinned(null);
          setHovered(null);
        }
      }}
    >
      {places.map((p) => (
        <button
          key={p.id}
          type="button"
          class={`hotspot hotspot--${p.kind}${active === p.id ? ' is-active' : ''}`}
          style={{ left: `${left(p)}%`, top: `${top(p)}%` }}
          aria-label={`${p.name}: ${p.fromDriftwood}`}
          aria-expanded={active === p.id}
          aria-controls={cardId}
          onMouseEnter={() => setHovered(p.id)}
          onFocus={() => setHovered(p.id)}
          onBlur={() => setHovered((h) => (h === p.id ? null : h))}
          onClick={() => setPinned((cur) => (cur === p.id ? null : p.id))}
        >
          <span class="hotspot-dot" aria-hidden="true" />
        </button>
      ))}

      <div
        id={cardId}
        class={`map-card${place ? ' is-open' : ''}`}
        role="status"
        aria-live="polite"
        style={
          place
            ? {
                left: `${left(place)}%`,
                top: `${top(place)}%`,
                '--dx': left(place) > 55 ? '-100%' : '0%',
                '--dy': top(place) > 50 ? 'calc(-100% - 18px)' : '18px',
                '--ox': left(place) > 55 ? '18px' : '-18px',
              }
            : undefined
        }
      >
        {place && (
          <>
            <p class="map-card-name">{place.name}</p>
            <p class="map-card-desc">{place.description}</p>
            <p class="map-card-time">{place.fromDriftwood}</p>
          </>
        )}
      </div>
    </div>
  );
}
