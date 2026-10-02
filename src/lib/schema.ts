/**
 * JSON-LD builders, typed with schema-dts. Reviews on this site are samples,
 * so there is deliberately no Review or AggregateRating markup anywhere.
 */
import type { BreadcrumbList, FAQPage, LodgingBusiness, TouristTrip, WithContext, Thing } from 'schema-dts';
import { site } from '../data/site';
import { rooms, totalRooms, type Room } from '../data/rooms';
import { seasons } from '../data/seasons';
import type { Faq } from '../data/faq';
import type { Experience } from '../data/experiences';

const abs = (base: URL | string, path: string) => new URL(path, base).href;

export const lodgingId = (base: URL | string) => abs(base, '/#lodging');

const disambiguation =
  'Driftwood is a fictional guesthouse created by the web design studio Nuit Works as a website concept. It is not a real business and cannot be booked.';

const maxMultiplier = Math.max(...seasons.map((s) => s.multiplier));
const priceLow = Math.min(...rooms.map((r) => r.fromPrice));
const priceHigh = Math.round(Math.max(...rooms.map((r) => r.fromPrice)) * maxMultiplier);

const amenities = [
  'Breakfast included',
  'Free Wi-Fi',
  'Air conditioning',
  'House reef 2 minutes away',
  'Snorkel gear',
  'Airport speedboat transfers',
  'Daily housekeeping',
  'Beach towels',
];

export const lodgingBusiness = (base: URL | string, image: string): WithContext<LodgingBusiness> => ({
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  '@id': lodgingId(base),
  name: site.name,
  description: site.description,
  disambiguatingDescription: disambiguation,
  slogan: site.tagline,
  url: abs(base, '/'),
  image,
  email: site.contact.email,
  telephone: site.contact.whatsappDisplay,
  address: {
    '@type': 'PostalAddress',
    addressLocality: site.location.island,
    addressRegion: site.location.atoll,
    addressCountry: site.location.countryCode,
  },
  geo: { '@type': 'GeoCoordinates', latitude: site.location.lat, longitude: site.location.lng },
  priceRange: `$${priceLow} to $${priceHigh} per night`,
  currenciesAccepted: 'USD',
  checkinTime: site.policies.checkIn,
  checkoutTime: site.policies.checkOut,
  numberOfRooms: totalRooms,
  amenityFeature: amenities.map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
  sameAs: [site.contact.instagram],
});

/** HotelRoom typed together with Product so it can carry an Offer (schema.org hotel pattern). */
export const hotelRoom = (base: URL | string, room: Room, images: string[]) =>
  ({
    '@context': 'https://schema.org',
    '@type': ['HotelRoom', 'Product'],
    '@id': abs(base, `/rooms/${room.slug}/#room`),
    name: room.name,
    description: room.summary,
    image: images,
    url: abs(base, `/rooms/${room.slug}/`),
    bed: { '@type': 'BedDetails', typeOfBed: room.bed, numberOfBeds: 1 },
    occupancy: { '@type': 'QuantitativeValue', maxValue: room.maxGuests, unitText: 'guests' },
    floorSize: { '@type': 'QuantitativeValue', value: room.sizeM2, unitCode: 'MTK' },
    amenityFeature: room.amenities.map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
    containedInPlace: { '@type': 'LodgingBusiness', '@id': lodgingId(base), name: site.name },
    disambiguatingDescription: disambiguation,
    offers: {
      '@type': 'Offer',
      url: abs(base, `/book/?room=${room.slug}`),
      price: room.fromPrice,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      businessFunction: 'http://purl.org/goodrelations/v1#LeaseOut',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: room.fromPrice,
        priceCurrency: 'USD',
        unitCode: 'DAY',
        referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'DAY' },
      },
    },
  }) satisfies Record<string, unknown>;

export const faqPage = (items: Faq[]): WithContext<FAQPage> => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
});

export const touristTrips = (base: URL | string, items: Experience[], images: Record<string, string>) => ({
  '@context': 'https://schema.org' as const,
  '@graph': items.map(
    (e): TouristTrip => ({
      '@type': 'TouristTrip',
      '@id': abs(base, `/experiences/#${e.slug}`),
      name: e.name,
      description: `${e.line} ${e.duration}. ${e.time}.`,
      image: images[e.slug],
      touristType: 'Guests of Driftwood, Maafushi',
      provider: { '@type': 'LodgingBusiness', '@id': lodgingId(base), name: site.name },
      offers: {
        '@type': 'Offer',
        price: e.price,
        priceCurrency: 'USD',
        url: abs(base, `/book/?exp=${e.slug}`),
        description: `Price ${e.priceUnit}`,
      },
    }),
  ),
});

export const breadcrumbs = (base: URL | string, trail: { name: string; path: string }[]): WithContext<BreadcrumbList> => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.name,
    item: abs(base, t.path),
  })),
});

export type JsonLd = WithContext<Thing> | Record<string, unknown>;

/** Serialise for a <script type="application/ld+json">, safe against </script>. */
export const jsonLdString = (data: JsonLd) => JSON.stringify(data).replace(/</g, '\\u003c');
