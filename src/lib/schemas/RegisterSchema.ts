import { z } from 'zod';

const registerSchema = z
  .object({
    email: z
      .string()
      .email('Invalid email address')
      .describe(`type:email, label:Email`),
    fullName: z.string().min(2, 'Please enter your full name').describe(`
    type:text,
    label:Full Name
    `),
    password: z
      .string()
      .min(8, 'Please must be at least 8 characters')
      .max(100, 'Password must be less than 100 characters')
      .describe(`type:password, label: Password`),
    confirmPassword: z
      .string()
      .describe(`type:password, label: Confirm Password`),
    termsAndConditions: z.boolean().describe(`
    type:checkbox,
    label: I agree to the Terms and Conditions
    `)
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword']
      });
    }

    if (!data.termsAndConditions) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'You must agree to the terms and conditions',
        path: ['termsAndConditions']
      });
    }
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
export default registerSchema;
