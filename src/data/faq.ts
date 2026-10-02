/**
 * Questions guests actually ask. Grouped by topic on /faq, with a few on
 * Home and the room pages. Answers are plain text so they can be reused in
 * FAQPage structured data and llms.txt.
 */

export type FaqTopic = 'Getting here' | 'On the island' | 'Your stay' | 'Booking and payment';

export interface Faq {
  id: string;
  topic: FaqTopic;
  question: string;
  answer: string;
  /** Show on the Home page */
  top?: boolean;
  /** Show on room pages */
  rooms?: boolean;
}

export const faqTopics: FaqTopic[] = ['Getting here', 'On the island', 'Your stay', 'Booking and payment'];

export const faqs: Faq[] = [
  {
    id: 'airport-transfer',
    topic: 'Getting here',
    top: true,
    question: 'How do I get from the airport to Maafushi?',
    answer:
      'Most guests take the shared speedboat from Velana International Airport: about 35 to 45 minutes and about $30 per person each way. A private speedboat takes about 30 minutes and costs about $220 per boat. The public ferry from Malé costs about $2 but takes about 1.5 hours and does not run on Fridays. We can book either speedboat when you book your room. Prices and times are approximate.',
  },
  {
    id: 'bikini-beach',
    topic: 'On the island',
    top: true,
    question: 'Is there a bikini beach on Maafushi, and what are the local rules?',
    answer:
      'Yes. Maafushi is a local island, so swimwear is fine on the designated bikini beach, a 6-minute walk from Driftwood, and on the sandbank and boat trips. Elsewhere on the island, cover shoulders and knees. A sarong or a T-shirt over swimwear is enough. We can lend you a sarong.',
  },
  {
    id: 'alcohol',
    topic: 'On the island',
    top: true,
    question: 'Can I drink alcohol at Driftwood?',
    answer:
      'Alcohol is not sold or served on local islands in the Maldives, including Maafushi, and you cannot bring it with you. A licensed boat bar is moored off the island, and several nearby resorts offer day visits with a bar. We can arrange the boat for either.',
  },
  {
    id: 'cancellation',
    topic: 'Booking and payment',
    top: true,
    question: 'What is the cancellation policy?',
    answer:
      'Free cancellation up to 7 days before check-in. Within 7 days of arrival we charge the first night. If your flight is cancelled, we move your dates at no charge.',
  },
  {
    id: 'best-months',
    topic: 'Your stay',
    top: true,
    question: 'When is the best time to visit?',
    answer:
      'December to April is dry and bright with calm seas. It is also the busiest and most expensive time, and January fills up early. May to October is the quiet season: lower rates, warm water, more wind and the odd shower. November is a good middle ground. For snorkeling visibility, February to April is usually best.',
  },
  {
    id: 'payment',
    topic: 'Booking and payment',
    question: 'How and when do I pay?',
    answer:
      'For a real Driftwood stay you would pay at the guesthouse, by card or in US dollars, during your stay. Nothing is charged when you book. On this concept site no booking is made and no payment is taken.',
  },
  {
    id: 'included',
    topic: 'Your stay',
    rooms: true,
    question: 'What is included in the room rate?',
    answer:
      'Breakfast for every guest, Wi-Fi, beach towels, snorkel bags, filtered drinking water and daily housekeeping. Service charge, GST and the Maldives Green Tax are shown as separate lines in your quote. Transfers and experiences are optional extras.',
  },
  {
    id: 'children',
    topic: 'Your stay',
    rooms: true,
    question: 'Can we bring children?',
    answer:
      'Yes. The Garden Suite and the Beachfront Room sleep three, so they suit a family with one child. Children aged 2 to 11 count as guests. Babies under 2 stay free and we provide a cot. The water near the beach is shallow, and we have small masks and life jackets.',
  },
  {
    id: 'wifi-power',
    topic: 'Your stay',
    rooms: true,
    question: 'Is there Wi-Fi, and what plugs do you use?',
    answer:
      'There is fast Wi-Fi in every room and on the terrace. Power is 230V, and every room has universal sockets that take UK, European and US plugs, plus USB-C. Mobile data works across the island, and you can buy a local SIM at the airport.',
  },
  {
    id: 'check-in',
    topic: 'Your stay',
    rooms: true,
    question: 'What time are check-in and check-out?',
    answer:
      'Check-in is from 2pm and check-out is by 12pm. When you book direct, late checkout until 3pm is free if the room is not needed. If you arrive early, we keep your bags and serve breakfast while the room is prepared.',
  },
];
