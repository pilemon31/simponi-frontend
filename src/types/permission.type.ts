import { type Permissions } from '@/schemas/roles.schema';
import type { SuccessResponse } from './response.type';

export type GetAllPermissionsResponse = SuccessResponse<Permissions[]>;
