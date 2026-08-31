'use client';

import { useState } from 'react';
import { z } from 'zod';
import { btn } from '@/components/ui/button';
import { CheckIcon } from '@/components/ui/icons';

const emailSchema = z.email();

/**
 * Frontend only, as briefed — there is no list to post to. It validates, gives
 * real feedback, and says plainly that nothing was sent, rather than faking a
 * success state.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'error' | 'done'>('idle');

  if (state === 'done') {
    return (
      <p className="border-ink-line text-bone mt-6 flex items-start gap-3 border p-4 text-sm">
        <CheckIcon className="text-flame mt-0.5 h-4 w-4 shrink-0" />
        <span>
          You’re on the list for the next drop.
          <span className="text-ash mt-1 block">
            Demo build — this form validates in the browser and doesn’t send anything.
          </span>
        </span>
      </p>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setState(emailSchema.safeParse(email).success ? 'done' : 'error');
      }}
      className="mt-6"
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === 'error') setState('idle');
          }}
          placeholder="you@email.com"
          aria-invalid={state === 'error'}
          aria-describedby={state === 'error' ? 'newsletter-error' : undefined}
          className="border-ink-line bg-ink-raised text-bone placeholder:text-ash focus:border-flame h-12 flex-1 border px-4 text-sm focus:outline-none"
        />
        <button type="submit" className={btn('secondary', 'md', 'sm:w-auto')}>
          Join
        </button>
      </div>
      {state === 'error' && (
        <p id="newsletter-error" role="alert" className="text-danger mt-2 text-sm">
          That email doesn’t look right.
        </p>
      )}
    </form>
  );
}
