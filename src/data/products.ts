import type { Product, Size } from '@/lib/types';

const img = (slug: string) => ({
  front: `/products/${slug}/1.webp`,
  back: `/products/${slug}/2.webp`,
  full: `/products/${slug}/3.webp`,
  poster: `/products/${slug}/4.webp`,
  street: `/products/${slug}/5.webp`,
});

const stock = (xs: number, s: number, m: number, l: number, xl: number, xxl: number) =>
  ({ XS: xs, S: s, M: m, L: l, XL: xl, XXL: xxl }) satisfies Record<Size, number>;

export const COLLECTION = 'The Origin Drop';
export const FREE_SHIPPING_THRESHOLD_AUD = 150;
export const STANDARD_SHIPPING_AUD = 9.95;
export const EXPRESS_SHIPPING_AUD = 14.95;

/**
 * The whole catalogue. Ten pieces, one drop, no restocks — so this is a typed
 * constant rather than a database. Server Components read it directly.
 */
export const products: Product[] = [
  {
    slug: 'blue-flame-tee',
    name: 'Blue Flame Tee',
    collection: COLLECTION,
    colourway: 'Steel Blue',
    sku: 'ZNJ-BLU-001',
    priceAud: 39.99,
    salePriceAud: 33.99,
    description:
      'Washed steel blue on 240gsm heavyweight cotton, cut oversized with a dropped shoulder. Front portrait print, full-length back column. Garment washed before it ships, so the fade you see is the fade you get.',
    story:
      'Blue burns hotter than red and makes less noise doing it. This one is for the people who stopped announcing what they were going to do and just started doing it — the quiet ones at the back of the room who are already three moves ahead. The print sits low and heavy on the chest so it reads across a train platform.',
    kanji: { glyphs: '青い炎', romaji: 'aoi honō', meaning: 'blue flame' },
    images: img('blue-flame-tee'),
    stock: stock(4, 9, 12, 7, 3, 0),
    tags: ['fire', 'origin-drop', 'sale', 'blue'],
    accent: '#4f7bd1',
    releasedAt: '2026-08-22',
    limited: true,
  },
  {
    slug: 'bushido-tee',
    name: 'Bushido Tee',
    collection: COLLECTION,
    colourway: 'Sand / Earth',
    sku: 'ZNJ-BUS-001',
    priceAud: 39.99,
    description:
      'Sand-dyed heavyweight cotton with an earth-tone screenprint that sits almost tonal in daylight. Oversized body, ribbed collar, side-seam construction. The most restrained piece in the drop.',
    story:
      'Bushidō was never a costume — it was a list of things you do when nobody is checking. Seven virtues, no audience. We printed it in the colours of a training ground rather than a battlefield, because the part nobody photographs is the part that actually makes you.',
    kanji: { glyphs: '武士道', romaji: 'bushidō', meaning: 'the way of the warrior' },
    images: img('bushido-tee'),
    stock: stock(6, 11, 14, 9, 5, 2),
    tags: ['honour', 'origin-drop', 'neutral'],
    accent: '#c2a87c',
    releasedAt: '2026-08-18',
    limited: true,
  },
  {
    slug: 'demon-blood-tee',
    name: 'Demon Blood Tee',
    collection: COLLECTION,
    colourway: 'Crimson Pink',
    sku: 'ZNJ-DEM-001',
    priceAud: 39.99,
    salePriceAud: 33.99,
    description:
      'Faded crimson pink with a black ink portrait and a single vermilion seal at the hem. 240gsm, oversized, garment washed. The loudest colourway we have made and the one that sells first.',
    story:
      'Every good demon story is really about inheritance — the thing in your blood you did not ask for and cannot give back. You can spend your life apologising for it or you can wear it in pink and let people work it out themselves. The seal at the hem reads 滅: destroy.',
    kanji: { glyphs: '鬼の血', romaji: 'oni no chi', meaning: "the demon's blood" },
    images: img('demon-blood-tee'),
    stock: stock(2, 5, 8, 4, 0, 0),
    tags: ['demon', 'origin-drop', 'sale', 'pink'],
    accent: '#e4568c',
    releasedAt: '2026-08-22',
    limited: true,
  },
  {
    slug: 'domain-expansion-tee',
    name: 'Domain Expansion Tee',
    collection: COLLECTION,
    colourway: 'Void Purple',
    sku: 'ZNJ-DOM-001',
    priceAud: 39.99,
    description:
      'Deep void purple, printed edge to edge across the back so the artwork runs off the seams. Heavyweight oversized cut with a boxy drop. Reads black indoors, purple in sunlight.',
    story:
      'A domain is a space where your rules are the only rules — you build it, you hold it, and everything inside it moves at your speed. Most people never build one. Fewer still can keep it open under pressure. This is the piece for the ones already inside theirs.',
    kanji: { glyphs: '領域展開', romaji: 'ryōiki tenkai', meaning: 'domain expansion' },
    images: img('domain-expansion-tee'),
    stock: stock(3, 7, 10, 8, 4, 1),
    tags: ['power', 'origin-drop', 'purple'],
    accent: '#7b4fd6',
    releasedAt: '2026-08-20',
    limited: true,
  },
  {
    slug: 'free-soul-tee',
    name: 'Free Soul Tee',
    collection: COLLECTION,
    colourway: 'Ash White',
    sku: 'ZNJ-FRE-001',
    priceAud: 39.99,
    description:
      'Ash white with a high-contrast black print — the sharpest artwork in the range. Oversized 240gsm cotton, pre-washed so it will not shrink up the body after the first wash.',
    story:
      'Nothing built to hold you was ever built well. The bird on the back is mid-escape, not mid-flight, and that gap matters: freedom is a decision you make on a specific Tuesday, not a personality you were born with. Wear it on the Tuesday.',
    kanji: { glyphs: '自由な魂', romaji: 'jiyū na tamashii', meaning: 'a free soul' },
    images: img('free-soul-tee'),
    stock: stock(5, 8, 11, 6, 2, 0),
    tags: ['freedom', 'origin-drop', 'white'],
    accent: '#d6d2ca',
    releasedAt: '2026-08-16',
    limited: true,
  },
  {
    slug: 'limitless-tee',
    name: 'Limitless Tee',
    collection: COLLECTION,
    colourway: 'Shadow Olive',
    sku: 'ZNJ-LIM-001',
    priceAud: 39.99,
    description:
      'Shadow olive, the most wearable colour in the drop, with a low-contrast tonal print. Oversized fit, heavyweight hand, garment washed. Goes with everything black in your wardrobe.',
    story:
      'The technique with no ceiling is not about strength — it is about refusing to accept the edge of the map someone else drew for you. Olive because this one is not asking for attention. The limit was always negotiable.',
    kanji: { glyphs: '無限', romaji: 'mugen', meaning: 'without limit' },
    images: img('limitless-tee'),
    stock: stock(4, 10, 13, 9, 6, 3),
    tags: ['power', 'origin-drop', 'green'],
    accent: '#6f7a57',
    releasedAt: '2026-08-14',
    limited: true,
  },
  {
    slug: 'paradise-spirit-tee',
    name: 'Paradise Spirit Tee',
    collection: COLLECTION,
    colourway: 'Sage Olive',
    sku: 'ZNJ-PAR-001',
    priceAud: 39.99,
    description:
      'Soft sage olive with a washed-out print that looks like it has already lived a year. Oversized 240gsm cotton with a relaxed neckline. The calmest piece in the drop.',
    story:
      'Still water is not empty water. Underneath the surface there is a current strong enough to move a body, and the people who look most at ease are usually the ones holding the most in place. Paradise is a discipline, not a location.',
    kanji: {
      glyphs: '楽園の魂',
      romaji: 'rakuen no tamashii',
      meaning: 'spirit of paradise',
    },
    images: img('paradise-spirit-tee'),
    stock: stock(3, 6, 9, 7, 4, 2),
    tags: ['calm', 'origin-drop', 'green'],
    accent: '#93a382',
    releasedAt: '2026-08-12',
    limited: true,
  },
  {
    slug: 'warrior-spirit-tee',
    name: 'Warrior Spirit Tee',
    collection: COLLECTION,
    colourway: 'Forest Green',
    sku: 'ZNJ-WAR-001',
    priceAud: 39.99,
    salePriceAud: 33.99,
    description:
      'Deep forest green, heavyweight and boxy, with the drop’s largest back print running collar to hem. Garment washed. The piece people buy a second time in another size.',
    story:
      'This one is not about winning. It is about the round after the one you lost — the walk back to the mark with your hands still shaking. Anyone can look like a warrior on the way in. The spirit is what is left on the way out.',
    kanji: { glyphs: '闘魂', romaji: 'tōkon', meaning: 'fighting spirit' },
    images: img('warrior-spirit-tee'),
    stock: stock(2, 4, 7, 5, 3, 0),
    tags: ['warrior', 'origin-drop', 'sale', 'green'],
    accent: '#3f7a57',
    releasedAt: '2026-08-24',
    limited: true,
  },
  {
    slug: 'water-breathing-tee',
    name: 'Water Breathing Tee',
    collection: COLLECTION,
    colourway: 'Ocean Teal',
    sku: 'ZNJ-WAT-001',
    priceAud: 39.99,
    description:
      'Ocean teal with a flowing white and black print that wraps the back panel. 240gsm oversized cotton, garment washed. Newest addition to the drop and the fastest moving.',
    story:
      'Water does not fight the rock. It arrives, it keeps arriving, and one day the rock is sand. Every form of this technique is the same instruction written ten ways: do not stop, do not harden, do not take it personally. Breathe and keep moving.',
    kanji: { glyphs: '水の呼吸', romaji: 'mizu no kokyū', meaning: 'water breathing' },
    images: img('water-breathing-tee'),
    stock: stock(6, 12, 15, 10, 7, 4),
    tags: ['water', 'origin-drop', 'new', 'blue'],
    accent: '#2e8c9e',
    releasedAt: '2026-08-28',
    limited: true,
  },
  {
    slug: 'will-of-the-sun-tee',
    name: 'Will of the Sun Tee',
    collection: COLLECTION,
    colourway: 'Solar Gold',
    sku: 'ZNJ-WIL-001',
    priceAud: 39.99,
    salePriceAud: 33.99,
    description:
      'Solar gold, the brightest garment dye we run, with a heavy black print that stops it tipping into costume. Oversized heavyweight cotton, garment washed and softened.',
    story:
      'The sun does not decide whether to rise. It has no opinion on your week, your losses or your plans — it simply keeps its appointment, every single morning, for four and a half billion years. That is not motivation. That is a standard.',
    kanji: { glyphs: '太陽の意志', romaji: 'taiyō no ishi', meaning: 'will of the sun' },
    images: img('will-of-the-sun-tee'),
    stock: stock(0, 3, 6, 4, 2, 1),
    tags: ['fire', 'origin-drop', 'sale', 'gold'],
    accent: '#e8a62c',
    releasedAt: '2026-08-26',
    limited: true,
  },
];

/** Four pieces that carry the collection strip on the home page. */
export const FEATURED_SLUGS = [
  'demon-blood-tee',
  'blue-flame-tee',
  'will-of-the-sun-tee',
  'warrior-spirit-tee',
] as const;

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeatured(): Product[] {
  return FEATURED_SLUGS.map((slug) => getProduct(slug)).filter(
    (p): p is Product => p !== undefined,
  );
}

/** Same collection, excluding the piece being viewed. */
export function getRelated(slug: string, limit = 4): Product[] {
  const current = getProduct(slug);
  if (!current) return products.slice(0, limit);
  return products
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      const shared = (p: typeof a) =>
        p.tags.filter((t) => current.tags.includes(t)).length;
      return shared(b) - shared(a);
    })
    .slice(0, limit);
}
