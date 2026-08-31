export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
export type Size = (typeof SIZES)[number];

/**
 * Every shot we hold for a piece. The photography is consistent across the
 * range, so the shape is fixed rather than an open array — it lets the gallery,
 * the card hover swap and the lookbook filters all be typed.
 */
export type ProductImages = {
  /** Front print, on model, studio. */
  front: string;
  /** Back print, on model, studio. */
  back: string;
  /** Full-length back three-quarter, studio. */
  full: string;
  /** Artwork composite — used for the collection poster cards. */
  poster: string;
  /** Street/lifestyle frame — used for the hero and the lookbook. */
  street: string;
};

export type Product = {
  slug: string;
  name: string;
  collection: string;
  /** Colourway as printed on the swing tag, e.g. "Steel Blue". */
  colourway: string;
  sku: string;
  priceAud: number;
  salePriceAud?: number;
  /** Two or three sentences — what it is and how it wears. */
  description: string;
  /** One paragraph of lore. This is the reason someone buys the piece. */
  story: string;
  /** The kanji printed on the garment, with a reading and a translation. */
  kanji: { glyphs: string; romaji: string; meaning: string };
  images: ProductImages;
  /** Units on hand per size. 0 = sold out and stays sold out. */
  stock: Record<Size, number>;
  tags: string[];
  /** Colourway hex, used only for the poster rail and active gallery thumb. */
  accent: string;
  /** ISO date, drives "newest first" sorting. */
  releasedAt: string;
  limited: true;
};

export type CartItem = { slug: string; size: Size; qty: number };

export type ShippingMethod = 'standard' | 'express';

export type Totals = {
  subtotal: number;
  savings: number;
  shipping: number;
  total: number;
};

export type ShippingAddress = {
  fullName: string;
  email: string;
  phone: string;
  addressLine: string;
  suburb: string;
  state: string;
  postcode: string;
};

export type Order = {
  id: string;
  items: Array<CartItem & { name: string; unitPrice: number; image: string }>;
  shipping: ShippingAddress;
  shippingMethod: ShippingMethod;
  totals: Totals;
  placedAt: string;
};
