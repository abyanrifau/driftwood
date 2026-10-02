/**
 * Builds the favicon set from public/favicon.svg:
 * favicon.ico (16, 32, 48), apple-touch-icon.png (180), icon-192.png,
 * icon-512.png and a maskable icon. Run: npm run icons
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const pub = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const svg = await readFile(join(pub, 'favicon.svg'));
const cream = { r: 246, g: 242, b: 236, alpha: 1 };

const png = (size: number, pad = 0) =>
  sharp(svg, { density: 512 })
    .resize(size - pad * 2, size - pad * 2)
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: cream })
    .flatten({ background: cream })
    .png({ compressionLevel: 9, palette: true, colors: 32 })
    .toBuffer();

await writeFile(join(pub, 'apple-touch-icon.png'), await png(180, 12));
await writeFile(join(pub, 'icon-192.png'), await png(192));
await writeFile(join(pub, 'icon-512.png'), await png(512));
await writeFile(join(pub, 'icon-maskable-512.png'), await png(512, 72));

// favicon.ico with embedded PNGs (supported by every current browser).
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => png(s)));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = sizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0);
  e.writeUInt8(s, 1);
  e.writeUInt8(0, 2);
  e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(images[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += images[i].length;
  return e;
});
await writeFile(join(pub, 'favicon.ico'), Buffer.concat([header, ...entries, ...images]));
console.log('icons written');
