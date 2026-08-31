'use client';

import { useEffect, useState } from 'react';
import { NEXT_DROP_AT, NEXT_DROP_NAME } from '@/data/products';

type Parts = { days: string; hours: string; minutes: string; seconds: string };

const PLACEHOLDER: Parts = { days: '--', hours: '--', minutes: '--', seconds: '--' };
const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0');

function remaining(target: number, now: number): Parts {
  const ms = Math.max(0, target - now);
  const total = Math.floor(ms / 1000);
  return {
    days: pad(Math.floor(total / 86400)),
    hours: pad(Math.floor(total / 3600) % 24),
    minutes: pad(Math.floor(total / 60) % 60),
    seconds: pad(total % 60),
  };
}

/**
 * The counter is the one thing on the page that is genuinely live, so it earns
 * a tick. Each unit re-mounts on change (`key`), which lets the new digits ride
 * up from behind a hard edge — the same move as the hero headline.
 *
 * It renders `--` on the server: a clock is not something a server and a client
 * can ever agree on, and guessing would be a hydration mismatch.
 */
export function DropCountdown() {
  const [parts, setParts] = useState<Parts>(PLACEHOLDER);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const target = new Date(NEXT_DROP_AT).getTime();
    const tick = () => setParts(remaining(target, Date.now()));
    tick();
    setLive(true);
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units: Array<[keyof Parts, string]> = [
    ['days', 'Days'],
    ['hours', 'Hrs'],
    ['minutes', 'Min'],
    ['seconds', 'Sec'],
  ];

  return (
    <section
      aria-labelledby="next-drop"
      className="border-ink-line bg-ink-raised border-b"
    >
      <div className="shell flex flex-col gap-6 py-8 sm:flex-row sm:items-end sm:justify-between lg:py-10">
        <div>
          <p className="label text-flame flex items-center gap-2">
            <span
              aria-hidden
              className="bg-flame inline-block h-1.5 w-1.5 animate-pulse"
              style={{ animationDuration: '1.8s' }}
            />
            Next drop
          </p>
          <h2 id="next-drop" className="font-display text-display-m mt-3 uppercase">
            {NEXT_DROP_NAME}
          </h2>
          <p className="text-ash mt-2 max-w-[44ch] text-sm">
            Drop list first, then socials. The Origin Drop does not come back.
          </p>
        </div>

        <div
          className="flex items-start gap-4 sm:gap-6"
          role="timer"
          aria-live="off"
          aria-label={
            live
              ? `${parts.days} days, ${parts.hours} hours, ${parts.minutes} minutes until the next drop`
              : 'Counting down to the next drop'
          }
        >
          {units.map(([key, label], i) => (
            <div key={key} className="flex items-start gap-4 sm:gap-6">
              <div className="text-center">
                <span className="font-display block min-w-[1.5em] overflow-hidden text-[clamp(1.75rem,5.5vw,3.25rem)] leading-[1.15] tabular-nums">
                  {/* Re-mounting on value change replays the rise. */}
                  <span key={parts[key]} className="line-mask block">
                    <span>{parts[key]}</span>
                  </span>
                </span>
                <span className="label text-ash mt-2 block">{label}</span>
              </div>
              {i < units.length - 1 && (
                <span
                  aria-hidden
                  className="font-display text-ink-line hidden text-[clamp(1.75rem,5.5vw,3.25rem)] leading-none sm:inline"
                >
                  :
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
