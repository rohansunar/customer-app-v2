import { z } from 'zod';

/* ---------------- Full Address ---------------- */

export const addressTextSchema = z
  .string()
  .trim()
  .min(10, 'Address must be at least 10 characters')
  .max(200, 'Address is too long')
  // must contain letters (street/locality)
  .refine(
    (val) => /[a-zA-Z]/.test(val),
    'Address must contain street or locality name',
  )
  // must contain number (flat/house/building)
  .refine((val) => /\d/.test(val), 'Include flat / house / building number');

/* ---------------- Pincode ---------------- */

export const pincodeSchema = z
  .string()
  .trim()
  .regex(/^[1-9][0-9]{5}$/, 'Enter a valid 6 digit pincode');

/* ---------------- State ---------------- */

export const stateSchema = z
  .string()
  .trim()
  .min(3, 'State is required')
  .max(20, 'Invalid state name')
  .regex(/^[a-zA-Z\s]+$/, 'State must contain only letters');

/* ---------------- City ---------------- */

export const citySchema = z
  .string()
  .trim()
  .min(4, 'City is required')
  .max(60, 'Invalid city name')
  .regex(/^[a-zA-Z\s]+$/, 'City must contain only letters');

/* ---------------- FULL FORM ---------------- */

export const addressFormSchema = z.object({
  addressText: addressTextSchema,
  pincode: pincodeSchema,
  state: stateSchema,
  city: citySchema,
});

export type AddressFormData = z.infer<typeof addressFormSchema>;
