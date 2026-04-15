import axiosConfig from '@/lib/axios';
import { type GetAllRoleResponse } from '@/types/role.type';

export const RolesApi = {
  getAll: async (search = '') => {
    const response = await axiosConfig.get<GetAllRoleResponse>('/roles', {
      params: {
        search: search || undefined,
      },
    });

    return response;
  },
};
