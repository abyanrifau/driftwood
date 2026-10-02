/**
 * Brand, contact details, policies and navigation.
 * Driftwood is a fictional business. Contact details are placeholders.
 */

export const site = {
  name: 'Driftwood',
  legalName: 'Driftwood Guesthouse (fictional)',
  tagline: 'A twelve-room guesthouse on Maafushi',
  description:
    'Driftwood is a 12-room guesthouse on Maafushi, Kaafu Atoll, Maldives, two minutes on foot from the house reef. Four room types from $180 a night, breakfast included.',
  locale: 'en_GB',
  lang: 'en-GB',
  themeColor: '#F6F2EC',
  currency: 'USD',

  location: {
    island: 'Maafushi',
    atoll: 'Kaafu Atoll',
    country: 'Maldives',
    countryCode: 'MV',
    short: 'Maafushi, Kaafu Atoll, Maldives',
    // Approximate centre of Maafushi.
    lat: 3.9418,
    lng: 73.4899,
    reefWalkMinutes: 2,
    airport: 'Velana International Airport (MLE)',
  },

  story: {
    short:
      'Two storeys of lime-plastered coral stone and reclaimed timber on the quiet south side of Maafushi, built between 2019 and 2023.',
  },

  contact: {
    email: 'stay@driftwoodmaldives.com',
    whatsappDisplay: '+960 700 0000',
    /** Digits only, for wa.me links */
    whatsappNumber: '9607000000',
    instagram: 'https://www.instagram.com/',
    instagramHandle: '@driftwood.maafushi',
    replyTime: 'We reply within a few hours, 8am to 10pm Maldives time.',
  },

  policies: {
    breakfast: 'Breakfast included',
    cancellation: 'Free cancellation up to 7 days before check-in',
    cancellationDays: 7,
    checkIn: '14:00',
    checkOut: '12:00',
    checkInLabel: '2pm',
    checkOutLabel: '12pm',
    lateCheckout: 'Free late checkout when you book direct, if the room is free',
  },

  /** The line every Nuit Works concept carries in its footer. */
  concept: {
    studio: 'Nuit Works',
    studioUrl: 'https://nuit.works',
    line: 'A Nuit Works concept. Driftwood is a fictional business.',
    demoNote: 'This is a Nuit Works concept. No booking is made and no payment is taken.',
  },
} as const;

export interface NavItem {
  href: string;
  label: string;
}

export const mainNav: NavItem[] = [
  { href: '/rooms/', label: 'Rooms' },
  { href: '/experiences/', label: 'Experiences' },
  { href: '/about/', label: 'About' },
  { href: '/getting-here/', label: 'Getting here' },
  { href: '/faq/', label: 'FAQ' },
  { href: '/contact/', label: 'Contact' },
];

export const footerNav: NavItem[] = [
  { href: '/', label: 'Home' },
  ...mainNav,
  { href: '/book/', label: 'Book' },
  { href: '/credits/', label: 'Photo credits' },
  { href: '/privacy/', label: 'Privacy' },
];

/** Book-direct perks, shown near the top of Home and Rooms. */
export const perks = [
  { title: 'Breakfast included', body: 'Served on the terrace from 7 to 10am.' },
  { title: 'Free cancellation', body: 'Up to 7 days before check-in.' },
  { title: 'Best rate here', body: 'Our own rates are never higher than on booking sites.' },
  { title: 'Late checkout', body: 'Until 3pm at no charge when you book direct, if the room is free.' },
] as const;

export const whatsappLink = (text?: string) =>
  `https://wa.me/${site.contact.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
