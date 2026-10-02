import type { Confirmed } from './store';
import { roomBySlug } from '../../../data/rooms';
import { site } from '../../../data/site';

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

/** Fold lines longer than 75 octets, as the iCalendar spec asks. */
const fold = (line: string) => {
  const out: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    out.push(rest.slice(0, 74));
    rest = ` ${rest.slice(74)}`;
  }
  out.push(rest);
  return out.join('\r\n');
};

/** An all-day calendar event covering the stay. */
export const icsFor = (c: Confirmed): string => {
  const room = roomBySlug(c.state.room);
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nuit Works//Driftwood concept//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${c.ref}@driftwood.nuit.works`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${c.state.checkin!.replace(/-/g, '')}`,
    `DTEND;VALUE=DATE:${c.state.checkout!.replace(/-/g, '')}`,
    `SUMMARY:${esc(`Driftwood, Maafushi: ${room?.name ?? 'your stay'}`)}`,
    `LOCATION:${esc(`Driftwood, ${site.location.short}`)}`,
    `DESCRIPTION:${esc(
      `Booking reference ${c.ref}. Check-in from ${site.policies.checkInLabel}, check-out by ${site.policies.checkOutLabel}. WhatsApp ${site.contact.whatsappDisplay}. ${site.concept.demoNote}`,
    )}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
};
