import { z } from 'zod';

const uploadVideoSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(3).max(1000),
  tags: z.array(z.string().min(3).max(100))
});

export type UploadVideoSchema = z.infer<typeof uploadVideoSchema>;

export default uploadVideoSchema;
