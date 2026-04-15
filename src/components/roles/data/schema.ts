import { z } from 'zod';

export const permissionSchema = z.object({
  id: z.string(),
  name: z.string(),
  endpoint: z.string(),
  method: z.string(),
  module: z.string(),
});

export const roleSchema = z.object({
  id: z.string(),
  name: z.string(),
  permissions: z.array(permissionSchema),
});

export type Role = z.infer<typeof roleSchema>;
export type Permissions = z.infer<typeof permissionSchema>;
