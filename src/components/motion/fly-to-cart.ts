/**
 * Sends a copy of the product image arcing into the cart button.
 *
 * Deliberately plain DOM + the Web Animations API rather than React: it is a
 * throwaway element that lives for 700ms, and routing it through state would
 * mean a render on every add for no benefit. Returns the duration so the caller
 * can choreograph what happens when it lands.
 */
export function flyToCart(imageSrc: string, origin?: DOMRect | null): number {
  if (typeof window === 'undefined') return 0;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 0;

  const target = document.querySelector('[data-cart-target]');
  const from =
    origin ?? document.querySelector('[data-fly-source]')?.getBoundingClientRect();
  if (!target || !from || from.width === 0) return 0;

  const to = target.getBoundingClientRect();
  const duration = 700;

  const node = document.createElement('div');
  node.setAttribute('aria-hidden', 'true');
  Object.assign(node.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    width: `${from.width}px`,
    height: `${from.height}px`,
    backgroundImage: `url("${imageSrc}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center 20%',
    zIndex: '60',
    pointerEvents: 'none',
    willChange: 'transform, opacity',
  } satisfies Partial<CSSStyleDeclaration>);
  document.body.appendChild(node);

  const endScale = Math.max(0.06, 28 / Math.max(from.width, 1));
  const targetX = to.left + to.width / 2 - from.width / 2;
  const targetY = to.top + to.height / 2 - from.height / 2;

  const animation = node.animate(
    [
      { transform: `translate(${from.left}px, ${from.top}px) scale(1)`, opacity: 1 },
      {
        // Arc upward on the way across rather than sliding in a straight line.
        transform: `translate(${(from.left + targetX) / 2}px, ${Math.min(from.top, targetY) - 60}px) scale(0.45)`,
        opacity: 0.95,
        offset: 0.55,
      },
      {
        transform: `translate(${targetX}px, ${targetY}px) scale(${endScale})`,
        opacity: 0.15,
      },
    ],
    { duration, easing: 'cubic-bezier(0.5, 0, 0.35, 1)', fill: 'forwards' },
  );

  animation.onfinish = () => node.remove();
  animation.oncancel = () => node.remove();

  return duration;
}
