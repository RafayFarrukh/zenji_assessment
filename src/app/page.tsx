import Image from 'next/image';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { PosterCard } from '@/components/PosterCard';
import { ProductGrid } from '@/components/ProductGrid';
import { SectionHeading } from '@/components/Section';
import { btn } from '@/components/ui/button';
import { COLLECTION, getFeatured, getProduct, products } from '@/data/products';

const STREET_SLUGS = ['warrior-spirit-tee', 'demon-blood-tee', 'water-breathing-tee'];

export default function HomePage() {
  const hero = getProduct('blue-flame-tee');
  const featured = getFeatured();
  const street = STREET_SLUGS.map((slug) => getProduct(slug)).filter(
    (p) => p !== undefined,
  );

  return (
    <>
      {hero && <Hero product={hero} />}

      {/* Collection strip */}
      <section className="shell py-section">
        <SectionHeading
          eyebrow={COLLECTION}
          title="Four that go first"
          action={{ href: '/drop', label: 'All ten pieces' }}
        />
        <ul className="hide-scrollbar -mx-gutter px-gutter mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto md:mx-0 md:grid md:grid-cols-2 md:px-0 xl:grid-cols-4">
          {featured.map((product) => (
            <li
              key={product.slug}
              className="w-[72vw] shrink-0 snap-start sm:w-[46vw] md:w-auto"
            >
              <PosterCard product={product} />
            </li>
          ))}
        </ul>
      </section>

      {/* Manifesto */}
      <section className="border-ink-line bg-ink-raised border-y">
        <div className="shell py-section grid gap-10 lg:grid-cols-12 lg:gap-8">
          <p className="label text-flame lg:col-span-3">Manifesto</p>
          <div className="lg:col-span-9">
            <p className="font-display text-display-l text-balance uppercase">
              We make ten things properly, then we stop.
            </p>
            <div className="text-body-l text-ash mt-8 grid gap-6 md:grid-cols-2 md:gap-10">
              <p className="max-w-[52ch]">
                ZENJI started in a Melbourne bedroom with one screenprint and a group
                chat. The rule has not changed since: heavyweight cotton, an oversized cut
                that actually falls right, and artwork drawn for the piece rather than
                pulled off a stock library.
              </p>
              <p className="max-w-[52ch]">
                A drop is a fixed number of garments. When a size sells through, that is
                the end of it — no reprints, no “back by popular demand”. It makes the
                range harder to run and it is the entire point. What you own stays rare.
              </p>
            </div>
            <dl className="border-ink-line mt-12 grid grid-cols-2 gap-y-8 border-t pt-8 md:grid-cols-4">
              {[
                ['240gsm', 'Heavyweight cotton'],
                ['10', 'Pieces in the drop'],
                ['0', 'Restocks, ever'],
                ['A$150', 'Free shipping over'],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display text-display-m">{value}</dt>
                  <dd className="label text-ash mt-2">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Full range */}
      <section className="shell py-section">
        <SectionHeading
          eyebrow="The full range"
          title="All ten pieces"
          action={{ href: '/drop', label: 'Filter and sort' }}
        />
        <div className="mt-10">
          <ProductGrid products={products} />
        </div>
      </section>

      {/* Lifestyle */}
      <section className="border-ink-line border-t">
        <div className="shell py-section">
          <SectionHeading
            eyebrow="Off the studio floor"
            title="On the street"
            action={{ href: '/lookbook', label: 'Full lookbook' }}
          />
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {street.map((product) => (
              <li key={product.slug}>
                <Link href={`/drop/${product.slug}`} className="group block">
                  <div className="bg-ink-raised relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={product.images.street}
                      alt={`${product.name} worn on the street`}
                      fill
                      loading="lazy"
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="label text-ash group-hover:text-bone mt-4 transition-colors">
                    {product.name} — {product.colourway} →
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-ink-line mt-12 flex flex-wrap items-center gap-4 border-t pt-10">
            <p className="font-display text-display-m uppercase">
              The drop is live. Sizes are not coming back.
            </p>
            <Link href="/drop" className={btn('primary', 'lg', 'ml-auto')}>
              Shop the drop
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
