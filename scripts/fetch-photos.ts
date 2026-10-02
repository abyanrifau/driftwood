/**
 * Downloads every photo listed in src/data/credits.ts from the Unsplash CDN,
 * applies one shared warm, natural colour grade, and writes optimised JPEG
 * masters to src/assets/photos. astro:assets then builds AVIF/WebP srcsets.
 *
 *   npm run photos            (skips files that already exist)
 *   npm run photos -- --force (re-downloads and re-grades everything)
 */
import { mkdir, writeFile, access, readdir, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp, { type Region, type Sharp } from 'sharp';
import { credits } from '../src/data/credits.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cacheDir = join(root, '.cache', 'photos');
const outDir = join(root, 'src', 'assets', 'photos');
const force = process.argv.includes('--force');

/** Longest edge of each master. Full-bleed images get more pixels. */
const fullBleed = new Set(['hero-wide', 'hero-tall', 'house', 'reef-split', 'sandbank-wide', 'speedboat', 'wet-sand', 'boat-sunset', 'beachfront-2', 'rooftop-2']);

/**
 * The phone hero sits under a gradient and is the LCP image on phones, so it
 * is very slightly softened: that roughly halves its AVIF size.
 */
const soften: Record<string, number> = { 'hero-tall': 0.6 };

const exists = (p: string) => access(p).then(() => true, () => false);

async function download(cdnPath: string, file: string) {
  if (!force && (await exists(file))) return;
  const url = `https://images.unsplash.com/${cdnPath}?w=2600&h=2600&fit=max&q=92&fm=jpg`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
}

/**
 * The house grade: a little warmth (red up, blue down), slightly lower
 * saturation so turquoise water sits next to plaster and linen, and lifted
 * blacks for a soft, matte finish.
 */
function grade(img: Sharp) {
  return img
    .recomb([
      [1.035, 0.025, 0],
      [0.01, 1.0, 0.0],
      [0, 0.02, 0.935],
    ])
    .modulate({ saturation: 0.86, brightness: 1.01 })
    .linear(0.94, 9);
}

async function writeMaster(src: string, out: string, longEdge: number, extract?: Region, soften = 0) {
  let img = sharp(src).rotate();
  if (extract) img = img.extract(extract);
  img = img.resize({ width: longEdge, height: longEdge, fit: 'inside', withoutEnlargement: true });
  if (soften) img = img.blur(soften);
  await grade(img).jpeg({ quality: 80, mozjpeg: true }).toFile(out);
}

await mkdir(cacheDir, { recursive: true });
await mkdir(outDir, { recursive: true });

for (const c of credits) {
  // Cached by Unsplash path, so a slot that changes photo downloads the new one.
  const raw = join(cacheDir, `${c.cdnPath}.jpg`);
  await download(c.cdnPath, raw);
  const out = join(outDir, `${c.key}.jpg`);
  if (!force && (await exists(out))) continue;
  const long = fullBleed.has(c.key) ? 2400 : 1800;
  await writeMaster(raw, out, long, undefined, soften[c.key] ?? 0);
  console.log(`graded ${c.key}`);
}

// Masters that are no longer listed in credits.ts
const keep = new Set(credits.map((c) => `${c.key}.jpg`));
for (const f of await readdir(outDir)) {
  if (f.endsWith('.jpg') && !keep.has(f)) {
    await rm(join(outDir, f));
    console.log(`removed ${f}`);
  }
}
console.log('done');
