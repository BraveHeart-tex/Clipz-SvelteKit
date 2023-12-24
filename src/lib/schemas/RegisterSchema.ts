import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  fullName: z.string().min(2, 'Please enter your full name'),
  password: z
    .string()
    .min(8, 'Please must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export default registerSchema;
