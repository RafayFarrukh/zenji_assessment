import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/CheckoutForm';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Confirm your ZENJI order — delivery details, shipping and totals.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="shell py-12 lg:py-16">
      <header className="border-ink-line border-b pb-8">
        <p className="label text-flame">Almost yours</p>
        <h1 className="font-display text-display-l mt-4 uppercase">Checkout</h1>
      </header>
      <div className="mt-10">
        <CheckoutForm />
      </div>
    </div>
  );
}
