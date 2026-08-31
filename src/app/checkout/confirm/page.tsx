import type { Metadata } from 'next';
import { OrderConfirmation } from '@/components/OrderConfirmation';

export const metadata: Metadata = {
  title: 'Order confirmed',
  robots: { index: false, follow: false },
};

export default function ConfirmPage() {
  return <OrderConfirmation />;
}
