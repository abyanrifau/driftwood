/**
 * SAMPLE REVIEWS written for this concept. They are not real guests and must
 * never be added to structured data (no Review or AggregateRating markup).
 */

export interface Review {
  name: string;
  country: string;
  /** Month and year of the stay */
  month: string;
  room: string;
  text: string;
}

export const reviewsNote = 'Sample reviews written for this concept, not real guests.';

export const reviews: Review[] = [
  {
    name: 'Hanna',
    country: 'Germany',
    month: 'February 2026',
    room: 'Reef View Room',
    text: 'We snorkelled before breakfast every day and saw turtles twice. The balcony is small but the view is very good. Breakfast was good too, the mango especially.',
  },
  {
    name: 'Tom',
    country: 'United Kingdom',
    month: 'May 2026',
    room: 'Garden Suite',
    text: 'Six nights in May. The rate was a lot lower than January and there was only us and one other couple on the sandbank trip. The outdoor shower was the best part of the room.',
  },
  {
    name: 'Aiko',
    country: 'Japan',
    month: 'March 2026',
    room: 'Rooftop Suite',
    text: 'Booking on the website took about a minute. The terrace faces the sunset and we used the daybed every evening. They also arranged our speedboat from the airport.',
  },
  {
    name: 'Marco',
    country: 'Italy',
    month: 'November 2025',
    room: 'Beachfront Room',
    text: 'The room opens straight onto the sand. Very quiet at night. Coffee on the veranda every morning, and after the first day they knew how we take our tea.',
  },
  {
    name: 'Priya',
    country: 'India',
    month: 'January 2026',
    room: 'Garden Suite',
    text: 'We came with our seven-year-old. The daybed was fine for her and they had small life jackets for snorkelling. The island walk is short but she liked the tea shop most.',
  },
  {
    name: 'Sam',
    country: 'Australia',
    month: 'August 2026',
    room: 'Reef View Room',
    text: 'Wi-Fi was reliable, which I needed for two work calls. The reef really is two minutes away. August was windy some afternoons, mornings were calm.',
  },
  {
    name: 'Léa',
    country: 'France',
    month: 'April 2026',
    room: 'Beachfront Room',
    text: 'They booked our speedboat, met us at the jetty with a trolley for the bags, and breakfast was ready at seven the next morning. Very easy from start to finish.',
  },
];
