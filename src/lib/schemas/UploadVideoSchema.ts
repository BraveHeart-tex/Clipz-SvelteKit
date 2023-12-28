import { z } from 'zod';

const uploadVideoSchema = z.object({
  title: z.string().min(3, "Title can't be less than 3 characters.").max(100),
  description: z
    .string()
    .min(3, "Description can't be less than 3 characters.")
    .max(1000)
});

export type UploadVideoSchema = z.infer<typeof uploadVideoSchema>;

export default uploadVideoSchema;
