import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
