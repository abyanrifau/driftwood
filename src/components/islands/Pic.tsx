/** @jsxImportSource preact */
import type { PicData } from '../../lib/images';

interface Props {
  pic: PicData;
  class?: string;
  alt?: string;
  eager?: boolean;
  /** Mark as the LCP image: eager and high fetch priority */
  priority?: boolean;
  style?: Record<string, string>;
}

/** <picture> for islands, fed by srcsets generated at build time. */
export default function Pic({ pic, class: className, alt, eager = false, priority = false, style }: Props) {
  return (
    <picture class={className}>
      <source type="image/avif" srcset={pic.avif} sizes={pic.sizes} />
      <source type="image/webp" srcset={pic.webp} sizes={pic.sizes} />
      <img
        src={pic.src}
        alt={alt ?? pic.alt}
        width={pic.width}
        height={pic.height}
        loading={eager || priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : undefined}
        decoding="async"
        style={{ objectPosition: pic.focus, ...style }}
      />
    </picture>
  );
}
