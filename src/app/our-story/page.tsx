import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Pass } from '@/components/motion/Pass';
import { btn } from '@/components/ui/button';
import { getProduct } from '@/data/products';

export const metadata: Metadata = {
  title: 'Our story',
  description:
    'ZENJI is an anime-inspired streetwear label from Melbourne. Heavyweight cotton, oversized cuts, artwork drawn for the piece, and drops that never come back.',
  alternates: { canonical: '/our-story' },
};

const CHAPTERS = [
  {
    year: '2023',
    title: 'One screenprint',
    body: 'A bedroom in Brunswick, a borrowed press and forty tees that took a week to dry. They sold out of a group chat in two days, which was either a good sign or a very small sample size.',
  },
  {
    year: '2024',
    title: 'The rule',
    body: 'We ran the numbers on restocking a piece that had done well and decided not to. A drop is a fixed number of garments. If you own one, nobody else can order it later — that turned out to be the whole product.',
  },
  {
    year: '2025',
    title: 'Drawn, not licensed',
    body: 'Every graphic since has been drawn for the specific garment, in ink, by artists we pay properly. No stock libraries and no traced screencaps. It is slower and it is the difference you can feel at arm’s length.',
  },
  {
    year: '2026',
    title: 'The Origin Drop',
    body: 'Ten pieces, 240gsm, garment washed, printed and packed in Melbourne. The largest range we have made and still the same rule: when a size is gone, it is gone.',
  },
] as const;

const VALUES = [
  {
    kanji: '質',
    romaji: 'shitsu',
    title: 'Weight you can feel',
    body: '240gsm heavyweight cotton, garment washed before it ships so it arrives already soft and stays the shape you bought.',
  },
  {
    kanji: '限',
    romaji: 'gen',
    title: 'Limited on purpose',
    body: 'Fixed runs, no reprints. It costs us sales and it is the only way what you own stays rare.',
  },
  {
    kanji: '縁',
    romaji: 'en',
    title: 'Built with the group chat',
    body: 'Colourways, sizes and what gets drawn next are decided with the people who actually wear it, not a trend report.',
  },
] as const;

export default function OurStoryPage() {
  const hero = getProduct('warrior-spirit-tee');
  const secondary = getProduct('free-soul-tee');

  return (
    <div>
      <section className="shell grid gap-10 py-12 lg:grid-cols-12 lg:gap-12 lg:py-20">
        <div className="lg:col-span-7">
          <p className="label text-flame">Melbourne, Australia</p>
          <h1 className="font-display text-display-l mt-4 text-balance uppercase">
            We make ten things properly, then we stop.
          </h1>
          <p className="text-body-l text-ash mt-8 max-w-[58ch]">
            ZENJI is an anime-inspired streetwear label built by people who grew up
            half-watching subtitles and half-drawing in the margins. We make oversized,
            heavyweight pieces with artwork drawn for the garment — and we make a fixed
            number of each.
          </p>

          <Pass>
            <dl className="border-ink-line mt-12 grid max-w-lg grid-cols-2 gap-y-8 border-t pt-8 sm:grid-cols-3">
              {[
                ['2023', 'Started in Brunswick'],
                ['4', 'Drops a year, maximum'],
                ['Never', 'Restocked'],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display text-display-m">{value}</dt>
                  <dd className="label text-ash mt-2">{label}</dd>
                </div>
              ))}
            </dl>
          </Pass>
        </div>
        {hero && (
          <div className="lg:col-span-5">
            <div className="bg-ink-raised relative aspect-[3/4] overflow-hidden">
              <Image
                src={hero.images.street}
                alt="A ZENJI piece worn on a Melbourne street"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        )}
      </section>

      <section className="border-ink-line bg-ink-raised border-y">
        <div className="shell py-section">
          <h2 className="label text-flame">How it went</h2>
          <Pass>
            <ol className="bg-ink-line mt-10 grid gap-px md:grid-cols-2 xl:grid-cols-4">
              {CHAPTERS.map((chapter) => (
                <li key={chapter.year} className="bg-ink-raised p-6 lg:p-8">
                  <p className="font-display text-display-m text-flame">{chapter.year}</p>
                  <h3 className="font-display mt-4 text-xl uppercase">{chapter.title}</h3>
                  <p className="text-ash mt-3 text-sm leading-relaxed">{chapter.body}</p>
                </li>
              ))}
            </ol>
          </Pass>
        </div>
      </section>

      <section className="shell py-section">
        <Pass>
          <figure className="mx-auto max-w-[46ch] text-center">
            <blockquote className="font-display text-display-l text-balance uppercase">
              “The warrior nobody is watching is the only one that counts.”
            </blockquote>
            <figcaption className="label text-ash mt-6">
              <span className="font-jp text-bone text-base tracking-normal">武士道</span>{' '}
              — bushidō, the way of the warrior
            </figcaption>
          </figure>
        </Pass>
      </section>

      <section className="border-ink-line border-t">
        <div className="shell py-section grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            {secondary && (
              <div className="bg-ink-raised relative aspect-[4/5] overflow-hidden">
                <Image
                  src={secondary.images.poster}
                  alt="ZENJI print artwork, drawn for the garment"
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>
          <div className="lg:col-span-7">
            <h2 className="font-display text-display-l uppercase">What we hold to</h2>
            <Pass>
              <ul className="divide-ink-line border-ink-line mt-10 divide-y border-y">
                {VALUES.map((value) => (
                  <li key={value.title} className="flex gap-6 py-6">
                    <span className="shrink-0 text-center">
                      <span className="font-jp block text-3xl leading-none">
                        {value.kanji}
                      </span>
                      <span className="label text-ash mt-2 block">{value.romaji}</span>
                    </span>
                    <span>
                      <span className="font-display block text-xl uppercase">
                        {value.title}
                      </span>
                      <span className="text-ash mt-2 block text-sm leading-relaxed">
                        {value.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Pass>
          </div>
        </div>
      </section>

      <section className="border-ink-line border-t">
        <div className="shell py-section flex flex-wrap items-center gap-6">
          <p className="font-display text-display-m uppercase">
            The Origin Drop is live now.
          </p>
          <div className="ml-auto flex flex-wrap gap-3">
            <Link href="/drop" className={btn('primary', 'lg')}>
              Shop the drop
            </Link>
            <Link href="/lookbook" className={btn('secondary', 'lg')}>
              See the lookbook
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
