import type { Metadata } from 'next';
import Link from 'next/link';
import { Accordion } from '@/components/Accordion';
import { Pass } from '@/components/motion/Pass';

export const metadata: Metadata = {
  title: 'Help — shipping, returns & sizing',
  description:
    'Shipping times and costs, the 30-day return policy, the full size guide, and how to reach a human at ZENJI.',
  alternates: { canonical: '/faq' },
};

const SHIPPING = [
  {
    title: 'What does shipping cost?',
    body: 'Standard shipping is A$9.95 Australia-wide, and free on every order over A$150. Express is A$14.95 flat. We do not ship internationally yet — the drop sizes are too small to do it properly.',
  },
  {
    title: 'How long will it take?',
    body: 'Orders placed before 2pm AEST on a business day are packed the same day. Melbourne metro lands in 1–3 business days, the rest of Australia in 3–7. Express is 1–3 anywhere on the mainland.',
  },
  {
    title: 'Can I track it?',
    body: 'Yes. A tracking number is emailed the moment the parcel is scanned by the carrier, which is usually the evening it leaves us.',
  },
];

const RETURNS = [
  {
    title: 'What is the return window?',
    body: 'Thirty days from delivery. The piece needs to be unworn, unwashed and still have its tags. Sale pieces are included — a discount is not a final sale.',
  },
  {
    title: 'How do I start a return?',
    body: 'Reply to your order confirmation with the order number and which piece is going back. We send a return label and refund to the original payment method within three business days of it arriving.',
  },
  {
    title: 'Can I exchange for another size?',
    body: 'Only while that size is still in the drop. Because we do not restock, an exchange is really a return plus a new order — so if the size you want is showing low stock, order it now and send the first one back.',
  },
];

const SIZING = [
  {
    title: 'How does the fit run?',
    body: 'Everything is cut oversized with a dropped shoulder. Take your usual size for the intended fit, or one down if you want it closer to the body. The model in the product photography is 175cm and wears a size L.',
  },
  {
    title: 'Full measurements',
    body: 'XS 52cm chest / 68cm length · S 55/70 · M 58/72 · L 61/74 · XL 64/76 · XXL 67/78. Measured flat across half the chest, so double it to compare with a tee you already own.',
  },
  {
    title: 'Will it shrink?',
    body: 'Every piece is garment washed before it ships, so the shrink is already out of it. Cold machine wash inside out and hang to dry — the print does not like a tumble dryer.',
  },
];

const CONTACT = [
  {
    title: 'How do I reach a human?',
    body: 'Email admin@zenji.shop or send a DM on Instagram — both reach the same two people. We answer within one business day, usually much faster.',
  },
  {
    title: 'When is the next drop?',
    body: 'It is announced to the drop list first, then Instagram and TikTok. Sign up in the footer and you get the sizes, prices and release time before anyone else.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [...SHIPPING, ...RETURNS, ...SIZING, ...CONTACT].map((item) => ({
    '@type': 'Question',
    name: item.title,
    acceptedAnswer: { '@type': 'Answer', text: item.body },
  })),
};

const SECTIONS = [
  { id: 'shipping', title: 'Shipping', items: SHIPPING },
  { id: 'returns', title: 'Returns', items: RETURNS },
  { id: 'sizing', title: 'Sizing & care', items: SIZING },
  { id: 'contact', title: 'Contact', items: CONTACT },
] as const;

export default function FaqPage() {
  return (
    <div className="shell py-12 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <header className="border-ink-line border-b pb-8">
        <p className="label text-flame">Help</p>
        <h1 className="font-display text-display-xl mt-4 uppercase">
          Shipping, returns & sizing
        </h1>
        <p className="text-body-l text-ash mt-6 max-w-[56ch]">
          Everything we get asked, answered properly. If it is not here,{' '}
          <a href="mailto:admin@zenji.shop" className="text-bone underline">
            email us
          </a>{' '}
          and a person will reply.
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <nav aria-label="Sections" className="lg:col-span-3">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 lg:sticky lg:top-24 lg:block lg:space-y-3">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="label text-ash hover:text-bone transition-colors"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-9">
          {SECTIONS.map((section) => (
            <Pass key={section.id} bar>
              <section id={section.id} className="mb-12 scroll-mt-24">
                <h2 className="font-display text-display-m uppercase">{section.title}</h2>
                <Accordion className="mt-5" items={section.items} />
              </section>
            </Pass>
          ))}

          <div className="border-ink-line border p-6 lg:p-8">
            <h2 className="font-display text-display-m uppercase">Still stuck?</h2>
            <p className="text-ash mt-3 max-w-[52ch] text-sm">
              Email{' '}
              <a href="mailto:admin@zenji.shop" className="text-bone underline">
                admin@zenji.shop
              </a>{' '}
              with your order number, or start from{' '}
              <Link href="/drop" className="text-bone underline">
                the drop
              </Link>{' '}
              if you are still deciding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
