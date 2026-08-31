import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Accordion } from '@/components/Accordion';
import { BuyBox } from '@/components/BuyBox';
import { ProductGallery } from '@/components/ProductGallery';
import { ProductGrid } from '@/components/ProductGrid';
import { SectionHeading } from '@/components/Section';
import { Badge } from '@/components/ui/Badge';
import { Price } from '@/components/ui/Price';
import { getProduct, getRelated, products } from '@/data/products';
import { discountPct, isSoldOut, totalStock, unitPrice } from '@/lib/pricing';
import { absoluteUrl } from '@/lib/site';

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: 'Not found' };

  const title = product.name;
  const description = `${product.description.split('.')[0]}. ${product.colourway}, oversized 240gsm cotton. ${
    isSoldOut(product) ? 'Sold out.' : 'Limited stock, no restocks.'
  }`;

  return {
    title,
    description,
    alternates: { canonical: `/drop/${product.slug}` },
    openGraph: {
      type: 'website',
      title: `${title} — ZENJI`,
      description,
      url: absoluteUrl(`/drop/${product.slug}`),
      images: [
        { url: product.images.front, width: 1122, height: 1402, alt: product.name },
      ],
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = getRelated(product.slug);
  const soldOut = isSoldOut(product);
  const remaining = totalStock(product);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: product.name,
        sku: product.sku,
        description: product.description,
        image: [product.images.front, product.images.back, product.images.street].map(
          (p) => absoluteUrl(p),
        ),
        color: product.colourway,
        material: '100% cotton, 240gsm',
        brand: { '@type': 'Brand', name: 'ZENJI' },
        offers: {
          '@type': 'Offer',
          url: absoluteUrl(`/drop/${product.slug}`),
          priceCurrency: 'AUD',
          price: unitPrice(product).toFixed(2),
          itemCondition: 'https://schema.org/NewCondition',
          availability: soldOut
            ? 'https://schema.org/SoldOut'
            : 'https://schema.org/InStock',
          seller: { '@type': 'Organization', name: 'ZENJI' },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'The Origin Drop',
            item: absoluteUrl('/drop'),
          },
          { '@type': 'ListItem', position: 3, name: product.name },
        ],
      },
    ],
  };

  return (
    <div className="pb-24 lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="shell py-6">
        <nav aria-label="Breadcrumb">
          <ol className="label text-ash flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-bone">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/drop" className="hover:text-bone">
                {product.collection}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-bone">
              {product.name}
            </li>
          </ol>
        </nav>
      </div>

      <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-12">
        {/* min-w-0: a grid item defaults to min-width:auto, so without this the
            gallery's thumbnail rail would set the track width on a phone. */}
        <div className="min-w-0 lg:col-span-7">
          <div className="lg:sticky lg:top-24">
            <ProductGallery product={product} />
          </div>
        </div>

        <div className="min-w-0 lg:col-span-5 lg:py-2">
          <div className="flex flex-wrap items-center gap-2">
            {product.salePriceAud && (
              <Badge tone="sale">−{discountPct(product)}% off</Badge>
            )}
            {product.tags.includes('new') && <Badge tone="new">Just dropped</Badge>}
            {!soldOut && remaining <= 12 && (
              <Badge tone="low">{remaining} left in the drop</Badge>
            )}
            {soldOut && <Badge tone="quiet">Sold out</Badge>}
          </div>

          <h1 className="font-display text-display-l mt-4 uppercase">{product.name}</h1>

          <p className="label text-ash mt-3">
            {product.colourway} · {product.sku}
          </p>

          <Price product={product} size="lg" className="mt-6" />

          <p className="text-ash mt-6 max-w-[52ch] leading-relaxed">
            {product.description}
          </p>

          <BuyBox product={product} />

          <figure className="border-flame mt-10 border-l-2 pl-5">
            <blockquote className="text-bone max-w-[52ch] leading-relaxed">
              {product.story}
            </blockquote>
            <figcaption className="label text-ash mt-4">
              <span className="font-jp text-bone text-base tracking-normal">
                {product.kanji.glyphs}
              </span>{' '}
              — {product.kanji.romaji}, “{product.kanji.meaning}”
            </figcaption>
          </figure>

          <Accordion
            className="mt-10"
            items={[
              {
                title: 'Fabric & fit',
                body: (
                  <ul className="space-y-2">
                    <li>240gsm heavyweight 100% cotton, garment washed.</li>
                    <li>Oversized boxy cut with a dropped shoulder.</li>
                    <li>
                      Screen-printed front and back. Ribbed collar, twin-needle hems.
                    </li>
                    <li>
                      Model is 175cm and wears a size <strong>L</strong>.
                    </li>
                    <li>Cold machine wash inside out. Do not tumble dry the print.</li>
                  </ul>
                ),
              },
              {
                id: 'sizing',
                title: 'Size guide',
                body: (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[420px] border-collapse text-left">
                      <thead>
                        <tr className="label text-ash">
                          <th scope="col" className="py-2 pr-4 font-normal">
                            Size
                          </th>
                          <th scope="col" className="py-2 pr-4 font-normal">
                            Chest (cm)
                          </th>
                          <th scope="col" className="py-2 pr-4 font-normal">
                            Length (cm)
                          </th>
                          <th scope="col" className="py-2 font-normal">
                            Sleeve (cm)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ['XS', 52, 68, 21],
                          ['S', 55, 70, 22],
                          ['M', 58, 72, 23],
                          ['L', 61, 74, 24],
                          ['XL', 64, 76, 25],
                          ['XXL', 67, 78, 26],
                        ].map(([size, chest, length, sleeve]) => (
                          <tr key={size} className="border-ink-line border-t">
                            <th scope="row" className="text-bone py-2 pr-4 font-normal">
                              {size}
                            </th>
                            <td className="py-2 pr-4">{chest}</td>
                            <td className="py-2 pr-4">{length}</td>
                            <td className="py-2">{sleeve}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="mt-4">
                      Measured flat, half chest. Between sizes? Take the smaller one for a
                      cleaner shoulder.
                    </p>
                  </div>
                ),
              },
              {
                title: 'Shipping & returns',
                body: (
                  <ul className="space-y-2">
                    <li>Standard shipping A$9.95, free on orders over A$150.</li>
                    <li>Express A$14.95. Orders placed before 2pm AEST ship same day.</li>
                    <li>Melbourne metro 1–3 days, rest of Australia 3–7 days.</li>
                    <li>
                      30 days to return unworn pieces with tags. Sale items included.{' '}
                      <Link href="/faq">Full policy</Link>.
                    </li>
                  </ul>
                ),
              },
            ]}
          />
        </div>
      </div>

      <section className="shell mt-section">
        <SectionHeading
          eyebrow="From the same drop"
          title="You may also like"
          action={{ href: '/drop', label: 'All ten pieces' }}
        />
        <div className="pb-section mt-10">
          <ProductGrid products={related} />
        </div>
      </section>
    </div>
  );
}
