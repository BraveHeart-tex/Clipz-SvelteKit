import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address.')
    .describe(`type: email, label: Email`),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .describe(`type: password, label: Password`)
});

export type LoginSchema = z.infer<typeof loginSchema>;
