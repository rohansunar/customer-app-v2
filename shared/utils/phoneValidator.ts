import { z } from 'zod';

export const phoneSchema = z.object({
  phone: z
    .string()
    .trim()
    .length(10, 'Phone number must be exactly 10 digits')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number'),
});

export type PhoneInput = z.infer<typeof phoneSchema>;
