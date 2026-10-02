/**
 * Server-side image helpers. Every photo is a graded JPEG master in
 * src/assets/photos; we generate AVIF and WebP srcsets from it at build time.
 * Crops are anchored on each photo's focal point (credits.ts), or on the
 * slot's own focal point when it sets one.
 */
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { creditByKey } from '../data/credits';

const modules = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.jpg', { eager: true });

const byKey = new Map<string, ImageMetadata>(
  Object.entries(modules).map(([path, mod]) => [path.slice(path.lastIndexOf('/') + 1, -4), mod.default]),
);

export const photo = (key: string): ImageMetadata => {
  const img = byKey.get(key);
  if (!img) throw new Error(`No photo called "${key}" in src/assets/photos`);
  return img;
};

/** The photo's default focal point, as a CSS object-position. */
export const focusOf = (key: string): string => creditByKey(key)?.focus ?? '50% 50%';

export const QUALITY = { avif: 50, webp: 68 } as const;

export interface PicData {
  avif: string;
  webp: string;
  /** Fallback src (WebP, largest width) */
  src: string;
  width: number;
  height: number;
  alt: string;
  sizes: string;
  /** Focal point used for the crop, also applied as object-position */
  focus: string;
}

export interface PicOptions {
  /** Output widths for the srcset */
  widths?: number[];
  sizes?: string;
  /** Width / height. Crops the photo around the focal point when set. */
  aspect?: number;
  /** Override the photo's focal point for this slot */
  focus?: string;
  /** Override the default encoder quality */
  quality?: { avif: number; webp: number };
}

/** AVIF + WebP srcsets for one photo, ready for a <picture>. */
export const picData = async (key: string, alt: string, opts: PicOptions = {}): Promise<PicData> => {
  const img = photo(key);
  const focus = opts.focus ?? focusOf(key);
  const sourceAspect = img.width / img.height;
  const aspect = opts.aspect ?? sourceAspect;
  const widths = (opts.widths ?? [480, 828, 1080, 1600]).filter((w) => w <= img.width && Math.round(w / aspect) <= img.height);
  if (!widths.length) widths.push(Math.min(img.width, Math.round(img.height * aspect)));
  const width = widths[widths.length - 1];
  const height = Math.round(width / aspect);
  const sizes = opts.sizes ?? '100vw';
  const crop = opts.aspect ? { height, fit: 'cover' as const, position: focus } : {};
  const [avif, webp] = await Promise.all([
    getImage({ src: img, width, widths, sizes, format: 'avif', quality: (opts.quality ?? QUALITY).avif, ...crop }),
    getImage({ src: img, width, widths, sizes, format: 'webp', quality: (opts.quality ?? QUALITY).webp, ...crop }),
  ]);
  return { avif: avif.srcSet.attribute, webp: webp.srcSet.attribute, src: webp.src, width, height, alt, sizes, focus };
};

export interface ArtDirected {
  desktop: PicData;
  mobile: PicData;
  /** Media query for the mobile sources */
  media: string;
}

export interface ArtOptions {
  /** Desktop crop, e.g. 16 / 9 or 21 / 9 */
  aspect: number;
  /** Phone crop, e.g. 4 / 5 */
  mobileAspect: number;
  /** A different photo for phones (same scene, upright frame) */
  mobileKey?: string;
  focus?: string;
  mobileFocus?: string;
  widths?: number[];
  mobileWidths?: number[];
  sizes?: string;
  quality?: { avif: number; webp: number };
  mobileQuality?: { avif: number; webp: number };
}

/** Separate composed crops for phones and larger screens, for one <picture>. */
export const artDirected = async (key: string, alt: string, o: ArtOptions): Promise<ArtDirected> => {
  const mobileKey = o.mobileKey ?? key;
  const [desktop, mobile] = await Promise.all([
    picData(key, alt, { aspect: o.aspect, focus: o.focus, widths: o.widths ?? [960, 1280, 1600, 2000, 2400], sizes: o.sizes ?? '100vw', quality: o.quality }),
    picData(mobileKey, alt, {
      aspect: o.mobileAspect,
      focus: o.mobileFocus ?? (o.mobileKey ? undefined : o.focus),
      widths: o.mobileWidths ?? [480, 750, 1080],
      sizes: '100vw',
      quality: o.mobileQuality ?? o.quality,
    }),
  ]);
  return { desktop, mobile, media: '(max-width: 767.98px)' };
};
