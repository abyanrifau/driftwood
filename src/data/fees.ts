/**
 * Taxes and fees used in every quote.
 * ESTIMATES FOR THIS CONCEPT ONLY. They follow the usual Maldives structure
 * for guesthouses (service charge, tourism GST and Green Tax) but are not
 * tax advice and are not guaranteed to match current rates.
 */

export const fees = {
  isEstimate: true,
  note: 'Taxes and fees are estimates for this concept.',
  currency: 'USD',

  /** Applied to the room and experiences. */
  serviceCharge: {
    label: 'Service charge',
    rate: 0.1,
  },

  /** Tourism GST, applied to everything above plus the service charge. */
  gst: {
    label: 'GST',
    rate: 0.17,
  },

  /** Charged per guest per night. Babies under 2 are exempt and are not counted as guests. */
  greenTax: {
    label: 'Green Tax',
    perGuestPerNight: 6,
  },
} as const;

export const childAgeNote = 'Children are 2 to 11. Babies under 2 stay free and do not count as guests.';
