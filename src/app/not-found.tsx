import Link from 'next/link';
import { btn } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col justify-center py-20">
      <p className="label text-flame">Error 404</p>
      <h1 className="font-display text-display-xl mt-4 uppercase">
        This one’s already gone.
      </h1>
      <p className="text-body-l text-ash mt-6 max-w-[48ch]">
        The page you were after doesn’t exist — or it was a piece from a drop that has
        sold through. Either way, we don’t restock, but there are ten pieces live right
        now.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Link href="/drop" className={btn('primary', 'lg')}>
          Shop the drop
        </Link>
        <Link href="/" className={btn('secondary', 'lg')}>
          Back to home
        </Link>
      </div>
      <p className="label text-ash mt-16">
        <span className="font-jp text-bone text-base tracking-normal">一期一会</span> —
        one meeting, one chance
      </p>
    </div>
  );
}
