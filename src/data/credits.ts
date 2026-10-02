/**
 * Every photo on the site, with photographer and source.
 * All photos are from Unsplash (free Unsplash License, no Unsplash+ images),
 * downloaded once by `npm run photos`, colour-graded to one warm look and
 * committed to src/assets/photos. Nothing is hotlinked.
 * IMAGES.md explains where each one is used and why it was chosen.
 */

export interface PhotoCredit {
  /** File name in src/assets/photos (without .jpg) */
  key: string;
  /** What the photo shows, in plain words */
  subject: string;
  photographer: string;
  /** Unsplash username, without the @ */
  username: string;
  /** Unsplash photo id */
  id: string;
  /** images.unsplash.com path, used only by the download script */
  cdnPath: string;
  /** Width and height of the original upload, in pixels */
  source: [number, number];
  /**
   * Default focal point, as a CSS object-position. Every crop of this photo
   * (build-time and CSS) is anchored here unless a slot overrides it.
   */
  focus: string;
}

export const photoSource = {
  name: 'Unsplash',
  url: 'https://unsplash.com',
  license: 'Unsplash License',
  licenseUrl: 'https://unsplash.com/license',
} as const;

export const credits: PhotoCredit[] = [
  { key: 'hero-wide', subject: 'Canopy daybed on a terrace, curtains framing a turquoise lagoon', photographer: 'Omar', username: 'ommyjay', id: 'IyvAqGd5Hd0', cdnPath: 'photo-1768047846080-d477e260ff00', source: [6240, 4160], focus: '50% 62%' },
  { key: 'hero-tall', subject: 'The same daybed and lagoon, upright frame', photographer: 'Omar', username: 'ommyjay', id: 'r02TJbjch7I', cdnPath: 'photo-1768047845996-4771cf1a61e9', source: [4160, 6240], focus: '50% 60%' },
  { key: 'house', subject: 'Whitewashed veranda with columns, palms and a lawn', photographer: 'Dinuka Lankaloka', username: 'bawva', id: 'pm3vGgDnb3o', cdnPath: 'photo-1582610191340-fa501e6e5040', source: [5760, 3840], focus: '62% 60%' },
  { key: 'villa-terrace', subject: 'Limestone terrace with rattan loungers and a plunge pool', photographer: 'Pepita Martasya', username: 'pepitamartasya', id: 'OaQ-p0lCmRs', cdnPath: 'photo-1720161263981-84281892ee4b', source: [4160, 6240], focus: '45% 62%' },
  { key: 'plaster-shutter', subject: 'Timber shutter in a plaster wall, palm shadows', photographer: 'Kadir Celep', username: 'kadircelep', id: 'A8aJwJ49rVM', cdnPath: 'photo-1571327352610-1c5484ccc840', source: [4032, 2688], focus: '38% 50%' },
  { key: 'timber-courtyard', subject: 'Timber pavilion and frangipani in a walled courtyard', photographer: 'Shawn', username: 'shawnanggg', id: '74db2s4okvc', cdnPath: 'photo-1692736933732-ad902fc34626', source: [6048, 8064], focus: '50% 55%' },
  { key: 'breakfast', subject: 'Breakfast bowls on a terrace table by the sea', photographer: 'Anastase Maragos', username: 'visualsbyroyalz', id: 'hW-a5RqguOU', cdnPath: 'photo-1781456506947-248b9e0bfed4', source: [5341, 8007], focus: '50% 68%' },
  { key: 'reef-split', subject: 'Reef above and below the waterline', photographer: 'Ishan @seefromthesky', username: 'seefromthesky', id: '8qEuawM_txg', cdnPath: 'photo-1540202403-b7abd6747a18', source: [3000, 4000], focus: '50% 45%' },
  { key: 'reef-coral', subject: 'Hard coral and reef fish', photographer: 'Hiroko Yoshii', username: 'hiro0718', id: '9y7y26C-l4Y', cdnPath: 'photo-1583212292454-1fe6229603b7', source: [3648, 2736], focus: '50% 60%' },
  { key: 'snorkel', subject: 'Snorkeler over a shallow reef', photographer: 'Subtle Cinematics', username: 'subtlecinematics', id: 'O5Fr1BZ-aR4', cdnPath: 'photo-1583364493238-248032147fbd', source: [3391, 2543], focus: '50% 40%' },
  { key: 'sandbank', subject: 'Sandbank from above', photographer: 'Ibrahim Mohamed', username: 'ibbeyz', id: 'DwBiWW-aE5A', cdnPath: 'photo-1613072473431-26027b609d50', source: [3070, 5464], focus: '45% 50%' },
  { key: 'sandbank-wide', subject: 'Curved white sandbank in a turquoise lagoon, from above', photographer: 'Hamdhulla Shakeeb', username: 'handhey', id: 'IGaHJutSeBI', cdnPath: 'photo-1706065992255-03946424cf9d', source: [3982, 2986], focus: '50% 50%' },
  { key: 'boat-sunset', subject: 'Wooden boat on still water at sunset', photographer: 'Inu Etc', username: 'inuetc', id: 'N5n9FDQkmGQ', cdnPath: 'photo-1578981320111-c7e9426cd6e8', source: [3500, 3500], focus: '55% 58%' },
  { key: 'dolphins', subject: 'Dolphins in a turquoise lagoon', photographer: 'Hushaan @fromtinyisles', username: 'fromtinyisles', id: 'MYEycJFNEu8', cdnPath: 'photo-1667537506790-55601bcfe1b4', source: [2389, 2986], focus: '50% 45%' },
  { key: 'street', subject: 'White sand path under palms', photographer: 'World Wanderer', username: 'worldwanderer2024', id: 'TygYYmyHKro', cdnPath: 'photo-1730944531723-6367c8f1bc62', source: [12000, 9000], focus: '50% 62%' },
  { key: 'wet-sand', subject: 'Low sun on wet sand', photographer: 'Harald Attila', username: 'attilandscape', id: '_XqbPS0b2Bw', cdnPath: 'photo-1547325556-6522f323ebd9', source: [4272, 2848], focus: '50% 55%' },
  { key: 'island-aerial', subject: 'Local island and lagoon from the air', photographer: 'Adam Juman', username: 'jumanjiphotos', id: 'p7AvZ7a2N3U', cdnPath: 'photo-1759676120032-f76c4bd0dcc6', source: [6048, 8064], focus: '50% 50%' },
  { key: 'speedboat', subject: 'Speedboat crossing the atoll', photographer: 'Ibrahim Shabil', username: 'shabilphotos', id: 'RKMVOSGWMC8', cdnPath: 'photo-1743657106155-5d968270fbb8', source: [4000, 2667], focus: '50% 55%' },

  { key: 'reef-view-1', subject: 'Whitewashed bedroom with a timber bed', photographer: 'Sanju Pandita', username: 'spxclicks', id: 'TKDF5G6ua1w', cdnPath: 'photo-1718894071528-1108a094cc78', source: [8511, 5674], focus: '50% 74%' },
  { key: 'reef-view-2', subject: 'Linen bed facing a balcony and the sea', photographer: 'Kristina Paparo', username: 'krispaparo', id: 'GJb-5DMv9js', cdnPath: 'photo-1560264981-911bbf4a29b4', source: [3024, 4032], focus: '55% 50%' },
  { key: 'reef-view-3', subject: 'Linen in morning light', photographer: 'Liz Vo', username: 'lvphotos', id: 'pl3sj3DigxM', cdnPath: 'photo-1601276174812-63280a55656e', source: [5677, 8516], focus: '50% 50%' },
  { key: 'reef-view-4', subject: 'Window seat looking out to sea', photographer: 'amelia elite', username: 'ameliaelite', id: 'jltLS_8EmMw', cdnPath: 'photo-1744745257491-acfa043d1caf', source: [2739, 1826], focus: '50% 55%' },
  { key: 'reef-view-5', subject: 'Stone basin on a plaster shelf', photographer: 'Sanibell BV', username: 'sanibell', id: '530lZQXMKGw', cdnPath: 'photo-1595514535116-d0401260e7cf', source: [5472, 3648], focus: '45% 55%' },

  { key: 'garden-suite-1', subject: 'Canopy bed under a high timber ceiling', photographer: 'Didi Paul', username: 'didipaul', id: 'xchTgSqaoTo', cdnPath: 'photo-1737531049186-a20c1f203f50', source: [4718, 3713], focus: '45% 70%' },
  { key: 'garden-suite-2', subject: 'Outdoor rain shower among plants', photographer: 'Alexander Davies', username: 'adelahaye2020', id: 'EL2cArqkB_Y', cdnPath: 'photo-1661069543192-98a5a598ae9e', source: [4000, 2667], focus: '50% 50%' },
  { key: 'garden-suite-3', subject: 'Planted courtyard against white walls', photographer: 'Kirke Kiki', username: 'kikikirke', id: 'ZJB_V7XmsPQ', cdnPath: 'photo-1763914766799-e90cd89d9764', source: [3448, 4592], focus: '50% 60%' },
  { key: 'garden-suite-4', subject: 'Canopy bed with white netting, closer', photographer: 'Didi Paul', username: 'didipaul', id: 'qz_yWytwgcE', cdnPath: 'photo-1737530916785-f91994fcc7d1', source: [5905, 3942], focus: '55% 55%' },
  { key: 'garden-suite-5', subject: 'Linen bed in warm light', photographer: 'Efe Kekikciler', username: 'mutanzom', id: 'APy5TV9HrVo', cdnPath: 'photo-1764867249027-06a1db1c6613', source: [4608, 3456], focus: '50% 50%' },

  { key: 'beachfront-1', subject: 'White linen and a carved timber headboard', photographer: 'Michael DeMarco', username: 'michaelxdemarco', id: 'hdDDRjF34v4', cdnPath: 'photo-1611776592848-774e66450805', source: [3840, 5760], focus: '50% 55%' },
  { key: 'beachfront-2', subject: 'Timber cabanas under palms on a white beach', photographer: 'Zidhan Ibrahim', username: 'xidhern', id: 'nO746fCppak', cdnPath: 'photo-1781436091741-1e13c167dfb2', source: [8796, 5864], focus: '60% 70%' },
  { key: 'beachfront-3', subject: 'Beach and shallow lagoon from above the palms', photographer: 'Adam Juman', username: 'jumanjiphotos', id: 'PqVMpLu8pyA', cdnPath: 'photo-1724163421250-b772094b41b6', source: [4000, 2250], focus: '55% 50%' },
  { key: 'beachfront-4', subject: 'Thatched shade and two loungers on the sand', photographer: 'Datingjungle', username: 'datingjungle', id: '_NfK1MoEPGk', cdnPath: 'photo-1648648500411-abc3ab8d22eb', source: [7837, 5193], focus: '62% 58%' },
  { key: 'beachfront-5', subject: 'Linen against a timber wall', photographer: 'Andreas Haslinger', username: 'andreas_haslinger', id: 'safXxEsD-fs', cdnPath: 'photo-1786107727673-dfb789a4e5c8', source: [4160, 6240], focus: '50% 55%' },

  { key: 'rooftop-1', subject: 'Bright bedroom with glass doors to the terrace', photographer: 'Greg Rivers', username: 'rivphoto', id: 'vvYs67H9Y2E', cdnPath: 'photo-1597126729864-51740ac05236', source: [6000, 4000], focus: '45% 72%' },
  { key: 'rooftop-2', subject: 'Canopy daybed on a terrace at sunset', photographer: 'George Desipris', username: 'desipris', id: 'icZYX3A6nzM', cdnPath: 'photo-1538374316596-a8d246e3e07a', source: [7380, 4145], focus: '50% 58%' },
  { key: 'rooftop-3', subject: 'Canopy daybed with white curtains on a stone terrace', photographer: 'Anastase Maragos', username: 'visualsbyroyalz', id: 'ZEPeidUonGA', cdnPath: 'photo-1668209879635-1a511fd5bf4b', source: [3339, 5949], focus: '50% 52%' },
  { key: 'rooftop-4', subject: 'Lounger facing the evening sea', photographer: 'Datingjungle', username: 'datingjungle', id: 'VTII8TeLmeU', cdnPath: 'photo-1624971687853-547d78e7fd1e', source: [2956, 3941], focus: '50% 62%' },
  { key: 'rooftop-5', subject: 'Stone counter with two basins in a timber-lined bathroom', photographer: 'Caroline Badran', username: '___atmos', id: 'XXsCZqj78wU', cdnPath: 'photo-1779366034539-4c16e979f485', source: [4672, 7008], focus: '62% 70%' },
];

export const creditByKey = (key: string): PhotoCredit | undefined => credits.find((c) => c.key === key);

export const photoUrl = (c: PhotoCredit) => `https://unsplash.com/photos/${c.id}`;
export const photographerUrl = (c: PhotoCredit) => `https://unsplash.com/@${c.username}`;
