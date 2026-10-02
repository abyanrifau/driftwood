/**
 * llms.txt: a plain summary of the site and its key facts for AI tools,
 * generated from the same data files as the pages.
 */
import type { APIRoute } from 'astro';
import { site, perks } from '../data/site';
import { rooms, totalRooms } from '../data/rooms';
import { experiences } from '../data/experiences';
import { seasons } from '../data/seasons';
import { transfers, transfersNote } from '../data/transfers';
import { fees } from '../data/fees';
import { faqs } from '../data/faq';

export const GET: APIRoute = ({ site: base }) => {
  const url = (p: string) => new URL(p, base).href;
  const sorted = [...seasons].sort((a, b) => a.tier - b.tier);
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.name} is a FICTIONAL ${totalRooms}-room guesthouse on ${site.location.short}, created by the web design studio Nuit Works (https://nuit.works) as a website concept. It is not a real business. Nothing can be booked and no payment is taken.`,
    '',
    `Tagline: "${site.tagline}"`,
    '',
    '## Key facts (fictional)',
    '',
    `- Location: ${site.location.short}. The house reef is a ${site.location.reefWalkMinutes}-minute walk from the front door.`,
    `- Rooms: ${totalRooms} rooms in ${rooms.length} types. ${rooms.map((r) => `${r.name} (${r.count} rooms, ${r.bed} bed, sleeps ${r.sleepsLabel}, ${r.sizeM2} m², from $${r.fromPrice} a night)`).join('; ')}.`,
    `- Included: breakfast, Wi-Fi, beach towels, snorkel bags, daily housekeeping.`,
    `- Policies: check-in ${site.policies.checkInLabel}, check-out ${site.policies.checkOutLabel}. ${site.policies.cancellation}.`,
    `- Book-direct perks: ${perks.map((p) => p.title.toLowerCase()).join(', ')}.`,
    `- Seasons: ${sorted.map((s) => `${s.name} ${s.ranges.map((r) => `${r.from} to ${r.to}`).join(', ')} (x${s.multiplier})`).join('; ')}. Dates are MM-DD.`,
    `- Best months: December to April is dry and calm but busiest; January fills up early. May to October is the quiet season with the lowest rates.`,
    `- Taxes in quotes (estimates): service charge ${fees.serviceCharge.rate * 100}%, GST ${fees.gst.rate * 100}%, Green Tax $${fees.greenTax.perGuestPerNight} per guest per night.`,
    `- Getting here from ${site.location.airport}: ${transfers.map((t) => `${t.name}, ${t.crossing}, ${t.priceLabel}`).join('; ')}. ${transfersNote}`,
    `- Experiences (per person): ${experiences.map((e) => `${e.name} $${e.price} (${e.duration})`).join('; ')}.`,
    `- Contact (placeholders): ${site.contact.email}, WhatsApp ${site.contact.whatsappDisplay}.`,
    '',
    '## Pages',
    '',
    `- [Home](${url('/')}): overview, booking widget, rooms, the house reef, island map, experiences, seasons.`,
    `- [Rooms](${url('/rooms/')}): room explorer with side-by-side comparison and a 12-month seasonal price calendar.`,
    ...rooms.map((r) => `- [${r.name}](${url(`/rooms/${r.slug}/`)}): ${r.summary}`),
    `- [Experiences](${url('/experiences/')}): snorkeling, sandbank picnic, dolphin cruise, island walk.`,
    `- [About](${url('/about/')}): how the house was built, materials, the island and the (fictional) people.`,
    `- [Getting here](${url('/getting-here/')}): transfer options compared, island map, arrival tips.`,
    `- [FAQ](${url('/faq/')}): transfers, local island rules, alcohol, payment, cancellation, children, best months, Wi-Fi.`,
    `- [Contact](${url('/contact/')}): WhatsApp, email, enquiry form (sends nothing).`,
    `- [Book](${url('/book/')}): demo booking flow in four steps with a live itemised quote. No booking is made.`,
    '',
    '## FAQ',
    '',
    ...faqs.flatMap((f) => [`### ${f.question}`, '', f.answer, '']),
    '## About this concept',
    '',
    'Designed and built by Nuit Works to show a guesthouse website that converts: book direct, fast, with a live quote and no third-party booking site. Reviews on the site are samples. Photos are from Unsplash.',
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
