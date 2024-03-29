import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address.')
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export default forgotPasswordSchema;
