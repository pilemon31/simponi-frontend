import axiosConfig from '@/lib/axios';
import type { GetALlInventoryLogResponse } from '@/types/inventory-log.type';

export const InventoryLogsApi = {
  getAll: async (search = '') => {
    const response = await axiosConfig.get<GetALlInventoryLogResponse>(
      '/inventory-logs',
      {
        params: {
          search: search || undefined,
        },
      },
    );
    return response.data;
  },
};
