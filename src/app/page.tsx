import Image from 'next/image';
import Link from 'next/link';
import { DropCountdown } from '@/components/DropCountdown';
import { Hero } from '@/components/Hero';
import { PosterCard } from '@/components/PosterCard';
import { ProductGrid } from '@/components/ProductGrid';
import { SectionHeading } from '@/components/Section';
import { CountUp } from '@/components/motion/CountUp';
import { MagneticLink } from '@/components/motion/Magnetic';
import { Pass } from '@/components/motion/Pass';
import { btn } from '@/components/ui/button';
import { COLLECTION, getFeatured, getProduct, products } from '@/data/products';

const STREET_SLUGS = ['warrior-spirit-tee', 'demon-blood-tee', 'water-breathing-tee'];

const STATS = [
  { value: 240, suffix: 'gsm', label: 'Heavyweight cotton' },
  { value: 10, label: 'Pieces in the drop' },
  { value: 0, label: 'Restocks, ever' },
  { value: 150, prefix: 'A$', label: 'Free shipping over' },
];

export default function HomePage() {
  const hero = getProduct('blue-flame-tee');
  const featured = getFeatured();
  const street = STREET_SLUGS.map((slug) => getProduct(slug)).filter(
    (p) => p !== undefined,
  );

  return (
    <>
      {hero && <Hero product={hero} />}

      <DropCountdown />

      {/* Collection strip */}
      <section className="shell py-section">
        <Pass bar>
          <SectionHeading
            eyebrow={COLLECTION}
            title="Four that go first"
            action={{ href: '/drop', label: 'All ten pieces' }}
          />
        </Pass>
        <ul
          data-scroller
          className="hide-scrollbar -mx-gutter px-gutter mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto md:mx-0 md:grid md:grid-cols-2 md:px-0 xl:grid-cols-4"
        >
          {featured.map((product, i) => (
            <li
              key={product.slug}
              className="w-[72vw] shrink-0 snap-start sm:w-[46vw] md:w-auto"
            >
              <Pass delay={i * 80}>
                <PosterCard product={product} />
              </Pass>
            </li>
          ))}
        </ul>
      </section>

      {/* Manifesto */}
      <section className="border-ink-line bg-ink-raised border-y">
        <div className="shell py-section grid gap-10 lg:grid-cols-12 lg:gap-8">
          <p className="label text-flame lg:col-span-3">Manifesto</p>
          <div className="lg:col-span-9">
            <Pass>
              <p className="font-display text-display-l text-balance uppercase">
                We make ten things properly, then we stop.
              </p>
            </Pass>
            <div className="text-body-l text-ash mt-8 grid gap-6 md:grid-cols-2 md:gap-10">
              <Pass delay={80}>
                <p className="max-w-[52ch]">
                  ZENJI started in a Melbourne bedroom with one screenprint and a group
                  chat. The rule has not changed since: heavyweight cotton, an oversized
                  cut that actually falls right, and artwork drawn for the piece rather
                  than pulled off a stock library.
                </p>
              </Pass>
              <Pass delay={160}>
                <p className="max-w-[52ch]">
                  A drop is a fixed number of garments. When a size sells through, that is
                  the end of it — no reprints, no “back by popular demand”. It makes the
                  range harder to run and it is the entire point. What you own stays rare.
                </p>
              </Pass>
            </div>
            {/* One wrapper rather than one per stat: a dl may only contain
                dt/dd groups or plain divs, and the numbers carry their own
                animation anyway. */}
            <Pass>
              <dl className="border-ink-line mt-12 grid grid-cols-2 gap-y-8 border-t pt-8 md:grid-cols-4">
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <dt className="font-display text-display-m">
                      <CountUp
                        value={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                      />
                    </dt>
                    <dd className="label text-ash mt-2">{stat.label}</dd>
                  </div>
                ))}
              </dl>
            </Pass>
          </div>
        </div>
      </section>

      {/* Full range */}
      <section className="shell py-section">
        <Pass bar>
          <SectionHeading
            eyebrow="The full range"
            title="All ten pieces"
            action={{ href: '/drop', label: 'Filter and sort' }}
          />
        </Pass>
        <div className="mt-10">
          <ProductGrid products={products} />
        </div>
      </section>

      {/* Lifestyle */}
      <section className="border-ink-line border-t">
        <div className="shell py-section">
          <Pass bar>
            <SectionHeading
              eyebrow="Off the studio floor"
              title="On the street"
              action={{ href: '/lookbook', label: 'Full lookbook' }}
            />
          </Pass>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {street.map((product, i) => (
              <li key={product.slug}>
                <Pass delay={i * 90}>
                  <Link href={`/drop/${product.slug}`} className="group block">
                    <div className="bg-ink-raised relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={product.images.street}
                        alt={`${product.name} worn on the street`}
                        fill
                        loading="lazy"
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                      />
                    </div>
                    <p className="label text-ash group-hover:text-bone mt-4 flex items-center gap-2 transition-colors">
                      {product.name} — {product.colourway}
                      <span
                        aria-hidden
                        className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1.5"
                      >
                        →
                      </span>
                    </p>
                  </Link>
                </Pass>
              </li>
            ))}
          </ul>

          <div className="border-ink-line mt-12 flex flex-wrap items-center gap-4 border-t pt-10">
            <p className="font-display text-display-m uppercase">
              The drop is live. Sizes are not coming back.
            </p>
            <div className="ml-auto">
              <MagneticLink href="/drop" className={btn('primary', 'lg')}>
                Shop the drop
              </MagneticLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
