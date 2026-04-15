import type { SuccessResponse } from './response.type';

interface Permissions {
  id: string;
  name: string;
  endpoint: string;
  method: string;
}

interface RoleResponseData {
  id: string;
  name: string;
  permissions: Permissions[];
}

export type RoleResponse = SuccessResponse<RoleResponseData>;
export type GetAllRoleResponse = SuccessResponse<{
  data: RoleResponseData[];
}>;
