import { InventoryLogsApi } from '@/services/inventory-logs.service';
import { useQuery } from '@tanstack/react-query';

export const useInventoryLogs = (search = '') => {
  return useQuery({
    queryKey: ['inventory-logs', search],
    queryFn: () => InventoryLogsApi.getAll(search),
  });
};
