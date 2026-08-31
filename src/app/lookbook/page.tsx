import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Pass } from '@/components/motion/Pass';
import { COLLECTION, products } from '@/data/products';
import { cn } from '@/lib/cn';

export const metadata: Metadata = {
  title: 'Lookbook',
  description:
    'The full visual archive of The Origin Drop — thirty frames across ten pieces, shot in the studio and on the street in Melbourne.',
  alternates: { canonical: '/lookbook' },
};

const VIEWS = [
  { value: 'all', label: 'Everything' },
  { value: 'front', label: 'Front' },
  { value: 'back', label: 'Back' },
  { value: 'street', label: 'On the street' },
] as const;

type View = (typeof VIEWS)[number]['value'];

type Frame = {
  key: string;
  src: string;
  alt: string;
  kind: Exclude<View, 'all'>;
  caption: string;
  slug: string;
  name: string;
};

const frames: Frame[] = products.flatMap((product) => [
  {
    key: `${product.slug}-front`,
    src: product.images.front,
    alt: `${product.name} in ${product.colourway}, front print`,
    kind: 'front' as const,
    caption: 'Front',
    slug: product.slug,
    name: product.name,
  },
  {
    key: `${product.slug}-back`,
    src: product.images.back,
    alt: `${product.name} in ${product.colourway}, back print`,
    kind: 'back' as const,
    caption: 'Back',
    slug: product.slug,
    name: product.name,
  },
  {
    key: `${product.slug}-street`,
    src: product.images.street,
    alt: `${product.name} worn on the street`,
    kind: 'street' as const,
    caption: 'On the street',
    slug: product.slug,
    name: product.name,
  },
]);

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function LookbookPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const raw = params.view;
  const view: View = VIEWS.some((v) => v.value === raw) ? (raw as View) : 'all';
  const visible = view === 'all' ? frames : frames.filter((f) => f.kind === view);

  return (
    <div className="shell py-12 lg:py-16">
      <header className="border-ink-line border-b pb-8">
        <p className="label text-flame">Editorial — {COLLECTION}</p>
        <h1 className="font-display text-display-xl mt-4 uppercase">Lookbook</h1>
        <p className="text-body-l text-ash mt-6 max-w-[56ch]">
          Thirty frames across ten pieces. Studio for the print detail, street for how
          they actually wear. Every frame links back to the piece.
        </p>
      </header>

      <div className="border-ink-line flex flex-wrap items-center justify-between gap-4 border-b py-6">
        <ul className="flex flex-wrap gap-2">
          {VIEWS.map((option) => {
            const active = option.value === view;
            return (
              <li key={option.value}>
                <Link
                  href={
                    option.value === 'all'
                      ? '/lookbook'
                      : `/lookbook?view=${option.value}`
                  }
                  scroll={false}
                  aria-current={active ? 'true' : undefined}
                  className={cn(
                    'label inline-flex h-10 items-center border px-4 transition-colors',
                    active
                      ? 'border-bone bg-bone text-ink'
                      : 'border-ink-line text-ash hover:border-bone hover:text-bone',
                  )}
                >
                  {option.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="label text-ash" role="status">
          {visible.length} images
        </p>
      </div>

      <ul className="mt-10 columns-2 gap-4 md:columns-3 xl:columns-4 [&>li]:mb-4">
        {visible.map((frame, i) => (
          <li key={frame.key} className="break-inside-avoid">
            <Pass delay={(i % 4) * 70}>
              <Link href={`/drop/${frame.slug}`} className="group block">
                <div
                  className={cn(
                    'bg-ink-raised relative overflow-hidden',
                    frame.kind === 'street' ? 'aspect-[3/4]' : 'aspect-[4/5]',
                  )}
                >
                  <Image
                    src={frame.src}
                    alt={frame.alt}
                    fill
                    loading={i < 4 ? undefined : 'lazy'}
                    priority={i < 4}
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                  />
                  <span
                    aria-hidden
                    className="bg-ink/0 group-hover:bg-ink/20 absolute inset-0 transition-colors duration-500"
                  />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <p className="label text-bone truncate">{frame.name}</p>
                  <p className="label text-ash shrink-0">{frame.caption}</p>
                </div>
              </Link>
            </Pass>
          </li>
        ))}
      </ul>
    </div>
  );
}
