import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/** 力 — "strength". The brand's own motif, rendered at build time. */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0A0A0A',
        color: '#F2EFE9',
        fontSize: 46,
        lineHeight: 1,
      }}
    >
      力
    </div>,
    size,
  );
}
