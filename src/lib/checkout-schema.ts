import { z } from 'zod';

export const AU_STATES = [
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'SA', label: 'South Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'ACT', label: 'Australian Capital Territory' },
  { value: 'NT', label: 'Northern Territory' },
] as const;

const stateValues = AU_STATES.map((s) => s.value) as [string, ...string[]];

export const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter the name on the delivery.'),
  email: z.email('Enter an email we can send the confirmation to.'),
  phone: z
    .string()
    .trim()
    .regex(
      /^(\+?61|0)[ -]?[2-478]([ -]?\d){8}$/,
      'Enter an Australian number, e.g. 0412 345 678.',
    ),
  addressLine: z.string().trim().min(5, 'Enter a street number and name.'),
  suburb: z.string().trim().min(2, 'Enter a suburb.'),
  state: z.enum(stateValues, { message: 'Choose a state.' }),
  postcode: z
    .string()
    .trim()
    .regex(/^\d{4}$/, 'Australian postcodes are four digits.'),
  shippingMethod: z.enum(['standard', 'express']),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;
