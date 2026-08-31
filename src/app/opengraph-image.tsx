import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Pulls the display face at build time so the card matches the site. If the
 * fetch fails the card still renders in the default face rather than the whole
 * build going down over a font.
 */
async function loadAnton(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Anton&display=swap',
      {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      },
    ).then((res) => res.text());
    const url = css.match(/src: url\((https:\/\/[^)]+)\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((res) => res.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const anton = await loadAnton();

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#0A0A0A',
        color: '#F2EFE9',
        padding: 72,
        fontFamily: anton ? 'Anton' : 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ fontSize: 40, letterSpacing: 8 }}>ZENJI</div>
        <div style={{ height: 1, flex: 1, background: '#242424' }} />
        <div style={{ fontSize: 20, letterSpacing: 6, color: '#8A8680' }}>
          ORIGIN DROP 01
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 116, lineHeight: 1, letterSpacing: -3 }}>
          NO RESTOCKS.
        </div>
        <div style={{ fontSize: 116, lineHeight: 1, letterSpacing: -3 }}>
          NO SECOND CHANCES.
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ width: 10, height: 10, background: '#2F6BFF' }} />
        <div style={{ fontSize: 26, letterSpacing: 3, color: '#8A8680' }}>
          Anime streetwear · Melbourne · Ten pieces, limited stock
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: anton
        ? [{ name: 'Anton', data: anton, style: 'normal' as const, weight: 400 as const }]
        : undefined,
    },
  );
}
