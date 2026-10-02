/**
 * Astro's sharp image service, plus exact focal-point crops.
 *
 * Sharp's own `position` only knows nine gravities. Every photo slot on this
 * site sets its focal point as a CSS object-position ("62% 40%"), so here we
 * crop the master to the requested aspect ratio around that point first,
 * using the same maths as object-position, then hand it to the normal
 * service to resize and encode.
 */
import type { LocalImageService } from 'astro';
import sharpService from 'astro/assets/services/sharp';
import sharp from 'sharp';

const FOCAL = /^(\d{1,3}(?:\.\d+)?)%\s+(\d{1,3}(?:\.\d+)?)%$/;

const base = sharpService as LocalImageService;

const service: LocalImageService = {
  ...base,
  async transform(input, options, config, logger) {
    const t = options as typeof options & { position?: string; fit?: string };
    const m = typeof t.position === 'string' ? FOCAL.exec(t.position.trim()) : null;
    if (!m || !t.width || !t.height || (t.fit && t.fit !== 'cover')) {
      return base.transform(input, options, config, logger);
    }
    const fx = Math.min(100, Number(m[1])) / 100;
    const fy = Math.min(100, Number(m[2])) / 100;
    const img = sharp(input, { failOn: 'none' }).rotate();
    const { width: W = 0, height: H = 0 } = await img.metadata();
    const aspect = Number(t.width) / Number(t.height);
    let cw = W;
    let ch = H;
    if (W / H > aspect) cw = Math.round(H * aspect);
    else ch = Math.round(W / aspect);
    const region = {
      left: Math.round((W - cw) * fx),
      top: Math.round((H - ch) * fy),
      width: cw,
      height: ch,
    };
    // Resize to the requested size here too, so the service below encodes a
    // small image instead of the full master.
    const cropped = await img
      .extract(region)
      .resize({ width: Math.round(Number(t.width)), height: Math.round(Number(t.height)), withoutEnlargement: true })
      .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
      .toBuffer();
    return base.transform(new Uint8Array(cropped), { ...options, position: undefined }, config, logger);
  },
};

export default service;
