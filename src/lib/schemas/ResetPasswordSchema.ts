import { z } from 'zod';
import registerSchema from './RegisterSchema';

const resetPasswordSchema = registerSchema._def.schema
  .pick({
    password: true,
    confirmPassword: true
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword']
      });
    }
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export default resetPasswordSchema;
