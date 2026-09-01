'use client';

import Image from 'next/image';
import { usePointerFine } from '@/components/motion/use-pointer-fine';

/**
 * The back print exists only to be revealed on hover, so it is only downloaded
 * on devices that can hover. On a phone this is ten fewer image requests on the
 * home page and the drop listing — roughly a third of the page's image weight,
 * on exactly the connections that can least afford it.
 *
 * It renders after hydration, which is early enough: it is lazy anyway and is
 * not needed until a pointer is over the card.
 */
export function BackPrint({
  src,
  sizes,
  alt = '',
}: {
  src: string;
  sizes: string;
  alt?: string;
}) {
  const canHover = usePointerFine();
  if (!canHover) return null;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      loading="lazy"
      className="object-cover"
    />
  );
}
