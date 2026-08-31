'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OrderSummary } from '@/components/OrderSummary';
import { btn } from '@/components/ui/button';
import { products } from '@/data/products';
import { useCart, useCartHydrated, useCartLines } from '@/lib/cart-store';
import { cn } from '@/lib/cn';
import { AU_STATES, checkoutSchema, type CheckoutValues } from '@/lib/checkout-schema';
import { generateOrderId, saveOrder } from '@/lib/order-storage';
import { cartTotals, formatAud, unitPrice } from '@/lib/pricing';
import type { Order } from '@/lib/types';

const inputBase =
  'h-12 w-full border bg-ink-raised px-4 text-sm text-bone placeholder:text-ash ' +
  'focus:outline-none focus:border-flame';

const SHIPPING_OPTIONS = [
  {
    value: 'standard',
    title: 'Standard',
    detail: '3–7 business days Australia-wide',
    price: 'A$9.95 · free over A$150',
  },
  {
    value: 'express',
    title: 'Express',
    detail: '1–3 business days, tracked',
    price: 'A$14.95',
  },
] as const;

export function CheckoutForm() {
  const router = useRouter();
  const lines = useCartLines();
  const hydrated = useCartHydrated();
  const clear = useCart((s) => s.clear);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { shippingMethod: 'standard', state: 'VIC' },
    mode: 'onBlur',
  });

  const shippingMethod = watch('shippingMethod');
  const totals = cartTotals(
    lines.map((l) => l.item),
    products,
    shippingMethod,
  );

  function onSubmit(values: CheckoutValues) {
    if (lines.length === 0) return;
    setSubmitting(true);

    const order: Order = {
      id: generateOrderId(),
      placedAt: new Date().toISOString(),
      shippingMethod: values.shippingMethod,
      shipping: {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        addressLine: values.addressLine,
        suburb: values.suburb,
        state: values.state,
        postcode: values.postcode,
      },
      items: lines.map(({ item, product }) => ({
        ...item,
        name: product.name,
        unitPrice: unitPrice(product),
        image: product.images.front,
      })),
      totals,
    };

    saveOrder(order);
    clear();
    router.push('/checkout/confirm');
  }

  if (hydrated && lines.length === 0) {
    return (
      <div className="border-ink-line border p-10 text-center">
        <h2 className="font-display text-display-m uppercase">Your cart is empty</h2>
        <p className="text-ash mx-auto mt-3 max-w-[38ch] text-sm">
          Add a piece from the drop and it will show up here with the total and shipping.
        </p>
        <Link href="/drop" className={btn('primary', 'md', 'mt-6')}>
          Shop the drop
        </Link>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-10 lg:grid-cols-12 lg:gap-12"
    >
      <div className="lg:col-span-7">
        <fieldset>
          <legend className="border-ink-line font-display text-display-m flex w-full items-baseline gap-3 border-b pb-4 uppercase">
            <span className="label text-flame">01</span> Contact
          </legend>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field
              label="Full name"
              error={errors.fullName?.message}
              className="sm:col-span-2"
            >
              <input
                {...register('fullName')}
                autoComplete="name"
                placeholder="Alex Nguyen"
                className={cn(
                  inputBase,
                  errors.fullName ? 'border-danger' : 'border-ink-line',
                )}
              />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <input
                {...register('email')}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@email.com"
                className={cn(
                  inputBase,
                  errors.email ? 'border-danger' : 'border-ink-line',
                )}
              />
            </Field>
            <Field label="Phone" error={errors.phone?.message}>
              <input
                {...register('phone')}
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="0412 345 678"
                className={cn(
                  inputBase,
                  errors.phone ? 'border-danger' : 'border-ink-line',
                )}
              />
            </Field>
          </div>
        </fieldset>

        <fieldset className="mt-12">
          <legend className="border-ink-line font-display text-display-m flex w-full items-baseline gap-3 border-b pb-4 uppercase">
            <span className="label text-flame">02</span> Delivery
          </legend>
          <div className="mt-6 grid gap-5 sm:grid-cols-6">
            <Field
              label="Street address"
              error={errors.addressLine?.message}
              className="sm:col-span-6"
            >
              <input
                {...register('addressLine')}
                autoComplete="street-address"
                placeholder="12 Smith Street"
                className={cn(
                  inputBase,
                  errors.addressLine ? 'border-danger' : 'border-ink-line',
                )}
              />
            </Field>
            <Field
              label="Suburb"
              error={errors.suburb?.message}
              className="sm:col-span-3"
            >
              <input
                {...register('suburb')}
                autoComplete="address-level2"
                placeholder="Collingwood"
                className={cn(
                  inputBase,
                  errors.suburb ? 'border-danger' : 'border-ink-line',
                )}
              />
            </Field>
            <Field label="State" error={errors.state?.message} className="sm:col-span-2">
              <select
                {...register('state')}
                autoComplete="address-level1"
                className={cn(
                  inputBase,
                  'appearance-none',
                  errors.state ? 'border-danger' : 'border-ink-line',
                )}
              >
                {AU_STATES.map((s) => (
                  <option key={s.value} value={s.value} className="bg-ink">
                    {s.value}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label="Postcode"
              error={errors.postcode?.message}
              className="sm:col-span-1"
            >
              <input
                {...register('postcode')}
                inputMode="numeric"
                maxLength={4}
                autoComplete="postal-code"
                placeholder="3066"
                className={cn(
                  inputBase,
                  errors.postcode ? 'border-danger' : 'border-ink-line',
                )}
              />
            </Field>
          </div>
        </fieldset>

        <fieldset className="mt-12">
          <legend className="border-ink-line font-display text-display-m flex w-full items-baseline gap-3 border-b pb-4 uppercase">
            <span className="label text-flame">03</span> Shipping
          </legend>
          <div className="mt-6 space-y-3">
            {SHIPPING_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={cn(
                  'flex cursor-pointer items-start gap-4 border p-4 transition-colors',
                  shippingMethod === option.value
                    ? 'border-flame bg-ink-raised'
                    : 'border-ink-line hover:border-bone',
                )}
              >
                <input
                  {...register('shippingMethod')}
                  type="radio"
                  value={option.value}
                  className="mt-1 h-4 w-4 shrink-0 accent-[color:var(--color-flame)]"
                />
                <span className="flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-display text-base uppercase">
                      {option.title}
                    </span>
                    <span className="label text-ash">{option.price}</span>
                  </span>
                  <span className="text-ash mt-1 block text-sm">{option.detail}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-10">
          <button
            type="submit"
            disabled={submitting || lines.length === 0}
            className={btn('primary', 'lg', 'w-full')}
          >
            {submitting ? 'Placing order…' : `Place order · ${formatAud(totals.total)}`}
          </button>
          <p className="text-ash mt-4 text-xs leading-relaxed">
            This is a frontend demonstration build. No payment is taken, no card details
            are requested, and nothing you enter here leaves your browser.
          </p>
        </div>
      </div>

      <aside className="lg:col-span-5">
        <div className="lg:sticky lg:top-24">
          <OrderSummary
            lines={lines}
            totals={totals}
            showMeter={shippingMethod === 'standard'}
          />
        </div>
      </aside>
    </form>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn('block', className)}>
      <span className="label text-ash mb-2 block">{label}</span>
      {children}
      {error && (
        <span role="alert" className="text-danger mt-2 block text-sm">
          {error}
        </span>
      )}
    </label>
  );
}
