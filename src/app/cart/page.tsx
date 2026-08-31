import type { Metadata } from 'next';
import { CartPageContents } from '@/components/CartPageContents';

export const metadata: Metadata = {
  title: 'Your cart',
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="shell py-12 lg:py-16">
      <header className="border-ink-line border-b pb-8">
        <p className="label text-flame">The Origin Drop</p>
        <h1 className="font-display text-display-l mt-4 uppercase">Your cart</h1>
      </header>
      <CartPageContents />
    </div>
  );
}
