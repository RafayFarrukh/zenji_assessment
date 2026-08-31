/**
 * Re-mounts on every navigation, which gives each route an entry without any
 * router plumbing.
 *
 * Transform only — deliberately no opacity. A page that fades in from zero
 * delays the largest-contentful paint by the length of the fade, and the hero
 * photograph is the LCP element on this site.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-enter">{children}</div>;
}
