/**
 * Open Graph images, generated at build time in the site's style:
 * cream panel, Cormorant headline, small tracked label, one graded photo.
 * 1200 x 630 JPEG.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { rooms } from '../../data/rooms';
import { site } from '../../data/site';

type OgPage = {
  slug: string;
  kicker: string;
  title: string;
  photo: string;
};

const pages: OgPage[] = [
  { slug: 'home', kicker: 'Maafushi · Kaafu Atoll · Maldives', title: site.tagline, photo: 'hero-tall' },
  { slug: 'rooms', kicker: 'Rooms', title: 'Four room types, from $180 a night', photo: 'reef-view-1' },
  ...rooms.map((r) => ({ slug: `room-${r.slug}`, kicker: `From $${r.fromPrice} per night`, title: r.name, photo: r.photos[0].key })),
  { slug: 'experiences', kicker: 'Experiences', title: 'Snorkeling, a sandbank picnic and a sunset cruise', photo: 'snorkel' },
  { slug: 'about', kicker: 'About', title: 'Coral stone, teak and lime plaster', photo: 'villa-terrace' },
  { slug: 'getting-here', kicker: 'Getting here', title: 'Thirty-five minutes from the airport', photo: 'speedboat' },
  { slug: 'faq', kicker: 'Questions', title: 'Transfers, local island rules and the best months', photo: 'wet-sand' },
  { slug: 'contact', kicker: 'Contact', title: 'WhatsApp and email, 8am to 10pm', photo: 'breakfast' },
  { slug: 'book', kicker: 'Book direct', title: 'Best rate, breakfast included', photo: 'rooftop-2' },
  { slug: 'credits', kicker: 'Credits', title: 'Photo credits', photo: 'plaster-shutter' },
  { slug: 'privacy', kicker: 'Privacy', title: 'Nothing you enter here leaves your browser', photo: 'reef-view-3' },
  { slug: '404', kicker: 'Error 404', title: 'Page not found', photo: 'wet-sand' },
];

export const getStaticPaths = (() => pages.map((p) => ({ params: { slug: p.slug }, props: p }))) satisfies GetStaticPaths;

const root = process.cwd();
let fonts: Promise<{ serif: Buffer; sans: Buffer }> | undefined;
const loadFonts = () =>
  (fonts ??= Promise.all([readFile(join(root, 'src/assets/og/cormorant-og.ttf')), readFile(join(root, 'src/assets/og/jost-og.ttf'))]).then(
    ([serif, sans]) => ({ serif, sans }),
  ));

const mark =
  'data:image/svg+xml;base64,' +
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M3.5 19.6 28.5 14.8v3.1L3.5 22.7Z" fill="none" stroke="#1E1A17" stroke-width="1"/><path d="M8 20.4 23.5 17.4" fill="none" stroke="#1E1A17" stroke-width=".6"/><path d="M2 26.5h28" fill="none" stroke="#1E1A17" stroke-width="1"/></svg>`,
  ).toString('base64');

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style, children, ...extra },
});

export const GET: APIRoute = async ({ props }) => {
  const page = props as OgPage;
  const { serif, sans } = await loadFonts();
  const photo = await sharp(join(root, 'src/assets/photos', `${page.photo}.jpg`))
    .resize(480, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 82 })
    .toBuffer();

  const titleSize = page.title.length > 44 ? 64 : page.title.length > 28 ? 74 : 86;

  const tree = h('div', { display: 'flex', width: '1200px', height: '630px', background: '#F6F2EC' }, [
    h('div', { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '720px', padding: '60px 64px' }, [
      h('div', { display: 'flex', alignItems: 'center', gap: '14px' }, [
        h('img', { width: '40px', height: '40px' }, undefined, { src: mark, width: 40, height: 40 }),
        h('div', { fontFamily: 'Cormorant Garamond', fontSize: '40px', color: '#1E1A17' }, 'Driftwood'),
      ]),
      h('div', { display: 'flex', flexDirection: 'column', gap: '22px' }, [
        h('div', { fontFamily: 'Jost', fontSize: '18px', letterSpacing: '4px', textTransform: 'uppercase', color: '#675E56' }, page.kicker),
        h('div', { fontFamily: 'Cormorant Garamond', fontSize: `${titleSize}px`, lineHeight: 1.04, color: '#1E1A17', textWrap: 'balance' }, page.title),
      ]),
      h(
        'div',
        { display: 'flex', fontFamily: 'Jost', fontSize: '16px', letterSpacing: '3px', textTransform: 'uppercase', color: '#675E56', borderTop: '1px solid #E3DCD2', paddingTop: '18px' },
        'A Nuit Works concept',
      ),
    ]),
    h('img', { width: '480px', height: '630px', objectFit: 'cover' }, undefined, {
      src: `data:image/jpeg;base64,${photo.toString('base64')}`,
      width: 480,
      height: 630,
    }),
  ]);

  const svg = await satori(tree as never, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Cormorant Garamond', data: serif, weight: 300, style: 'normal' },
      { name: 'Jost', data: sans, weight: 400, style: 'normal' },
    ],
  });
  const jpg = await sharp(Buffer.from(svg)).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpg), { headers: { 'Content-Type': 'image/jpeg' } });
};
