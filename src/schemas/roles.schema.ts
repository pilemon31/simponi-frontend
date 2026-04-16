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

export const createRoleSchema = z.object({
  name: z.string().trim().min(1, 'Role name required!'),
  permissions: z
    .array(permissionSchema)
    .min(1, 'At least one permission is required'),
});

export const updateRoleSchema = z.object({
  id: z.string('Role ID required!'),
  name: z.string().trim().min(1, 'Role name required!'),
  permissions: z
    .array(permissionSchema)
    .min(1, 'At least one permission is required'),
});

export const createRolePayload = z.object({
  name: z.string().trim().min(1, 'Role name required!'),
  permission_ids: z
    .array(z.string())
    .min(1, 'At least one permission is required'),
});

export const updateRolePayload = z.object({
  id: z.string('Role ID required!'),
  name: z.string().trim().min(1, 'Role name required!'),
  permission_ids: z
    .array(z.string())
    .min(1, 'At least one permission is required'),
});

export type Role = z.infer<typeof roleSchema>;
export type Permissions = z.infer<typeof permissionSchema>;

export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;
export type UpdateRoleFormValues = z.infer<typeof updateRoleSchema>;

export type CreateRolePayloadValues = z.infer<typeof createRolePayload>;
export type UpdateRolePayloadValues = z.infer<typeof updateRolePayload>;
