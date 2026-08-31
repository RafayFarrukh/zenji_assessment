'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { btn } from '@/components/ui/button';
import { CheckIcon } from '@/components/ui/icons';
import { readOrder } from '@/lib/order-storage';
import { formatAud } from '@/lib/pricing';
import type { Order } from '@/lib/types';

/**
 * Reads the order back out of sessionStorage in an effect, so the server HTML
 * and the first client render agree and nothing hydrates twice.
 */
export function OrderConfirmation() {
  const [order, setOrder] = useState<Order | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setOrder(readOrder());
    setChecked(true);
  }, []);

  if (!checked) {
    return <div className="shell py-24" aria-busy="true" />;
  }

  if (!order) {
    return (
      <div className="shell py-24 text-center">
        <h1 className="font-display text-display-l uppercase">No order to show</h1>
        <p className="text-ash mx-auto mt-4 max-w-[42ch]">
          Confirmations live for the length of a browser session. If you have just placed
          an order the details were shown here at the time.
        </p>
        <Link href="/drop" className={btn('primary', 'lg', 'mt-8')}>
          Back to the drop
        </Link>
      </div>
    );
  }

  const eta =
    order.shippingMethod === 'express' ? '1–3 business days' : '3–7 business days';

  return (
    <div className="shell py-12 lg:py-20">
      <div className="flex items-center gap-3">
        <span className="bg-flame text-bone flex h-9 w-9 items-center justify-center">
          <CheckIcon className="h-5 w-5" />
        </span>
        <p className="label text-flame">Order placed</p>
      </div>

      <h1 className="font-display text-display-xl mt-6 uppercase">Thank you.</h1>
      <p className="text-body-l text-ash mt-6 max-w-[54ch]">
        Your order is confirmed. A receipt is on its way to{' '}
        <span className="text-bone">{order.shipping.email}</span>. Pieces are packed in
        Melbourne and dispatched within one business day.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <dl className="border-ink-line grid grid-cols-2 gap-6 border-y py-6 sm:grid-cols-3">
            <div>
              <dt className="label text-ash">Order number</dt>
              <dd className="font-display mt-2 text-xl">{order.id}</dd>
            </div>
            <div>
              <dt className="label text-ash">Arriving</dt>
              <dd className="font-display mt-2 text-xl">{eta}</dd>
            </div>
            <div>
              <dt className="label text-ash">Total paid</dt>
              <dd className="font-display mt-2 text-xl">
                {formatAud(order.totals.total)}
              </dd>
            </div>
          </dl>

          <h2 className="font-display text-display-m mt-10 uppercase">Shipping to</h2>
          <address className="text-ash mt-4 text-sm leading-relaxed not-italic">
            <span className="text-bone block">{order.shipping.fullName}</span>
            {order.shipping.addressLine}
            <br />
            {order.shipping.suburb} {order.shipping.state} {order.shipping.postcode}
            <br />
            Australia
            <br />
            {order.shipping.phone}
          </address>

          <h2 className="font-display text-display-m mt-10 uppercase">
            What happens next
          </h2>
          <ol className="text-ash mt-4 space-y-4 text-sm">
            {[
              'We pick and pack your pieces in Melbourne, usually the same day.',
              'You get a tracking number by email as soon as the parcel is scanned.',
              'Thirty days to return anything unworn with tags — sale pieces included.',
            ].map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="label text-flame shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/drop" className={btn('primary', 'lg')}>
              Keep shopping
            </Link>
            <Link href="/lookbook" className={btn('secondary', 'lg')}>
              See the lookbook
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="border-ink-line border">
            <h2 className="border-ink-line font-display border-b px-5 py-4 text-lg uppercase">
              Your pieces
            </h2>
            <ul className="divide-ink-line divide-y px-5">
              {order.items.map((item) => (
                <li key={`${item.slug}:${item.size}`} className="flex gap-4 py-4">
                  <div className="bg-ink-raised relative aspect-[4/5] w-14 shrink-0 overflow-hidden">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display truncate text-sm uppercase">{item.name}</p>
                    <p className="label text-ash mt-1">
                      Size {item.size} · Qty {item.qty}
                    </p>
                  </div>
                  <p className="font-display shrink-0 text-sm">
                    {formatAud(item.unitPrice * item.qty)}
                  </p>
                </li>
              ))}
            </ul>
            <dl className="border-ink-line space-y-3 border-t px-5 py-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ash">Subtotal</dt>
                <dd>{formatAud(order.totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ash">Shipping</dt>
                <dd>
                  {order.totals.shipping === 0
                    ? 'Free'
                    : formatAud(order.totals.shipping)}
                </dd>
              </div>
              <div className="border-ink-line flex items-baseline justify-between border-t pt-4">
                <dt className="label text-ash">Total</dt>
                <dd className="font-display text-2xl">{formatAud(order.totals.total)}</dd>
              </div>
            </dl>
          </div>
          <p className="text-ash mt-4 text-xs leading-relaxed">
            Demonstration build — no payment was processed and no email will arrive.
          </p>
        </div>
      </div>
    </div>
  );
}
