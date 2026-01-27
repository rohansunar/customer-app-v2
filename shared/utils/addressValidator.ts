import { z } from 'zod';

export const addressValidator = z
  .string()
  .trim()
  .min(10, 'Address must be at least 10 characters')
  .max(200, 'Address is too long')
  // must contain at least one letter
  .refine(
    (val) => /[a-zA-Z]/.test(val),
    'Address must contain street or locality name',
  )
  // must contain at least one number (house / flat / building)
  .refine(
    (val) => /\d/.test(val),
    'Address must include house, flat, or building number',
  );
