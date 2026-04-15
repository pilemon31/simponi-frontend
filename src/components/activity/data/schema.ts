import { z } from 'zod';

export const activitySchema = z.object({
  id: z.string(),
  module: z.string(),
  action: z.string(),
  message: z.string(),
  timestamp: z.date(),
});

export type Activity = z.infer<typeof activitySchema>;
