import { z } from 'zod';

export const addressSchema = z.object({
  // Basic schema consistency with vendor-app
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(5, 'Address is too short'),
  latitude: z.number(),
  longitude: z.number(),
});
